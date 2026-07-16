import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { api } from '@/api/client';
import { fetcher } from '@/api/fetcher';

import type { UpdateUserRequest } from '@/types/api';

/**
 * Reference domain query file — copy this shape for every domain.
 *
 * One file per domain holds three layers:
 * 1. `userKeys` — hierarchical key factory. Every key is built from the one
 *    above it, so prefix invalidation always works and key structure cannot
 *    drift between call sites.
 * 2. `userQueries` — `queryOptions()` factories combining key + queryFn
 *    (+ per-query cache config). Reusable in useQuery, prefetchQuery,
 *    setQueryData — all fully typed.
 * 3. Hooks — thin wrappers consumed by screens.
 *
 * Placement rule: a domain used by ONE feature keeps this file inside the
 * feature (`features/[name]/queries.ts`); once a SECOND feature needs it,
 * promote it here to `src/hooks/query/[domain].ts`.
 */
export const userKeys = {
  all: ['user'] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

export const userQueries = {
  detail: (id: number) =>
    queryOptions({
      queryKey: userKeys.detail(id),
      queryFn: () => fetcher(api.getUser(id)),
    }),
};

export function useUserQuery(id: number) {
  return useQuery(userQueries.detail(id));
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateUserRequest) => fetcher(api.updateUser(params)),
    onSuccess: (_data, { id }) => {
      // Prefix invalidation: refetch this user everywhere it is cached.
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
  });
}
