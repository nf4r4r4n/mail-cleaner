import { Trash2, Archive, X } from "lucide-react";
import { Button } from "../../ui/Button";

export function ActionBar({
  count, onTrash, onArchive, onClear, busy,
}: {
  count: number;
  onTrash: () => void;
  onArchive: () => void;
  onClear: () => void;
  busy: boolean;
}) {
  if (count === 0) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between gap-4">
        <div className="text-sm">
          <span className="font-semibold">{count}</span>
          <span className="text-gray-500 dark:text-gray-400 ml-2">selectionne(s)</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onClear} disabled={busy}>
            <X className="h-4 w-4" /> Tout retirer
          </Button>
          <Button variant="secondary" size="sm" onClick={onArchive} disabled={busy}>
            <Archive className="h-4 w-4" /> Archiver
          </Button>
          <Button variant="danger" size="sm" onClick={onTrash} disabled={busy}>
            <Trash2 className="h-4 w-4" /> Corbeille
          </Button>
        </div>
      </div>
    </div>
  );
}
