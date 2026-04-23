import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeContext";
import ScreenLayout from "@/styles/screenlayout";
import { useAuth } from "../../../../lib/auth-context";
import { getMessages, sendMessage, markMessageRead } from "../../../../lib/services";

export default function ConversationScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const { user } = useAuth();
  const { partnerId, partnerName } = useLocalSearchParams<{
    partnerId: string;
    partnerName: string;
  }>();

  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (user && partnerId) loadMessages();
  }, [user, partnerId]);

  const loadMessages = async () => {
    try {
      const result = await getMessages(user!.$id, partnerId);
      setMessages(result.documents);

      // mark unread messages as read
      const unread = result.documents.filter(
        (m: any) => m.receiverId === user!.$id && !m.isRead
      );
      await Promise.all(unread.map((m: any) => markMessageRead(m.$id)));
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      const msg = await sendMessage({
        senderId: user!.$id,
        receiverId: partnerId,
        content: input.trim(),
        senderName: user!.name,
      });
      setMessages((prev) => [...prev, msg]);
      setInput("");
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString("en-PH", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const renderMessage = ({ item }: { item: any }) => {
    const isMe = item.senderId === user!.$id;
    return (
      <View style={[styles.msgRow, isMe && styles.msgRowMe]}>
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
          <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe]}>
            {item.content}
          </Text>
          <Text style={[styles.bubbleTime, isMe && { color: "rgba(255,255,255,0.7)" }]}>
            {formatTime(item.$createdAt)}
            {isMe && (
              <Text> {item.isRead ? "✓✓" : "✓"}</Text>
            )}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScreenLayout style={{ backgroundColor: theme.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={theme.text} />
          </Pressable>
          <View style={styles.headerCenter}>
            <View style={styles.headerAvatar}>
              <Ionicons name="person" size={18} color={theme.subtext} />
            </View>
            <Text style={styles.headerName}>{partnerName}</Text>
          </View>
          <View style={{ width: 38 }} />
        </View>

        {/* MESSAGES */}
        {loading ? (
          <ActivityIndicator size="large" color={theme.primary} style={{ flex: 1 }} />
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.$id}
            renderItem={renderMessage}
            contentContainerStyle={styles.messageList}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: false })
            }
            ListEmptyComponent={
              <View style={{ alignItems: "center", marginTop: 60 }}>
                <Text style={{ color: theme.subtext, fontSize: 13 }}>
                  No messages yet. Say hi! 👋
                </Text>
              </View>
            }
          />
        )}

        {/* INPUT */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={theme.subtext}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={1000}
          />
          <Pressable
            style={[styles.sendBtn, (!input.trim() || sending) && { opacity: 0.4 }]}
            onPress={handleSend}
            disabled={!input.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={18} color="#fff" />
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
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
    headerCenter: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    headerAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.background,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 0.5,
      borderColor: theme.border,
    },
    headerName: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.text,
    },
    messageList: {
      padding: 14,
      gap: 8,
      paddingBottom: 20,
    },
    msgRow: {
      flexDirection: "row",
      marginBottom: 8,
    },
    msgRowMe: {
      justifyContent: "flex-end",
    },
    bubble: {
      maxWidth: "75%",
      padding: 10,
      borderRadius: 16,
      backgroundColor: theme.card,
      borderWidth: 0.5,
      borderColor: theme.border,
      borderBottomLeftRadius: 4,
    },
    bubbleMe: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 4,
    },
    bubbleThem: {
      borderBottomLeftRadius: 4,
    },
    bubbleText: {
      fontSize: 14,
      color: theme.text,
      lineHeight: 20,
    },
    bubbleTextMe: {
      color: "#fff",
    },
    bubbleTime: {
      fontSize: 10,
      color: theme.subtext,
      marginTop: 4,
      alignSelf: "flex-end",
    },
    inputBar: {
      flexDirection: "row",
      alignItems: "flex-end",
      padding: 10,
      gap: 10,
      backgroundColor: theme.card,
      borderTopWidth: 0.5,
      borderColor: theme.border,
    },
    input: {
      flex: 1,
      backgroundColor: theme.background,
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 10,
      fontSize: 14,
      color: theme.text,
      borderWidth: 0.5,
      borderColor: theme.border,
      maxHeight: 100,
    },
    sendBtn: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: theme.primary,
      alignItems: "center",
      justifyContent: "center",
    },
  });
