import { StyleSheet } from 'react-native';
import { Theme } from '@/theme/theme';

const createListingCardStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      borderRadius: 16,
      marginBottom: 16,
      overflow: "hidden",
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.border,
    },
    imageContainer: {
      position: "relative",
    },
    image: {
      width: "100%",
      height: 160,
    },
    favorite: {
      position: "absolute",
      top: 10,
      right: 10,
      backgroundColor: theme.card,
      padding: 6,
      borderRadius: 20,
    },
    priceTag: {
      position: "absolute",
      bottom: 10,
      left: 10,
      backgroundColor: "rgba(0,0,0,0.7)",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
    },
    priceText: {
      color: "#fff",
      fontWeight: "bold",
    },
    content: {
      padding: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
    },
    subtitle: {
      fontSize: 14,
      color: theme.subtext,
      marginBottom: 6,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    meta: {
      fontSize: 12,
      color: theme.subtext,
    },
    bottomRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    price: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.text,
    },
    button: {
      backgroundColor: theme.primary,
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 8,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
    },
  });

export default createListingCardStyles;
