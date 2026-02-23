import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { zustandSecureStorage } from '@/utils';

import { STORAGE_KEYS } from '@/constants';

interface AuthState {
  token: string | null;
  signIn: (token: string) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      signIn: (token) => set({ token }),
      signOut: () => set({ token: null }),
    }),
    {
      name: STORAGE_KEYS.AUTH_STORAGE,
      storage: zustandSecureStorage,
    },
  ),
);

/**
 * Returns a promise that resolves when the auth store has finished
 * reading persisted state from MMKV. With sync storage this is nearly instant.
 */
export const waitForAuthHydration = () =>
  new Promise<void>((resolve) => {
    if (useAuthStore.persist.hasHydrated()) {
      resolve();
      return;
    }
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      unsub();
      resolve();
    });
  });

/**
 * Force-rehydrates the auth store from encrypted MMKV.
 *
 * Called after `initSecureStorage` in `useAppReady` — at that point the MMKV
 * encryption key is available and the store can read the actual persisted data.
 * On first launch the store simply keeps its initial state `{ token: null }`.
 */
export const rehydrateAuthStore = () =>
  new Promise<void>((resolve) => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      unsub();
      resolve();
    });
    useAuthStore.persist.rehydrate();
  });

export const signIn = (token: string) => useAuthStore.getState().signIn(token);
export const signOut = () => useAuthStore.getState().signOut();
