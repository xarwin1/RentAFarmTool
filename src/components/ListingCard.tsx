import { View, Text, Image, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import styles from '../styles/ListingCard.styles';

export default function ListingCard() {
  return (
    <View style={styles.card}>
      {/* IMAGE */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: "https://ferrari.scene7.com/is/image/ferrari/67b4b9739b77dc0010a956aa-sf-25-launch-desk" }}
          style={styles.image}
        />

        {/* Favorite */}
        <TouchableOpacity style={styles.favorite}>
          <MaterialIcons name="favorite-border" size={22} color="#000" />
        </TouchableOpacity>

        {/* Price Overlay */}
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>₱1500/day</Text>
        </View>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        <Text style={styles.title}>Tractor</Text>
        <Text style={styles.subtitle}>Ferrari SF-25</Text>

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
