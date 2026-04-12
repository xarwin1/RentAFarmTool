import { StyleSheet } from 'react-native';
import { Theme } from '@/theme/theme';

const createRentalStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      fontSize: 28,
      fontWeight: "700",
      padding: 15,
      color: theme.text,
    },
    tabs: {
      flexDirection: "row",
      paddingHorizontal: 15,
      marginBottom: 10,
    },
    tab: {
      marginRight: 10,
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 20,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },
    activeTab: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    tabText: {
      color: theme.subtext,
    },
    activeText: {
      color: "#fff",
      fontWeight: "600",
    },
  });

export default createRentalStyles;
