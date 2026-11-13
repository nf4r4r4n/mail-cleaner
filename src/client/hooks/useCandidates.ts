import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { api } from "../api/client";
import { PAGE_SIZE } from "../lib/constants";
import type { Candidate } from "../types";

export interface CandidateFilters {
  minScore: number;
  unread: boolean;
  stale: boolean;
  fromEmail: string;
  offset: number;
}

export function useCandidates(filters: CandidateFilters) {
  return useQuery({
    queryKey: ["candidates", filters],
    queryFn: () =>
      api.getCandidates({
        minScore: filters.minScore,
        limit: PAGE_SIZE,
        offset: filters.offset,
        unread: filters.unread,
        stale: filters.stale,
        fromEmail: filters.fromEmail || undefined,
      }),
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  });
}
