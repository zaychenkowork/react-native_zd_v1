export const STORAGE_KEYS = {
  AUTH_STORAGE: 'auth-storage',
  // USER_PREFERENCES: 'user-preferences',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
