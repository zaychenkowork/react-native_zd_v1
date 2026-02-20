# Store

Zustand stores for client-side state (UI, auth, preferences). Server data lives in React Query, not here.

## Conventions

| Rule | Description |
|------|-------------|
| One store = one file | `use[Name]Store.ts` |
| Re-export from index | All stores go through `index.ts` |
| Always use selectors | `useStore((s) => s.field)`, never the whole store |
| Actions inside store | No separate action files |

## Quick Example

```ts
import { create } from 'zustand';

interface UIStore {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIStore>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}));
```

For persistence with MMKV — see `useAuthStore.ts` as reference.

## Folder Structure

```
src/store/
├── index.ts
├── use[Name]Store.ts
└── README.md
```

## Docs

- [Zustand v5](https://zustand.docs.pmnd.rs/)
- [Persist middleware](https://zustand.docs.pmnd.rs/integrations/persisting-store-data)
