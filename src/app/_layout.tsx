import { APIProvider } from "@/providers";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <APIProvider>
      <Stack />
    </APIProvider>
  );
}
