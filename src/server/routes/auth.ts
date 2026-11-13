import type { FastifyInstance } from "fastify";
import { getAuthUrl, handleCallback, isConnected, getAccountEmail } from "../services/gmail.js";

export async function authRoutes(app: FastifyInstance) {
  app.get("/auth/google/start", async (_req, reply) => {
    const url = getAuthUrl();
    reply.redirect(url);
  });

  app.get<{ Querystring: { code?: string; error?: string } }>("/auth/google/callback", async (req, reply) => {
    const { code, error } = req.query;
    if (error) return reply.status(400).send({ error });
    if (!code) return reply.status(400).send({ error: "missing code" });
    try {
      const email = await handleCallback(code);
      reply.redirect(`/?connected=${encodeURIComponent(email)}`);
    } catch (e: any) {
      reply.status(500).send({ error: e.message });
    }
  });

  app.get("/api/account", async () => {
    return { email: getAccountEmail(), connected: isConnected() };
  });

  app.post("/api/auth/disconnect", async (_req, reply) => {
    // remove account row
    const { db } = await import("../db/repo.js");
    db.prepare("DELETE FROM account").run();
    db.prepare("DELETE FROM messages").run();
    reply.send({ ok: true });
  });
}
