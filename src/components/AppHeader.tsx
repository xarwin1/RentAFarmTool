import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Pressable,
  Modal,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import createStyles from "@/styles/index.styles";
import { useTheme } from "@/theme/ThemeContext";
import { useAuth } from "../../lib/auth-context";
import { getNotifications, markNotificationRead } from "../../lib/services";

export default function AppHeader({ title = "Rent a Farm Tool" }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const localStyles = createLocalStyles(theme);
  const { user } = useAuth();

  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) loadNotifications();
  }, [user]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const result = await getNotifications(user!.$id);
      setNotifications(result.documents);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (notifId: string) => {
    try {
      await markNotificationRead(notifId);
      setNotifications((prev) =>
        prev.map((n) => (n.$id === notifId ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const unread = notifications.filter((n) => !n.isRead);
      await Promise.all(unread.map((n) => markNotificationRead(n.$id)));
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const typeIcon = (type: string) => {
    switch (type) {
      case "booking": return { name: "receipt-outline", color: "#1976D2" };
      case "message": return { name: "chatbubble-outline", color: "#2E7D32" };
      case "review": return { name: "star-outline", color: "#F5C842" };
      case "system": return { name: "information-circle-outline", color: "#888" };
      default: return { name: "notifications-outline", color: theme.subtext };
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return date.toLocaleDateString("en-PH", { month: "short", day: "numeric" });
  };

  const renderNotif = ({ item }: { item: any }) => {
    const icon = typeIcon(item.type);
    return (
      <Pressable
        style={[localStyles.notifItem, !item.isRead && localStyles.notifUnread]}
        onPress={() => handleMarkRead(item.$id)}
      >
        <View style={[localStyles.notifIcon, { backgroundColor: `${icon.color}20` }]}>
          <Ionicons name={icon.name as any} size={18} color={icon.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={localStyles.notifTitle}>{item.title}</Text>
          <Text style={localStyles.notifBody} numberOfLines={2}>{item.body}</Text>
          <Text style={localStyles.notifTime}>{formatTime(item.$createdAt)}</Text>
        </View>
        {!item.isRead && <View style={localStyles.unreadDot} />}
      </Pressable>
    );
  };

  return (
    <>
      <View style={styles.header}>
        {/* LEFT: Logo + Title */}
        <View style={styles.headerLeft}>
          <Image
            style={styles.profilePic}
            source={require("../../assets/raft/logo.png")}
          />
          <Text style={styles.appTitle}>{title}</Text>
        </View>

        {/* RIGHT: Notification Bell */}
        <Pressable
          style={styles.notification}
          onPress={() => {
            setShowNotifs(true);
            loadNotifications();
          }}
        >
          <Ionicons name="notifications-outline" size={24} color={theme.text} />
          {unreadCount > 0 && (
            <View style={localStyles.badge}>
              <Text style={localStyles.badgeText}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* NOTIFICATION MODAL */}
      <Modal
        visible={showNotifs}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNotifs(false)}
      >
        <Pressable
          style={localStyles.overlay}
          onPress={() => setShowNotifs(false)}
        >
          <Pressable
            style={localStyles.dropdown}
            onPress={(e) => e.stopPropagation()}
          >
            {/* DROPDOWN HEADER */}
            <View style={localStyles.dropdownHeader}>
              <Text style={localStyles.dropdownTitle}>Notifications</Text>
              {unreadCount > 0 && (
                <Pressable onPress={handleMarkAllRead}>
                  <Text style={localStyles.markAllText}>Mark all read</Text>
                </Pressable>
              )}
            </View>

            {/* CONTENT */}
            {loading ? (
              <ActivityIndicator
                size="small"
                color={theme.primary}
                style={{ padding: 24 }}
              />
            ) : notifications.length === 0 ? (
              <View style={localStyles.emptyState}>
                <Ionicons name="notifications-off-outline" size={32} color={theme.border} />
                <Text style={localStyles.emptyText}>No notifications yet</Text>
              </View>
            ) : (
              <FlatList
                data={notifications}
                keyExtractor={(item) => item.$id}
                renderItem={renderNotif}
                style={{ maxHeight: 380 }}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => (
                  <View style={{ height: 0.5, backgroundColor: theme.border }} />
                )}
              />
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const createLocalStyles = (theme: any) =>
  StyleSheet.create({
    badge: {
      position: "absolute",
      top: 0,
      right: 0,
      minWidth: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: theme.primary,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 3,
    },
    badgeText: {
      color: "#fff",
      fontSize: 9,
      fontWeight: "700",
    },
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.3)",
      alignItems: "flex-end",
      paddingTop: 60,
      paddingRight: 12,
    },
    dropdown: {
      width: 320,
      backgroundColor: theme.card,
      borderRadius: 16,
      borderWidth: 0.5,
      borderColor: theme.border,
      overflow: "hidden",
      elevation: 8,
    },
    dropdownHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 14,
      borderBottomWidth: 0.5,
      borderColor: theme.border,
    },
    dropdownTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.text,
    },
    markAllText: {
      fontSize: 12,
      color: theme.primary,
      fontWeight: "600",
    },
    notifItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      padding: 12,
      gap: 10,
    },
    notifUnread: {
      backgroundColor: `${theme.primary}10`,
    },
    notifIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    notifTitle: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 2,
    },
    notifBody: {
      fontSize: 12,
      color: theme.subtext,
      lineHeight: 17,
    },
    notifTime: {
      fontSize: 11,
      color: theme.subtext,
      marginTop: 4,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.primary,
      marginTop: 4,
    },
    emptyState: {
      alignItems: "center",
      padding: 32,
      gap: 10,
    },
    emptyText: {
      fontSize: 13,
      color: theme.subtext,
    },
  });
