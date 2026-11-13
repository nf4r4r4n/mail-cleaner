import type { FastifyInstance } from "fastify";
import fs from "node:fs";
import { CONFIG_FILE, RULES_FILE } from "../config.js";
import { getWhitelist, addWhitelist, removeWhitelist } from "../db/repo.js";
import type { Rule, AppConfig } from "../../shared/types.js";

export async function rulesRoutes(app: FastifyInstance) {
  app.get("/api/config", async () => {
    let cfg: Partial<AppConfig> = {};
    try { if (fs.existsSync(CONFIG_FILE)) cfg = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8")); } catch {}
    return cfg;
  });

  app.put("/api/config", async (req, reply) => {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(req.body, null, 2));
    reply.send({ ok: true });
  });

  app.get("/api/rules", async () => {
    let rules: Rule[] = [];
    try { if (fs.existsSync(RULES_FILE)) rules = JSON.parse(fs.readFileSync(RULES_FILE, "utf8")); } catch {}
    return { items: rules };
  });

  app.put("/api/rules", async (req, reply) => {
    fs.writeFileSync(RULES_FILE, JSON.stringify(req.body, null, 2));
    reply.send({ ok: true });
  });

  app.get("/api/whitelist", async () => ({ items: getWhitelist() }));
  app.post("/api/whitelist", async (req, reply) => {
    const b = req.body as { pattern: string; kind?: string };
    addWhitelist(b.pattern, b.kind || "sender");
    reply.send({ ok: true });
  });
  app.delete("/api/whitelist", async (req, reply) => {
    const b = req.body as { pattern: string };
    removeWhitelist(b.pattern);
    reply.send({ ok: true });
  });
}
