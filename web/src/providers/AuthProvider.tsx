import {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../firebase";

interface AuthContextType {
  user: User | null;
  isInitializing: boolean;
  handleSignInAndReturnSuccess: (
    email: string,
    password: string
  ) => Promise<boolean>;
  handleCreateUser: (email: string, password: string) => Promise<void>;
  handleSignOut: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsLoadingUser] = useState(true);

  const handleSignInAndReturnSuccess = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error: any) {
      console.error("Error signing in:", error.message);
      return false;
    }
  };

  const handleCreateUser = async (
    email: string,
    password: string
  ): Promise<void> => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (updatedUser) => {
      setUser(updatedUser);
      setIsLoadingUser(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      alert("You successfully signed out.");
    } catch (error: any) {
      console.error("Error signing out:", error.message);
    }
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        isInitializing,
        handleSignOut,
        handleSignInAndReturnSuccess,
        handleCreateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
