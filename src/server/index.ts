import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import staticPlugin from "@fastify/static";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import { env, ensureDataDir, DATA_DIR } from "./config.js";
import { authRoutes } from "./routes/auth.js";
import { scanRoutes } from "./routes/scan.js";
import { messagesRoutes } from "./routes/messages.js";
import { actionsRoutes } from "./routes/actions.js";
import { rulesRoutes } from "./routes/rules.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  ensureDataDir();
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: true, credentials: true });
  await app.register(cookie, { secret: "mail-cleaner-secret-change-me" });

  await authRoutes(app);
  await scanRoutes(app);
  await messagesRoutes(app);
  await actionsRoutes(app);
  await rulesRoutes(app);

  // serve built client if present
  const clientDir = path.resolve(process.cwd(), "dist/client");
  if (fs.existsSync(clientDir)) {
    await app.register(staticPlugin, { root: clientDir, prefix: "/" });
    app.setNotFoundHandler((_req, reply) => {
      reply.sendFile("index.html", clientDir);
    });
  } else {
    app.get("/", async () => ({ ok: true, message: "API running. Start Vite dev server for UI." }));
  }

  await app.listen({ port: env.PORT, host: env.HOST });
  console.log(`Mail Cleaner API listening on http://${env.HOST}:${env.PORT}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
