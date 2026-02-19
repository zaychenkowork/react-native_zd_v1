# Store

This folder contains Zustand stores — lightweight, flexible state management for the app.

**Version:** This guide targets Zustand v5.x and modern React Native (2026).

## What is Zustand?

Zustand is a small, fast state management library with a minimal API. It works great with React and React Native, supports TypeScript, and has no boilerplate.

## When to Use Zustand

| Use Case | Example |
|----------|---------|
| Global UI state | Theme, sidebar open/closed, modals |
| User session | Auth token, user profile, preferences |
| Cross-screen state | Selected filters, cart items, onboarding progress |
| Client-side cache | Temporary data that complements React Query |

⛔ **When NOT to use:** Server state — use TanStack React Query instead.

## Conventions

| Rule | Description |
|------|-------------|
| 📁 One store = one file | Naming: use[Name]Store.ts (e.g., useAuthStore.ts, useUIStore.ts) |
| 📦 Re-export from index | All stores exported from index.ts for clean imports |
| 🔧 Actions co-located | Actions live inside the store, not in separate files |
| 📐 Flat structure | Avoid deep nesting; keep state shallow |
| 🔗 No cross-store imports | Never import one store inside another; use getState() if needed |
| 🎯 Always use selectors | Never subscribe to the whole store; always use (state) => state.field |
| 🧮 Derived state in components | Compute derived data via useMemo in components, not in the store |
| 🔐 Sensitive data | Never persist tokens/credentials without encryption |

## Basic Usage

### Simple Store (no persistence)

```ts
import { create } from 'zustand';

interface UIStore {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
```

### Usage in Components

```tsx
import { useUIStore } from '@/store';

function Header() {
  // Only re-renders when isSidebarOpen changes
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <button onClick={toggleSidebar}>
      {isSidebarOpen ? 'Close' : 'Open'} Menu
    </button>
  );
}
```

### Selective Subscriptions (avoiding re-renders)

When extracting multiple fields, use useShallow to prevent unnecessary re-renders:

```tsx
import { useShallow } from 'zustand/react/shallow';
import { useUIStore } from '@/store';

const { isSidebarOpen, toggleSidebar } = useUIStore(
  useShallow((state) => ({
    isSidebarOpen: state.isSidebarOpen,
    toggleSidebar: state.toggleSidebar,
  }))
);
```

### Using Store Outside React (getState)

Use getState() when you need store data outside React components — e.g., in Axios interceptors, API layers, or event handlers.

```ts
// api/client.ts
import axios from 'axios';
import { useAuthStore } from '@/store';

const api = axios.create({ baseURL: 'https://api.example.com' });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Middleware & Advanced Patterns

### Immer (for complex/nested state)

Use immer for convenient nested state updates.

```ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface CartStore {
  items: { id: string; qty: number }[];
  addItem: (id: string, qty: number) => void;
}

export const useCartStore = create<CartStore>()(
  immer((set) => ({
    items: [],
    addItem: (id, qty) =>
      set((state) => {
        const existing = state.items.find((i) => i.id === id);
        if (existing) existing.qty += qty;
        else state.items.push({ id, qty });
      }),
  }))
);
```

### Persisted Store (MMKV + Encryption + Hydration + Zod)

For React Native, use react-native-mmkv. Always encrypt sensitive data and handle hydration gracefully. We use Zod to validate data coming from storage to prevent crashes if the storage schema changes.

#### 1. MMKV Setup (mmkvStorage.ts)

```ts
import { createMMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';
import * as Keychain from 'react-native-keychain'; // Or Expo SecureStore

// Fetch encryption key securely (implementation depends on your setup)
const getSecureKey = () => 'your-secure-runtime-key';

export const secureStorage = createMMKV({
  id: 'auth-storage',
  encryptionKey: getSecureKey(),
});

export const mmkvStorage: StateStorage = {
  getItem: (name) => secureStorage.getString(name) ?? null,
  setItem: (name, value) => secureStorage.set(name, value),
  removeItem: (name) => secureStorage.remove(name),
};
```

#### 2. Auth Store with Persist & Zod (useAuthStore.ts)

```ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { z } from 'zod';
import { mmkvStorage } from './mmkvStorage';

// Validate stored data
const AuthSchema = z.object({
  token: z.string().nullable(),
});

interface AuthStore {
  token: string | null;
  _hasHydrated: boolean;
  setToken: (token: string | null) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      _hasHydrated: false,
      setToken: (token) => set({ token }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({ token: state.token }), // Don't persist _hasHydrated
      onRehydrateStorage: () => (state) => {
        if (state) {
          try {
            // Validate schema to prevent crashes from outdated storage
            AuthSchema.parse({ token: state.token });
            state.setHasHydrated(true);
          } catch (error) {
            console.error('Storage validation failed, resetting:', error);
            state.setToken(null);
            state.setHasHydrated(true);
          }
        }
      },
    }
  )
);
```

#### 3. Hydration Gate (Preventing Auth Bugs)

In React Native, it's critical not to render the main UI (or RootNavigator) until hydration finishes.
Without a gate, you will encounter a bug: Empty token -> Redirect to Login -> Hydration finishes -> Token appears.

There are two modern ways to handle this in 2026.

**Option A: Using the state flag (Recommended with Zod)**

Since we set _hasHydrated to true inside onRehydrateStorage after validation, this is the most reactive way:

```tsx
import { useAuthStore } from '@/store';
import { SplashScreen } from '@/components';
import { RootNavigator } from '@/navigation';

export function App() {
  // Subscribe to hydration flag from store state
  const hasHydrated = useAuthStore((state) => state._hasHydrated);

  if (!hasHydrated) {
    return <SplashScreen />; // Wait until MMKV returns data
  }

  return <RootNavigator />;
}
```

**Option B: Custom Hook using persist API**

If you don't want to keep a _hasHydrated flag in your store state, you can use Zustand's built-in persist API.

```ts
// hooks/useHydration.ts
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store';

export const useHydration = () => {
  // Check initial state
  const [hydrated, setHydrated] = useState(useAuthStore.persist.hasHydrated());

  useEffect(() => {
    // Subscribe to successful hydration completion
    const unsubFinish = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    return () => {
      unsubFinish();
    };
  }, []);

  return hydrated;
};
```

**Usage:**

```tsx
export function App() {
  const isHydrated = useHydration();

  if (!isHydrated) return <SplashScreen />;
  return <RootNavigator />;
}
```

## Testing (Jest)

Zustand state persists between Jest tests, which can lead to flaky tests. Always reset your stores between test runs.

Add this utility to your test setup:

```ts
// tests/zustandReset.ts
import { StateCreator } from 'zustand';

const storeResetFns = new Set<() => void>();

// Use this wrapper when creating stores you want to test
export const createWithReset = <T>(createState: StateCreator<T>) => {
  const store = create(createState);
  const initialState = store.getState();
  storeResetFns.add(() => store.setState(initialState, true));
  return store;
};

// Call this in setupTests.ts (beforeEach)
export const resetAllStores = () => {
  storeResetFns.forEach((resetFn) => resetFn());
};
```

## Antipatterns & Pitfalls

| ⛔ Don't | ✅ Do |
|---------|-------|
| Subscribe to whole store: useStore(store) | Use selectors: useStore((s) => s.field) |
| Store server data in Zustand | Use React Query for server state |
| Compute derived state in store | Use useMemo in components |
| Persist sensitive data without encryption | Use MMKV with encryptionKey via Keychain |
| Mutate state directly: state.foo = 1 | Always use set() or Immer |
| Let state leak between Jest tests | Reset stores in beforeEach |
| Assume persisted data is always valid | Validate with Zod on onRehydrateStorage |

## Store Structure

```
src/store/
├── index.ts           # Re-export all stores
├── mmkvStorage.ts     # MMKV adapter for persist
├── useAuthStore.ts    # Auth/session (persisted, encrypted, Zod validated)
├── useUIStore.ts      # UI state (ephemeral)
└── README.md
```
