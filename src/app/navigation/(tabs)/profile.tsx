import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, Image, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import createProfileStyles from "@/styles/profile.styles";
import SettingItem from "@/components/SettingItem";
import ScreenLayout from "@/styles/screenlayout";
import { useAuth } from "../../../../lib/auth-context";
import { useTheme } from "@/theme/ThemeContext";
import { avatars } from "../../../../lib/appwrite";
import { getUser, getMyListings, getRentals } from "../../../../lib/services";

export default function ProfileScreen() {
  const { user, logOut } = useAuth();
  const { theme, darkMode, setDarkMode } = useTheme();
  const styles = createProfileStyles(theme);

  const [profile, setProfile] = useState<any>(null);
  const [listingCount, setListingCount] = useState(0);
  const [rentalCount, setRentalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const avatarUrl = profile?.avatar
    ? profile.avatar
    : avatars.getInitials(profile?.name || user?.name || "U").toString();

  useEffect(() => {
    if (user) loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      console.log("Loading profile for user:", user?.$id);
      const [userData, listings, rentals] = await Promise.all([
        getUser(user!.$id),
        getMyListings(user!.$id),
        getRentals(user!.$id, "renter"),
      ]);
      setProfile(userData);
      setListingCount(listings.total);
      setRentalCount(rentals.total);
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ScreenLayout style={{ backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} style={{ flex: 1 }} />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout style={{ backgroundColor: theme.background }}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>

          {/* PROFILE HEADER */}
          <View style={styles.card}>
            <View style={styles.profileRow}>
              <Image
                source={{ uri: avatarUrl }
                }
                style={styles.avatar}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{profile?.name || user?.name || "—"}</Text>
                <Text style={styles.location}>
                  📍 {profile?.location || "Location not set"}
                </Text>
                <Text style={[styles.location, { marginTop: 2 }]}>
                  {profile?.email || user?.email}
                </Text>
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
                <Text style={styles.statNumber}>{listingCount}</Text>
                <Text style={styles.statLabel}>Listings</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{rentalCount}</Text>
                <Text style={styles.statLabel}>Rentals</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {profile?.rating > 0 ? profile.rating.toFixed(1) : "—"}
                </Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>
          </View>

          {/* MEMBER SINCE */}
          {profile?.memberSince && (
            <View style={styles.card}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Ionicons name="calendar-outline" size={16} color={theme.subtext} />
                <Text style={{ fontSize: 13, color: theme.subtext }}>
                  Member since{" "}
                  {new Date(profile.memberSince).toLocaleDateString("en-PH", {
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
              </View>
            </View>
          )}

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
