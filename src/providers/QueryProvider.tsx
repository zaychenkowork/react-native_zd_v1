import { useReactQueryDevTools } from '@dev-plugins/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

const queryClient = new QueryClient();

export function QueryProvider({ children }: { children: ReactNode }) {
  useReactQueryDevTools(queryClient);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
