import { cn } from "../../lib/cn";

type Tone = "neutral" | "accent" | "danger" | "warning" | "success" | "info";

const tones: Record<Tone, string> = {
  neutral: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  accent: "bg-accent-soft text-accent dark:bg-accent/20 dark:text-accent-dark",
  danger: "bg-red-100 text-status-danger dark:bg-red-900/30 dark:text-red-400",
  warning: "bg-amber-100 text-status-warning dark:bg-amber-900/30 dark:text-amber-400",
  success: "bg-green-100 text-status-success dark:bg-green-900/30 dark:text-green-400",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

export function Badge({ className, tone = "neutral", children }: { className?: string; tone?: Tone; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 text-xs font-medium uppercase tracking-wide", tones[tone], className)}>
      {children}
    </span>
  );
}
