CREATE TABLE IF NOT EXISTS account (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  email TEXT NOT NULL,
  tokens TEXT NOT NULL,
  history_id TEXT,
  last_sync TEXT
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  thread_id TEXT,
  from_addr TEXT,
  from_email TEXT,
  subject TEXT,
  date TEXT,
  snippet TEXT,
  label_ids TEXT,
  size_estimate INTEGER,
  is_unread INTEGER,
  is_starred INTEGER,
  has_attachment INTEGER,
  score INTEGER,
  reasons TEXT,
  is_stale INTEGER,
  cached_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_messages_from ON messages(from_email);
CREATE INDEX IF NOT EXISTS idx_messages_date ON messages(date);
CREATE INDEX IF NOT EXISTS idx_messages_score ON messages(score);

CREATE TABLE IF NOT EXISTS action_log (
  id TEXT PRIMARY KEY,
  message_id TEXT NOT NULL,
  action TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  restored INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS whitelist (
  pattern TEXT PRIMARY KEY,
  kind TEXT NOT NULL
);
