import React, { useState } from "react";
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
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeContext";
import ScreenLayout from "@/styles/screenlayout";
import { CalendarList } from "react-native-calendars";

export default function BookingScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = createStyles(theme);

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

  const DAILY_RATE = 1500;
  const DEPOSIT = 500;
  const DELIVERY_FEE = 200;

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

  const handleDayPress = (day: any) => {
    const dateStr = day.dateString;
    if (showCalendar === "start") {
      setStartDate(dateStr);
      if (endDate && dateStr >= endDate) setEndDate("");
      buildMarked(dateStr, endDate);
      setShowCalendar("end");
    } else {
      if (dateStr <= startDate) return;
      setEndDate(dateStr);
      buildMarked(startDate, dateStr);
      setShowCalendar(null);
    }
  };

  const buildMarked = (start: string, end: string) => {
    if (!start) return;
    const marked: any = {};
    marked[start] = {
      startingDay: true,
      color: theme.primary,
      textColor: "#fff",
    };
    if (end && end !== start) {
      let current = new Date(start);
      current.setDate(current.getDate() + 1);
      const endD = new Date(end);
      while (current < endD) {
        const key = current.toISOString().split("T")[0];
        marked[key] = { color: `${theme.primary}40`, textColor: theme.text };
        current.setDate(current.getDate() + 1);
      }
      marked[end] = {
        endingDay: true,
        color: theme.primary,
        textColor: "#fff",
      };
    }
    setMarkedDates(marked);
  };

  const formatDate = (date: string) => {
    if (!date) return "Select date";
    const d = new Date(date);
    return d.toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
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
        {
          headers: {
            "Accept-Language": "en",
            "User-Agent": "RentAFarmTool/1.0",
          },
        }
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
    const formatted = item.display_name;
    setAddress(formatted);
    setAddressQuery(formatted);
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
                uri: "https://ferrari.scene7.com/is/image/ferrari/67b4b9739b77dc0010a956aa-sf-25-launch-desk",
              }}
              style={styles.listingImage}
            />
            <View style={styles.listingInfo}>
              <Text style={styles.listingTitle}>Tractor</Text>
              <Text style={styles.listingSubtitle}>Ferrari SF-25</Text>
              <Text style={styles.listingPrice}>₱1,500/day</Text>
              <View style={styles.listingMeta}>
                <Ionicons name="location-outline" size={12} color={theme.subtext} />
                <Text style={styles.listingMetaText}>Naic, Cavite</Text>
                <Ionicons name="star" size={12} color="#F5C842" />
                <Text style={styles.listingMetaText}>4.8</Text>
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
                  <Text style={[styles.dateBtnValue, startDate && { color: theme.text }]}>
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
                  <Text style={[styles.dateBtnValue, endDate && { color: theme.text }]}>
                    {formatDate(endDate)}
                  </Text>
                </View>
              </Pressable>
            </View>

            {days > 0 && (
              <View style={styles.daysSummary}>
                <Ionicons name="time-outline" size={16} color={theme.primary} />
                <Text style={styles.daysSummaryText}>
                  {days} {days === 1 ? "day" : "days"} selected
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
                <Ionicons
                  name="walk-outline"
                  size={20}
                  color={deliveryMode === "pickup" ? "#fff" : theme.subtext}
                />
                <Text style={[styles.modeBtnText, deliveryMode === "pickup" && styles.modeBtnTextActive]}>
                  Pickup
                </Text>
                <Text style={[styles.modeBtnSub, deliveryMode === "pickup" && { color: "rgba(255,255,255,0.7)" }]}>
                  Free
                </Text>
              </Pressable>

              <Pressable
                style={[styles.modeBtn, deliveryMode === "delivery" && styles.modeBtnActive]}
                onPress={() => setDeliveryMode("delivery")}
              >
                <Ionicons
                  name="car-outline"
                  size={20}
                  color={deliveryMode === "delivery" ? "#fff" : theme.subtext}
                />
                <Text style={[styles.modeBtnText, deliveryMode === "delivery" && styles.modeBtnTextActive]}>
                  Delivery
                </Text>
                <Text style={[styles.modeBtnSub, deliveryMode === "delivery" && { color: "rgba(255,255,255,0.7)" }]}>
                  +₱{DELIVERY_FEE}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* ADDRESS — separate card, only when delivery */}
          {deliveryMode === "delivery" && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Delivery address</Text>

              {/* LOCATION SEARCH */}
              <Text style={styles.label}>Barangay / City</Text>
              <View style={[styles.inputWrapper, address && { borderColor: theme.primary }]}>
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
                {loadingAddress && (
                  <ActivityIndicator size="small" color={theme.primary} />
                )}
                {addressQuery.length > 0 && !loadingAddress && (
                  <Pressable onPress={clearAddress}>
                    <Ionicons name="close-circle" size={16} color={theme.subtext} />
                  </Pressable>
                )}
              </View>

              {/* SUGGESTIONS DROPDOWN */}
              {showSuggestions && suggestions.length > 0 && (
                <View style={styles.suggestionList}>
                  {suggestions.map((item, index) => (
                    <Pressable
                      key={index}
                      style={[
                        styles.suggestionItem,
                        index < suggestions.length - 1 && styles.suggestionBorder,
                      ]}
                      onPress={() => handleSelectAddress(item)}
                    >
                      <Ionicons name="location-outline" size={14} color={theme.primary} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.suggestionMain} numberOfLines={1}>
                          {item.address?.road ||
                            item.address?.suburb ||
                            item.address?.village ||
                            item.name}
                        </Text>
                        <Text style={styles.suggestionSub} numberOfLines={1}>
                          {[item.address?.city, item.address?.municipality, item.address?.state]
                            .filter(Boolean)
                            .join(", ")}
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

              {/* LANDMARK / SPECIFIC ADDRESS */}
              <Text style={styles.label}>Landmark / Specific address</Text>
              <View style={[styles.inputWrapper, specificAddress && { borderColor: theme.primary }]}>
                <Ionicons
                  name="home-outline"
                  size={16}
                  color={specificAddress ? theme.primary : theme.subtext}
                />
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
                ₱{DAILY_RATE.toLocaleString()} x {days} {days === 1 ? "day" : "days"}
              </Text>
              <Text style={styles.priceValue}>₱{subtotal.toLocaleString()}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Deposit</Text>
              <Text style={styles.priceValue}>₱{DEPOSIT.toLocaleString()}</Text>
            </View>
            {deliveryMode === "delivery" && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Delivery fee</Text>
                <Text style={styles.priceValue}>₱{DELIVERY_FEE.toLocaleString()}</Text>
              </View>
            )}
            <View style={styles.divider} />
            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₱{total.toLocaleString()}</Text>
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
              I agree to the{" "}
              <Text style={styles.termsLink}>terms and conditions</Text>
            </Text>
          </Pressable>
        </ScrollView>

        {/* CONFIRM BUTTON */}
        <View style={styles.bottomBar}>
          <View style={{ flex: 1 }}>
            <Text style={styles.totalSummaryLabel}>Total</Text>
            <Text style={styles.totalSummaryValue}>₱{total.toLocaleString()}</Text>
          </View>
          <Pressable
            style={[styles.confirmBtn, !canConfirm && styles.confirmBtnDisabled]}
            disabled={!canConfirm}
            onPress={() => console.log("Booking confirmed, address:", fullAddress)}
          >
            <Text style={styles.confirmBtnText}>Confirm booking</Text>
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
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {showCalendar === "start" ? "Select start date" : "Select end date"}
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
  });
