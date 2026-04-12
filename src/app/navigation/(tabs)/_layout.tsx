import { Tabs } from "expo-router";
import { useTheme } from "@/theme/ThemeContext";
import CustomTabBar from "@/components/NavBar";
import NavBar from "@/components/NavBar";

export default function TabsLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      tabBar={(props) => <NavBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="messages" options={{ title: "Messages" }} />
      <Tabs.Screen name="post" options={{ title: "Post" }} />
      <Tabs.Screen name="rentals" options={{ title: "Rentals" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
