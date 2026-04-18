import { databases, storage, config, ID, Query } from "./appwrite";

const db = config.databaseId;

// ── USERS ──────────────────────────────────────────────
export const createUser = async (userId: string, data: {
  name: string;
  email: string;
  phone?: string;
  location?: string;
}) => {
  return await databases.createDocument(db, config.usersCollectionId, userId, {
    ...data,
    memberSince: new Date().toISOString(),
    rating: 0,
    totalListings: 0,
    totalRentals: 0,
  });
};

export const getUser = async (userId: string) => {
  return await databases.getDocument(db, config.usersCollectionId, userId);
};

export const updateUser = async (userId: string, data: Partial<{
  name: string;
  phone: string;
  avatar: string;
  location: string;
}>) => {
  return await databases.updateDocument(db, config.usersCollectionId, userId, data);
};

// ── CATEGORIES ─────────────────────────────────────────
export const getCategories = async () => {
  return await databases.listDocuments(db, config.categoriesCollectionId);
};

// ── LISTINGS ───────────────────────────────────────────
export const createListing = async (data: {
  ownerId: string;
  categoryId: string;
  title: string;
  description: string;
  condition: string;
  pricePerDay: number;
  deposit?: number;
  location: string;
  latitude?: number;
  longitude?: number;
  images?: string[];
  deliveryAvailable: boolean;
  deliveryFee?: number;
  cancellationPolicy?: string;
  availableFrom?: string;
  availableTo?: string;
}) => {
  return await databases.createDocument(db, config.listingsCollectionId, ID.unique(), {
    ...data,
    status: "active",
    rating: 0,
    totalReviews: 0,
  });
};

export const getListings = async (queries: string[] = []) => {
  return await databases.listDocuments(db, config.listingsCollectionId, [
    Query.equal("status", "active"),
    ...queries,
  ]);
};

export const getListing = async (listingId: string) => {
  return await databases.getDocument(db, config.listingsCollectionId, listingId);
};

export const getMyListings = async (ownerId: string) => {
  return await databases.listDocuments(db, config.listingsCollectionId, [
    Query.equal("ownerId", ownerId),
  ]);
};

export const updateListing = async (listingId: string, data: object) => {
  return await databases.updateDocument(db, config.listingsCollectionId, listingId, data);
};

export const deleteListing = async (listingId: string) => {
  return await databases.deleteDocument(db, config.listingsCollectionId, listingId);
};

// ── RENTALS ────────────────────────────────────────────
export const createRental = async (data: {
  listingId: string;
  renterId: string;
  ownerId: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  dailyRate: number;
  deposit?: number;
  deliveryMode: string;
  deliveryAddress?: string;
  deliveryFee?: number;
  subtotal: number;
  total: number;
  notes?: string;
}) => {
  return await databases.createDocument(db, config.rentalsCollectionId, ID.unique(), {
    ...data,
    status: "pending",
  });
};

export const getRentals = async (userId: string, role: "renter" | "owner") => {
  return await databases.listDocuments(db, config.rentalsCollectionId, [
    Query.equal(role === "renter" ? "renterId" : "ownerId", userId),
    Query.orderDesc("$createdAt"),
  ]);
};

export const updateRentalStatus = async (rentalId: string, status: string) => {
  return await databases.updateDocument(db, config.rentalsCollectionId, rentalId, { status });
};

// ── MESSAGES ───────────────────────────────────────────
export const sendMessage = async (data: {
  senderId: string;
  receiverId: string;
  content: string;
  listingId?: string;
  rentalId?: string;
}) => {
  return await databases.createDocument(db, config.messagesCollectionId, ID.unique(), {
    ...data,
    isRead: false,
  });
};

export const getMessages = async (userId1: string, userId2: string) => {
  return await databases.listDocuments(db, config.messagesCollectionId, [
    Query.or([
      Query.and([Query.equal("senderId", userId1), Query.equal("receiverId", userId2)]),
      Query.and([Query.equal("senderId", userId2), Query.equal("receiverId", userId1)]),
    ]),
    Query.orderAsc("$createdAt"),
  ]);
};

export const markMessageRead = async (messageId: string) => {
  return await databases.updateDocument(db, config.messagesCollectionId, messageId, { isRead: true });
};

// ── REVIEWS ────────────────────────────────────────────
export const createReview = async (data: {
  rentalId: string;
  listingId: string;
  reviewerId: string;
  ownerId: string;
  rating: number;
  comment?: string;
}) => {
  return await databases.createDocument(db, config.reviewsCollectionId, ID.unique(), data);
};

export const getReviews = async (listingId: string) => {
  return await databases.listDocuments(db, config.reviewsCollectionId, [
    Query.equal("listingId", listingId),
    Query.orderDesc("$createdAt"),
  ]);
};

// ── NOTIFICATIONS ──────────────────────────────────────
export const getNotifications = async (userId: string) => {
  return await databases.listDocuments(db, config.notificationsCollectionId, [
    Query.equal("userId", userId),
    Query.orderDesc("$createdAt"),
  ]);
};

export const markNotificationRead = async (notificationId: string) => {
  return await databases.updateDocument(db, config.notificationsCollectionId, notificationId, { isRead: true });
};

// ── STORAGE ────────────────────────────────────────────
export const uploadFile = async (file: any) => {
  return await storage.createFile(config.bucketId, ID.unique(), file);
};

export const getFileUrl = (fileId: string) => {
  return storage.getFilePreview(config.bucketId, fileId);
};

export const deleteFile = async (fileId: string) => {
  return await storage.deleteFile(config.bucketId, fileId);
};
