import { API_BASE } from "../lib/constants";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const method = (init?.method || "GET").toUpperCase();
  const hasBody = init?.body != null;
  const needsBody = method === "POST" || method === "PUT" || method === "PATCH";
  const headers: Record<string, string> = { ...(init?.headers as Record<string, string> | undefined) };
  if (hasBody || needsBody) headers["Content-Type"] = "application/json";
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    method,
    headers,
    body: hasBody ? init!.body : (needsBody ? "{}" : undefined),
    credentials: "same-origin",
  });
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const body = await res.json();
      msg = body?.error || body?.message || msg;
    } catch {}
    throw new ApiError(msg, res.status);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  getAccount: () => request<{ email: string | null; connected: boolean }>("/api/account"),
  disconnect: () => request<{ ok: boolean }>("/api/auth/disconnect", { method: "POST" }),

  getStats: () => request<import("../types").Stats>("/api/stats"),

  getSenders: (minScore: number, limit = 20) =>
    request<{ items: import("../types").Sender[] }>(`/api/senders?minScore=${minScore}&limit=${limit}`),

  getCandidates: (params: {
    minScore: number; limit: number; offset: number;
    unread?: boolean; stale?: boolean; fromEmail?: string;
  }) => {
    const q = new URLSearchParams();
    q.set("minScore", String(params.minScore));
    q.set("limit", String(params.limit));
    q.set("offset", String(params.offset));
    if (params.unread) q.set("unread", "true");
    if (params.stale) q.set("stale", "true");
    if (params.fromEmail) q.set("fromEmail", params.fromEmail);
    return request<{ total: number; items: import("../types").Candidate[] }>(`/api/candidates?${q}`);
  },

  startScan: () => request<{ scanId: string }>("/api/scan", { method: "POST" }),

  trash: (ids: string[]) => request<{ ok: boolean; count: number }>("/api/actions/trash", { method: "POST", body: JSON.stringify({ ids }) }),
  archive: (ids: string[]) => request<{ ok: boolean; count: number }>("/api/actions/archive", { method: "POST", body: JSON.stringify({ ids }) }),

  getConfig: () => request<Record<string, unknown>>("/api/config"),
  setConfig: (cfg: Record<string, unknown>) => request<{ ok: boolean }>("/api/config", { method: "PUT", body: JSON.stringify(cfg) }),

  getWhitelist: () => request<{ items: { pattern: string; kind: string }[] }>("/api/whitelist"),
  addWhitelist: (pattern: string, kind = "sender") => request<{ ok: boolean }>("/api/whitelist", { method: "POST", body: JSON.stringify({ pattern, kind }) }),
  removeWhitelist: (pattern: string) => request<{ ok: boolean }>("/api/whitelist", { method: "DELETE", body: JSON.stringify({ pattern }) }),

  getHistory: (limit = 50) => request<{ items: any[] }>(`/api/history?limit=${limit}`),
  undo: (id: string) => request<{ ok: boolean }>(`/api/history/${id}/undo`, { method: "POST" }),
};
