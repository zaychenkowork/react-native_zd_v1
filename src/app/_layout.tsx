import { QueryProvider } from '@/providers';
import { ErrorFallback } from '@/ui/components';
import { useFonts } from 'expo-font';
import { type ErrorBoundaryProps, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return <ErrorFallback error={error} onRetry={retry} />;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    // 'Inter-Regular': require('@/ui/assets/fonts/Inter-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryProvider>
        <Stack />
        <StatusBar style="auto" />
      </QueryProvider>
    </SafeAreaProvider>
  );
}
