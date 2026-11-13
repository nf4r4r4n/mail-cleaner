import { Checkbox } from "../../ui/Input";
import { Badge } from "../../ui/Badge";
import { formatDate, formatSize } from "../../../lib/format";
import type { Candidate } from "../../../types";

export function CandidateRow({
  c, selected, onToggle, onOpen,
}: {
  c: Candidate;
  selected: boolean;
  onToggle: () => void;
  onOpen: () => void;
}) {
  return (
    <div
      className={`grid grid-cols-[auto_1fr_auto] gap-4 px-6 py-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-colors ${
        selected ? "bg-primary-soft dark:bg-primary/20" : "hover:bg-gray-50 dark:hover:bg-gray-800"
      }`}
      onClick={onOpen}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <Checkbox checked={selected} onChange={onToggle} />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm truncate">{c.from}</span>
          <Badge tone={c.score >= 6 ? "danger" : "warning"}>score {c.score}</Badge>
          {c.isStale && <Badge tone="neutral">perime</Badge>}
          {c.isUnread && <Badge tone="info">non lu</Badge>}
        </div>
        <div className="mt-1 text-sm text-gray-800 dark:text-gray-200 truncate">{c.subject || "(sans sujet)"}</div>
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">{c.snippet}</div>
        <div className="mt-1 text-xs text-gray-400 dark:text-gray-500 font-mono">
          {formatDate(c.date)} · {formatSize(c.sizeEstimate)} · {c.reasons.join(", ")}
        </div>
      </div>
      <div className="flex items-start">
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className="text-xs text-gray-400 hover:text-accent uppercase tracking-wide"
        >
          {selected ? "Retirer" : "Choisir"}
        </button>
      </div>
    </div>
  );
}
