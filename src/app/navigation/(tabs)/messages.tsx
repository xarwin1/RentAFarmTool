import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import createStyles from "../../../styles/index.styles";
import createMsgStyles from "@/styles/messages.styles";
import AppHeader from "@/components/AppHeader";
import ScreenLayout from "@/styles/screenlayout";
import { useTheme } from "@/theme/ThemeContext";
import { useAuth } from "../../../../lib/auth-context";
import { useRouter } from "expo-router";
import { databases, config, Query } from "../../../../lib/appwrite";
import { getUser } from "../../../../lib/services";

export default function MessagesScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const msgStyles = createMsgStyles(theme);
  const { user } = useAuth();
  const router = useRouter();

  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) loadConversations();
  }, [user]);

  const loadConversations = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      // get all messages where user is sender or receiver
      const [sent, received] = await Promise.all([
        databases.listDocuments(config.databaseId, config.messagesCollectionId, [
          Query.equal("senderId", user!.$id),
          Query.orderDesc("$createdAt"),
          Query.limit(100),
        ]),
        databases.listDocuments(config.databaseId, config.messagesCollectionId, [
          Query.equal("receiverId", user!.$id),
          Query.orderDesc("$createdAt"),
          Query.limit(100),
        ]),
      ]);

      const allMessages = [...sent.documents, ...received.documents];

      // group by conversation partner
      const conversationMap = new Map<string, any>();
      for (const msg of allMessages) {
        const partnerId = msg.senderId === user!.$id ? msg.receiverId : msg.senderId;
        const existing = conversationMap.get(partnerId);
        if (!existing || new Date(msg.$createdAt) > new Date(existing.lastMessage.$createdAt)) {
          conversationMap.set(partnerId, {
            partnerId,
            lastMessage: msg,
            unreadCount: 0,
          });
        }
      }

      // count unread messages per conversation
      for (const msg of received.documents) {
        if (!msg.isRead) {
          const conv = conversationMap.get(msg.senderId);
          if (conv) conv.unreadCount += 1;
        }
      }

      // fetch partner user details
      const enriched = await Promise.all(
        Array.from(conversationMap.values()).map(async (conv) => {
          try {
            const partner = await getUser(conv.partnerId);
            return { ...conv, partner };
          } catch {
            return { ...conv, partner: null };
          }
        })
      );

      // sort by most recent message
      enriched.sort(
        (a, b) =>
          new Date(b.lastMessage.$createdAt).getTime() -
          new Date(a.lastMessage.$createdAt).getTime()
      );

      setConversations(enriched);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return date.toLocaleDateString("en-PH", { month: "short", day: "numeric" });
  };

  const onRefresh = useCallback(() => loadConversations(true), [user]);

  const renderItem = ({ item }: { item: any }) => (
    <Pressable
      style={msgStyles.chatItem}
      onPress={() =>
        router.push(
          `/navigation/screens/conversation?partnerId=${item.partnerId}&partnerName=${item.partner?.name || "User"}`
        )
      }
    >
      {/* AVATAR */}
      <View style={msgStyles.avatar}>
        <Ionicons name="person" size={20} color={theme.subtext} />
      </View>

      {/* TEXT CONTENT */}
      <View style={msgStyles.chatContent}>
        <Text style={msgStyles.name}>{item.partner?.name || "Unknown"}</Text>
        <Text style={msgStyles.listing}>
          {item.lastMessage.listingId ? "Re: listing" : "Direct message"}
        </Text>
        <Text style={msgStyles.message} numberOfLines={1}>
          {item.lastMessage.senderId === user!.$id ? "You: " : ""}
          {item.lastMessage.content}
        </Text>
      </View>

      {/* RIGHT SIDE */}
      <View style={msgStyles.rightSection}>
        <Text style={msgStyles.time}>
          {formatTime(item.lastMessage.$createdAt)}
        </Text>
        {item.unreadCount > 0 && (
          <View style={msgStyles.badge}>
            <Text style={msgStyles.badgeText}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );

  return (
    <ScreenLayout style={{ backgroundColor: theme.background }}>
      <View style={styles.container}>
        <AppHeader title="Messages" notifications={conversations.reduce((sum, c) => sum + c.unreadCount, 0)} />
        <View style={styles.main}>
          {loading ? (
            <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 40 }} />
          ) : conversations.length === 0 ? (
            <View style={{ alignItems: "center", marginTop: 60 }}>
              <Ionicons name="chatbubble-outline" size={48} color={theme.border} />
              <Text style={{ color: theme.subtext, marginTop: 12, fontSize: 14 }}>
                No messages yet.
              </Text>
            </View>
          ) : (
            <FlatList
              data={conversations}
              keyExtractor={(item) => item.partnerId}
              renderItem={renderItem}
              ItemSeparatorComponent={() => <View style={msgStyles.separator} />}
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
      </View>
    </ScreenLayout>
  );
}
