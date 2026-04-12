import { View, Text, Image, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import createListingCardStyles from "../styles/ListingCard.styles";
import { useTheme } from "@/theme/ThemeContext";

export default function ListingCard() {
  const { theme } = useTheme();
  const styles = createListingCardStyles(theme);

  return (
    <View style={styles.card}>
      {/* IMAGE */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: "https://www.deere.com/assets/images/region-4/products/tractors/utility-tractors/6m-series-utility-tractors/6M_155_Front_Left_studio_graphic_1024x576_small_ad511f737c4f9d929dd90cdfd360038474a69d9a.jpg" }}
          style={styles.image}
        />
        {/* Favorite */}
        <TouchableOpacity style={styles.favorite}>
          <MaterialIcons name="favorite-border" size={22} color={theme.text} />
        </TouchableOpacity>
        {/* Price Overlay */}
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>₱1500/day</Text>
        </View>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        <Text style={styles.title}>Tractor</Text>
        <Text style={styles.subtitle}>John Deere 5310</Text>
        <View style={styles.row}>
          <Text style={styles.meta}>📍 Naic</Text>
          <Text style={styles.meta}>⭐ 4.8</Text>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.price}>₱1500/day</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Rent</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
