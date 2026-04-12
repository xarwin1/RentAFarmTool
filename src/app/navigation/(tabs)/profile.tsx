import React from "react";
import { View, Text, Pressable, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import createProfileStyles from "@/styles/profile.styles";
import SettingItem from "@/components/SettingItem";
import ScreenLayout from "@/styles/screenlayout";
import { useAuth } from "../../../../lib/auth-context";
import { useTheme } from "@/theme/ThemeContext";

export default function ProfileScreen() {
  const { logOut } = useAuth();
  const { theme, darkMode, setDarkMode } = useTheme();
  const styles = createProfileStyles(theme);

  return (
    <ScreenLayout style={{ backgroundColor: theme.background }}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          {/* PROFILE HEADER */}
          <View style={styles.card}>
            <View style={styles.profileRow}>
              <Image
                source={require("@/assets/raft/logo-transparent.png")}
                style={styles.avatar}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>Warwick Dela Cruz</Text>
                <Text style={styles.location}>📍 Naic, Cavite</Text>
              </View>
              <Pressable style={styles.editBtn}>
                <Ionicons name="pencil" size={16} color={theme.primary} />
              </Pressable>
            </View>
          </View>

          {/* STATS */}
          <View style={styles.card}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Listings</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>8</Text>
                <Text style={styles.statLabel}>Rentals</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>4.8</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>
          </View>

          {/* SETTINGS */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <SettingItem icon="person-outline" label="Account Settings" />
            <SettingItem icon="notifications-outline" label="Notifications" />
            <SettingItem icon="card-outline" label="Payment Methods" />
            <SettingItem
              icon="moon-outline"
              label="Dark Mode"
              type="toggle"
              value={darkMode}
              onValueChange={setDarkMode}
            />
            <SettingItem icon="help-circle-outline" label="Help & Support" />
          </View>

          {/* LOGOUT */}
          <Pressable style={styles.logoutBtn} onPress={logOut}>
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </ScrollView>
      </View>
    </ScreenLayout>
  );
}
