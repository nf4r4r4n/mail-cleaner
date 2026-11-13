import { cn } from "../../lib/cn";

type Tone = "neutral" | "primary" | "danger" | "warning" | "success" | "info" | "secondary";

const tones: Record<Tone, string> = {
  neutral: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  primary: "bg-primary-soft text-primary dark:bg-primary/30 dark:text-primary-dark",
  secondary: "bg-secondary-soft text-secondary dark:bg-secondary/30 dark:text-secondary-dark",
  danger: "bg-red-100 text-status-danger dark:bg-red-900/40 dark:text-red-300",
  warning: "bg-orange-100 text-status-warning dark:bg-orange-900/40 dark:text-orange-300",
  success: "bg-green-100 text-status-success dark:bg-green-900/40 dark:text-green-300",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
};

export function Badge({ className, tone = "neutral", children }: { className?: string; tone?: Tone; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center px-3 py-1 text-xs font-medium rounded-full", tones[tone], className)}>
      {children}
    </span>
  );
}
