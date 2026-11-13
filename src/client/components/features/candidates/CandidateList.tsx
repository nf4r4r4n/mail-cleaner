import { useState } from "react";
import { Checkbox } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { EmptyState } from "../../ui/EmptyState";
import { Spinner } from "../../ui/Spinner";
import { CandidateRow } from "./CandidateRow";
import { RefreshCw, ChevronDown, ChevronRight } from "lucide-react";
import type { Candidate } from "../../../types";

export function CandidateList({
  items, total, selected, onToggle, onToggleAll, onOpen, loading, onRefresh,
}: {
  items: Candidate[] | undefined;
  total: number;
  selected: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  onOpen: (c: Candidate) => void;
  loading: boolean;
  onRefresh?: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  if (loading && (!items || items.length === 0)) {
    return <div className="flex justify-center py-16"><Spinner /></div>;
  }
  if (!items || items.length === 0) {
    return <EmptyState title="Aucun candidat" description="Lancez un scan pour detecter les notifications inutiles." />;
  }
  const allSelected = items.length > 0 && items.every((c) => selected.has(c.id));
  return (
    <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            aria-label={collapsed ? "Deplier la liste" : "Replier la liste"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <Checkbox checked={allSelected} onChange={onToggleAll} />
          <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {items.length} affiches / {total} candidats — {selected.size} selectionnes
          </span>
        </div>
        {onRefresh && (
          <Button variant="ghost" size="sm" onClick={onRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Actualiser
          </Button>
        )}
      </div>
      {!collapsed && (
        <>
          <div>
            {items.map((c) => (
              <CandidateRow
                key={c.id}
                c={c}
                selected={selected.has(c.id)}
                onToggle={() => onToggle(c.id)}
                onOpen={() => onOpen(c)}
              />
            ))}
          </div>
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <Checkbox checked={allSelected} onChange={onToggleAll} />
              <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Tout selectionner (page) — {selected.size} selectionnes
              </span>
            </div>
          </div>
        </>
      )}
      {collapsed && (
        <div className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
          Liste repliee. {total} candidats au total, {selected.size} selectionnes.
        </div>
      )}
    </div>
  );
}
