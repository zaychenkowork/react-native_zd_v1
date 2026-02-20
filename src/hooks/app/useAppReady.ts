// import { queryClient } from '@/providers';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

import { useAuthStore, waitForAuthHydration } from '@/store';

export function useAppReady() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await waitForAuthHydration();

        const token = useAuthStore.getState().token;
        if (token) {
          // Prefetch critical data while splash is still visible.
          // Example:
          // await queryClient.prefetchQuery({
          //   queryKey: [QueryKey.UserProfile],
          //   queryFn: fetchProfile,
          // });
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
