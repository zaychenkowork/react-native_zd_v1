import { createMMKV } from 'react-native-mmkv';
import { createJSONStorage } from 'zustand/middleware';

/**
 * General-purpose storage for non-sensitive data (theme, language, preferences).
 * Not encrypted — do NOT store tokens or credentials here.
 */
export const storage = createMMKV();

/**
 * Encrypted MMKV instance for sensitive data (auth tokens, credentials).
 *
 * Not created at module level — initialized via `initSecureStorage(key)` during
 * app startup. The key is retrieved from iOS Keychain / Android Keystore by
 * `getOrCreateMmkvKey()` in `useAppReady`, so it is never bundled in the JS
 * layer and is unique per device.
 *
 * @see src/utils/secureKey.ts
 * @see src/hooks/app/useAppReady.ts
 */
let _secureStorage: ReturnType<typeof createMMKV> | null = null;

/**
 * Initializes the encrypted MMKV instance with the provided key.
 * Must be called once during app startup (inside `useAppReady`) before any
 * store that uses `zustandSecureStorage` is rehydrated.
 */
export function initSecureStorage(encryptionKey: string): void {
  _secureStorage = createMMKV({ id: 'secure-storage', encryptionKey });
}

export function getItem<T>(key: string): T | null {
  const value = storage.getString(key);
  if (value === undefined) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function setItem<T>(key: string, value: T) {
  storage.set(key, JSON.stringify(value));
}

export function removeItem(key: string) {
  storage.remove(key);
}

/**
 * Zustand persist middleware adapter for MMKV (non-sensitive data).
 * MMKV is synchronous, so hydration happens instantly (no async flash).
 * @see https://zustand.docs.pmnd.rs/integrations/persisting-store-data
 */
export const zustandStorage = createJSONStorage(() => ({
  getItem: (key: string) => storage.getString(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.remove(key),
}));

/**
 * Zustand persist middleware adapter for encrypted MMKV (sensitive data).
 *
 * Returns `null` for all reads before `initSecureStorage` is called — Zustand
 * will fall back to the store's initial state. After `initSecureStorage` runs
 * in `useAppReady`, the store is force-rehydrated via `rehydrateAuthStore()`
 * to load the actual persisted data.
 */
export const zustandSecureStorage = createJSONStorage(() => ({
  getItem: (key: string) => _secureStorage?.getString(key) ?? null,
  setItem: (key: string, value: string) => _secureStorage?.set(key, value),
  removeItem: (key: string) => {
    _secureStorage?.remove(key);
  },
}));
