import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";

const categories = [
  "All",
  "Tractors",
  "Tools",
  "Seeds",
  "Equipment",
  "Rentals",
  "Others",
];

export default function CategoryFilter() {
  const [selected, setSelected] = useState("All");

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
              onPress={() => setSelected(item)}
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

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
  },

  container: {
    paddingHorizontal: 12,
    gap: 10,
    alignItems: "center",
  },

  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "transparent",
  },

  chipActive: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },

  text: {
    fontSize: 14,
    color: "#444",
    fontWeight: "500",
  },

  textActive: {
    color: "#fff",
  },
});
