import { cn } from "../../lib/cn";

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("h-1 w-full bg-gray-200 dark:bg-gray-800", className)}>
      <div className="h-1 bg-accent transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}
