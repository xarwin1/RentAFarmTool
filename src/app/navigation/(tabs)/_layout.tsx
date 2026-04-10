import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarInactiveTintColor: "#adeae1",
      tabBarActiveTintColor: "#ffffff",
      tabBarStyle: {
        backgroundColor: "#4CAF50",
        borderTopWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
      }
    }}>
      <Tabs.Screen name="home" options={{
        title: "Home",
        tabBarIcon: ({ color, size }) => (<Ionicons name="home" size={size} color={color} />
        ),
      }} />
      <Tabs.Screen name="messages" options={{
        title: "Messages",
        tabBarIcon: ({ color, size }) => (<Ionicons name="mail" size={size} color={color} />
        ),
      }} />
      <Tabs.Screen name="post" options={{
        title: "Post",
        tabBarIcon: ({ color, size }) => (<Ionicons name="add-circle-outline" size={size} color={color} />
        ),
      }} />
      <Tabs.Screen name="rentals" options={{
        title: "Rentals",
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
