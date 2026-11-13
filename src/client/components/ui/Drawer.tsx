import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/cn";
import { X } from "lucide-react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: string;
}

export function Drawer({ open, onClose, title, children, width = "w-full sm:w-[480px]" }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={cn("relative h-full bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 flex flex-col", width)}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-base font-semibold uppercase tracking-wide">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 px-6 py-4 overflow-auto">{children}</div>
      </div>
    </div>,
    document.body
  );
}
