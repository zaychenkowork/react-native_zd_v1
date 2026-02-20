# Query Hooks

TanStack React Query hooks for server state — fetching, caching, and mutations. Client-only state (UI, theme) lives in Zustand, not here.

## Conventions

| Rule | Description |
|------|-------------|
| One hook per resource/action | Flat: `use[Resource]Query.ts` / `use[Action]Mutation.ts`, or grouped: `[resource]/` folder with queries and mutations inside |
| Re-export from index | All hooks go through `index.ts` |
| Query keys as enum | Define in `src/types/enums.ts`, import via `@/types` |
| Invalidate on logout | Clear relevant queries when auth token is removed |

## Quick Example

```ts
import { useQuery } from '@tanstack/react-query';
import { QueryKey } from '@/types';
import { api } from '@/api';

export function useUserQuery() {
  return useQuery({
    queryKey: [QueryKey.User],
    queryFn: () => api.get('/user').then((res) => res.data),
  });
}
```

## Folder Structure

Flat (few hooks):

```
src/hooks/query/
├── index.ts
├── useUserQuery.ts
├── useLoginMutation.ts
└── README.md
```

Grouped by resource (many hooks):

```
src/hooks/query/
├── index.ts
├── user/
│   ├── useUserQuery.ts
│   └── useLoginMutation.ts
├── products/
│   ├── useProductsQuery.ts
│   └── useCreateProductMutation.ts
└── README.md
```

## Docs

- [TanStack React Query v5](https://tanstack.com/query/latest)
- [useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery)
- [useMutation](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation)
