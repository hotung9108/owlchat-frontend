import React, { createContext, useContext, useEffect, useCallback, useMemo, useRef } from "react";
import { useUserProfile as useUserProfileHook } from "@/hooks/use-user-profile";
import type { UserProfile } from "@/types/user-profile.type";

interface UserProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  fetchProfileById: (id: string) => Promise<UserProfile | undefined | null>;
  clearProfileCache: (id?: string) => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, loading, error, fetchUserProfile, fetchProfileById, clearProfileCache } = useUserProfileHook();
  const isInitialMount = useRef(true);

  // 1. Stable refresh function - only call if user is authenticated
  const refreshProfile = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) {
      return;
    }
    try {
      await fetchUserProfile(null);
    } catch (err) {
      console.debug("Profile Provider: Error fetching profile", err);
    }
  }, [fetchUserProfile]);

  // 2. Fetch on mount only if token exists (prevents infinite loops on login page)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      
      // Only fetch if already authenticated
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      if (token) {
        refreshProfile();
      }
    }
  }, [refreshProfile]); // Include refreshProfile in deps

  // 3. Listen for logout - clear cache when accessToken is removed
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "accessToken" && !e.newValue) {
        // Token was removed - user logged out
        clearProfileCache();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [clearProfileCache]);

  // 4. Memoize value to prevent re-rendering consumers when provider re-renders for other reasons
  const value = useMemo(() => ({
    profile,
    loading,
    error,
    refreshProfile,
    fetchProfileById,
    clearProfileCache,
  }), [profile, loading, error, refreshProfile, fetchProfileById, clearProfileCache]);

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfileContext = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error("useUserProfileContext must be used within a UserProfileProvider");
  }
  return context;
};
