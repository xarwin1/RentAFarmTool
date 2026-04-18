import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "../../lib/auth-context";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@/theme/ThemeContext";
import AppProviders from "@/providers/AppProvider";
import * as SplashScreen from "expo-splash-screen";
import { View, Image } from "react-native";

SplashScreen.preventAutoHideAsync();

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
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        console.log("Hiding splash...");
        await SplashScreen.hideAsync()
        console.log("Splash hidden");
        setAppReady(true);
      } catch (e) {
        console.error("Splash error:", e);
        setAppReady(true); // hide splash even if error
        console.log("ENDPOINT:", process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT);
        console.log("PROJECT:", process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID);
      }
    }
    prepare();
  }, []);

  if (!appReady) {
    return (
      <View style={{ flex: 1, backgroundColor: "#4CAF50", alignItems: "center", justifyContent: "center" }}>
        <Image
          source={require("../../assets/raft/logo-transparent.png")}
          style={{ width: 256, height: 256, resizeMode: "contain" }}
        />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProviders>
          <SafeAreaProvider>
            <RouteGuard>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="navigation/(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="navigation/screens/listingDetail" options={{ headerShown: false }} />
                <Stack.Screen name="navigation/screens/bookingScreen" options={{ headerShown: false }} />
              </Stack>
            </RouteGuard>
          </SafeAreaProvider>
        </AppProviders>
      </AuthProvider>
    </ThemeProvider>
  );
}
