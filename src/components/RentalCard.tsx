import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Theme } from "@/theme/theme";

type Props = {
  item: {
    title: string;
    user: string;
    startDate: string;
    endDate: string;
    price: number;
    unit: string;
    status: string;
  };
  type: "owner" | "renter";
  theme: Theme;
};

export default function RentalCard({ item, type, theme }: Props) {
  const styles = createCardStyles(theme);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.sub}>
        {type === "owner" ? "Renter" : "Owner"}: {item.user}
      </Text>
      <Text style={styles.sub}>
        {item.startDate} - {item.endDate}
      </Text>
      <Text style={styles.price}>₱{item.price}/{item.unit}</Text>
      <View style={[styles.badge, badgeColor(item.status)]}>
        <Text style={styles.badgeText}>{item.status}</Text>
      </View>
      <View style={styles.actions}>
        {item.status === "Pending" && (
          <>
            <Pressable style={styles.acceptBtn}>
              <Text style={styles.btnText}>Accept</Text>
            </Pressable>
            <Pressable style={styles.declineBtn}>
              <Text style={styles.btnText}>Decline</Text>
            </Pressable>
          </>
        )}
        {item.status === "Ongoing" && (
          <Pressable style={styles.messageBtn}>
            <Text style={styles.btnText}>Message</Text>
          </Pressable>
        )}
        {item.status === "Completed" && (
          <Pressable style={styles.viewBtn}>
            <Text style={styles.btnText}>View</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

// Status badge colors stay semantic regardless of theme
const badgeColor = (status: string) => {
  switch (status) {
    case "Pending": return { backgroundColor: "#FFC107" };
    case "Ongoing": return { backgroundColor: "#2E7D32" };
    case "Completed": return { backgroundColor: "#888" };
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
    },
    sub: {
      color: theme.subtext,
      marginTop: 2,
    },
    price: {
      marginTop: 6,
      fontWeight: "600",
      color: theme.text,
    },
    badge: {
      marginTop: 8,
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
    btnText: {
      color: "#fff",
      fontSize: 12,
    },
  });
