import { cn } from "../../lib/cn";

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h3 className="text-lg font-semibold uppercase tracking-wide">{title}</h3>
      {description && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
