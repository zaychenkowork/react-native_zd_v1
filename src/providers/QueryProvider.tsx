import { useReactQueryDevTools } from '@dev-plugins/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { useAppFocusManager } from '@/hooks/app/useAppFocusManager';
import { useOnlineManager } from '@/hooks/app/useOnlineManager';

import { QUERY_CONFIG } from '@/config';

export const queryClient = new QueryClient(QUERY_CONFIG);

export function QueryProvider({ children }: { children: ReactNode }) {
  useOnlineManager();
  useAppFocusManager();
  useReactQueryDevTools(queryClient);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
