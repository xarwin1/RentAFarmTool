import { StyleSheet } from 'react-native';
import { Theme } from '@/theme/theme';

const createSettingItemStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 14,
    },
    left: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconWrapper: {
      width: 34,
      height: 34,
      borderRadius: 10,
      backgroundColor: theme.background,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 10,
      borderWidth: 1,
      borderColor: theme.border,
    },
    label: {
      fontSize: 14,
      color: theme.text,
    },
    right: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    rightText: {
      fontSize: 13,
      color: theme.subtext,
    },
  });

export default createSettingItemStyles;
