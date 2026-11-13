import { Input, Checkbox } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { Card, CardHeader, CardBody } from "../../ui/Card";

export interface FiltersState {
  minScore: number;
  unread: boolean;
  stale: boolean;
  fromEmail: string;
  offset: number;
}

export function FiltersPanel({
  value, onChange, onApply,
}: {
  value: FiltersState;
  onChange: (v: FiltersState) => void;
  onApply: () => void;
}) {
  return (
    <Card>
      <CardHeader><h2 className="text-sm font-semibold uppercase tracking-wide">Filtres</h2></CardHeader>
      <CardBody className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Score minimum</label>
          <Input type="number" value={value.minScore} onChange={(e) => onChange({ ...value, minScore: Number(e.target.value) })} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={value.unread} onChange={(e) => onChange({ ...value, unread: e.target.checked })} />
          Non lus seulement
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={value.stale} onChange={(e) => onChange({ ...value, stale: e.target.checked })} />
          Perimes seulement
        </label>
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Expediteur</label>
          <Input value={value.fromEmail} onChange={(e) => onChange({ ...value, fromEmail: e.target.value })} placeholder="email@..." />
        </div>
        <Button variant="primary" size="sm" className="w-full" onClick={onApply}>Appliquer</Button>
      </CardBody>
    </Card>
  );
}
