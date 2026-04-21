import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeContext";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
};

export default function SearchBar({ value, onChangeText }: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color={theme.subtext} style={styles.icon} />
      <TextInput
        placeholder="Search tools, tractors..."
        style={styles.input}
        placeholderTextColor={theme.subtext}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      borderRadius: 12,
      paddingHorizontal: 12,
      marginTop: 10,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    icon: { marginRight: 8 },
    input: {
      flex: 1,
      paddingVertical: 10,
      fontSize: 14,
      color: theme.text,
    },
  });
