export type LabelId = string;

export interface GmailMessageMeta {
  id: string;
  threadId: string;
  from: string;
  fromEmail: string;
  subject: string;
  date: string; // ISO
  snippet: string;
  labelIds: LabelId[];
  sizeEstimate: number;
  isUnread: boolean;
  isStarred: boolean;
  hasAttachment: boolean;
}

export interface ScoredMessage extends GmailMessageMeta {
  score: number;
  reasons: string[];
  isStale: boolean;
}

export interface Rule {
  id: string;
  name: string;
  enabled: boolean;
  senderPatterns: string[]; // regex
  subjectKeywords: string[];
  categories: string[]; // gmail category label ids
  ageDays?: number;
  unreadOnly?: boolean;
  action: "trash" | "archive" | "ignore";
  minScore?: number;
}

export interface AppConfig {
  minScore: number;
  staleDays: number;
  notificationSenders: string[];
  notificationSubjects: string[];
  protectedLabels: string[];
}

export interface ActionLogEntry {
  id: string;
  messageId: string;
  action: "trash" | "archive";
  timestamp: string;
  restored: boolean;
}

export interface ScanProgress {
  scanId: string;
  status: "running" | "done" | "error";
  processed: number;
  total?: number;
  found: number;
  message?: string;
}

export interface AccountInfo {
  email: string;
  connected: boolean;
}
