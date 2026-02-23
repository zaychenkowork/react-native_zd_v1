export const STORAGE_KEYS = {
  /** Zustand auth store key (stored in encrypted MMKV) */
  AUTH_STORAGE: 'auth-storage',
  /** User language preference (stored in plain MMKV) */
  LANGUAGE: 'app-language',
  /** User theme preference (stored in plain MMKV) */
  THEME: 'app-theme',
  /** MMKV encryption key identifier (stored in iOS Keychain / Android Keystore via expo-secure-store) */
  MMKV_ENCRYPTION_KEY: 'mmkv_encryption_key',
} as const;
