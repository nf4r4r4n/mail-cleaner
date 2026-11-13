import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";

export function useAccount() {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ["account"], queryFn: api.getAccount, staleTime: 60_000 });
  const disconnect = useMutation({
    mutationFn: api.disconnect,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["account"] }),
  });
  return { ...query, disconnect };
}
