import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeContext";
import ScreenLayout from "@/styles/screenlayout";
import { getListing, getReviews, getUser } from "../../../../lib/services";
import { avatars } from "../../../../lib/appwrite";

const TABS = ["Details", "Reviews", "Owner"];

export default function ListingDetailScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = createStyles(theme);
  const { id } = useLocalSearchParams<{ id: string }>();

  const [activeTab, setActiveTab] = useState("Details");
  const [listing, setListing] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [owner, setOwner] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadAll();
  }, [id]);

  const loadAll = async () => {
    try {
      const listingData = await getListing(id);
      setListing(listingData);
      const [reviewsData, ownerData] = await Promise.all([
        getReviews(id),
        getUser(listingData.ownerId),
      ]);
      setReviews(reviewsData.documents);
      setOwner(ownerData);
    } catch (err) {
      console.error("Failed to load listing:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number, size = 14) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Ionicons
        key={i}
        name={i < rating ? "star" : "star-outline"}
        size={size}
        color={i < rating ? "#F5C842" : theme.border}
      />
    ));

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const starBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percent:
      reviews.length > 0
        ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100
        : 0,
  }));

  // parse booked date ranges for display
  const bookedRanges = (listing?.bookedDates || []).map((d: string) => {
    try { return JSON.parse(d); } catch { return null; }
  }).filter(Boolean);

  const renderDetails = () => (
    <View style={styles.tabContent}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.bodyText}>{listing?.description || "—"}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Info</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Condition</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {listing?.condition?.charAt(0).toUpperCase() + listing?.condition?.slice(1)}
            </Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Availability</Text>
          <Text style={styles.infoValue}>
            {listing?.availableFrom && listing?.availableTo
              ? `${formatDate(listing.availableFrom)} – ${formatDate(listing.availableTo)}`
              : "Flexible"}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Location</Text>
          <Text style={styles.infoValue}>📍 {listing?.location || "—"}</Text>
        </View>

        {/* BOOKED DATES BANNER */}
        {bookedRanges.length > 0 && (
          <View style={styles.bookedBanner}>
            <Ionicons name="calendar-outline" size={16} color="#F44336" />
            <View style={{ flex: 1 }}>
              <Text style={styles.bookedBannerTitle}>Some dates are already booked</Text>
              {bookedRanges.map((range: any, index: number) => (
                <Text key={index} style={styles.bookedBannerDate}>
                  • {formatDate(range.from)} — {formatDate(range.to)}
                </Text>
              ))}
            </View>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Rental terms</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Deposit</Text>
          <Text style={styles.infoValue}>
            {listing?.deposit ? `₱${listing.deposit.toLocaleString()}` : "None"}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Delivery</Text>
          <Text style={styles.infoValue}>
            {listing?.deliveryAvailable
              ? `Available (+₱${listing.deliveryFee || 0})`
              : "Pickup only"}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Cancellation</Text>
          <Text style={styles.infoValue}>
            {listing?.cancellationPolicy || "Not specified"}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderReviews = () => (
    <View style={styles.tabContent}>
      <View style={styles.card}>
        <View style={styles.ratingOverview}>
          <Text style={styles.ratingScore}>
            {avgRating > 0 ? avgRating.toFixed(1) : "—"}
          </Text>
          <View>
            <View style={styles.starsRow}>{renderStars(Math.round(avgRating), 18)}</View>
            <Text style={styles.ratingCount}>{reviews.length} reviews</Text>
          </View>
        </View>
        <View style={styles.ratingBreakdown}>
          {starBreakdown.map(({ star, percent }) => (
            <View key={star} style={styles.ratingBarRow}>
              <Text style={styles.ratingBarLabel}>{star}</Text>
              <Ionicons name="star" size={11} color="#F5C842" />
              <View style={styles.ratingBarBg}>
                <View style={[styles.ratingBarFill, { width: `${percent}%` }]} />
              </View>
            </View>
          ))}
        </View>
      </View>

      {reviews.length === 0 ? (
        <View style={styles.card}>
          <Text style={{ color: theme.subtext, textAlign: "center", fontSize: 13 }}>
            No reviews yet.
          </Text>
        </View>
      ) : (
        reviews.map((review) => (
          <View key={review.$id} style={styles.card}>
            <View style={styles.reviewHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {review.reviewerId?.substring(0, 2).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.reviewName}>{review.reviewerName || "User"}</Text>
                <View style={styles.starsRow}>{renderStars(review.rating)}</View>
              </View>
            </View>
            <Text style={styles.bodyText}>{review.comment}</Text>
          </View>
        ))
      )}
    </View>
  );

  const renderOwner = () => (
    <View style={styles.tabContent}>
      <View style={styles.card}>
        <View style={styles.ownerHeader}>
          <Image
            source={{
              uri:
                owner?.avatar ||
                avatars.getInitials(owner?.name || "U").toString(),
            }}
            style={styles.ownerAvatar as any}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.ownerName}>{owner?.name || "—"}</Text>
            <View style={styles.starsRow}>
              {renderStars(Math.round(owner?.rating || 0))}
              <Text style={[styles.infoLabel, { marginLeft: 4 }]}>
                {owner?.rating > 0 ? owner.rating.toFixed(1) : "New"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Stats</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Listings</Text>
          <Text style={styles.infoValue}>{owner?.totalListings ?? "—"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Member since</Text>
          <Text style={styles.infoValue}>
            {owner?.memberSince
              ? new Date(owner.memberSince).toLocaleDateString("en-PH", {
                month: "long",
                year: "numeric",
              })
              : "—"}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Total rentals</Text>
          <Text style={styles.infoValue}>{owner?.totalRentals ?? "—"}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Contact</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>{owner?.phone || "Not provided"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{owner?.email || "—"}</Text>
        </View>
      </View>

      <Pressable
        style={styles.messageOwnerBtn}
        onPress={() =>
          router.push(
            `/navigation/screens/conversation?partnerId=${owner?.$id}&partnerName=${owner?.name || "Owner"}`
          )
        }
      >
        <Ionicons name="chatbubble-outline" size={18} color="#fff" />
        <Text style={styles.messageOwnerText}>Message owner</Text>
      </Pressable>
    </View>
  );

  if (loading) {
    return (
      <ScreenLayout style={{ backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} style={{ flex: 1 }} />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout style={{ backgroundColor: theme.background }}>
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* IMAGE */}
          <View style={{ position: "relative" }}>
            <Image
              source={{
                uri: "https://www.deere.com/assets/images/region-4/products/tractors/utility-tractors/6m-series-utility-tractors/6M_155_Front_Left_studio_graphic_1024x576_small_ad511f737c4f9d929dd90cdfd360038474a69d9a.jpg",
              }}
              style={styles.image}
            />
            <Pressable style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color={theme.text} />
            </Pressable>
          </View>

          {/* TITLE CARD */}
          <View style={styles.titleCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{listing?.title || "—"}</Text>
              <Text style={styles.subtitle}>📍 {listing?.location || "—"}</Text>
            </View>
            <Text style={styles.price}>
              ₱{listing?.pricePerDay?.toLocaleString()}/day
            </Text>
          </View>

          {/* TABS */}
          <View style={styles.tabBar}>
            {TABS.map((tab) => (
              <Pressable
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab}
                </Text>
              </Pressable>
            ))}
          </View>

          {activeTab === "Details" && renderDetails()}
          {activeTab === "Reviews" && renderReviews()}
          {activeTab === "Owner" && renderOwner()}
        </ScrollView>

        {/* STICKY BOTTOM ACTIONS */}
        <View style={styles.bottomBar}>
          <Pressable
            style={styles.messageBtn}
            onPress={() =>
              router.push(
                `/navigation/screens/conversation?partnerId=${listing?.ownerId}&partnerName=${owner?.name || "Owner"}`
              )
            }
          >
            <Ionicons name="chatbubble-outline" size={18} color={theme.primary} />
            <Text style={styles.messageBtnText}>Message</Text>
          </Pressable>
          <Pressable
            style={styles.rentBtn}
            onPress={() =>
              router.push(`/navigation/screens/bookingScreen?id=${id}`)
            }
          >
            <Text style={styles.rentBtnText}>Rent Now</Text>
          </Pressable>
        </View>
      </View>
    </ScreenLayout>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    image: {
      width: "100%",
      height: 240,
    },
    backBtn: {
      position: "absolute",
      top: 16,
      left: 16,
      backgroundColor: theme.card,
      padding: 8,
      borderRadius: 20,
    },
    titleCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      padding: 16,
      borderBottomWidth: 0.5,
      borderColor: theme.border,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.text,
    },
    subtitle: {
      fontSize: 13,
      color: theme.subtext,
      marginTop: 2,
    },
    price: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.primary,
    },
    tabBar: {
      flexDirection: "row",
      backgroundColor: theme.card,
      borderBottomWidth: 0.5,
      borderColor: theme.border,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: "center",
      borderBottomWidth: 2,
      borderBottomColor: "transparent",
    },
    tabActive: {
      borderBottomColor: theme.primary,
    },
    tabText: {
      fontSize: 14,
      color: theme.subtext,
      fontWeight: "500",
    },
    tabTextActive: {
      color: theme.primary,
      fontWeight: "700",
    },
    tabContent: {
      padding: 14,
      gap: 12,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: 14,
      padding: 14,
      borderWidth: 0.5,
      borderColor: theme.border,
      gap: 8,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 4,
    },
    bodyText: {
      fontSize: 13,
      color: theme.subtext,
      lineHeight: 20,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 4,
      borderBottomWidth: 0.5,
      borderColor: theme.border,
    },
    infoLabel: {
      fontSize: 13,
      color: theme.subtext,
    },
    infoValue: {
      fontSize: 13,
      color: theme.text,
      fontWeight: "500",
    },
    badge: {
      backgroundColor: theme.background,
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 20,
      borderWidth: 0.5,
      borderColor: theme.border,
    },
    badgeText: {
      fontSize: 12,
      color: theme.text,
    },
    bookedBanner: {
      backgroundColor: "#F4433615",
      borderRadius: 10,
      padding: 10,
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
      borderWidth: 0.5,
      borderColor: "#F44336",
      marginTop: 4,
    },
    bookedBannerTitle: {
      fontSize: 13,
      color: "#F44336",
      fontWeight: "600",
      marginBottom: 4,
    },
    bookedBannerDate: {
      fontSize: 12,
      color: "#F44336",
      marginTop: 2,
    },
    ratingOverview: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      marginBottom: 12,
    },
    ratingScore: {
      fontSize: 42,
      fontWeight: "700",
      color: theme.text,
    },
    ratingCount: {
      fontSize: 12,
      color: theme.subtext,
      marginTop: 2,
    },
    starsRow: {
      flexDirection: "row",
      gap: 2,
      alignItems: "center",
    },
    ratingBreakdown: {
      gap: 5,
    },
    ratingBarRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    ratingBarLabel: {
      fontSize: 12,
      color: theme.subtext,
      width: 10,
    },
    ratingBarBg: {
      flex: 1,
      height: 6,
      backgroundColor: theme.background,
      borderRadius: 3,
      overflow: "hidden",
    },
    ratingBarFill: {
      height: 6,
      backgroundColor: "#F5C842",
      borderRadius: 3,
    },
    reviewHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 6,
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.background,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 0.5,
      borderColor: theme.border,
    },
    avatarText: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.primary,
    },
    reviewName: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 2,
    },
    ownerHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    ownerAvatar: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: theme.background,
      borderWidth: 0.5,
      borderColor: theme.border,
    },
    ownerName: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 4,
    },
    messageOwnerBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: theme.primary,
      padding: 14,
      borderRadius: 12,
      marginTop: 4,
    },
    messageOwnerText: {
      color: "#fff",
      fontWeight: "700",
      fontSize: 14,
    },
    bottomBar: {
      flexDirection: "row",
      padding: 12,
      gap: 10,
      backgroundColor: theme.card,
      borderTopWidth: 0.5,
      borderColor: theme.border,
    },
    messageBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      padding: 13,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.primary,
    },
    messageBtnText: {
      color: theme.primary,
      fontWeight: "700",
      fontSize: 14,
    },
    rentBtn: {
      flex: 2,
      alignItems: "center",
      justifyContent: "center",
      padding: 13,
      borderRadius: 12,
      backgroundColor: theme.primary,
    },
    rentBtnText: {
      color: "#fff",
      fontWeight: "700",
      fontSize: 14,
    },
  });
