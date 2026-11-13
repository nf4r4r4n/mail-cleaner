export type {
  GmailMessageMeta,
  ScoredMessage,
  Rule,
  AppConfig,
  ActionLogEntry,
  ScanProgress,
  AccountInfo,
} from "@shared/types";

export interface Candidate {
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
  score: number;
  reasons: string[];
  isStale: boolean;
}

export interface Account { email: string | null; connected: boolean; }
export interface Stats { total: number; candidates: number; stale: number; unread: number; actions: number; }
export interface Sender { from_email: string; from_addr: string; cnt: number; avgScore: number; }
export interface ScanState { scanId: string; status: "running" | "done" | "error"; processed: number; total?: number; found: number; message?: string; }

export type ActionKind = "trash" | "archive";
