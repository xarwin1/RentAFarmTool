import { Client, Account, Databases, Storage, Avatars, ID, Query } from "react-native-appwrite";

export const config = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM!,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
  usersCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
  listingsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_LISTINGS_COLLECTION_ID!,
  rentalsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_RENTALS_COLLECTION_ID!,
  messagesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_MESSAGES_COLLECTION_ID!,
  reviewsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID!,
  notificationsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_NOTIFICATIONS_COLLECTION_ID!,
  categoriesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!,
  bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!,
};

export const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
export { ID, Query };
