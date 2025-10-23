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
import { profileService } from "@/services/profile.service";

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
      // ✅ USAR DATOS REALES DEL BACKEND
      console.log('🔍 [useProfile] Cargando datos para usuario:', authContext.user.id);
      const profileData = await profileService.getUserProfile(authContext.user.id);
      console.log('📦 [useProfile] Datos RAW del backend:', profileData);
      console.log('📍 [useProfile] Direcciones (tipo:', typeof profileData.direcciones, '):', profileData.direcciones);
      console.log('💳 [useProfile] Tarjetas (tipo:', typeof profileData.tarjetas, '):', profileData.tarjetas);

      // Asegurar que tarjetas y direcciones sean arrays
      const tarjetasArray = Array.isArray(profileData.tarjetas) ? profileData.tarjetas : [];
      const direccionesArray = Array.isArray(profileData.direcciones) ? profileData.direcciones : [];

      console.log('🔄 [useProfile] Arrays preparados:', {
        tarjetas: tarjetasArray.length,
        direcciones: direccionesArray.length
      });

      // Transformar tarjetas del backend al formato PaymentMethod
      const paymentMethods: PaymentMethod[] = tarjetasArray.map(tarjeta => ({
        id: tarjeta.id.toString(),
        type: (tarjeta.tipo_tarjeta as 'credit_card' | 'debit_card') || 'credit_card',
        isDefault: tarjeta.es_predeterminada || false,
        alias: tarjeta.alias || tarjeta.nombre_titular || `Tarjeta ${tarjeta.marca || ''}`.trim() || `Tarjeta *${tarjeta.ultimos_dijitos}`,
        last4Digits: tarjeta.ultimos_dijitos,  // ✅ CORREGIDO: ultimos_dijitos (con j)
        expirationDate: tarjeta.fecha_vencimiento,
        brand: tarjeta.marca,
        isActive: tarjeta.activa !== false,
      }));

      // Transformar direcciones del backend al formato ProfileAddress
      const addresses: ProfileAddress[] = direccionesArray.map(dir => {
        // Determinar el tipo de dirección
        const addressType = dir.tipoDireccion === 'casa'
          ? 'home'
          : dir.tipoDireccion === 'oficina'
          ? 'work'
          : 'other';

        return {
          id: dir.id,
          userId: authContext.user!.id,
          // ✅ CORREGIDO: Usar linea_uno si no hay nombreDireccion
          alias: dir.nombreDireccion || dir.linea_uno || 'Dirección',
          type: addressType,
          name: dir.nombreDireccion || dir.linea_uno || 'Dirección',
          // ✅ CORREGIDO: Usar linea_uno si no hay direccionFormateada
          addressLine1: dir.direccionFormateada || dir.linea_uno || '',
          addressLine2: dir.complemento,
          street: dir.direccionFormateada || dir.linea_uno || '',
          city: dir.ciudad || '',
          state: dir.departamento || '',
          zipCode: '',
          country: dir.pais || 'CO',
          isDefault: dir.esPredeterminada || false,
          instructions: dir.instruccionesEntrega,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });

      console.log('✅ [useProfile] Direcciones transformadas:', addresses);
      console.log('✅ [useProfile] Métodos de pago transformados:', paymentMethods);

      setProfileData({
        addresses,
        paymentMethods,
        credits: { balance: 0, currency: "COP", lastUpdate: new Date() },
        coupons: [],
        loyaltyProgram: null,
      });

      console.log('💾 [useProfile] Datos guardados en estado correctamente');
    } catch (err) {
      console.error("Error loading profile:", err);
      setError(err instanceof Error ? err.message : "Failed to load profile");

      // Fallback a datos mock en caso de error
      const mockData = createMockProfileState();
      setProfileData({
        addresses: mockData.addresses,
        paymentMethods: mockData.paymentMethods,
        credits: mockData.credits,
        coupons: mockData.coupons,
        loyaltyProgram: mockData.loyaltyProgram,
      });
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
    if (!authContext.user) return;

    setLoadingState("addresses", true);
    setError(null);

    try {
      // ✅ USAR DATOS REALES DEL BACKEND
      const addressData = await profileService.getUserAddresses(authContext.user.id);

      const addresses: ProfileAddress[] = addressData.map(dir => {
        const addressType = dir.tipoDireccion === 'casa'
          ? 'home'
          : dir.tipoDireccion === 'oficina'
          ? 'work'
          : 'other';

        return {
          id: dir.id,
          userId: authContext.user!.id,
          alias: dir.nombreDireccion || dir.linea_uno || 'Dirección',
          type: addressType,
          name: dir.nombreDireccion || dir.linea_uno || 'Dirección',
          addressLine1: dir.direccionFormateada || dir.linea_uno || '',
          addressLine2: dir.complemento,
          street: dir.direccionFormateada || dir.linea_uno || '',
          city: dir.ciudad || '',
          state: dir.departamento || '',
          zipCode: '',
          country: dir.pais || 'CO',
          isDefault: dir.esPredeterminada || false,
          instructions: dir.instruccionesEntrega,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });

      setProfileData((prev) => ({ ...prev, addresses }));
    } catch (err) {
      console.error("Error loading addresses:", err);
      setError(err instanceof Error ? err.message : "Failed to load addresses");

      // Fallback a datos mock
      const addresses = createMockAddresses();
      setProfileData((prev) => ({ ...prev, addresses }));
    } finally {
      setLoadingState("addresses", false);
    }
  }, [authContext.user, setLoadingState, setProfileData]);

  // Load payment methods
  const loadPaymentMethods = useCallback(async () => {
    if (!authContext.user) return;

    setLoadingState("paymentMethods", true);
    setError(null);

    try {
      // ✅ USAR DATOS REALES DEL BACKEND
      const paymentData = await profileService.getUserPaymentMethods(authContext.user.id);

      const paymentMethods: PaymentMethod[] = paymentData.map(tarjeta => ({
        id: tarjeta.id.toString(),
        type: (tarjeta.tipo_tarjeta as 'credit_card' | 'debit_card') || 'credit_card',
        isDefault: tarjeta.es_predeterminada || false,
        alias: tarjeta.alias || tarjeta.nombre_titular || `Tarjeta ${tarjeta.marca || ''}`.trim() || `Tarjeta *${tarjeta.ultimos_dijitos}`,
        last4Digits: tarjeta.ultimos_dijitos,  // ✅ CORREGIDO: ultimos_dijitos (con j)
        expirationDate: tarjeta.fecha_vencimiento,
        brand: tarjeta.marca,
        isActive: tarjeta.activa !== false,
      }));

      setProfileData((prev) => ({ ...prev, paymentMethods }));
    } catch (err) {
      console.error("Error loading payment methods:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load payment methods"
      );

      // Fallback a datos mock
      const paymentMethods = createMockPaymentMethods();
      setProfileData((prev) => ({ ...prev, paymentMethods }));
    } finally {
      setLoadingState("paymentMethods", false);
    }
  }, [authContext.user, setLoadingState, setProfileData]);

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
