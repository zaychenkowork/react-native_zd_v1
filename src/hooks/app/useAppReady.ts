import { queryClient } from '@/providers';
import { hydrateAuth, useAuthStore } from '@/store';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

export function useAppReady() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await hydrateAuth();

        const token = useAuthStore.getState().token;
        if (token) {
          // Prefetch critical data while splash is still visible.
          // Example:
          // await queryClient.prefetchQuery({
          //   queryKey: [QueryKey.UserProfile],
          //   queryFn: fetchProfile,
          // });
          void queryClient;
        }
      } catch (error) {
        console.warn('App preparation failed:', error);
      } finally {
        setIsReady(true);
        SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  return isReady;
}
