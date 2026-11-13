import { Card, CardHeader, CardBody } from "../../ui/Card";
import type { Sender } from "../../../types";

export function SendersList({ senders, onSelect }: { senders: Sender[] | undefined; onSelect: (email: string) => void }) {
  return (
    <Card>
      <CardHeader><h2 className="text-sm font-semibold uppercase tracking-wide">Top expediteurs</h2></CardHeader>
      <CardBody className="p-0">
        <ul>
          {(senders || []).map((s) => (
            <li
              key={s.from_email}
              onClick={() => onSelect(s.from_email)}
              className="flex items-center justify-between px-6 py-2.5 text-sm border-b border-gray-100 dark:border-gray-900 last:border-b-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <span className="truncate">{s.from_email || s.from_addr}</span>
              <span className="text-gray-500 dark:text-gray-400 tabular-nums">{s.cnt}</span>
            </li>
          ))}
          {(!senders || senders.length === 0) && (
            <li className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Aucun expediteur.</li>
          )}
        </ul>
      </CardBody>
    </Card>
  );
}
