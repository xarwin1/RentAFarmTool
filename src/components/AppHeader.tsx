import React from "react";
import { View, Image, Pressable } from "react-native";
import { Text, Badge } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import styles from "@/styles/index.styles";

export default function AppHeader({ title = "Rent a Farm Tool", notifications = 0 }) {
  return (
    <View style={styles.header}>

      {/* LEFT: Logo + Title */}
      <View style={styles.headerLeft}>
        <Image
          style={styles.profilePic}
          source={require("../../assets/raft/logo.png")}
        />
        <Text style={styles.appTitle}>{title}</Text>
      </View>

      {/* RIGHT: Notification */}
      <View style={styles.notification}>
        <Pressable onPress={() => console.log("Notification pressed")}>
          <Ionicons name="notifications-outline" size={24} color="#000" />
        </Pressable>

        {notifications > 0 && (
          <Badge style={styles.notificationBadge}>
            {notifications}
          </Badge>
        )}
      </View>

    </View>
  );
}
