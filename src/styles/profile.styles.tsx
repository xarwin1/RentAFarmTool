import { StyleSheet } from 'react-native';
import { Theme } from '@/theme/theme';

const createProfileStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      padding: 15,
      paddingBottom: 40,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 15,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.border,
    },
    profileRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 12,
    },
    name: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.text,
    },
    location: {
      color: theme.subtext,
      marginTop: 2,
    },
    editBtn: {
      padding: 8,
      borderRadius: 10,
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.primary,
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    statItem: {
      alignItems: "center",
    },
    statNumber: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.text,
    },
    statLabel: {
      fontSize: 12,
      color: theme.subtext,
    },
    sectionTitle: {
      fontWeight: "600",
      marginBottom: 10,
      color: theme.text,
    },
    logoutBtn: {
      backgroundColor: theme.card,
      padding: 15,
      borderRadius: 14,
      alignItems: "center",
      marginTop: 10,
      borderWidth: 1,
      borderColor: theme.border,
    },
    logoutText: {
      color: "#D32F2F",
      fontWeight: "600",
    },
  });

export default createProfileStyles;
