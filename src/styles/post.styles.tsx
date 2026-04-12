import { StyleSheet } from "react-native";
import { Theme } from "@/theme/theme";

const createPostStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 15,
      backgroundColor: theme.card,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.text,
    },
    content: {
      padding: 15,
      paddingBottom: 120,
    },
    card: {
      backgroundColor: theme.card,
      padding: 15,
      borderRadius: 14,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    label: {
      fontWeight: "600",
      marginBottom: 10,
      color: theme.text,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      padding: 12,
      borderRadius: 10,
      marginBottom: 10,
      color: theme.text,
    },
    textArea: {
      height: 100,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      padding: 12,
      textAlignVertical: "top",
      color: theme.text,
    },
    imageBox: {
      width: 80,
      height: 80,
      backgroundColor: theme.background,
      borderRadius: 12,
      marginRight: 10,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
    },
    smallText: {
      fontSize: 10,
      color: theme.subtext,
    },
    selectBox: {
      flexDirection: "row",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: theme.border,
      padding: 12,
      borderRadius: 10,
      marginBottom: 5,
    },
    selectText: {
      color: theme.subtext,
    },
    row: {
      flexDirection: "row",
      gap: 10,
    },
    option: {
      flex: 1,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      alignItems: "center",
    },
    optionText: {
      color: theme.text,
    },
    priceBox: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      paddingHorizontal: 12,
    },
    currency: {
      fontSize: 16,
      marginRight: 5,
      color: theme.text,
    },
    priceInput: {
      flex: 1,
      padding: 12,
      color: theme.text,
    },
    locationBtn: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
    },
    locationText: {
      marginLeft: 8,
      color: theme.text,
    },
    postBtn: {
      backgroundColor: theme.primary,
      padding: 15,
      borderRadius: 14,
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 5,
    },
    postText: {
      color: "#fff",
      fontWeight: "700",
    },
  });

export default createPostStyles;
