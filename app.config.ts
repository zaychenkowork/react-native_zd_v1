import 'tsx/cjs';

import type { AppIconBadgeConfig } from 'app-icon-badge/types';
import type { ConfigContext, ExpoConfig } from 'expo/config';

import Env from './env';

const appIconBadgeConfig: AppIconBadgeConfig = {
  enabled: Env.EXPO_PUBLIC_RUN_MODE !== 'prod',
  badges: [
    {
      text: Env.EXPO_PUBLIC_RUN_MODE,
      type: 'banner',
      color: 'white',
    },
    {
      text: Env.EXPO_PUBLIC_VERSION.toString(),
      type: 'ribbon',
      color: 'white',
    },
  ],
};

// ⚠️ REPLACE with your Expo account username and project ID before running `eas init`
const EXPO_ACCOUNT_OWNER = 'your-expo-username';
const EAS_PROJECT_ID = 'your-eas-project-id';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: Env.EXPO_PUBLIC_NAME,
  description: `${Env.EXPO_PUBLIC_NAME} Mobile App`,
  owner: EXPO_ACCOUNT_OWNER,

  scheme: Env.EXPO_PUBLIC_SCHEME,
  slug: 'your-app-slug', // ⚠️ REPLACE with your app slug

  version: Env.EXPO_PUBLIC_VERSION.toString(),

  orientation: 'portrait',
  icon: './assets/icon.png',

  ios: {
    supportsTablet: true,
    bundleIdentifier: Env.EXPO_PUBLIC_BUNDLE_ID,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/adaptive-icon.png',
    },
    package: Env.EXPO_PUBLIC_PACKAGE,
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    'expo-status-bar',
    [
      'expo-localization',
      {
        supportedLocales: ['en', 'uk'],
      },
    ],
    [
      'expo-dev-client',
      {
        launchMode: 'most-recent',
      },
    ],
    [
      'expo-splash-screen',
      {
        backgroundColor: '#2E3C4B',
        image: './assets/splash-icon.png',
        imageWidth: 150,
      },
    ],
    ['app-icon-badge', appIconBadgeConfig],
    [
      '@sentry/react-native/expo',
      {
        // ⚠️ REPLACE with your Sentry organization and project slugs.
        // Source maps upload requires SENTRY_AUTH_TOKEN (set it as an EAS secret).
        organization: 'your-sentry-org',
        project: 'your-sentry-project',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    // supportsRTL: true,
    eas: {
      projectId: EAS_PROJECT_ID,
    },
  },
});
