import pLimit from "p-limit";
import { listMessageIds, fetchMessageMeta } from "./gmail.js";
import fs from "node:fs";
import { DEFAULT_CONFIG, env, CONFIG_FILE } from "../config.js";
import { upsertMessages, getWhitelist } from "../db/repo.js";
import type { AppConfig, GmailMessageMeta } from "../../shared/types.js";

function loadConfig(): AppConfig {
  let fileCfg: Partial<AppConfig> = {};
  try {
    if (fs.existsSync(CONFIG_FILE)) fileCfg = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
  } catch {}
  return { ...DEFAULT_CONFIG, ...fileCfg, minScore: fileCfg.minScore ?? env.MIN_SCORE, staleDays: fileCfg.staleDays ?? env.STALE_DAYS };
}

function isWhitelisted(msg: GmailMessageMeta, wl: { pattern: string; kind: string }[]): boolean {
  for (const w of wl) {
    try {
      const re = new RegExp(w.pattern, "i");
      if (w.kind === "sender" && (re.test(msg.fromEmail) || re.test(msg.from))) return true;
      if (w.kind === "subject" && re.test(msg.subject)) return true;
    } catch {
      if (w.kind === "sender" && (msg.fromEmail.includes(w.pattern) || msg.from.includes(w.pattern))) return true;
      if (w.kind === "subject" && msg.subject.includes(w.pattern)) return true;
    }
  }
  return false;
}

export function scoreMessage(msg: GmailMessageMeta, cfg: AppConfig): { score: number; reasons: string[]; isStale: boolean } {
  const reasons: string[] = [];
  let score = 0;
  const senderLower = (msg.fromEmail + " " + msg.from).toLowerCase();
  const subjectLower = msg.subject.toLowerCase();
  const ageDays = (Date.now() - new Date(msg.date).getTime()) / (1000 * 60 * 60 * 24);
  const isStale = ageDays >= cfg.staleDays;

  // sender notification pattern
  if (cfg.notificationSenders.some((p) => senderLower.includes(p))) {
    score += 3; reasons.push("expediteur-notification");
  }
  // gmail category
  const catLabels = ["CATEGORY_UPDATES", "CATEGORY_PROMOTIONS", "CATEGORY_FORUMS", "CATEGORY_SOCIAL"];
  if (msg.labelIds.some((l) => catLabels.includes(l))) {
    score += 2; reasons.push("categorie-gmail");
  }
  // subject keyword
  if (cfg.notificationSubjects.some((k) => subjectLower.includes(k))) {
    score += 2; reasons.push("sujet-notification");
  }
  // unread + older
  if (msg.isUnread && ageDays > 30) { score += 1; reasons.push("non-lu-ancien"); }
  // not starred
  if (!msg.isStarred) { score += 1; reasons.push("non-starred"); }
  // stale
  if (isStale) { score += 2; reasons.push("perime"); }
  // attachment reduces
  if (msg.hasAttachment) { score -= 1; reasons.push("piece-jointe"); }
  // protected labels
  if (msg.labelIds.includes("IMPORTANT") || msg.labelIds.includes("STARRED")) {
    score = Math.min(score, cfg.minScore - 1);
    reasons.push("protege");
  }

  return { score, reasons, isStale };
}

export interface ScanResult {
  scanId: string;
  processed: number;
  found: number;
}

// Progress callback
export type ProgressFn = (p: { processed: number; total?: number; found: number }) => void;

export async function runScan(onProgress?: ProgressFn): Promise<ScanResult> {
  const cfg = loadConfig();
  const wl = getWhitelist();
  const scanId = cryptoRandomId();

  // Build query to pre-filter
  const senderOr = cfg.notificationSenders.slice(0, 8).map((s) => `from:${s}`).join(" OR ");
  const q = `older_than:${cfg.staleDays}d (${senderOr} OR category:updates OR category:promotions OR category:forums OR category:social)`;

  const ids = await listMessageIds(q, 500);
  const total = ids.length;
  let processed = 0;
  let found = 0;
  const limit = pLimit(5);
  const rows: any[] = [];

  await Promise.all(ids.map((id) => limit(async () => {
    try {
      const meta = await fetchMessageMeta(id);
      if (isWhitelisted(meta, wl)) {
        processed++; onProgress?.({ processed, total, found }); return;
      }
      const { score, reasons, isStale } = scoreMessage(meta, cfg);
      const row = {
        id: meta.id,
        thread_id: meta.threadId,
        from_addr: meta.from,
        from_email: meta.fromEmail,
        subject: meta.subject,
        date: meta.date,
        snippet: meta.snippet,
        label_ids: JSON.stringify(meta.labelIds),
        size_estimate: meta.sizeEstimate,
        is_unread: meta.isUnread ? 1 : 0,
        is_starred: meta.isStarred ? 1 : 0,
        has_attachment: meta.hasAttachment ? 1 : 0,
        score,
        reasons: JSON.stringify(reasons),
        is_stale: isStale ? 1 : 0,
        cached_at: new Date().toISOString(),
      };
      rows.push(row);
      if (score >= cfg.minScore) found++;
    } catch (e) {
      console.error("scan err", id, e);
    }
    processed++;
    onProgress?.({ processed, total, found });
  })));

  upsertMessages(rows);
  return { scanId, processed, found };
}

function cryptoRandomId() {
  return (globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2));
}
