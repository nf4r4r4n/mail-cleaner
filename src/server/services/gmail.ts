import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { env } from "../config.js";
import { getAccount, upsertAccount, updateHistoryId } from "../db/repo.js";
import { encrypt, decrypt } from "./crypto.js";

const SCOPES = ["https://www.googleapis.com/auth/gmail.modify"];

let oauth2Client: OAuth2Client | null = null;

export function getOAuth2Client(): OAuth2Client {
  if (oauth2Client) return oauth2Client;
  oauth2Client = new OAuth2Client(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    env.GOOGLE_REDIRECT_URI
  );
  // load tokens if present
  const acc = getAccount();
  if (acc) {
    try {
      const tokens = JSON.parse(decrypt(acc.tokens));
      oauth2Client.setCredentials(tokens);
    } catch (e) {
      console.error("Failed to load tokens", e);
    }
  }
  // persist refreshed tokens
  oauth2Client.on("tokens", (t) => {
    const acc2 = getAccount();
    if (acc2) {
      const merged = { ...JSON.parse(decrypt(acc2.tokens)), ...t };
      upsertAccount(acc2.email, encrypt(JSON.stringify(merged)));
    }
  });
  return oauth2Client;
}

export function getAuthUrl(): string {
  const client = getOAuth2Client();
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });
}

export async function handleCallback(code: string): Promise<string> {
  const client = getOAuth2Client();
  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);
  const gmail = google.gmail({ version: "v1", auth: client });
  const profile = await gmail.users.getProfile({ userId: "me" });
  const email = profile.data.emailAddress || "me";
  upsertAccount(email, encrypt(JSON.stringify(tokens)));
  // fetch initial history id
  if (profile.data.historyId) updateHistoryId(profile.data.historyId);
  return email;
}

export function getGmail() {
  const client = getOAuth2Client();
  return google.gmail({ version: "v1", auth: client });
}

export function isConnected(): boolean {
  return !!getAccount();
}

export function getAccountEmail(): string | null {
  return getAccount()?.email ?? null;
}

// ---- Fetch message metadata ----
export interface RawMsg {
  id: string;
  threadId: string;
  from: string;
  fromEmail: string;
  subject: string;
  date: string;
  snippet: string;
  labelIds: string[];
  sizeEstimate: number;
  isUnread: boolean;
  isStarred: boolean;
  hasAttachment: boolean;
}

function header(headers: { name?: string | null; value?: string | null }[] | undefined, name: string): string {
  return headers?.find((h) => (h.name || "").toLowerCase() === name.toLowerCase())?.value || "";
}

export async function fetchMessageMeta(id: string): Promise<RawMsg> {
  const gmail = getGmail();
  const res = await gmail.users.messages.get({
    userId: "me",
    id,
    format: "metadata",
    metadataHeaders: ["From", "Subject", "Date"],
  });
  const m = res.data;
  const headers = m.payload?.headers || [];
  const from = header(headers, "From");
  const emailMatch = from.match(/<([^>]+)>/) || from.match(/([^\s]+@[^\s]+)/);
  const fromEmail = (emailMatch ? emailMatch[1] : from).toLowerCase().trim();
  const dateRaw = header(headers, "Date");
  let date = new Date().toISOString();
  try { date = new Date(dateRaw).toISOString(); } catch {}
  const labelIds = m.labelIds || [];
  const hasAttachment = (m.payload?.parts || []).some((p) => !!p.filename) ||
    !!m.payload?.filename;
  return {
    id: m.id!,
    threadId: m.threadId!,
    from,
    fromEmail,
    subject: header(headers, "Subject"),
    date,
    snippet: m.snippet || "",
    labelIds,
    sizeEstimate: m.sizeEstimate || 0,
    isUnread: labelIds.includes("UNREAD"),
    isStarred: labelIds.includes("STARRED"),
    hasAttachment,
  };
}

// ---- List message ids with query ----
export async function listMessageIds(q: string, maxResults = 500): Promise<string[]> {
  const gmail = getGmail();
  const ids: string[] = [];
  let pageToken: string | undefined;
  do {
    const res = await gmail.users.messages.list({
      userId: "me",
      q,
      maxResults,
      pageToken,
    });
    for (const m of res.data.messages || []) {
      if (m.id) ids.push(m.id);
    }
    pageToken = res.data.nextPageToken || undefined;
  } while (pageToken);
  return ids;
}

// ---- Actions ----
export async function trashMessages(ids: string[]) {
  if (ids.length === 0) return;
  const gmail = getGmail();
  // batchModify to add TRASH label and remove INBOX
  await gmail.users.messages.batchModify({
    userId: "me",
    requestBody: {
      ids,
      addLabelIds: ["TRASH"],
      removeLabelIds: ["INBOX"],
    },
  });
}

export async function archiveMessages(ids: string[]) {
  if (ids.length === 0) return;
  const gmail = getGmail();
  await gmail.users.messages.batchModify({
    userId: "me",
    requestBody: {
      ids,
      removeLabelIds: ["INBOX"],
    },
  });
}

export async function untrashMessage(id: string) {
  const gmail = getGmail();
  await gmail.users.messages.modify({
    userId: "me",
    id,
    requestBody: { removeLabelIds: ["TRASH"], addLabelIds: ["INBOX"] },
  });
}

export async function unarchiveMessage(id: string) {
  const gmail = getGmail();
  await gmail.users.messages.modify({
    userId: "me",
    id,
    requestBody: { addLabelIds: ["INBOX"] },
  });
}
