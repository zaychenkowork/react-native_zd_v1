# Query Hooks

TanStack React Query hooks for server state — fetching, caching, and mutations. Client-only state (UI, theme) lives in Zustand, not here.

## Conventions

| Rule                       | Description                                                                                                       |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| One file per domain        | Keys + `queryOptions` factories + hooks live together: `[domain].ts` (see `src/hooks/query/user.ts`)              |
| Feature-first placement    | A domain used by one feature lives in `features/[name]/queries.ts`; promote to `src/hooks/query/` at 2+ consumers |
| Keys via key factory       | Hierarchical arrays built from a `[domain]Keys` factory — never a flat enum, never inline literals                |
| Options via `queryOptions` | Combine key + queryFn in a `[domain]Queries` factory; enforced by the `@tanstack/query/prefer-query-options` rule |
| Direct imports             | Import hooks from their concrete module — no barrels                                                              |
| Invalidate by prefix       | `invalidateQueries({ queryKey: userKeys.all })` clears the whole domain subtree                                   |
| Invalidate on logout       | Call `queryClient.clear()` when the auth token is removed                                                         |
| Use `fetcher()` in queryFn | Wrap `api.*` calls with `fetcher()` from `@/api/fetcher` to unwrap `res.data`                                     |

## Why key factories, not an enum

A query key is a **hierarchical array**, not a string: `['user', 'detail', 5]`. Invalidation matches by prefix, so structure is everything — and a flat enum only covers the root word, leaving the parameterized tail untyped and unstructured at every call site. A key factory keeps the whole shape in one place:

```ts
export const userKeys = {
  all: ['user'] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

// invalidate one user:      queryClient.invalidateQueries({ queryKey: userKeys.detail(5) })
// invalidate every user:    queryClient.invalidateQueries({ queryKey: userKeys.all })
```

Sources: [Effective React Query Keys (TkDodo)](https://tkdodo.eu/blog/effective-react-query-keys), [Query Options API (official)](https://tanstack.com/query/latest/docs/framework/react/guides/query-options). Real-world reference: Bluesky co-locates a key factory with the hooks of each domain in [`state/queries/`](https://github.com/bluesky-social/social-app/tree/main/src/state/queries).

## The domain file shape

`src/hooks/query/user.ts` is the living reference. Every domain file has three layers:

```ts
// 1. Key factory — the single source of key structure
export const userKeys = { ... };

// 2. queryOptions factories — key + queryFn together, fully typed,
//    reusable in useQuery / prefetchQuery / setQueryData
export const userQueries = {
  detail: (id: number) =>
    queryOptions({
      queryKey: userKeys.detail(id),
      queryFn: () => fetcher(api.getUser(id)),
    }),
};

// 3. Hooks consumed by screens
export function useUserQuery(id: number) {
  return useQuery(userQueries.detail(id));
}
```

Mutations invalidate by key prefix:

```ts
export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateUserRequest) => fetcher(api.updateUser(params)),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
  });
}
```

## `fetcher` utility

`fetcher()` from `@/api/fetcher` unwraps `AxiosResponse<T>` → `T` so you never write `.then((res) => res.data)`:

```ts
// api methods use raw axios — return AxiosResponse<T>
api.getUser(id); // → Promise<AxiosResponse<UserResponse>>

// fetcher unwraps to just the data
fetcher(api.getUser(id)); // → Promise<UserResponse>
```

API methods live in `src/api/client.ts` using raw `axiosInstance.*` calls — the transport layer stays React-free; caching policy lives here.

## Folder Structure

```
src/features/[name]/queries.ts    # domain used by a single feature (default)
src/hooks/query/[domain].ts       # promoted: domain used by 2+ features
```

## Docs

- [TanStack React Query v5](https://tanstack.com/query/latest)
- [Query Options](https://tanstack.com/query/latest/docs/framework/react/guides/query-options)
- [Query Invalidation](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation)
- [Effective React Query Keys (TkDodo)](https://tkdodo.eu/blog/effective-react-query-keys)
