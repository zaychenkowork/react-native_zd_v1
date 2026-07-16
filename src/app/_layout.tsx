import '@/i18n';

import Env from '@env';
import * as Sentry from '@sentry/react-native';
import { type ErrorBoundaryProps, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ErrorFallback } from '@/ui/components';

import { useAppReady } from '@/hooks';

import { QueryProvider } from '@/providers';

import { useAuthStore } from '@/store';

Sentry.init({
  dsn: Env.EXPO_PUBLIC_SENTRY_DSN, // empty DSN disables the SDK
  enabled: !!Env.EXPO_PUBLIC_SENTRY_DSN,
  environment: Env.EXPO_PUBLIC_RUN_MODE,
  // Performance tracing sample rate — tune down in production if volume is high.
  tracesSampleRate: 1.0,
});

SplashScreen.preventAutoHideAsync();

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return <ErrorFallback error={error} onRetry={retry} />;
}

function RootLayout() {
  const isReady = useAppReady();

  if (!isReady) return null;

  return (
    <SafeAreaProvider>
      <QueryProvider>
        <RootNavigator />
        <StatusBar style="auto" />
      </QueryProvider>
    </SafeAreaProvider>
  );
}

function RootNavigator() {
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default Sentry.wrap(RootLayout);
