import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

import { getOrCreateMmkvKey, initSecureStorage } from '@/utils';

import { rehydrateAuthStore, useAuthStore } from '@/store';

export function useAppReady() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // 1. Retrieve (or generate on first launch) the MMKV encryption key
        //    from iOS Keychain / Android Keystore — never from the JS bundle.
        const encryptionKey = await getOrCreateMmkvKey();

        // 2. Initialize the encrypted MMKV instance, then force-rehydrate the
        //    auth store so it reads the actual persisted token.
        initSecureStorage(encryptionKey);
        await rehydrateAuthStore();

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
