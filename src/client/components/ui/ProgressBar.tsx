import { cn } from "../../lib/cn";

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden", className)}>
      <div className="h-1 bg-primary rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
    </div>
  );
}
