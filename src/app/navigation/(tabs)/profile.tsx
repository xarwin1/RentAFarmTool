import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, Image, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import createProfileStyles from "@/styles/profile.styles";
import SettingItem from "@/components/SettingItem";
import ScreenLayout from "@/styles/screenlayout";
import { useAuth } from "../../../../lib/auth-context";
import { useTheme } from "@/theme/ThemeContext";
import { getUser, updateUser, uploadFile, getFileUrl, getMyListings, getRentals } from "../../../../lib/services";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen() {
  const { user, logOut } = useAuth();
  const { theme, darkMode, setDarkMode } = useTheme();
  const styles = createProfileStyles(theme);

  const [profile, setProfile] = useState<any>(null);
  const [listingCount, setListingCount] = useState(0);
  const [rentalCount, setRentalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (user) loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
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

  const handlePickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow access to your photo library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    setUploadingAvatar(true);
    try {
      const asset = result.assets[0];
      const file = {
        uri: asset.uri,
        name: asset.fileName || `avatar_${Date.now()}.jpg`,
        type: asset.mimeType || "image/jpeg",
        size: asset.fileSize || 0,
      };

      const uploaded = await uploadFile(file);
      const fileUrl = getFileUrl(uploaded.$id);

      await updateUser(user!.$id, { avatar: fileUrl });
      setProfile((prev: any) => ({ ...prev, avatar: fileUrl }));

      Alert.alert("Success", "Profile picture updated!");
    } catch (err) {
      console.error("Avatar upload failed:", err);
      Alert.alert("Error", "Failed to update profile picture.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (!user) return null;

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
              {/* AVATAR WITH EDIT OVERLAY */}
              <Pressable onPress={handlePickAvatar} style={{ marginRight: 12 }}>
                {uploadingAvatar ? (
                  <View style={[styles.avatar, {
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: theme.background,
                  }]}>
                    <ActivityIndicator size="small" color={theme.primary} />
                  </View>
                ) : (
                  <View>
                    <Image
                      source={
                        profile?.avatar
                          ? { uri: profile.avatar }
                          : require("@/assets/raft/logo-transparent.png")
                      }
                      style={styles.avatar}
                    />
                    <View style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      backgroundColor: theme.primary,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 2,
                      borderColor: theme.card,
                    }}>
                      <Ionicons name="camera" size={11} color="#fff" />
                    </View>
                  </View>
                )}
              </Pressable>

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
                  {"Member since " + new Date(profile.memberSince).toLocaleDateString("en-PH", {
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
