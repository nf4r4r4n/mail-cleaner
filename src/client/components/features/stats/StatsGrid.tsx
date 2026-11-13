import { Card, CardBody } from "../../ui/Card";
import type { Stats } from "../../../types";

const ITEMS: { key: keyof Stats; label: string }[] = [
  { key: "total", label: "Mails scannes" },
  { key: "candidates", label: "Candidats" },
  { key: "stale", label: "Perimes" },
  { key: "unread", label: "Non lus" },
  { key: "actions", label: "Actions" },
];

export function StatsGrid({ stats }: { stats: Stats | undefined }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {ITEMS.map((it) => (
        <Card key={it.key}>
          <CardBody className="py-4">
            <div className="text-3xl font-medium text-primary">{stats ? stats[it.key] : "—"}</div>
            <div className="mt-1 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{it.label}</div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
