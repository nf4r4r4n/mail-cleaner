import Database from "better-sqlite3";
import { DB_PATH, ensureDataDir } from "../config.js";

ensureDataDir();
const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("synchronous = NORMAL");

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS account (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  email TEXT NOT NULL,
  tokens TEXT NOT NULL,
  history_id TEXT,
  last_sync TEXT
);
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  thread_id TEXT,
  from_addr TEXT,
  from_email TEXT,
  subject TEXT,
  date TEXT,
  snippet TEXT,
  label_ids TEXT,
  size_estimate INTEGER,
  is_unread INTEGER,
  is_starred INTEGER,
  has_attachment INTEGER,
  score INTEGER,
  reasons TEXT,
  is_stale INTEGER,
  cached_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_messages_from ON messages(from_email);
CREATE INDEX IF NOT EXISTS idx_messages_date ON messages(date);
CREATE INDEX IF NOT EXISTS idx_messages_score ON messages(score);
CREATE TABLE IF NOT EXISTS action_log (
  id TEXT PRIMARY KEY,
  message_id TEXT NOT NULL,
  action TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  restored INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS whitelist (
  pattern TEXT PRIMARY KEY,
  kind TEXT NOT NULL
);
`;
db.exec(SCHEMA_SQL);

export { db };

// ---- Account ----
export interface AccountRow {
  id: number;
  email: string;
  tokens: string;
  history_id: string | null;
  last_sync: string | null;
}

export function getAccount(): AccountRow | undefined {
  return db.prepare("SELECT * FROM account WHERE id = 1").get() as AccountRow | undefined;
}

export function upsertAccount(email: string, tokens: string) {
  const existing = getAccount();
  if (existing) {
    db.prepare("UPDATE account SET email=?, tokens=? WHERE id=1").run(email, tokens);
  } else {
    db.prepare("INSERT INTO account (id, email, tokens) VALUES (1, ?, ?)").run(email, tokens);
  }
}

export function updateHistoryId(hid: string) {
  db.prepare("UPDATE account SET history_id=?, last_sync=? WHERE id=1").run(hid, new Date().toISOString());
}

// ---- Messages ----
export interface MessageRow {
  id: string;
  thread_id: string;
  from_addr: string;
  from_email: string;
  subject: string;
  date: string;
  snippet: string;
  label_ids: string;
  size_estimate: number;
  is_unread: number;
  is_starred: number;
  has_attachment: number;
  score: number;
  reasons: string;
  is_stale: number;
  cached_at: string;
}

export function upsertMessages(rows: MessageRow[]) {
  const stmt = db.prepare(`INSERT INTO messages
    (id, thread_id, from_addr, from_email, subject, date, snippet, label_ids, size_estimate, is_unread, is_starred, has_attachment, score, reasons, is_stale, cached_at)
    VALUES (@id,@thread_id,@from_addr,@from_email,@subject,@date,@snippet,@label_ids,@size_estimate,@is_unread,@is_starred,@has_attachment,@score,@reasons,@is_stale,@cached_at)
    ON CONFLICT(id) DO UPDATE SET
      label_ids=excluded.label_ids, is_unread=excluded.is_unread, is_starred=excluded.is_starred,
      score=excluded.score, reasons=excluded.reasons, is_stale=excluded.is_stale, cached_at=excluded.cached_at`);
  const tx = db.transaction((items: MessageRow[]) => {
    for (const r of items) stmt.run(r);
  });
  tx(rows);
}

export function getCandidates(opts: {
  minScore: number;
  limit: number;
  offset: number;
  fromEmail?: string;
  unreadOnly?: boolean;
  staleOnly?: boolean;
}) {
  const where: string[] = ["score >= ?"];
  const params: any[] = [opts.minScore];
  if (opts.fromEmail) { where.push("from_email = ?"); params.push(opts.fromEmail); }
  if (opts.unreadOnly) { where.push("is_unread = 1"); }
  if (opts.staleOnly) { where.push("is_stale = 1"); }
  const sql = `SELECT * FROM messages WHERE ${where.join(" AND ")} ORDER BY date DESC LIMIT ? OFFSET ?`;
  params.push(opts.limit, opts.offset);
  return db.prepare(sql).all(...params) as MessageRow[];
}

export function countCandidates(opts: { minScore: number; fromEmail?: string; unreadOnly?: boolean; staleOnly?: boolean }) {
  const where: string[] = ["score >= ?"];
  const params: any[] = [opts.minScore];
  if (opts.fromEmail) { where.push("from_email = ?"); params.push(opts.fromEmail); }
  if (opts.unreadOnly) { where.push("is_unread = 1"); }
  if (opts.staleOnly) { where.push("is_stale = 1"); }
  const sql = `SELECT COUNT(*) as c FROM messages WHERE ${where.join(" AND ")}`;
  return (db.prepare(sql).get(...params) as { c: number }).c;
}

export function getMessageIds(ids: string[]) {
  if (ids.length === 0) return [];
  const placeholders = ids.map(() => "?").join(",");
  return db.prepare(`SELECT * FROM messages WHERE id IN (${placeholders})`).all(...ids) as MessageRow[];
}

export function deleteMessages(ids: string[]) {
  if (ids.length === 0) return;
  const placeholders = ids.map(() => "?").join(",");
  db.prepare(`DELETE FROM messages WHERE id IN (${placeholders})`).run(...ids);
}

export function topSenders(minScore: number, limit = 20) {
  return db.prepare(
    `SELECT from_email, from_addr, COUNT(*) as cnt, AVG(score) as avgScore
     FROM messages WHERE score >= ? GROUP BY from_email ORDER BY cnt DESC LIMIT ?`
  ).all(minScore, limit) as { from_email: string; from_addr: string; cnt: number; avgScore: number }[];
}

// ---- Action log ----
export function logAction(id: string, messageId: string, action: "trash" | "archive") {
  db.prepare("INSERT INTO action_log (id, message_id, action, timestamp) VALUES (?,?,?,?)")
    .run(id, messageId, action, new Date().toISOString());
}

export function getHistory(limit = 100) {
  return db.prepare("SELECT * FROM action_log ORDER BY timestamp DESC LIMIT ?").all(limit) as any[];
}

export function markRestored(id: string) {
  db.prepare("UPDATE action_log SET restored=1 WHERE id=?").run(id);
}

// ---- Whitelist ----
export function getWhitelist() {
  return db.prepare("SELECT * FROM whitelist").all() as { pattern: string; kind: string }[];
}

export function addWhitelist(pattern: string, kind = "sender") {
  db.prepare("INSERT OR IGNORE INTO whitelist (pattern, kind) VALUES (?,?)").run(pattern, kind);
}

export function removeWhitelist(pattern: string) {
  db.prepare("DELETE FROM whitelist WHERE pattern=?").run(pattern);
}
