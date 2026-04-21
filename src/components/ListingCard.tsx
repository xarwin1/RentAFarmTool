import { View, Text, Image, TouchableOpacity, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import createListingCardStyles from "../styles/ListingCard.styles";
import { useTheme } from "@/theme/ThemeContext";
import { useRouter } from "expo-router";
import { getFileUrl } from "../../lib/services";

type Props = {
  listing: {
    $id: string;
    title: string;
    description: string;
    pricePerDay: number;
    location: string;
    rating: number;
    images?: string[];
    condition: string;
    categoryId: string;
  };
};

export default function ListingCard({ listing }: Props) {
  const { theme } = useTheme();
  const styles = createListingCardStyles(theme);
  const router = useRouter();

  const imageUrl = listing.images?.[0]
    ? getFileUrl(listing.images[0])
    : "https://www.deere.com/assets/images/region-4/products/tractors/utility-tractors/6m-series-utility-tractors/6M_155_Front_Left_studio_graphic_1024x576_small_ad511f737c4f9d929dd90cdfd360038474a69d9a.jpg";
  console.log("images field:", listing.images);
  console.log("imageUrl:", imageUrl);
  //const imageUrl = "https://www.deere.com/assets/images/region-4/products/tractors/utility-tractors/6m-series-utility-tractors/6M_155_Front_Left_studio_graphic_1024x576_small_ad511f737c4f9d929dd90cdfd360038474a69d9a.jpg";
  return (
    <Pressable onPress={() => router.push(`/navigation/screens/listingDetail?id=${listing.$id}`)}>
      <View style={styles.card}>
        {/* IMAGE */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
          <TouchableOpacity
            style={styles.favorite}
            onPress={(e) => e.stopPropagation()}
          >
            <MaterialIcons name="favorite-border" size={22} color={theme.text} />
          </TouchableOpacity>
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>₱{listing.pricePerDay.toLocaleString()}/day</Text>
          </View>
        </View>

        {/* CONTENT */}
        <View style={styles.content}>
          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.subtitle}>{listing.condition}</Text>
          <View style={styles.row}>
            <Text style={styles.meta}>📍 {listing.location}</Text>
            <Text style={styles.meta}>⭐ {listing.rating > 0 ? listing.rating.toFixed(1) : "New"}</Text>
          </View>
          <View style={styles.bottomRow}>
            <Text style={styles.price}>₱{listing.pricePerDay.toLocaleString()}/day</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={(e) => e.stopPropagation()}
            >
              <Text style={styles.buttonText}>Rent</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
