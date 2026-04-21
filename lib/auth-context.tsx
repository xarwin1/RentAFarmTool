import { createContext, useContext, useEffect, useState } from "react";
import { ID, Models } from "react-native-appwrite";
import { account, databases, config } from "./appwrite";

type authContextType = {
  user: Models.User<Models.Preferences> | null;
  isLoadingUser: boolean;
  signUp: (
    email: string,
    password: string,
    name: string,
    phone?: string,
    location?: string,
    birthdate?: string,
  ) => Promise<string | null>;
  logIn: (email: string, password: string) => Promise<string | null>;
  logOut: () => Promise<void>;
}

const authContext = createContext<authContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const session = await account.get();
      setUser(session);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    phone?: string,
    location?: string,
    birthdate?: string,
  ) => {
    try {
      const authUser = await account.create(ID.unique(), email, password, name);
      await account.createEmailPasswordSession(email, password);
      await databases.createDocument(
        config.databaseId,
        config.usersCollectionId,
        authUser.$id,
        {
          name,
          email,
          phone: phone || null,
          location: location || null,
          birthdate: birthdate || null,
          memberSince: new Date().toISOString(),
          rating: 0,
          totalListings: 0,
          totalRentals: 0,
        }
      );
      const session = await account.get();
      setUser(session);
      return null;
    } catch (error: any) {
      return error.message;
    }
  };

  const logIn = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const session = await account.get();
      setUser(session);
      return null;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return "An error occurred during login.";
    }
  };

  const logOut = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <authContext.Provider value={{ user, isLoadingUser, signUp, logIn, logOut }}>
      {children}
    </authContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(authContext);
  if (context === undefined) {
    throw new Error("useAuth must be inside of the AuthProvider");
  }
  return context;
}
