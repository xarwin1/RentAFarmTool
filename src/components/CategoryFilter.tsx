import React from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useTheme } from "@/theme/ThemeContext";

type Props = {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
};

export default function CategoryFilter({ categories, selected, onSelect }: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {categories.map((item) => {
          const isActive = selected === item;
          return (
            <Pressable
              key={item}
              onPress={() => onSelect(item)}
              style={[styles.chip, isActive && styles.chipActive]}
            >
              <Text style={[styles.text, isActive && styles.textActive]}>
                {item}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    wrapper: { marginBottom: 10 },
    container: { paddingHorizontal: 12, gap: 10, alignItems: "center" },
    chip: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },
    chipActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    text: { fontSize: 14, color: theme.subtext, fontWeight: "500" },
    textActive: { color: "#fff" },
  });
