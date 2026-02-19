import { QueryProvider } from '@/providers';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <QueryProvider>
      <Stack />
    </QueryProvider>
  );
}
