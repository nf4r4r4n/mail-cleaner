import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

export function useSenders(minScore: number) {
  return useQuery({
    queryKey: ["senders", { minScore }],
    queryFn: () => api.getSenders(minScore, 20),
    staleTime: 30_000,
    select: (d) => d.items,
  });
}
