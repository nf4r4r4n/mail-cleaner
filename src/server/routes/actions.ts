import type { FastifyInstance } from "fastify";
import crypto from "node:crypto";
import { z } from "zod";
import { trashMessages, archiveMessages, untrashMessage, unarchiveMessage } from "../services/gmail.js";
import { logAction, markRestored, getHistory, deleteMessages } from "../db/repo.js";

const bodySchema = z.object({ ids: z.array(z.string()).min(1).max(500) });

export async function actionsRoutes(app: FastifyInstance) {
  app.post("/api/actions/trash", async (req, reply) => {
    const { ids } = bodySchema.parse(req.body);
    await trashMessages(ids);
    for (const id of ids) logAction(crypto.randomUUID(), id, "trash");
    deleteMessages(ids);
    reply.send({ ok: true, count: ids.length });
  });

  app.post("/api/actions/archive", async (req, reply) => {
    const { ids } = bodySchema.parse(req.body);
    await archiveMessages(ids);
    for (const id of ids) logAction(crypto.randomUUID(), id, "archive");
    deleteMessages(ids);
    reply.send({ ok: true, count: ids.length });
  });

  app.get("/api/history", async (req) => {
    const q = z.object({ limit: z.coerce.number().default(100) }).parse(req.query);
    return { items: getHistory(q.limit) };
  });

  app.post<{ Params: { id: string } }>("/api/history/:id/undo", async (req, reply) => {
    const entry = getHistory(1000).find((e: any) => e.id === req.params.id);
    if (!entry) return reply.status(404).send({ error: "not found" });
    if (entry.restored) return reply.send({ ok: true, already: true });
    if (entry.action === "trash") await untrashMessage(entry.message_id);
    else await unarchiveMessage(entry.message_id);
    markRestored(entry.id);
    reply.send({ ok: true });
  });
}
