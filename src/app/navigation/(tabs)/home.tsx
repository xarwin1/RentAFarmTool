import ScreenLayout from "../../../styles/screenlayout";
import { View, ScrollView } from "react-native";
import { Text } from "react-native-paper";

import ListingCard from "@/components/ListingCard";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";
import AppHeader from "@/components/AppHeader";

import { useTheme } from "@/theme/ThemeContext";
import createStyles from "@/styles/index.styles";

export default function Home() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  console.log("createStyles =", createStyles);
  console.log("theme =", theme);

  return (
    <ScreenLayout style={{ backgroundColor: theme.background }}>
      <View style={styles.container}>

        {/* HEADER */}
        <AppHeader notifications={3} />
        {/* MAIN CONTENT */}
        <View style={styles.main}>
          <SearchBar />

          <CategoryFilter />

          <Text style={styles.headingText}>
            Recent Listings in Cavite
          </Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <ListingCard />
            <ListingCard />
            <ListingCard />
          </ScrollView>

        </View>

      </View>
    </ScreenLayout>
  );
}

