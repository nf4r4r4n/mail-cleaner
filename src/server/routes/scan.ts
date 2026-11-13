import type { FastifyInstance } from "fastify";
import { runScan } from "../services/scanner.js";
import type { ScanProgress } from "../../shared/types.js";

const scans = new Map<string, ScanProgress>();

export async function scanRoutes(app: FastifyInstance) {
  // Start scan
  app.post("/api/scan", async (_req, reply) => {
    const scanId = (globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2));
    scans.set(scanId, { scanId, status: "running", processed: 0, found: 0 });
    // run async
    runScan((p) => {
      const s = scans.get(scanId);
      if (s) { s.processed = p.processed; s.total = p.total; s.found = p.found; }
    })
      .then((r) => {
        const s = scans.get(scanId);
        if (s) { s.status = "done"; s.processed = r.processed; s.found = r.found; }
      })
      .catch((e) => {
        const s = scans.get(scanId);
        if (s) { s.status = "error"; s.message = String(e?.message || e); }
      });
    reply.send({ scanId });
  });

  // SSE progress
  app.get<{ Params: { id: string } }>("/api/scan/:id/progress", async (req, reply) => {
    const { id } = req.params;
    reply.raw.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    const send = () => {
      const s = scans.get(id);
      if (!s) { reply.raw.write(`data: ${JSON.stringify({ error: "not found" })}\n\n`); return false; }
      reply.raw.write(`data: ${JSON.stringify(s)}\n\n`);
      return s.status !== "running";
    };
    // poll
    const interval = setInterval(() => {
      if (send()) { clearInterval(interval); reply.raw.end(); }
    }, 500);
    req.raw.on("close", () => clearInterval(interval));
  });

  app.get("/api/scan/status", async () => {
    return { scans: Array.from(scans.values()) };
  });
}
