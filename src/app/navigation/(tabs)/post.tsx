import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TextInput,
  Pressable,
  Text,
  Modal,
  Alert,
  Image,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import createPostStyles from "@/styles/post.styles";
import ScreenLayout from "@/styles/screenlayout";
import { useTheme } from "@/theme/ThemeContext";
import { useRouter } from "expo-router";
import { useAuth } from "../../../../lib/auth-context";
import { createListing, getCategories, uploadFile, getFileUrl } from "../../../../lib/services";
import { CalendarList } from "react-native-calendars";
import * as ImagePicker from "expo-image-picker";

export default function AddListingScreen() {
  const { theme } = useTheme();
  const styles = createPostStyles(theme);
  const router = useRouter();
  const { user } = useAuth();

  // basic info
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState<"new" | "used" | "">("");
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // images
  const [images, setImages] = useState<{ uri: string; fileId?: string }[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // pricing
  const [price, setPrice] = useState("");
  const [deposit, setDeposit] = useState("");

  // delivery
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState("");
  const [cancellationPolicy, setCancellationPolicy] = useState("");

  // location
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // availability
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTo, setAvailableTo] = useState("");
  const [markedDates, setMarkedDates] = useState({});
  const [showCalendar, setShowCalendar] = useState<"from" | "to" | null>(null);

  // state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const result = await getCategories();
      setCategories(result.documents);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  const handlePickImage = async () => {
    if (images.length >= 5) {
      Alert.alert("Limit reached", "You can only upload up to 5 photos.");
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow access to your photo library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 5 - images.length,
    });

    if (result.canceled) return;

    setUploadingImages(true);
    try {
      const uploaded = await Promise.all(
        result.assets.map(async (asset) => {
          const file = {
            uri: asset.uri,
            name: asset.fileName || `image_${Date.now()}.jpg`,
            type: asset.mimeType || "image/jpeg",
            size: asset.fileSize || 0,
          };
          const uploaded = await uploadFile(file);
          const url = getFileUrl(uploaded.$id).toString();
          return { uri: url, fileId: uploaded.$id };
        })
      );
      setImages((prev) => [...prev, ...uploaded]);
    } catch (err) {
      console.error("Image upload failed:", err);
      Alert.alert("Upload failed", "Could not upload one or more images.");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDayPress = (day: any) => {
    const dateStr = day.dateString;
    if (showCalendar === "from") {
      setAvailableFrom(dateStr);
      if (availableTo && dateStr >= availableTo) setAvailableTo("");
      buildMarked(dateStr, availableTo);
      setShowCalendar("to");
    } else {
      if (dateStr <= availableFrom) return;
      setAvailableTo(dateStr);
      buildMarked(availableFrom, dateStr);
      setShowCalendar(null);
    }
  };

  const buildMarked = (start: string, end: string) => {
    if (!start) return;
    const marked: any = {};
    marked[start] = { startingDay: true, color: theme.primary, textColor: "#fff" };
    if (end && end !== start) {
      let current = new Date(start);
      current.setDate(current.getDate() + 1);
      const endD = new Date(end);
      while (current < endD) {
        const key = current.toISOString().split("T")[0];
        marked[key] = { color: `${theme.primary}40`, textColor: theme.text };
        current.setDate(current.getDate() + 1);
      }
      marked[end] = { endingDay: true, color: theme.primary, textColor: "#fff" };
    }
    setMarkedDates(marked);
  };

  const formatDate = (date: string) => {
    if (!date) return "Select date";
    return new Date(date).toLocaleDateString("en-PH", {
      month: "short", day: "numeric", year: "numeric",
    });
  };

  const handlePost = async () => {
    if (!title || !description || !condition || !categoryId || !price || !location) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!user) {
      setError("You must be logged in to post a listing.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await createListing({
        ownerId: user.$id,
        categoryId,
        title,
        description,
        condition,
        pricePerDay: parseFloat(price),
        deposit: deposit ? parseFloat(deposit) : undefined,
        location,
        latitude: latitude ?? undefined,
        longitude: longitude ?? undefined,
        images: images.map((img) => img.fileId || img.uri),
        deliveryAvailable,
        deliveryFee: deliveryFee ? parseFloat(deliveryFee) : undefined,
        cancellationPolicy: cancellationPolicy || undefined,
        availableFrom: availableFrom ? new Date(availableFrom).toISOString() : undefined,
        availableTo: availableTo ? new Date(availableTo).toISOString() : undefined,
      });
      Alert.alert("Success", "Your listing has been posted!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      setError(err.message || "Failed to post listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenLayout style={{ backgroundColor: theme.background }}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Post Listing</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* IMAGE UPLOAD */}
          <View style={styles.card}>
            <Text style={styles.label}>
              Photos{" "}
              <Text style={{ color: theme.subtext, fontWeight: "400" }}>
                ({images.length}/5)
              </Text>
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: "row", gap: 10 }}>
                {/* EXISTING IMAGES */}
                {images.map((img, index) => (
                  <View key={index} style={{ position: "relative" }}>
                    <Image
                      source={{ uri: img.uri }}
                      style={[styles.imageBox, { padding: 0 }]}
                    />
                    <Pressable
                      onPress={() => handleRemoveImage(index)}
                      style={{
                        position: "absolute",
                        top: -6,
                        right: -6,
                        backgroundColor: "#F44336",
                        borderRadius: 10,
                        width: 20,
                        height: 20,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name="close" size={12} color="#fff" />
                    </Pressable>
                  </View>
                ))}

                {/* ADD BUTTON */}
                {images.length < 5 && (
                  <Pressable
                    style={styles.imageBox}
                    onPress={handlePickImage}
                    disabled={uploadingImages}
                  >
                    <Ionicons
                      name={uploadingImages ? "cloud-upload-outline" : "camera"}
                      size={26}
                      color={theme.subtext}
                    />
                    <Text style={styles.smallText}>
                      {uploadingImages ? "Uploading..." : "Add"}
                    </Text>
                  </Pressable>
                )}
              </View>
            </ScrollView>
          </View>

          {/* BASIC INFO */}
          <View style={styles.card}>
            <Text style={styles.label}>Title <Text style={{ color: "#F44336" }}>*</Text></Text>
            <TextInput
              placeholder="e.g. Hand Tractor for Rent"
              placeholderTextColor={theme.subtext}
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />

            <Text style={styles.label}>Category <Text style={{ color: "#F44336" }}>*</Text></Text>
            <Pressable style={styles.selectBox} onPress={() => setShowCategoryModal(true)}>
              <Text style={[styles.selectText, categoryName && { color: theme.text }]}>
                {categoryName || "Select Category"}
              </Text>
              <Ionicons name="chevron-down" size={18} color={theme.text} />
            </Pressable>

            <Text style={styles.label}>Condition <Text style={{ color: "#F44336" }}>*</Text></Text>
            <View style={styles.row}>
              <Pressable
                style={[styles.option, condition === "new" && { backgroundColor: theme.primary, borderColor: theme.primary }]}
                onPress={() => setCondition("new")}
              >
                <Text style={[styles.optionText, condition === "new" && { color: "#fff" }]}>New</Text>
              </Pressable>
              <Pressable
                style={[styles.option, condition === "used" && { backgroundColor: theme.primary, borderColor: theme.primary }]}
                onPress={() => setCondition("used")}
              >
                <Text style={[styles.optionText, condition === "used" && { color: "#fff" }]}>Used</Text>
              </Pressable>
            </View>
          </View>

          {/* PRICING */}
          <View style={styles.card}>
            <Text style={styles.label}>Price per day <Text style={{ color: "#F44336" }}>*</Text></Text>
            <View style={styles.priceBox}>
              <Text style={styles.currency}>₱</Text>
              <TextInput
                placeholder="0"
                placeholderTextColor={theme.subtext}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                style={styles.priceInput}
              />
            </View>

            <Text style={styles.label}>Deposit</Text>
            <View style={styles.priceBox}>
              <Text style={styles.currency}>₱</Text>
              <TextInput
                placeholder="0"
                placeholderTextColor={theme.subtext}
                value={deposit}
                onChangeText={setDeposit}
                keyboardType="numeric"
                style={styles.priceInput}
              />
            </View>
          </View>

          {/* AVAILABILITY */}
          <View style={styles.card}>
            <Text style={styles.label}>Availability</Text>
            <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
              <Pressable
                style={[styles.selectBox, { flex: 1 }, showCalendar === "from" && { borderColor: theme.primary }]}
                onPress={() => setShowCalendar("from")}
              >
                <Ionicons name="calendar-outline" size={16} color={showCalendar === "from" ? theme.primary : theme.subtext} />
                <Text style={[styles.selectText, availableFrom && { color: theme.text }]}>
                  {formatDate(availableFrom)}
                </Text>
              </Pressable>
              <Ionicons name="arrow-forward" size={16} color={theme.subtext} />
              <Pressable
                style={[styles.selectBox, { flex: 1 }, showCalendar === "to" && { borderColor: theme.primary }]}
                onPress={() => setShowCalendar("to")}
              >
                <Ionicons name="calendar-outline" size={16} color={showCalendar === "to" ? theme.primary : theme.subtext} />
                <Text style={[styles.selectText, availableTo && { color: theme.text }]}>
                  {formatDate(availableTo)}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* DELIVERY */}
          <View style={styles.card}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={styles.label}>Delivery available</Text>
              <Pressable
                style={{
                  width: 44,
                  height: 26,
                  borderRadius: 13,
                  backgroundColor: deliveryAvailable ? theme.primary : theme.border,
                  justifyContent: "center",
                  paddingHorizontal: 3,
                }}
                onPress={() => setDeliveryAvailable(p => !p)}
              >
                <View style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: "#fff",
                  alignSelf: deliveryAvailable ? "flex-end" : "flex-start",
                }} />
              </Pressable>
            </View>

            {deliveryAvailable && (
              <>
                <Text style={styles.label}>Delivery fee</Text>
                <View style={styles.priceBox}>
                  <Text style={styles.currency}>₱</Text>
                  <TextInput
                    placeholder="0"
                    placeholderTextColor={theme.subtext}
                    value={deliveryFee}
                    onChangeText={setDeliveryFee}
                    keyboardType="numeric"
                    style={styles.priceInput}
                  />
                </View>
              </>
            )}

            <Text style={styles.label}>Cancellation policy</Text>
            <TextInput
              placeholder="e.g. 24 hours notice required..."
              placeholderTextColor={theme.subtext}
              value={cancellationPolicy}
              onChangeText={setCancellationPolicy}
              multiline
              style={styles.textArea}
            />
          </View>

          {/* LOCATION */}
          <View style={styles.card}>
            <Text style={styles.label}>Location <Text style={{ color: "#F44336" }}>*</Text></Text>
            <TextInput
              placeholder="e.g. Naic, Cavite"
              placeholderTextColor={theme.subtext}
              value={location}
              onChangeText={setLocation}
              style={styles.input}
            />
            <Pressable style={styles.locationBtn}>
              <Ionicons name="location" size={18} color={theme.primary} />
              <Text style={styles.locationText}>Use current location</Text>
            </Pressable>
          </View>

          {/* DESCRIPTION */}
          <View style={styles.card}>
            <Text style={styles.label}>Description <Text style={{ color: "#F44336" }}>*</Text></Text>
            <TextInput
              placeholder="Describe your tool..."
              placeholderTextColor={theme.subtext}
              multiline
              value={description}
              onChangeText={setDescription}
              style={styles.textArea}
            />
          </View>

          {/* ERROR */}
          {error && (
            <Text style={{ color: "#F44336", fontSize: 13, textAlign: "center", marginBottom: 8 }}>
              {error}
            </Text>
          )}

          {/* POST BUTTON */}
          <Pressable
            style={[styles.postBtn, (loading || uploadingImages) && { opacity: 0.6 }]}
            onPress={handlePost}
            disabled={loading || uploadingImages}
          >
            <Text style={styles.postText}>
              {loading ? "POSTING..." : "POST LISTING"}
            </Text>
          </Pressable>
        </ScrollView>
      </View>

      {/* CATEGORY MODAL */}
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
          <View style={{
            backgroundColor: theme.card,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 20,
            maxHeight: "60%",
          }}>
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: theme.border, alignSelf: "center", marginBottom: 16 }} />
            <Text style={{ fontSize: 16, fontWeight: "700", color: theme.text, marginBottom: 12 }}>Select Category</Text>
            <ScrollView>
              {categories.map((cat) => (
                <Pressable
                  key={cat.$id}
                  style={{
                    paddingVertical: 14,
                    borderBottomWidth: 0.5,
                    borderColor: theme.border,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    setCategoryId(cat.$id);
                    setCategoryName(cat.name);
                    setShowCategoryModal(false);
                  }}
                >
                  <Text style={{ fontSize: 14, color: theme.text }}>{cat.name}</Text>
                  {categoryId === cat.$id && (
                    <Ionicons name="checkmark" size={18} color={theme.primary} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* CALENDAR MODAL */}
      <Modal
        visible={showCalendar !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCalendar(null)}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
          <View style={{
            backgroundColor: theme.card,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingBottom: 30,
            maxHeight: "85%",
          }}>
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: theme.border, alignSelf: "center", marginTop: 12, marginBottom: 8 }} />
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingBottom: 10, borderBottomWidth: 0.5, borderColor: theme.border }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: theme.text }}>
                {showCalendar === "from" ? "Available from" : "Available until"}
              </Text>
              <Pressable onPress={() => setShowCalendar(null)}>
                <Ionicons name="close" size={22} color={theme.text} />
              </Pressable>
            </View>
            <CalendarList
              onDayPress={handleDayPress}
              markingType="period"
              markedDates={markedDates}
              minDate={
                showCalendar === "to"
                  ? availableFrom
                  : new Date().toISOString().split("T")[0]
              }
              pastScrollRange={0}
              futureScrollRange={12}
              scrollEnabled
              showScrollIndicator={false}
              theme={{
                backgroundColor: theme.card,
                calendarBackground: theme.card,
                textSectionTitleColor: theme.subtext,
                selectedDayBackgroundColor: theme.primary,
                selectedDayTextColor: "#fff",
                todayTextColor: theme.primary,
                dayTextColor: theme.text,
                textDisabledColor: theme.border,
                arrowColor: theme.primary,
                monthTextColor: theme.text,
                indicatorColor: theme.primary,
              }}
            />
          </View>
        </View>
      </Modal>
    </ScreenLayout>
  );
}
