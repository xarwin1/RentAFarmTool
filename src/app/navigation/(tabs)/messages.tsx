import React from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import createStyles from "../../../styles/index.styles";
import createMsgStyles from "@/styles/messages.styles";
import AppHeader from "@/components/AppHeader";
import ScreenLayout from "@/styles/screenlayout";
import { useTheme } from "@/theme/ThemeContext";

const messages = [
  {
    id: "1",
    name: "Blitzcrank Delos Santos",
    listing: "Tractor",
    lastMessage: "ya pa-arkila tractor",
    time: "2m ago",
    unread: 2,
  },
  {
    id: "2",
    name: "Coco Martin",
    listing: "Water Pump",
    lastMessage: "Pwede bukas?",
    time: "10m ago",
    unread: 0,
  },
  {
    id: "3",
    name: "Sanford",
    listing: "Seeder Machine",
    lastMessage: "available pa dol🤏?",
    time: "Yesterday",
    unread: 0,
  },
];

export default function MessagesScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const msgStyles = createMsgStyles(theme);

  const renderItem = ({ item }) => (
    <Pressable style={msgStyles.chatItem}>
      {/* Avatar */}
      <View style={msgStyles.avatar}>
        <Ionicons name="person" size={20} color={theme.subtext} />
      </View>
      {/* Text Content */}
      <View style={msgStyles.chatContent}>
        <Text style={msgStyles.name}>{item.name}</Text>
        <Text style={msgStyles.listing}>{item.listing}</Text>
        <Text style={msgStyles.message} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      {/* Right Side */}
      <View style={msgStyles.rightSection}>
        <Text style={msgStyles.time}>{item.time}</Text>
        {item.unread > 0 && (
          <View style={msgStyles.badge}>
            <Text style={msgStyles.badgeText}>{item.unread}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );

  return (
    <ScreenLayout style={{ backgroundColor: theme.background }}>
      <View style={styles.container}>
        <AppHeader title="Messages" notifications={3} />
        <View style={styles.main}>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={msgStyles.separator} />}
          />
        </View>
      </View>
    </ScreenLayout>
  );
}
