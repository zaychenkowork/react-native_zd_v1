import { STORAGE_KEYS } from '@/constants';
import { zustandStorage } from '@/lib';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
      storage: zustandStorage,
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

export const signIn = (token: string) => useAuthStore.getState().signIn(token);
export const signOut = () => useAuthStore.getState().signOut();
