import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarInactiveTintColor: "#adeae1",
      tabBarActiveTintColor: "#ffffff",
      tabBarStyle: {
        backgroundColor: "#3a8e22",
        borderTopWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
      }
    }}>
      <Tabs.Screen name="index" options={{
        title: "Home",
        tabBarIcon: ({ color, size }) => (<Ionicons name="home" size={size} color={color} />
        ),
      }} />
      <Tabs.Screen name="browse" options={{
        title: "Browse",
        tabBarIcon: ({ color, size }) => (<Ionicons name="search" size={size} color={color} />
        ),
      }} />
      <Tabs.Screen name="add" options={{
        title: "Add",
        tabBarIcon: ({ color, size }) => (<Ionicons name="add-circle-outline" size={size} color={color} />
        ),
      }} />
      <Tabs.Screen name="transactions" options={{
        title: "Transactions",
        tabBarIcon: ({ color, size }) => (<Ionicons name="receipt" size={size} color={color} />
        ),
      }} />
      <Tabs.Screen name="profile" options={{
        title: "Profile",
        tabBarIcon: ({ color, size }) => (<Ionicons name="person-circle-outline" size={size} color={color} />
        ),
      }} />
    </Tabs>
  )
}
