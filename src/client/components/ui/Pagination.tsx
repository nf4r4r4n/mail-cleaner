import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

export function Pagination({ offset, limit, total, onPrev, onNext }: {
  offset: number; limit: number; total: number; onPrev: () => void; onNext: () => void;
}) {
  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(offset + limit, total);
  return (
    <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 dark:border-gray-800 text-sm">
      <Button variant="secondary" size="sm" onClick={onPrev} disabled={offset === 0}>
        <ChevronLeft className="h-4 w-4" /> Precedent
      </Button>
      <span className="text-gray-500 dark:text-gray-400">{from}–{to} / {total}</span>
      <Button variant="secondary" size="sm" onClick={onNext} disabled={offset + limit >= total}>
        Suivant <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
