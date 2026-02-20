import type { AppIconBadgeConfig } from 'app-icon-badge/types';
import type { ConfigContext, ExpoConfig } from 'expo/config';

import 'tsx/cjs';

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

const EXPO_ACCOUNT_OWNER = 'dz.work';
const EAS_PROJECT_ID = '996dc461-0d90-42f4-80f5-b690b2340268';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: Env.EXPO_PUBLIC_NAME,
  description: `${Env.EXPO_PUBLIC_NAME} Mobile App`,
  owner: EXPO_ACCOUNT_OWNER,

  scheme: Env.EXPO_PUBLIC_SCHEME,
  slug: 'test-template',

  version: Env.EXPO_PUBLIC_VERSION.toString(),

  orientation: 'portrait',
  icon: './assets/icon.png',

  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
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
    edgeToEdgeEnabled: true,
    package: Env.EXPO_PUBLIC_PACKAGE,
  },
  plugins: [
    'expo-router',
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
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: EAS_PROJECT_ID,
    },
  },
});
