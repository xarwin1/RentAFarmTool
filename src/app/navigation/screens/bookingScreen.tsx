import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  TextInput,
  Image,
  Modal,
  ActivityIndicator,
  Alert,
  Animated,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeContext";
import ScreenLayout from "@/styles/screenlayout";
import { CalendarList } from "react-native-calendars";
import { getListing, createRental, getFileUrl } from "../../../../lib/services";
import { useAuth } from "../../../../lib/auth-context";

export default function BookingScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = createStyles(theme);
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [listing, setListing] = useState<any>(null);
  const [loadingListing, setLoadingListing] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [markedDates, setMarkedDates] = useState({});
  const [showCalendar, setShowCalendar] = useState<"start" | "end" | null>(null);
  const [deliveryMode, setDeliveryMode] = useState<"pickup" | "delivery">("pickup");
  const [address, setAddress] = useState("");
  const [addressQuery, setAddressQuery] = useState("");
  const [specificAddress, setSpecificAddress] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [notes, setNotes] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [blockedDates, setBlockedDates] = useState<any>({});

  // Animated value for the floating confirm button
  const floatAnim = useRef(new Animated.Value(0)).current;

  // Show/hide floating button based on date selection progress
  const showFloatingBtn = startDate !== "" || endDate !== "";

  useEffect(() => {
    Animated.spring(floatAnim, {
      toValue: showFloatingBtn ? 1 : 0,
      useNativeDriver: true,
      tension: 65,
      friction: 10,
    }).start();
  }, [showFloatingBtn]);

  useEffect(() => {
    if (id) loadListing();
  }, [id]);

  const loadListing = async () => {
    try {
      const data = await getListing(id);
      setListing(data);
      if (!data.deliveryAvailable) setDeliveryMode("pickup");

      const blocked: any = {};

      if (data.availableFrom) {
        let current = new Date();
        const availStart = new Date(data.availableFrom);
        while (current < availStart) {
          const key = current.toISOString().split("T")[0];
          blocked[key] = { disabled: true, disableTouchEvent: true };
          current.setDate(current.getDate() + 1);
        }
      }

      if (data.availableTo) {
        const availEnd = new Date(data.availableTo);
        const future = new Date(availEnd);
        future.setDate(future.getDate() + 1);
        for (let i = 0; i < 180; i++) {
          const key = future.toISOString().split("T")[0];
          blocked[key] = { disabled: true, disableTouchEvent: true };
          future.setDate(future.getDate() + 1);
        }
      }

      if (data.bookedDates?.length > 0) {
        for (const rangeStr of data.bookedDates) {
          try {
            const range = JSON.parse(rangeStr);
            let current = new Date(range.from);
            const end = new Date(range.to);
            while (current <= end) {
              const key = current.toISOString().split("T")[0];
              blocked[key] = {
                disabled: true,
                disableTouchEvent: true,
                color: theme.border,
                textColor: theme.subtext,
              };
              current.setDate(current.getDate() + 1);
            }
          } catch {
            // skip malformed entries
          }
        }
      }

      setBlockedDates(blocked);
    } catch (err) {
      console.error("Failed to load listing:", err);
    } finally {
      setLoadingListing(false);
    }
  };

  const DAILY_RATE = listing?.pricePerDay || 0;
  const DEPOSIT = listing?.deposit || 0;
  const DELIVERY_FEE = listing?.deliveryFee || 0;

  const parseDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const days = parseDays();
  const subtotal = days * DAILY_RATE;
  const deliveryFee = deliveryMode === "delivery" ? DELIVERY_FEE : 0;
  const total = subtotal + DEPOSIT + deliveryFee;

  const isDateBlocked = (dateStr: string) => blockedDates[dateStr]?.disabled === true;

  const hasBlockedDateInRange = (start: string, end: string) => {
    let current = new Date(start);
    const endD = new Date(end);
    while (current <= endD) {
      if (isDateBlocked(current.toISOString().split("T")[0])) return true;
      current.setDate(current.getDate() + 1);
    }
    return false;
  };

  const handleDayPress = (day: any) => {
    const dateStr = day.dateString;
    if (isDateBlocked(dateStr)) return;

    if (showCalendar === "start") {
      setStartDate(dateStr);
      if (endDate && dateStr >= endDate) setEndDate("");
      buildMarked(dateStr, endDate);
      setShowCalendar("end");
    } else {
      if (dateStr <= startDate) return;
      if (hasBlockedDateInRange(startDate, dateStr)) {
        Alert.alert(
          "Dates unavailable",
          "Your selected range includes dates that are already booked. Please choose different dates."
        );
        return;
      }
      setEndDate(dateStr);
      buildMarked(startDate, dateStr);
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
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatShort = (date: string) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
    });
  };

  const handleAddressSearch = async (query: string) => {
    setAddressQuery(query);
    setAddress("");
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setLoadingAddress(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&countrycodes=ph`,
        { headers: { "Accept-Language": "en", "User-Agent": "RentAFarmTool/1.0" } }
      );
      const data = await res.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Address search error:", err);
    } finally {
      setLoadingAddress(false);
    }
  };

  const handleSelectAddress = (item: any) => {
    setAddress(item.display_name);
    setAddressQuery(item.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const clearAddress = () => {
    setAddressQuery("");
    setAddress("");
    setSpecificAddress("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const fullAddress = specificAddress ? `${specificAddress}, ${address}` : address;

  const canConfirm = agreed && days > 0 && (deliveryMode === "pickup" || address);

  const handleConfirm = async () => {
    if (!user || !listing) return;
    setSubmitting(true);
    try {
      await createRental({
        listingId: id,
        renterId: user.$id,
        ownerId: listing.ownerId,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        totalDays: days,
        dailyRate: DAILY_RATE,
        deposit: DEPOSIT,
        deliveryMode,
        deliveryAddress: deliveryMode === "delivery" ? fullAddress : undefined,
        deliveryFee: deliveryMode === "delivery" ? DELIVERY_FEE : undefined,
        subtotal,
        total,
        notes: notes || undefined,
        renterName: user.name,
        listingTitle: listing.title,
      });
      Alert.alert(
        "Booking submitted!",
        "Your rental request has been sent to the owner. You'll be notified once they confirm.",
        [{ text: "OK", onPress: () => router.replace("/navigation/(tabs)/rentals") }]
      );
    } catch (err: any) {
      Alert.alert("Booking failed", err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingListing) {
    return (
      <ScreenLayout style={{ backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} style={{ flex: 1 }} />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout style={{ backgroundColor: theme.background }}>
      <View style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={theme.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Book Listing</Text>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* LISTING SUMMARY CARD */}
          <View style={styles.card}>
            <Image
              source={{
                uri: listing?.images?.[0]
                  ? getFileUrl(listing.images[0])
                  : "https://www.deere.com/assets/images/region-4/products/tractors/utility-tractors/6m-series-utility-tractors/6M_155_Front_Left_studio_graphic_1024x576_small_ad511f737c4f9d929dd90cdfd360038474a69d9a.jpg",
              }}
              style={styles.listingImage}
            />            <View style={styles.listingInfo}>
              <Text style={styles.listingTitle}>{listing?.title ?? ""}</Text>
              <Text style={styles.listingSubtitle}>{listing?.condition ?? ""}</Text>
              <Text style={styles.listingPrice}>
                {"₱" + (listing?.pricePerDay?.toLocaleString() ?? "0") + "/day"}
              </Text>
              <View style={styles.listingMeta}>
                <Ionicons name="location-outline" size={12} color={theme.subtext} />
                <Text style={styles.listingMetaText}>{listing?.location ?? ""}</Text>
                <Ionicons name="star" size={12} color="#F5C842" />
                <Text style={styles.listingMetaText}>
                  {listing?.rating > 0 ? listing.rating.toFixed(1) : "New"}
                </Text>
              </View>
            </View>
          </View>

          {/* DATE RANGE */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Rental dates</Text>
            <View style={styles.dateRow}>
              <Pressable
                style={[styles.dateBtn, showCalendar === "start" && styles.dateBtnActive]}
                onPress={() => setShowCalendar("start")}
              >
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={showCalendar === "start" ? theme.primary : theme.subtext}
                />
                <View>
                  <Text style={styles.dateBtnLabel}>Start</Text>
                  <Text style={[styles.dateBtnValue, startDate ? { color: theme.text } : {}]}>
                    {formatDate(startDate)}
                  </Text>
                </View>
              </Pressable>

              <Ionicons name="arrow-forward" size={16} color={theme.subtext} />

              <Pressable
                style={[styles.dateBtn, showCalendar === "end" && styles.dateBtnActive]}
                onPress={() => setShowCalendar("end")}
              >
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={showCalendar === "end" ? theme.primary : theme.subtext}
                />
                <View>
                  <Text style={styles.dateBtnLabel}>End</Text>
                  <Text style={[styles.dateBtnValue, endDate ? { color: theme.text } : {}]}>
                    {formatDate(endDate)}
                  </Text>
                </View>
              </Pressable>
            </View>

            {days > 0 && (
              <View style={styles.daysSummary}>
                <Ionicons name="time-outline" size={16} color={theme.primary} />
                <Text style={styles.daysSummaryText}>
                  {days + " " + (days === 1 ? "day" : "days") + " selected"}
                </Text>
              </View>
            )}
          </View>

          {/* PICKUP OR DELIVERY */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Collection method</Text>
            <View style={styles.modeRow}>
              <Pressable
                style={[styles.modeBtn, deliveryMode === "pickup" && styles.modeBtnActive]}
                onPress={() => setDeliveryMode("pickup")}
              >
                <Ionicons name="walk-outline" size={20} color={deliveryMode === "pickup" ? "#fff" : theme.subtext} />
                <Text style={[styles.modeBtnText, deliveryMode === "pickup" && styles.modeBtnTextActive]}>
                  Pickup
                </Text>
                <Text style={[styles.modeBtnSub, deliveryMode === "pickup" && { color: "rgba(255,255,255,0.7)" }]}>
                  Free
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.modeBtn,
                  deliveryMode === "delivery" && styles.modeBtnActive,
                  !listing?.deliveryAvailable && { opacity: 0.4 },
                ]}
                onPress={() => listing?.deliveryAvailable && setDeliveryMode("delivery")}
                disabled={!listing?.deliveryAvailable}
              >
                <Ionicons name="car-outline" size={20} color={deliveryMode === "delivery" ? "#fff" : theme.subtext} />
                <Text style={[styles.modeBtnText, deliveryMode === "delivery" && styles.modeBtnTextActive]}>
                  Delivery
                </Text>
                <Text style={[styles.modeBtnSub, deliveryMode === "delivery" && { color: "rgba(255,255,255,0.7)" }]}>
                  {listing?.deliveryAvailable ? "+₱" + DELIVERY_FEE : "Unavailable"}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* ADDRESS */}
          {deliveryMode === "delivery" && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Delivery address</Text>
              <Text style={styles.label}>Barangay / City</Text>
              <View style={[styles.inputWrapper, address ? { borderColor: theme.primary } : {}]}>
                <Ionicons
                  name={address ? "checkmark-circle" : "location-outline"}
                  size={16}
                  color={address ? theme.primary : theme.subtext}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Search barangay, city..."
                  placeholderTextColor={theme.subtext}
                  value={addressQuery}
                  onChangeText={handleAddressSearch}
                  returnKeyType="search"
                />
                {loadingAddress && <ActivityIndicator size="small" color={theme.primary} />}
                {addressQuery.length > 0 && !loadingAddress && (
                  <Pressable onPress={clearAddress}>
                    <Ionicons name="close-circle" size={16} color={theme.subtext} />
                  </Pressable>
                )}
              </View>

              {showSuggestions && suggestions.length > 0 && (
                <View style={styles.suggestionList}>
                  {suggestions.map((item, index) => (
                    <Pressable
                      key={index}
                      style={[styles.suggestionItem, index < suggestions.length - 1 && styles.suggestionBorder]}
                      onPress={() => handleSelectAddress(item)}
                    >
                      <Ionicons name="location-outline" size={14} color={theme.primary} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.suggestionMain} numberOfLines={1}>
                          {item.address?.road || item.address?.suburb || item.address?.village || item.name}
                        </Text>
                        <Text style={styles.suggestionSub} numberOfLines={1}>
                          {[item.address?.city, item.address?.municipality, item.address?.state].filter(Boolean).join(", ")}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              )}

              {showSuggestions && suggestions.length === 0 && !loadingAddress && addressQuery.length >= 3 && (
                <View style={styles.noResults}>
                  <Text style={styles.noResultsText}>No addresses found. Try a different search.</Text>
                </View>
              )}

              <Text style={styles.label}>Landmark / Specific address</Text>
              <View style={[styles.inputWrapper, specificAddress ? { borderColor: theme.primary } : {}]}>
                <Ionicons name="home-outline" size={16} color={specificAddress ? theme.primary : theme.subtext} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Near Jollibee, 123 Mabini St..."
                  placeholderTextColor={theme.subtext}
                  value={specificAddress}
                  onChangeText={setSpecificAddress}
                />
                {specificAddress.length > 0 && (
                  <Pressable onPress={() => setSpecificAddress("")}>
                    <Ionicons name="close-circle" size={16} color={theme.subtext} />
                  </Pressable>
                )}
              </View>
            </View>
          )}

          {/* PRICE BREAKDOWN */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Price breakdown</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                {"₱" + DAILY_RATE.toLocaleString() + " x " + days + " " + (days === 1 ? "day" : "days")}
              </Text>
              <Text style={styles.priceValue}>{"₱" + subtotal.toLocaleString()}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Deposit</Text>
              <Text style={styles.priceValue}>
                {DEPOSIT > 0 ? "₱" + DEPOSIT.toLocaleString() : "None"}
              </Text>
            </View>
            {deliveryMode === "delivery" && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Delivery fee</Text>
                <Text style={styles.priceValue}>{"₱" + DELIVERY_FEE.toLocaleString()}</Text>
              </View>
            )}
            <View style={styles.divider} />
            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{"₱" + total.toLocaleString()}</Text>
            </View>
          </View>

          {/* NOTES */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Any special instructions for the owner..."
              placeholderTextColor={theme.subtext}
              multiline
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          {/* TERMS */}
          <Pressable style={styles.termsRow} onPress={() => setAgreed((p) => !p)}>
            <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
              {agreed && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
            <Text style={styles.termsText}>
              {"I agree to the "}
              <Text style={styles.termsLink}>terms and conditions</Text>
            </Text>
          </Pressable>
        </ScrollView>

        {/* CONFIRM BUTTON */}
        <View style={styles.bottomBar}>
          <View style={{ flex: 1 }}>
            <Text style={styles.totalSummaryLabel}>Total</Text>
            <Text style={styles.totalSummaryValue}>{"₱" + total.toLocaleString()}</Text>
          </View>
          <Pressable
            style={[styles.confirmBtn, (!canConfirm || submitting) && styles.confirmBtnDisabled]}
            disabled={!canConfirm || submitting}
            onPress={handleConfirm}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.confirmBtnText}>Confirm booking</Text>
            )}
          </Pressable>
        </View>
      </View>

      {/* CALENDAR MODAL */}
      <Modal
        visible={showCalendar !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCalendar(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />

            {/* MODAL HEADER */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {showCalendar === "start"
                  ? "Select start date"
                  : showCalendar === "end"
                    ? "Select end date"
                    : "Select dates"}
              </Text>
              <Pressable onPress={() => setShowCalendar(null)}>
                <Ionicons name="close" size={22} color={theme.text} />
              </Pressable>
            </View>

            {/* LEGEND */}
            <View style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderBottomWidth: 0.5,
              borderColor: theme.border,
            }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: theme.border }} />
                <Text style={{ fontSize: 12, color: theme.subtext }}>Already booked</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: theme.primary }} />
                <Text style={{ fontSize: 12, color: theme.subtext }}>Your selection</Text>
              </View>
            </View>

            {/* DATE SUMMARY */}
            <View style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 12,
              backgroundColor: theme.background,
            }}>
              <View style={{ alignItems: "center", flex: 1 }}>
                <Text style={{ fontSize: 11, color: theme.subtext, marginBottom: 2 }}>Start</Text>
                <Text style={{ fontSize: 14, fontWeight: "700", color: startDate ? theme.primary : theme.subtext }}>
                  {startDate ? formatShort(startDate) : "—"}
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={16} color={theme.subtext} />
              <View style={{ alignItems: "center", flex: 1 }}>
                <Text style={{ fontSize: 11, color: theme.subtext, marginBottom: 2 }}>End</Text>
                <Text style={{ fontSize: 14, fontWeight: "700", color: endDate ? theme.primary : theme.subtext }}>
                  {endDate ? formatShort(endDate) : "—"}
                </Text>
              </View>
              <View style={{ alignItems: "center", flex: 1 }}>
                <Text style={{ fontSize: 11, color: theme.subtext, marginBottom: 2 }}>Duration</Text>
                <Text style={{ fontSize: 14, fontWeight: "700", color: days > 0 ? theme.text : theme.subtext }}>
                  {days > 0 ? days + " " + (days === 1 ? "day" : "days") : "—"}
                </Text>
              </View>
            </View>

            <CalendarList
              onDayPress={handleDayPress}
              markingType="period"
              markedDates={{ ...blockedDates, ...markedDates }}
              minDate={
                showCalendar === "end"
                  ? startDate
                  : new Date().toISOString().split("T")[0]
              }
              pastScrollRange={0}
              futureScrollRange={3}
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

            {/* FLOATING CONFIRM BUTTON — overlays the calendar */}
            <Animated.View
              style={[
                styles.floatingBtn,
                {
                  opacity: floatAnim,
                  transform: [
                    {
                      translateY: floatAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [24, 0],
                      }),
                    },
                    {
                      scale: floatAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.92, 1],
                      }),
                    },
                  ],
                },
              ]}
              pointerEvents={showFloatingBtn ? "auto" : "none"}
            >
              <Pressable
                style={[
                  styles.floatingBtnInner,
                  {
                    backgroundColor:
                      startDate && endDate ? theme.primary : theme.card,
                    borderColor:
                      startDate && endDate ? theme.primary : theme.border,
                  },
                ]}
                onPress={() => {
                  if (startDate && endDate) {
                    setShowCalendar(null);
                  }
                }}
                disabled={!startDate || !endDate}
              >
                <Ionicons
                  name={startDate && endDate ? "checkmark-circle" : "calendar-outline"}
                  size={18}
                  color={startDate && endDate ? "#fff" : theme.subtext}
                />
                <Text
                  style={[
                    styles.floatingBtnText,
                    { color: startDate && endDate ? "#fff" : theme.subtext },
                  ]}
                >
                  {startDate && endDate
                    ? `Confirm ${days} ${days === 1 ? "day" : "days"}`
                    : startDate
                      ? "Now pick an end date"
                      : "Select both dates"}
                </Text>
              </Pressable>
            </Animated.View>
          </View>
        </View>
      </Modal>
    </ScreenLayout>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 14,
      backgroundColor: theme.card,
      borderBottomWidth: 0.5,
      borderColor: theme.border,
    },
    backBtn: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: theme.background,
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: theme.text,
    },
    content: {
      padding: 14,
      gap: 12,
      paddingBottom: 20,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: 14,
      padding: 14,
      borderWidth: 0.5,
      borderColor: theme.border,
      gap: 10,
    },
    listingImage: {
      width: "100%",
      height: 140,
      borderRadius: 10,
    },
    listingInfo: { gap: 3 },
    listingTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: theme.text,
    },
    listingSubtitle: {
      fontSize: 13,
      color: theme.subtext,
    },
    listingPrice: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.primary,
      marginTop: 2,
    },
    listingMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: 2,
    },
    listingMetaText: {
      fontSize: 12,
      color: theme.subtext,
      marginRight: 6,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.text,
    },
    label: {
      fontSize: 12,
      color: theme.subtext,
      marginBottom: 4,
    },
    dateRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    dateBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      padding: 10,
      borderRadius: 10,
      borderWidth: 0.5,
      borderColor: theme.border,
      backgroundColor: theme.background,
    },
    dateBtnActive: {
      borderColor: theme.primary,
    },
    dateBtnLabel: {
      fontSize: 11,
      color: theme.subtext,
    },
    dateBtnValue: {
      fontSize: 13,
      fontWeight: "500",
      color: theme.subtext,
    },
    daysSummary: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: theme.background,
      padding: 8,
      borderRadius: 8,
      borderWidth: 0.5,
      borderColor: theme.primary,
    },
    daysSummaryText: {
      fontSize: 13,
      color: theme.primary,
      fontWeight: "600",
    },
    modeRow: {
      flexDirection: "row",
      gap: 10,
    },
    modeBtn: {
      flex: 1,
      alignItems: "center",
      padding: 14,
      borderRadius: 12,
      borderWidth: 0.5,
      borderColor: theme.border,
      backgroundColor: theme.background,
      gap: 4,
    },
    modeBtnActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    modeBtnText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.text,
    },
    modeBtnTextActive: {
      color: "#fff",
    },
    modeBtnSub: {
      fontSize: 12,
      color: theme.subtext,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 0.5,
      borderColor: theme.border,
      borderRadius: 10,
      paddingHorizontal: 10,
      backgroundColor: theme.background,
      gap: 6,
    },
    input: {
      flex: 1,
      paddingVertical: 11,
      fontSize: 13,
      color: theme.text,
    },
    suggestionList: {
      backgroundColor: theme.card,
      borderRadius: 10,
      borderWidth: 0.5,
      borderColor: theme.border,
      overflow: "hidden",
    },
    suggestionItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      padding: 12,
    },
    suggestionBorder: {
      borderBottomWidth: 0.5,
      borderColor: theme.border,
    },
    suggestionMain: {
      fontSize: 13,
      color: theme.text,
      fontWeight: "500",
    },
    suggestionSub: {
      fontSize: 11,
      color: theme.subtext,
      marginTop: 1,
    },
    noResults: {
      padding: 12,
      backgroundColor: theme.card,
      borderRadius: 10,
      borderWidth: 0.5,
      borderColor: theme.border,
      alignItems: "center",
    },
    noResultsText: {
      fontSize: 13,
      color: theme.subtext,
    },
    priceRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    priceLabel: {
      fontSize: 13,
      color: theme.subtext,
    },
    priceValue: {
      fontSize: 13,
      color: theme.text,
      fontWeight: "500",
    },
    divider: {
      height: 0.5,
      backgroundColor: theme.border,
      marginVertical: 4,
    },
    totalLabel: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.text,
    },
    totalValue: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.primary,
    },
    textArea: {
      height: 90,
      borderWidth: 0.5,
      borderColor: theme.border,
      borderRadius: 10,
      padding: 10,
      fontSize: 13,
      color: theme.text,
      textAlignVertical: "top",
      backgroundColor: theme.background,
    },
    termsRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      padding: 4,
    },
    checkbox: {
      width: 22,
      height: 22,
      borderRadius: 6,
      borderWidth: 1.5,
      borderColor: theme.border,
      alignItems: "center",
      justifyContent: "center",
    },
    checkboxActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    termsText: {
      fontSize: 13,
      color: theme.subtext,
      flex: 1,
    },
    termsLink: {
      color: theme.primary,
      fontWeight: "600",
    },
    bottomBar: {
      flexDirection: "row",
      alignItems: "center",
      padding: 14,
      gap: 12,
      backgroundColor: theme.card,
      borderTopWidth: 0.5,
      borderColor: theme.border,
    },
    totalSummaryLabel: {
      fontSize: 12,
      color: theme.subtext,
    },
    totalSummaryValue: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.text,
    },
    confirmBtn: {
      flex: 2,
      backgroundColor: theme.primary,
      padding: 14,
      borderRadius: 12,
      alignItems: "center",
    },
    confirmBtnDisabled: {
      backgroundColor: theme.border,
    },
    confirmBtnText: {
      color: "#fff",
      fontWeight: "700",
      fontSize: 15,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },
    modalSheet: {
      backgroundColor: theme.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingBottom: 30,
      maxHeight: "85%",
      position: "relative",
    },
    modalHandle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.border,
      alignSelf: "center",
      marginTop: 12,
      marginBottom: 8,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingBottom: 10,
      borderBottomWidth: 0.5,
      borderColor: theme.border,
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.text,
    },
    // Floating confirm button styles
    floatingBtn: {
      position: "absolute",
      bottom: 16,
      left: 16,
      right: 16,
      zIndex: 10,
    },
    floatingBtnInner: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 14,
      borderWidth: 1,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.18,
      shadowRadius: 10,
      elevation: 6,
    },
    floatingBtnText: {
      fontSize: 15,
      fontWeight: "700",
    },
  });
