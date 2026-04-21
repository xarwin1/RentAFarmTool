import ScreenLayout from "../../../styles/screenlayout";
import { View, FlatList, ActivityIndicator } from "react-native";
import { Text } from "react-native-paper";
import ListingCard from "@/components/ListingCard";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";
import AppHeader from "@/components/AppHeader";
import { useTheme } from "@/theme/ThemeContext";
import createStyles from "@/styles/index.styles";
import { useEffect, useState } from "react";
import { getListings, getCategories } from "../../../../lib/services";
import { Query } from "../../../../lib/appwrite";

export default function Home() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [listings, setListings] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadListings();
  }, [selectedCategory, searchQuery]);

  const loadCategories = async () => {
    try {
      const result = await getCategories();
      setCategories(result.documents);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  const loadListings = async () => {
    setLoading(true);
    try {
      const queries: string[] = [];

      if (selectedCategory !== "All") {
        const cat = categories.find((c) => c.name === selectedCategory);
        if (cat) queries.push(Query.equal("categoryId", cat.$id));
      }

      if (searchQuery.trim()) {
        queries.push(Query.search("title", searchQuery.trim()));
      }

      queries.push(Query.orderDesc("$createdAt"));

      const result = await getListings(queries);
      setListings(result.documents);
    } catch (err) {
      console.error("Failed to load listings:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenLayout style={{ backgroundColor: theme.background }}>
      <View style={styles.container}>
        <AppHeader notifications={3} />
        <View style={styles.main}>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
          <CategoryFilter
            categories={["All", ...categories.map((c) => c.name)]}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
          <Text style={styles.headingText}>Recent Listings in Cavite</Text>

          {loading ? (
            <ActivityIndicator
              size="large"
              color={theme.primary}
              style={{ marginTop: 40 }}
            />
          ) : listings.length === 0 ? (
            <Text style={{ color: theme.subtext, textAlign: "center", marginTop: 40 }}>
              No listings found.
            </Text>
          ) : (
            <FlatList
              data={listings}
              keyExtractor={(item) => item.$id}
              renderItem={({ item }) => <ListingCard listing={item} />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>
      </View>
    </ScreenLayout>
  );
}
