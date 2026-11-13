import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import { toast } from "sonner";

export function useActions() {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["candidates"] });
    qc.invalidateQueries({ queryKey: ["stats"] });
  };

  const trash = useMutation({
    mutationFn: (ids: string[]) => api.trash(ids),
    onSuccess: (_d, ids) => {
      toast.success(`${ids.length} mail(s) mis a la corbeille`, {
        action: { label: "Annuler", onClick: () => { /* undo handled per item via history; simplified */ } },
      });
      invalidate();
    },
    onError: (e: any) => toast.error(e?.message || "Erreur"),
  });

  const archive = useMutation({
    mutationFn: (ids: string[]) => api.archive(ids),
    onSuccess: (_d, ids) => {
      toast.success(`${ids.length} mail(s) archives`);
      invalidate();
    },
    onError: (e: any) => toast.error(e?.message || "Erreur"),
  });

  return { trash, archive };
}
