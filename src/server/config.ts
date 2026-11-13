import "dotenv/config";
import { z } from "zod";
import path from "node:path";
import fs from "node:fs";

const envSchema = z.object({
  GOOGLE_CLIENT_ID: z.string().default(""),
  GOOGLE_CLIENT_SECRET: z.string().default(""),
  GOOGLE_REDIRECT_URI: z.string().default("http://localhost:3000/auth/google/callback"),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default("127.0.0.1"),
  MIN_SCORE: z.coerce.number().default(4),
  STALE_DAYS: z.coerce.number().default(90),
  DATA_DIR: z.string().default("./data"),
});

export const env = envSchema.parse(process.env);

export const DATA_DIR = path.resolve(process.cwd(), env.DATA_DIR);
export const DB_PATH = path.join(DATA_DIR, "mail-cleaner.db");
export const KEY_PATH = path.join(DATA_DIR, ".key");

export function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const DEFAULT_CONFIG: import("../shared/types.js").AppConfig = {
  minScore: env.MIN_SCORE,
  staleDays: env.STALE_DAYS,
  notificationSenders: [
    "noreply", "no-reply", "no_reply", "notifications", "notification",
    "alerts", "alert", "digest", "newsletter", "updates", "update",
    "billing", "security", "calendar", "github", "gitlab", "jira",
    "slack", "trello", "notion", "linkedin", "facebook", "twitter",
    "instagram", "pinterest", "amazon", "paypal", "stripe", "aws",
    "google", "microsoft", "apple", "dropbox", "zoom", "teams",
  ],
  notificationSubjects: [
    "notification", "alerte", "rappel", "digest", "weekly", "monthly",
    "summary", "verify", "confirmation", "password", "login", "sign-in",
    "security", "facture", "invoice", "receipt", "shipped", "delivered",
    "invitation", "reminder", "update", "nouveau", "new message",
  ],
  protectedLabels: ["STARRED", "IMPORTANT", "UNREAD"],
};

// User-configurable rules file (JSON) in data dir
export const RULES_FILE = path.join(DATA_DIR, "rules.json");
export const CONFIG_FILE = path.join(DATA_DIR, "config.json");
