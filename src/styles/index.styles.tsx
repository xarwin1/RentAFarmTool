import { StyleSheet } from "react-native";
import { Theme } from "@/theme/theme";


const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    button: {
      backgroundColor: theme.primary,
      borderRadius: 8,
      textAlign: "center",
    },

    header: {
      flex: 0.5,
      flexDirection: "row",
      justifyContent: "space-between",
      margin: 10,
      borderRadius: 10,
      padding: 8,
      marginBottom: 5,
      alignItems: "center",

      backgroundColor: theme.background,
    },

    main: {
      flex: 12,
      padding: 15,
      paddingTop: 0,
      paddingBottom: 40,
      backgroundColor: theme.background,
    },

    profilePic: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignSelf: "center",
      resizeMode: "cover",
    },

    notification: {
      width: 40,
      height: 40,
      alignItems: "center",
      position: "relative",
      justifyContent: "center",
    },

    notificationBadge: {
      position: "absolute",
      top: 2,
      right: 2,

      minWidth: 14,
      height: 14,
      borderRadius: 7,

      backgroundColor: theme.primary,

      color: "#fff",
      paddingHorizontal: 2,

      fontSize: 9,
      lineHeight: 14,
      textAlign: "center",
    },

    headingText: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 10,
      color: theme.text,
    },

    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },

    appTitle: {
      fontSize: 24,
      fontWeight: "800",
      color: theme.text,
    },
  });

export default createStyles;
