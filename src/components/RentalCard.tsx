import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Theme } from "@/theme/theme";
import { useRouter } from "expo-router";

type Props = {
  item: {
    $id: string;
    listingId: string;
    renterId?: string;
    ownerId?: string;
    startDate: string;
    endDate: string;
    dailyRate: number;
    totalDays: number;
    total: number;
    status: string;
    deliveryMode: string;
    listing?: { title: string };
    otherUser?: { name: string };
  };
  type: "owner" | "renter";
  theme: Theme;
  onAccept?: () => void;
  onDecline?: () => void;
};

export default function RentalCard({ item, type, theme, onAccept, onDecline }: Props) {
  const styles = createCardStyles(theme);
  const router = useRouter();

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleCardPress = () => {
    router.push(`/navigation/screens/rentalDetail?id=${item.$id}&type=${type}`);
  };

  return (
    <Pressable onPress={handleCardPress} style={({ pressed }) => [{ opacity: pressed ? 0.95 : 1 }]}>
      <View style={styles.card}>
        {/* TITLE */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Text style={styles.title}>
            {item.listing?.title || "Listing unavailable"}
          </Text>
          <View style={[styles.badge, badgeColor(item.status)]}>
            <Text style={styles.badgeText}>{item.status}</Text>
          </View>
        </View>

        {/* USER */}
        <Text style={styles.sub}>
          {type === "owner" ? "Renter" : "Owner"}: {item.otherUser?.name || "—"}
        </Text>

        {/* DATES */}
        <Text style={styles.sub}>
          {formatDate(item.startDate)} — {formatDate(item.endDate)}
        </Text>

        {/* DAYS + DELIVERY */}
        <Text style={styles.sub}>
          {item.totalDays} {item.totalDays === 1 ? "day" : "days"} •{" "}
          {item.deliveryMode === "delivery" ? "Delivery" : "Pickup"}
        </Text>

        {/* PRICE */}
        <Text style={styles.price}>
          ₱{item.total?.toLocaleString()} total
          <Text style={{ fontWeight: "400", fontSize: 12, color: theme.subtext }}>
            {" "}(₱{item.dailyRate?.toLocaleString()}/day)
          </Text>
        </Text>

        {/* ACTIONS */}
        <View style={styles.actions}>
          {item.status === "pending" && type === "owner" && (
            <>
              <Pressable
                style={styles.acceptBtn}
                onPress={(e) => { e.stopPropagation?.(); onAccept?.(); }}
              >
                <Text style={styles.btnText}>Accept</Text>
              </Pressable>
              <Pressable
                style={styles.declineBtn}
                onPress={(e) => { e.stopPropagation?.(); onDecline?.(); }}
              >
                <Text style={styles.btnText}>Decline</Text>
              </Pressable>
            </>
          )}
          {item.status === "pending" && type === "renter" && (
            <Pressable
              style={styles.declineBtn}
              onPress={(e) => { e.stopPropagation?.(); onDecline?.(); }}
            >
              <Text style={styles.btnText}>Cancel request</Text>
            </Pressable>
          )}
          {item.status === "ongoing" && (
            <Pressable
              style={styles.messageBtn}
              onPress={(e) => {
                e.stopPropagation?.();
                router.push(
                  `/navigation/screens/conversation?partnerId=${type === "owner" ? item.renterId : item.ownerId
                  }&partnerName=${item.otherUser?.name || "User"}`
                );
              }}
            >
              <Text style={styles.btnText}>Message</Text>
            </Pressable>
          )}
          {item.status === "completed" && (
            <Pressable
              style={styles.viewBtn}
              onPress={(e) => {
                e.stopPropagation?.();
                router.push(`/navigation/screens/listingDetail?id=${item.listingId}`);
              }}
            >
              <Text style={styles.btnText}>View listing</Text>
            </Pressable>
          )}
          <Pressable
            style={styles.detailBtn}
            onPress={handleCardPress}
          >
            <Text style={styles.btnText}>View details</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const badgeColor = (status: string) => {
  switch (status) {
    case "pending": return { backgroundColor: "#FFC107" };
    case "ongoing": return { backgroundColor: "#2E7D32" };
    case "completed": return { backgroundColor: "#888" };
    case "cancelled": return { backgroundColor: "#D32F2F" };
    default: return { backgroundColor: "#ccc" };
  }
};

const createCardStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      padding: 15,
      borderRadius: 12,
      marginBottom: 12,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.border,
    },
    title: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.text,
      flex: 1,
      marginRight: 8,
    },
    sub: {
      color: theme.subtext,
      marginTop: 2,
      fontSize: 13,
    },
    price: {
      marginTop: 6,
      fontWeight: "600",
      color: theme.text,
      fontSize: 15,
    },
    badge: {
      alignSelf: "flex-start",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    badgeText: {
      color: "#fff",
      fontSize: 12,
    },
    actions: {
      flexDirection: "row",
      marginTop: 10,
      gap: 10,
      flexWrap: "wrap",
    },
    acceptBtn: {
      backgroundColor: "#2E7D32",
      padding: 8,
      borderRadius: 8,
    },
    declineBtn: {
      backgroundColor: "#D32F2F",
      padding: 8,
      borderRadius: 8,
    },
    messageBtn: {
      backgroundColor: "#1976D2",
      padding: 8,
      borderRadius: 8,
    },
    viewBtn: {
      backgroundColor: "#555",
      padding: 8,
      borderRadius: 8,
    },
    detailBtn: {
      backgroundColor: theme.primary,
      padding: 8,
      borderRadius: 8,
    },
    btnText: {
      color: "#fff",
      fontSize: 12,
    },
  });
