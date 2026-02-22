import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { storage } from '@/utils/storage';

import { STORAGE_KEYS } from '@/constants';

import type { Language } from './resources';
import { resources, supportedLanguages } from './resources';

export const RTL_LANGUAGES: ReadonlySet<string> = new Set([
  'ar',
  'he',
  'fa',
  'ur',
]);

export function isSupportedLanguage(code: string): code is Language {
  return (supportedLanguages as string[]).includes(code);
}

function resolveLanguage(): Language {
  const saved = storage.getString(STORAGE_KEYS.LANGUAGE);
  if (saved && isSupportedLanguage(saved)) return saved;

  const device = getLocales()[0]?.languageCode;
  if (device && isSupportedLanguage(device)) return device;

  return 'en';
}

// RTL at startup is handled automatically by expo-localization plugin
// via extra.supportsRTL in app.config.ts
// eslint-disable-next-line import/no-named-as-default-member -- i18next singleton API
i18n.use(initReactI18next).init({
  resources,
  lng: resolveLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
