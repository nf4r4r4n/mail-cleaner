import { Badge } from "../../ui/Badge";
import { formatDate, formatSize } from "../../../lib/format";
import type { Candidate } from "../../../types";

export function CandidateDetail({ c }: { c: Candidate }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Expediteur</div>
        <div className="mt-1 font-semibold">{c.from}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{c.fromEmail}</div>
      </div>
      <div>
        <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Sujet</div>
        <div className="mt-1">{c.subject || "(sans sujet)"}</div>
      </div>
      <div>
        <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Extrait</div>
        <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">{c.snippet}</div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Date</div>
          <div className="mt-1 text-sm">{formatDate(c.date)}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Taille</div>
          <div className="mt-1 text-sm">{formatSize(c.sizeEstimate)}</div>
        </div>
      </div>
      <div>
        <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Score</div>
        <div className="mt-1 flex items-center gap-2">
          <Badge tone={c.score >= 6 ? "danger" : "warning"}>score {c.score}</Badge>
          {c.isStale && <Badge tone="neutral">perime</Badge>}
          {c.isUnread && <Badge tone="info">non lu</Badge>}
        </div>
      </div>
      <div>
        <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Raisons</div>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {c.reasons.map((r) => <Badge key={r} tone="neutral">{r}</Badge>)}
        </div>
      </div>
      <div>
        <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Labels</div>
        <div className="mt-1 text-xs font-mono text-gray-500 dark:text-gray-400">{c.labelIds.join(", ") || "—"}</div>
      </div>
    </div>
  );
}
