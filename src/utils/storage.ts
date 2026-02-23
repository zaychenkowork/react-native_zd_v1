import { createMMKV } from 'react-native-mmkv';
import { createJSONStorage } from 'zustand/middleware';

import { CONFIG } from '@/config';

/**
 * General-purpose storage for non-sensitive data (theme, language, preferences).
 * Not encrypted — do NOT store tokens or credentials here.
 */
export const storage = createMMKV();

/**
 * Encrypted storage for sensitive data (auth tokens, user credentials, etc.).
 *
 * The encryption key comes from CONFIG.MMKV_ENCRYPTION_KEY (set via env).
 * For production apps, replace the env key with one stored in the device
 * keychain: iOS Keychain via `expo-secure-store`, Android Keystore via
 * `react-native-keychain`. Store the EAS build key as an EAS Secret:
 * `eas secret:create --name EXPO_PUBLIC_MMKV_ENCRYPTION_KEY --value <key>`
 */
export const secureStorage = createMMKV({
  id: 'secure-storage',
  encryptionKey: CONFIG.MMKV_ENCRYPTION_KEY,
});

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
 * Use this for stores that persist auth tokens or other credentials.
 */
export const zustandSecureStorage = createJSONStorage(() => ({
  getItem: (key: string) => secureStorage.getString(key) ?? null,
  setItem: (key: string, value: string) => secureStorage.set(key, value),
  removeItem: (key: string) => secureStorage.remove(key),
}));
