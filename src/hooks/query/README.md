# Query Hooks

This folder contains custom hooks built on **TanStack React Query** for server state — fetching, caching, and mutating API data. These hooks integrate with **Zustand** stores for auth tokens, user context, and other client-side state.

**Version:** TanStack React Query v5.x, Zustand v5.x.

## When to Use Query Hooks

| Use Case | Example |
|----------|---------|
| Server data fetching | User profile, product list, search results |
| Mutations | Login, create order, update settings |
| Auth-dependent requests | API calls that need token from Zustand |
| Cache invalidation | Refetch after mutation, logout |

⛔ **When NOT to use:** Client-only state (theme, modals, filters) — use Zustand instead.

## Conventions

| Rule | Description |
|------|-------------|
| 📁 One hook per resource/action | Naming: use[Resource]Query, use[Action]Mutation |
| 📦 Re-export from index | All hooks exported from index.ts for clean imports |
| 🎯 Query keys as enum | Centralize keys in enums.ts for consistency |
| 🔄 Invalidate on logout | Clear queries when auth store token is cleared |

---

## Example: useMutation + Zustand (Login)

Login mutation updates the auth store on success. React Query handles loading/error; Zustand holds the token.

```ts
// hooks/query/useLoginMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store';
import { QueryKey } from './enums';

async function login(credentials: { email: string; password: string }) {
  const res = await fetch('https://api.example.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const setToken = useAuthStore((state) => state.setToken);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setToken(data.token);
      queryClient.invalidateQueries({ queryKey: [QueryKey.User] });
    },
    onError: () => {
      setToken(null);
    },
  });
}
```

```tsx
import { useLoginMutation } from '@/hooks/query';

function LoginScreen() {
  const { mutate, isPending, error } = useLoginMutation();

  const handleSubmit = (email: string, password: string) => {
    mutate({ email, password });
  };

  return (
    <LoginForm onSubmit={handleSubmit} loading={isPending} error={error?.message} />
  );
}
```

---

## Query Keys Structure

Keep keys consistent for easy invalidation. Store as enum in `enums.ts`:

```ts
// enums.ts
export enum QueryKey {
  User = 'user',
  UserProfile = 'user:profile',
  Products = 'products',
  ProductsList = 'products:list',
}
```

## Folder Structure

```
src/hooks/query/
├── index.ts              # Re-export all query hooks
├── useLoginMutation.ts
└── README.md
```
