import { STORAGE_KEYS } from '@/constants';
import { getItem, removeItem, setItem } from '@/lib';
import { create } from 'zustand';

interface AuthState {
  token: string | null;
  signIn: (token: string) => void;
  signOut: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  signIn: (token) => {
    setItem(STORAGE_KEYS.AUTH_STORAGE, token);
    set({ token });
  },
  signOut: () => {
    removeItem(STORAGE_KEYS.AUTH_STORAGE);
    set({ token: null });
  },
  hydrate: () => {
    const token = getItem<string>(STORAGE_KEYS.AUTH_STORAGE);

    if (token) {
      set({ token });
    }
  },
}));

export const hydrateAuth = () => useAuthStore.getState().hydrate();
export const signIn = (token: string) => useAuthStore.getState().signIn(token);
export const signOut = () => useAuthStore.getState().signOut();
