/**
 * @module useProfile
 * @description Custom hook for profile management leveraging existing contexts
 * Following Dependency Inversion Principle - depends on abstractions (contexts) not concretions
 */

import { useState, useCallback, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAuthContext } from "@/features/auth/context";
import { useUserPreferences } from "@/features/user/UserPreferencesContext";
import {
  ProfileState,
  ProfileUser,
  ProfileAddress,
  PaymentMethod,
  Order,
  Credits,
  Coupon,
  LoyaltyProgram,
  ProfilePreferences,
} from "../types";
import {
  createMockProfileState,
  createMockActiveOrders,
  createMockRecentOrders,
  createMockAddresses,
  createMockPaymentMethods,
  mockApiDelay,
} from "../utils/mockData";

interface UseProfileReturn {
  // State
  state: ProfileState;

  // Actions
  actions: {
    loadProfile: () => Promise<void>;
    updateProfile: (data: Partial<ProfileUser>) => Promise<void>;
    loadOrders: () => Promise<void>;
    loadAddresses: () => Promise<void>;
    loadPaymentMethods: () => Promise<void>;
    refreshData: () => Promise<void>;
    logout: () => Promise<void>;
  };

  // Utilities
  isLoading: boolean;
  hasError: boolean;
}

/**
 * Main profile hook that leverages existing contexts and state management
 */
export const useProfile = (): UseProfileReturn => {
  // Leverage existing contexts
  const authContext = useAuthContext();
  const userPreferencesContext = useUserPreferences();

  // Local state for profile-specific data
  const [profileData, setProfileData] = useLocalStorage<{
    addresses: ProfileAddress[];
    paymentMethods: PaymentMethod[];
    credits: Credits;
    coupons: Coupon[];
    loyaltyProgram: LoyaltyProgram | null;
  }>("profile-data", {
    addresses: [],
    paymentMethods: [],
    credits: { balance: 0, currency: "COP", lastUpdate: new Date() },
    coupons: [],
    loyaltyProgram: null,
  });

  const [orders, setOrders] = useState<{
    active: Order[];
    recent: Order[];
  }>({
    active: [],
    recent: [],
  });

  const [loading, setLoading] = useState({
    profile: false,
    orders: false,
    addresses: false,
    paymentMethods: false,
    invoices: false,
  });

  const [error, setError] = useState<string | null>(null);

  // Utility to set specific loading state
  const setLoadingState = useCallback(
    (key: keyof typeof loading, value: boolean) => {
      setLoading((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Load profile data - leverages auth context for user info
  const loadProfile = useCallback(async () => {
    if (!authContext.user) {
      setError("User not authenticated");
      return;
    }

    setLoadingState("profile", true);
    setError(null);

    try {
      await mockApiDelay(800);

      // In a real app, this would fetch from API using authContext.user.id
      const mockData = createMockProfileState();
      setProfileData({
        addresses: mockData.addresses,
        paymentMethods: mockData.paymentMethods,
        credits: mockData.credits,
        coupons: mockData.coupons,
        loyaltyProgram: mockData.loyaltyProgram,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoadingState("profile", false);
    }
  }, [authContext.user, setLoadingState, setProfileData]);

  // Update profile information
  const updateProfile = useCallback(
    async (data: Partial<ProfileUser>) => {
      setLoadingState("profile", true);
      setError(null);

      try {
        await mockApiDelay(500);

        // NOTE: This hook currently simulates an update for demo/testing purposes.
        // In a real application this should call the backend API to persist changes
        // (e.g. await api.updateProfile(authContext.user.id, data)).
        // The console.log is intentional to emulate side-effects in this mock.
        console.log("Profile update data (mock):", data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update profile"
        );
      } finally {
        setLoadingState("profile", false);
      }
    },
    [setLoadingState]
  );

  // Load orders data
  const loadOrders = useCallback(async () => {
    setLoadingState("orders", true);
    setError(null);

    try {
      await mockApiDelay(600);

      const activeOrders = createMockActiveOrders();
      const recentOrders = createMockRecentOrders();

      setOrders({
        active: activeOrders,
        recent: recentOrders,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoadingState("orders", false);
    }
  }, [setLoadingState]);

  // Load addresses
  const loadAddresses = useCallback(async () => {
    setLoadingState("addresses", true);
    setError(null);

    try {
      await mockApiDelay(400);

      const addresses = createMockAddresses();
      setProfileData((prev) => ({ ...prev, addresses }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load addresses");
    } finally {
      setLoadingState("addresses", false);
    }
  }, [setLoadingState, setProfileData]);

  // Load payment methods
  const loadPaymentMethods = useCallback(async () => {
    setLoadingState("paymentMethods", true);
    setError(null);

    try {
      await mockApiDelay(400);

      const paymentMethods = createMockPaymentMethods();
      setProfileData((prev) => ({ ...prev, paymentMethods }));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load payment methods"
      );
    } finally {
      setLoadingState("paymentMethods", false);
    }
  }, [setLoadingState, setProfileData]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    await Promise.all([
      loadProfile(),
      loadOrders(),
      loadAddresses(),
      loadPaymentMethods(),
    ]);
  }, [loadProfile, loadOrders, loadAddresses, loadPaymentMethods]);

  // Logout - leverage existing auth context
  const logout = useCallback(async () => {
    authContext.logout();
    // Clear local profile data
    setProfileData({
      addresses: [],
      paymentMethods: [],
      credits: { balance: 0, currency: "COP", lastUpdate: new Date() },
      coupons: [],
      loyaltyProgram: null,
    });
    setOrders({ active: [], recent: [] });
  }, [authContext, setProfileData]);

  // Initialize profile data on mount if user is authenticated
  useEffect(() => {
    if (authContext.user && profileData.addresses.length === 0) {
      loadProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authContext.user]); // Only re-run when user changes, not on every loadProfile recreation

  // Compute derived state
  const profileState: ProfileState = {
    user: (authContext.user as ProfileUser) || null,
    addresses: profileData.addresses,
    paymentMethods: profileData.paymentMethods,
    activeOrders: orders.active,
    recentOrders: orders.recent,
    invoices: [],
    credits: profileData.credits,
    coupons: profileData.coupons,
    loyaltyProgram: profileData.loyaltyProgram,
    preferences: (userPreferencesContext || {
      categories: [],
      brands: [],
      priceRange: { min: 0, max: 1000000 },
      themes: [],
      notifications: { email: true, push: true, marketing: false },
      shopping: { preferredPayment: "", preferredShipping: "", wishlist: [] },
    }) as unknown as ProfilePreferences,
    loading,
    error,
  };

  const isLoading = Object.values(loading).some(Boolean);
  const hasError = error !== null;

  return {
    state: profileState,
    actions: {
      loadProfile,
      updateProfile,
      loadOrders,
      loadAddresses,
      loadPaymentMethods,
      refreshData,
      logout,
    },
    isLoading,
    hasError,
  };
};
