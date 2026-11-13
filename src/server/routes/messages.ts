import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { getCandidates, countCandidates, topSenders, db } from "../db/repo.js";
import { env } from "../config.js";

const querySchema = z.object({
  minScore: z.coerce.number().optional(),
  limit: z.coerce.number().default(50),
  offset: z.coerce.number().default(0),
  fromEmail: z.string().optional(),
  unread: z.coerce.boolean().optional(),
  stale: z.coerce.boolean().optional(),
});

export async function messagesRoutes(app: FastifyInstance) {
  app.get("/api/candidates", async (req) => {
    const q = querySchema.parse(req.query);
    const minScore = q.minScore ?? env.MIN_SCORE;
    const rows = getCandidates({
      minScore,
      limit: q.limit,
      offset: q.offset,
      fromEmail: q.fromEmail,
      unreadOnly: q.unread,
      staleOnly: q.stale,
    });
    const total = countCandidates({ minScore, fromEmail: q.fromEmail, unreadOnly: q.unread, staleOnly: q.stale });
    return {
      total,
      items: rows.map((r) => ({
        id: r.id,
        threadId: r.thread_id,
        from: r.from_addr,
        fromEmail: r.from_email,
        subject: r.subject,
        date: r.date,
        snippet: r.snippet,
        labelIds: safeJson(r.label_ids, []),
        sizeEstimate: r.size_estimate,
        isUnread: !!r.is_unread,
        isStarred: !!r.is_starred,
        score: r.score,
        reasons: safeJson(r.reasons, []),
        isStale: !!r.is_stale,
      })),
    };
  });

  app.get("/api/senders", async (req) => {
    const q = z.object({ minScore: z.coerce.number().optional(), limit: z.coerce.number().default(20) }).parse(req.query);
    const minScore = q.minScore ?? env.MIN_SCORE;
    return { items: topSenders(minScore, q.limit) };
  });

  app.get("/api/stats", async () => {
    const total = (db.prepare("SELECT COUNT(*) as c FROM messages").get() as { c: number }).c;
    const candidates = countCandidates({ minScore: env.MIN_SCORE });
    const stale = (db.prepare("SELECT COUNT(*) as c FROM messages WHERE is_stale=1").get() as { c: number }).c;
    const unread = (db.prepare("SELECT COUNT(*) as c FROM messages WHERE is_unread=1").get() as { c: number }).c;
    const actions = (db.prepare("SELECT COUNT(*) as c FROM action_log").get() as { c: number }).c;
    return { total, candidates, stale, unread, actions };
  });
}

function safeJson(s: string, fallback: any) {
  try { return JSON.parse(s); } catch { return fallback; }
}
