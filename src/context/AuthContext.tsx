import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  SignInCredentials,
  SignUpCredentials,
  signIn,
  signUp,
  signOut,
  getCurrentUser,
} from "@/lib/api/auth";
import { UserRole, UserPermissions, getRolePermissions } from "@/types/auth";
import SupabaseWarning from "@/components/common/SupabaseWarning";

type AuthContextType = {
  user: User | null;
  userRole: UserRole | null;
  permissions: UserPermissions;
  loading: boolean;
  isConfigured: boolean;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [permissions, setPermissions] = useState<UserPermissions>(
    getRolePermissions("participant"),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured] = useState(isSupabaseConfigured());

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      setError(
        "Supabase is not configured. Please set up your environment variables.",
      );
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user || null;
      setUser(currentUser);

      if (currentUser) {
        // Get user role from user metadata
        const role =
          (currentUser.user_metadata?.role as UserRole) || "participant";
        setUserRole(role);
        setPermissions(getRolePermissions(role));
      }

      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const updatedUser = session?.user || null;
      setUser(updatedUser);

      if (updatedUser) {
        // Get user role from user metadata
        const role =
          (updatedUser.user_metadata?.role as UserRole) || "participant";
        setUserRole(role);
        setPermissions(getRolePermissions(role));
      } else {
        setUserRole(null);
        setPermissions(getRolePermissions("participant"));
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isConfigured]);

  const handleSignUp = async (credentials: SignUpCredentials) => {
    try {
      setLoading(true);
      setError(null);
      await signUp(credentials);
    } catch (error) {
      console.error("Error signing up:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred during sign up",
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (credentials: SignInCredentials) => {
    try {
      setLoading(true);
      setError(null);
      await signIn(credentials);

      // After sign in, get the current user to update role and permissions
      const currentUser = await getCurrentUser();
      if (currentUser) {
        const role =
          (currentUser.user_metadata?.role as UserRole) || "participant";
        setUserRole(role);
        setPermissions(getRolePermissions(role));
      }
    } catch (error) {
      console.error("Error signing in:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred during sign in",
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await signOut();
      setUserRole(null);
      setPermissions(getRolePermissions("participant"));
    } catch (error) {
      console.error("Error signing out:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred during sign out",
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    userRole,
    permissions,
    loading,
    isConfigured,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isConfigured && <SupabaseWarning />}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
