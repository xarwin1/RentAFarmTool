import React, { useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import RentalCard from "@/components/RentalCard";
import createRentalStyles from "@/styles/rentals.styles";
import ScreenLayout from "@/styles/screenlayout";
import { useTheme } from "@/theme/ThemeContext";

const DATA = [
  {
    id: "1",
    title: "Tractor for Rent",
    user: "Juan Dela Cruz",
    startDate: "Apr 10",
    endDate: "Apr 15",
    price: 500,
    unit: "day",
    status: "Ongoing",
  },
  {
    id: "2",
    title: "Water Pump",
    user: "Maria Santos",
    startDate: "Apr 12",
    endDate: "Apr 14",
    price: 200,
    unit: "day",
    status: "Pending",
  },
  {
    id: "3",
    title: "Seeder Machine",
    user: "Pedro Reyes",
    startDate: "Apr 5",
    endDate: "Apr 7",
    price: 300,
    unit: "day",
    status: "Completed",
  },
];

export default function RentalsScreen() {
  const { theme } = useTheme();
  const styles = createRentalStyles(theme);
  const [tab, setTab] = useState("Ongoing");
  const filteredData = DATA.filter((item) => item.status === tab);

  return (
    <ScreenLayout style={{ backgroundColor: theme.background }}>
      <View style={styles.container}>
        <Text style={styles.header}>Rentals</Text>
        <View style={styles.tabs}>
          {["Ongoing", "Pending", "Completed"].map((t) => (
            <Pressable
              key={t}
              onPress={() => setTab(t)}
              style={[styles.tab, tab === t && styles.activeTab]}
            >
              <Text style={tab === t ? styles.activeText : styles.tabText}>
                {t}
              </Text>
            </Pressable>
          ))}
        </View>
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RentalCard item={item} type="owner" theme={theme} />}
          contentContainerStyle={{ padding: 15 }}
        />
      </View>
    </ScreenLayout>
  );
}
