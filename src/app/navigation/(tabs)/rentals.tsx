import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import RentalCard from "@/components/RentalCard";
import createRentalStyles from "@/styles/rentals.styles";
import ScreenLayout from "@/styles/screenlayout";
import { useTheme } from "@/theme/ThemeContext";
import { useAuth } from "../../../../lib/auth-context";
import { getRentals, getListing, getUser, updateRentalStatus } from "../../../../lib/services";

const TABS = ["Pending", "Ongoing", "Completed"];

export default function RentalsScreen() {
  const { theme } = useTheme();
  const styles = createRentalStyles(theme);
  const { user } = useAuth();

  const [tab, setTab] = useState("Pending");
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [role, setRole] = useState<"renter" | "owner">("renter");

  useEffect(() => {
    if (user) loadRentals();
  }, [user, tab, role]);

  const loadRentals = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const result = await getRentals(user!.$id, role);

      // filter by tab status
      const filtered = result.documents.filter(
        (r: any) => r.status.toLowerCase() === tab.toLowerCase()
      );

      // fetch listing and user details for each rental
      const enriched = await Promise.all(
        filtered.map(async (rental: any) => {
          try {
            const [listing, otherUser] = await Promise.all([
              getListing(rental.listingId),
              getUser(role === "renter" ? rental.ownerId : rental.renterId),
            ]);
            return { ...rental, listing, otherUser };
          } catch {
            return { ...rental, listing: null, otherUser: null };
          }
        })
      );

      setRentals(enriched);
    } catch (err) {
      console.error("Failed to load rentals:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleStatusUpdate = async (rentalId: string, status: string) => {
    try {
      await updateRentalStatus(rentalId, status);
      loadRentals();
    } catch (err) {
      console.error("Failed to update rental status:", err);
    }
  };

  const onRefresh = useCallback(() => loadRentals(true), [tab, role]);
  if (!user) return null;
  return (
    <ScreenLayout style={{ backgroundColor: theme.background }}>
      <View style={styles.container}>
        <Text style={styles.header}>Rentals</Text>

        {/* ROLE TOGGLE */}
        <View style={{
          flexDirection: "row",
          marginHorizontal: 15,
          marginBottom: 10,
          backgroundColor: theme.card,
          borderRadius: 10,
          padding: 4,
          borderWidth: 0.5,
          borderColor: theme.border,
        }}>
          {(["renter", "owner"] as const).map((r) => (
            <Pressable
              key={r}
              onPress={() => setRole(r)}
              style={{
                flex: 1,
                paddingVertical: 8,
                alignItems: "center",
                borderRadius: 8,
                backgroundColor: role === r ? theme.primary : "transparent",
              }}
            >
              <Text style={{
                fontSize: 13,
                fontWeight: "600",
                color: role === r ? "#fff" : theme.subtext,
              }}>
                {r === "renter" ? "As Renter" : "As Owner"}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* STATUS TABS */}
        <View style={styles.tabs}>
          {TABS.map((t) => (
            <Pressable
              key={t}
              onPress={() => setTab(t)}
              style={[styles.tab, tab === t && styles.activeTab]}
            >
              <Text style={tab === t ? styles.activeText : styles.tabText}>
                {t}
              </Text>
            </Pressable>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={theme.primary}
            style={{ marginTop: 40 }}
          />
        ) : rentals.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 60 }}>
            <Text style={{ color: theme.subtext, fontSize: 14 }}>
              No {tab.toLowerCase()} rentals yet.
            </Text>
          </View>
        ) : (
          <FlatList
            data={rentals}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => (
              <RentalCard
                item={item}
                type={role}
                theme={theme}
                onAccept={() => handleStatusUpdate(item.$id, "ongoing")}
                onDecline={() => handleStatusUpdate(item.$id, "cancelled")}
              />
            )}
            contentContainerStyle={{ padding: 15 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.primary]}
                tintColor={theme.primary}
              />
            }
          />
        )}
      </View>
    </ScreenLayout>
  );
}
