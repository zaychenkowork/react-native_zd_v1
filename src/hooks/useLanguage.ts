import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { I18nManager } from 'react-native';
import { useMMKVString } from 'react-native-mmkv';

import { storage } from '@/utils/storage';

import { STORAGE_KEYS } from '@/constants';

import type { Language } from '@/i18n/resources';
import { supportedLanguages } from '@/i18n/resources';

/**
 * Hook for managing the app language with MMKV persistence.
 *
 * RTL direction changes require an app restart to take effect.
 * Install `expo-updates` and call `Updates.reloadAsync()` in `onDirectionChange`,
 * or prompt the user to restart manually.
 *
 * @see https://docs.expo.dev/guides/localization/#forcing-rtl-layout
 */
export function useLanguage(onDirectionChange?: () => void) {
  const { i18n } = useTranslation();
  const [, setStoredLanguage] = useMMKVString(STORAGE_KEYS.LANGUAGE, storage);

  const currentLanguage = i18n.language as Language;
  const isRTL = I18nManager.isRTL;

  const changeLanguage = useCallback(
    (lng: Language) => {
      i18n.changeLanguage(lng);

      // const shouldBeRTL = i18n.dir() === 'rtl';

      setStoredLanguage(lng);

      // if (shouldBeRTL !== I18nManager.isRTL && Platform.OS !== 'web') {
      //   I18nManager.allowRTL(shouldBeRTL);
      //   I18nManager.forceRTL(shouldBeRTL);
      //   onDirectionChange?.();
      // }
    },
    [i18n, setStoredLanguage],
  );

  return { currentLanguage, isRTL, changeLanguage, supportedLanguages };
}
