import { StyleSheet } from "react-native";
import { Theme } from "@/theme/theme";

const createMsgStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 15,
    },
    header: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 10,
      color: theme.text,
    },
    chatItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 18,
      backgroundColor: theme.background,
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.card,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 14,
    },
    chatContent: {
      flex: 1,
    },
    name: {
      fontWeight: "600",
      fontSize: 19,
      color: theme.text,
    },
    listing: {
      fontSize: 15,
      color: theme.primary,
    },
    message: {
      fontSize: 17,
      color: theme.subtext,
    },
    rightSection: {
      alignItems: "flex-end",
      gap: 4,
    },
    time: {
      fontSize: 14,
      color: theme.subtext,
    },
    badge: {
      minWidth: 20,
      height: 20,
      borderRadius: 11,
      backgroundColor: theme.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    badgeText: {
      color: "#fff",
      fontSize: 10,
    },
    separator: {
      height: 10,
      backgroundColor: theme.background,
    },
  });

export default createMsgStyles;
