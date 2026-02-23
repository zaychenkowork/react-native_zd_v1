import * as SecureStore from 'expo-secure-store';

import { STORAGE_KEYS } from '@/constants';

/**
 * Returns the MMKV encryption key from iOS Keychain / Android Keystore.
 *
 * On first launch, generates a cryptographically random 256-bit key, persists
 * it in native secure storage, and returns it. On all subsequent launches the
 * same key is retrieved, so encrypted MMKV data remains readable.
 *
 * Why this is better than EXPO_PUBLIC_MMKV_ENCRYPTION_KEY:
 *   - Never bundled in JS → invisible to anyone who decompiles the app
 *   - Per-device unique key → compromising one device doesn't affect others
 *   - Backed by iOS Keychain / Android Keystore hardware security
 */
export async function getOrCreateMmkvKey(): Promise<string> {
  const existing = await SecureStore.getItemAsync(
    STORAGE_KEYS.MMKV_ENCRYPTION_KEY,
  );

  if (existing) return existing;

  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  const key = btoa(
    Array.from(randomBytes, (b) => String.fromCharCode(b)).join(''),
  );

  await SecureStore.setItemAsync(STORAGE_KEYS.MMKV_ENCRYPTION_KEY, key);

  return key;
}
