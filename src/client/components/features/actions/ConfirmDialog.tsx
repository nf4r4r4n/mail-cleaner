import { Modal } from "../../ui/Modal";
import { Button } from "../../ui/Button";

export function ConfirmDialog({
  open, onClose, onConfirm, title, message, confirmLabel = "Confirmer", danger,
}: {
  open: boolean; onClose: () => void; onConfirm: () => void;
  title: string; message: string; confirmLabel?: string; danger?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="secondary" size="sm" onClick={onClose}>Annuler</Button>
        <Button variant={danger ? "danger" : "primary"} size="sm" onClick={() => { onConfirm(); onClose(); }}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
