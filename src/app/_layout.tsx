import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../../lib/auth-context";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoadingUser } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[2] === "loginScreen";

    if (!user && !inAuthGroup && !isLoadingUser) {
      router.replace("/navigation/screens/loginScreen");
    } else if (user && inAuthGroup && !isLoadingUser) {
      router.replace("/navigation/(tabs)");
    }
  }, [user, segments]);

  return <>{children}</>;
}


export default function RootLayout() {
  return (
    <AuthProvider>
      <PaperProvider>
        <SafeAreaProvider>

          <RouteGuard>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="navigation/(tabs)" options={{ headerShown: false }} />
            </Stack>
          </RouteGuard>
        </SafeAreaProvider>
      </PaperProvider>
    </AuthProvider>





  );
}
