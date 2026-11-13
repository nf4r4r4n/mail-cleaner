import { useState, useEffect } from "react";
import { useStats } from "../hooks/useStats";
import { useSenders } from "../hooks/useSenders";
import { useCandidates, type CandidateFilters } from "../hooks/useCandidates";
import type { ScanState } from "../types";
import { useActions } from "../hooks/useActions";
import { StatsGrid } from "../components/features/stats/StatsGrid";
import { FiltersPanel } from "../components/features/filters/FiltersPanel";
import { SendersList } from "../components/features/senders/SendersList";
import { CandidateList } from "../components/features/candidates/CandidateList";
import { CandidateDetail } from "../components/features/candidates/CandidateDetail";
import { ScanProgress } from "../components/features/scan/ScanProgress";
import { ActionBar } from "../components/features/actions/ActionBar";
import { ConfirmDialog } from "../components/features/actions/ConfirmDialog";
import { Drawer } from "../components/ui/Drawer";
import { Pagination } from "../components/ui/Pagination";
import { PAGE_SIZE, MIN_SCORE_DEFAULT } from "../lib/constants";
import type { Candidate } from "../types";
import { toast } from "sonner";

interface DashboardPageProps {
  scan: { scan: ScanState | null; running: boolean; start: () => void };
}
export default function DashboardPage({ scan }: DashboardPageProps) {
  const stats = useStats();
  const actions = useActions();

  const [filters, setFilters] = useState<CandidateFilters>({
    minScore: MIN_SCORE_DEFAULT,
    unread: false,
    stale: false,
    fromEmail: "",
    offset: 0,
  });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [detail, setDetail] = useState<Candidate | null>(null);
  const [confirm, setConfirm] = useState<{ open: boolean; kind: "trash" | "archive" }>({ open: false, kind: "trash" });

  const senders = useSenders(filters.minScore);
  const candidates = useCandidates(filters);

  const items = candidates.data?.items ?? [];
  const total = candidates.data?.total ?? 0;

  const toggle = (id: string) => {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const toggleAll = () => {
    if (items.length === 0) return;
    if (items.every((c) => selected.has(c.id))) {
      setSelected(new Set());
    } else {
      setSelected(new Set(items.map((c) => c.id)));
    }
  };

  const applyFilters = () => {
    setFilters((f) => ({ ...f, offset: 0 }));
    setSelected(new Set());
  };

  const onSenderSelect = (email: string) => {
    setFilters((f) => ({ ...f, fromEmail: email, offset: 0 }));
    setSelected(new Set());
  };

  const requestAction = (kind: "trash" | "archive") => {
    if (selected.size === 0) return;
    setConfirm({ open: true, kind });
  };

  const doAction = async () => {
    const ids = Array.from(selected);
    try {
      if (confirm.kind === "trash") await actions.trash.mutateAsync(ids);
      else await actions.archive.mutateAsync(ids);
      setSelected(new Set());
      setFilters((f) => ({ ...f, offset: 0 }));
    } catch {
      // toast handled in hook
    }
  };

  const selectHighScore = () => {
    setSelected(new Set(items.filter((c) => c.score >= 6).map((c) => c.id)));
  };

  useEffect(() => {
    if (scan.scan?.status === "done") {
      toast.success(`Scan termine : ${scan.scan.found} candidats sur ${scan.scan.processed} mails`);
    }
  }, [scan.scan?.status]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 space-y-8 pb-24">
      <ScanProgress scan={scan.scan} />

      <StatsGrid stats={stats.data} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1 space-y-6">
          <FiltersPanel value={filters} onChange={setFilters} onApply={applyFilters} />
          <SendersList senders={senders.data} onSelect={onSenderSelect} />
          <button
            onClick={selectHighScore}
            className="w-full text-xs uppercase tracking-wide text-accent hover:underline text-left px-1"
          >
            Selectionner score ≥ 6
          </button>
        </aside>

        <main className="lg:col-span-3 space-y-4">
          <CandidateList
            items={items}
            total={total}
            selected={selected}
            onToggle={toggle}
            onToggleAll={toggleAll}
            onOpen={setDetail}
            loading={candidates.isFetching}
            onRefresh={() => candidates.refetch()}
          />
          <Pagination
            offset={filters.offset}
            limit={PAGE_SIZE}
            total={total}
            onPrev={() => setFilters((f) => ({ ...f, offset: Math.max(0, f.offset - PAGE_SIZE) }))}
            onNext={() => setFilters((f) => ({ ...f, offset: f.offset + PAGE_SIZE }))}
          />
        </main>
      </div>

      <ActionBar
        count={selected.size}
        onTrash={() => requestAction("trash")}
        onArchive={() => requestAction("archive")}
        onClear={() => setSelected(new Set())}
        busy={actions.trash.isPending || actions.archive.isPending}
      />

      <Drawer open={!!detail} onClose={() => setDetail(null)} title="Detail du candidat">
        {detail && <CandidateDetail c={detail} />}
      </Drawer>

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ ...confirm, open: false })}
        onConfirm={doAction}
        title={confirm.kind === "trash" ? "Mettre a la corbeille" : "Archiver"}
        message={`${selected.size} mail(s) seront ${confirm.kind === "trash" ? "mis a la corbeille" : "archives"}.`}
        confirmLabel={confirm.kind === "trash" ? "Corbeille" : "Archiver"}
        danger={confirm.kind === "trash"}
      />
    </div>
  );
}
