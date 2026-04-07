import { createContext, useContext, useEffect, useState } from "react";
import { ID, Models } from "react-native-appwrite";
import { account } from "./appwrite";

type authContextType = {
  user: Models.User<Models.Preferences> | null;
  isLoadingUser: boolean;
  signUp: (email: string, password: string) => Promise<string | null>;
  logIn: (email: string, password: string) => Promise<string | null>;
  logOut: () => Promise<void>;
}

const authContext = createContext<authContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );

  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);

  useEffect(() => {
    getUser();
  }, [])

  const getUser = async () => {
    try {
      const session = await account.get();
      setUser(session)
    } catch (error) {
      setUser(null)
    } finally {
      setIsLoadingUser(false);
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      await account.create(ID.unique(), email, password);
      await logIn(email, password);
      return null;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return "An error occured during signup."
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
      return "An error occured during login."
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
    <authContext.Provider
      value={{ user, isLoadingUser, signUp, logIn, logOut }}
    >{children}</authContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(authContext);
  if (context === undefined) {
    throw new Error("useAuth must be inside of the AuthProvider");
  }
  return context;
}
