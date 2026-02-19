import { Env } from './env';

export type Environment = (typeof Env)['EXPO_PUBLIC_ENVIRONMENT'];

export const CONFIG = {
  API_URL: Env.EXPO_PUBLIC_API_URL,
  ENVIRONMENT: Env.EXPO_PUBLIC_ENVIRONMENT,
  IS_DEV: __DEV__,
} as const;
