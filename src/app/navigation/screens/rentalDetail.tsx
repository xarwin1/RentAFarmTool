import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeContext";
import ScreenLayout from "@/styles/screenlayout";
import { databases, config, avatars } from "../../../../lib/appwrite";
import { getListing, getUser, updateRentalStatus } from "../../../../lib/services";

export default function RentalDetailScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const { id, type } = useLocalSearchParams<{ id: string; type: string }>();

  const [rental, setRental] = useState<any>(null);
  const [listing, setListing] = useState<any>(null);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) loadAll();
  }, [id]);

  const loadAll = async () => {
    try {
      const rentalData = await databases.getDocument(
        config.databaseId,
        config.rentalsCollectionId,
        id
      );
      setRental(rentalData);

      const [listingData, userData] = await Promise.all([
        getListing(rentalData.listingId),
        getUser(type === "owner" ? rentalData.renterId : rentalData.ownerId),
      ]);
      setListing(listingData);
      setOtherUser(userData);
    } catch (err) {
      console.error("Failed to load rental detail:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status: string, label: string) => {
    Alert.alert(
      `${label} rental?`,
      `Are you sure you want to ${label.toLowerCase()} this rental?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: label,
          style: status === "cancelled" ? "destructive" : "default",
          onPress: async () => {
            setUpdating(true);
            try {
              await updateRentalStatus(id, status);
              setRental((prev: any) => ({ ...prev, status }));
            } catch (err) {
              Alert.alert("Error", "Failed to update rental status.");
            } finally {
              setUpdating(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-PH", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const badgeColor = (status: string) => {
    switch (status) {
      case "pending": return "#FFC107";
      case "ongoing": return "#2E7D32";
      case "completed": return "#888";
      case "cancelled": return "#D32F2F";
      default: return "#ccc";
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
      <View style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={theme.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Rental Details</Text>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* STATUS BANNER */}
          <View style={[styles.statusBanner, { backgroundColor: badgeColor(rental?.status) }]}>
            <Text style={styles.statusBannerText}>
              {rental?.status?.toUpperCase()}
            </Text>
            <Text style={styles.statusBannerSub}>
              Booked on {formatDateTime(rental?.$createdAt)}
            </Text>
          </View>

          {/* LISTING INFO */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Listing</Text>
            <Pressable
              style={styles.listingRow}
              onPress={() =>
                router.push(`/navigation/screens/listingDetail?id=${rental?.listingId}`)
              }
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.listingTitle}>{listing?.title || "—"}</Text>
                <Text style={styles.listingLocation}>📍 {listing?.location || "—"}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.subtext} />
            </Pressable>
          </View>

          {/* OTHER USER */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              {type === "owner" ? "Renter" : "Owner"}
            </Text>
            <View style={styles.userRow}>
              <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>
                  {otherUser?.name?.substring(0, 2).toUpperCase() || "??"}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.userName}>{otherUser?.name || "—"}</Text>
                <Text style={styles.userSub}>{otherUser?.email || "—"}</Text>
                {otherUser?.phone && (
                  <Text style={styles.userSub}>{otherUser.phone}</Text>
                )}
              </View>
              <Pressable
                style={styles.msgBtn}
                onPress={() =>
                  router.push(
                    `/navigation/screens/conversation?partnerId=${otherUser?.$id}&partnerName=${otherUser?.name || "User"}`
                  )
                }
              >
                <Ionicons name="chatbubble-outline" size={16} color="#fff" />
              </Pressable>
            </View>
          </View>

          {/* RENTAL DATES */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Rental period</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Start date</Text>
              <Text style={styles.infoValue}>{formatDate(rental?.startDate)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>End date</Text>
              <Text style={styles.infoValue}>{formatDate(rental?.endDate)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>
                {rental?.totalDays} {rental?.totalDays === 1 ? "day" : "days"}
              </Text>
            </View>
          </View>

          {/* COLLECTION */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Collection</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Method</Text>
              <Text style={styles.infoValue}>
                {rental?.deliveryMode === "delivery" ? "Delivery" : "Pickup"}
              </Text>
            </View>
            {rental?.deliveryMode === "delivery" && rental?.deliveryAddress && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={[styles.infoValue, { flex: 1, textAlign: "right" }]} numberOfLines={2}>
                  {rental.deliveryAddress}
                </Text>
              </View>
            )}
          </View>

          {/* PRICE BREAKDOWN */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Payment</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                ₱{rental?.dailyRate?.toLocaleString()} x {rental?.totalDays} days
              </Text>
              <Text style={styles.infoValue}>₱{rental?.subtotal?.toLocaleString()}</Text>
            </View>
            {rental?.deposit > 0 && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Deposit</Text>
                <Text style={styles.infoValue}>₱{rental?.deposit?.toLocaleString()}</Text>
              </View>
            )}
            {rental?.deliveryFee > 0 && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Delivery fee</Text>
                <Text style={styles.infoValue}>₱{rental?.deliveryFee?.toLocaleString()}</Text>
              </View>
            )}
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { fontWeight: "700", color: theme.text }]}>Total</Text>
              <Text style={[styles.infoValue, { color: theme.primary, fontWeight: "700", fontSize: 16 }]}>
                ₱{rental?.total?.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* NOTES */}
          {rental?.notes && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <Text style={styles.notesText}>{rental.notes}</Text>
            </View>
          )}
        </ScrollView>

        {/* BOTTOM ACTIONS */}
        <View style={styles.bottomBar}>
          {rental?.status === "pending" && type === "owner" && (
            <>
              <Pressable
                style={[styles.actionBtn, { backgroundColor: "#D32F2F", flex: 1 }]}
                onPress={() => handleStatusUpdate("cancelled", "Decline")}
                disabled={updating}
              >
                <Text style={styles.actionBtnText}>Decline</Text>
              </Pressable>
              <Pressable
                style={[styles.actionBtn, { backgroundColor: theme.primary, flex: 2 }]}
                onPress={() => handleStatusUpdate("ongoing", "Accept")}
                disabled={updating}
              >
                {updating ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.actionBtnText}>Accept rental</Text>
                )}
              </Pressable>
            </>
          )}
          {rental?.status === "pending" && type === "renter" && (
            <Pressable
              style={[styles.actionBtn, { backgroundColor: "#D32F2F", flex: 1 }]}
              onPress={() => handleStatusUpdate("cancelled", "Cancel")}
              disabled={updating}
            >
              <Text style={styles.actionBtnText}>Cancel request</Text>
            </Pressable>
          )}
          {rental?.status === "ongoing" && type === "owner" && (
            <Pressable
              style={[styles.actionBtn, { backgroundColor: theme.primary, flex: 1 }]}
              onPress={() => handleStatusUpdate("completed", "Complete")}
              disabled={updating}
            >
              {updating ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.actionBtnText}>Mark as completed</Text>
              )}
            </Pressable>
          )}
          {rental?.status === "ongoing" && (
            <Pressable
              style={[styles.actionBtn, { backgroundColor: "#1976D2", flex: 1 }]}
              onPress={() =>
                router.push(
                  `/navigation/screens/conversation?partnerId=${otherUser?.$id}&partnerName=${otherUser?.name || "User"}`
                )
              }
            >
              <Text style={styles.actionBtnText}>Message</Text>
            </Pressable>
          )}
          {rental?.status === "completed" && (
            <Pressable
              style={[styles.actionBtn, { backgroundColor: theme.primary, flex: 1 }]}
              onPress={() =>
                router.push(`/navigation/screens/listingDetail?id=${rental?.listingId}`)
              }
            >
              <Text style={styles.actionBtnText}>View listing</Text>
            </Pressable>
          )}
          {(rental?.status === "cancelled" || rental?.status === "completed") && (
            <Pressable
              style={[styles.actionBtn, { backgroundColor: theme.border, flex: 1 }]}
              onPress={() => router.back()}
            >
              <Text style={styles.actionBtnText}>Go back</Text>
            </Pressable>
          )}
        </View>
      </View>
    </ScreenLayout>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 14,
      backgroundColor: theme.card,
      borderBottomWidth: 0.5,
      borderColor: theme.border,
    },
    backBtn: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: theme.background,
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: theme.text,
    },
    content: {
      padding: 14,
      gap: 12,
      paddingBottom: 20,
    },
    statusBanner: {
      borderRadius: 14,
      padding: 16,
      alignItems: "center",
    },
    statusBannerText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "700",
      letterSpacing: 1,
    },
    statusBannerSub: {
      color: "rgba(255,255,255,0.8)",
      fontSize: 12,
      marginTop: 4,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: 14,
      padding: 14,
      borderWidth: 0.5,
      borderColor: theme.border,
      gap: 8,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 4,
    },
    listingRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    listingTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: theme.text,
    },
    listingLocation: {
      fontSize: 13,
      color: theme.subtext,
      marginTop: 2,
    },
    userRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    userAvatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.background,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 0.5,
      borderColor: theme.border,
    },
    userAvatarText: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.primary,
    },
    userName: {
      fontSize: 15,
      fontWeight: "600",
      color: theme.text,
    },
    userSub: {
      fontSize: 12,
      color: theme.subtext,
      marginTop: 1,
    },
    msgBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "#1976D2",
      alignItems: "center",
      justifyContent: "center",
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 5,
      borderBottomWidth: 0.5,
      borderColor: theme.border,
    },
    infoLabel: {
      fontSize: 13,
      color: theme.subtext,
    },
    infoValue: {
      fontSize: 13,
      color: theme.text,
      fontWeight: "500",
    },
    divider: {
      height: 0.5,
      backgroundColor: theme.border,
      marginVertical: 4,
    },
    notesText: {
      fontSize: 13,
      color: theme.subtext,
      lineHeight: 20,
    },
    bottomBar: {
      flexDirection: "row",
      padding: 14,
      gap: 10,
      backgroundColor: theme.card,
      borderTopWidth: 0.5,
      borderColor: theme.border,
    },
    actionBtn: {
      padding: 14,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    actionBtnText: {
      color: "#fff",
      fontWeight: "700",
      fontSize: 14,
    },
  });
