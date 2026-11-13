import { ProgressBar } from "../../ui/ProgressBar";
import type { ScanState } from "../../../types";

export function ScanProgress({ scan }: { scan: ScanState | null }) {
  if (!scan || scan.status !== "running") return null;
  const pct = scan.total ? (scan.processed / scan.total) * 100 : 10;
  return (
    <div className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-3">
        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-2">
          <span>Scan en cours</span>
          <span className="tabular-nums">
            {scan.processed}{scan.total ? ` / ${scan.total}` : ""} — {scan.found} candidats
          </span>
        </div>
        <ProgressBar value={pct} />
      </div>
    </div>
  );
}
