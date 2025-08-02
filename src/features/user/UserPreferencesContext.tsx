/**
 * 👤 USER PREFERENCES CONTEXT - IMAGIQ ECOMMERCE
 *
 * Context provider para preferencias de usuario:
 * - Gestión de gustos y preferencias
 * - Patrones de consumo automáticos
 * - Personalización de la experiencia
 * - Segmentación basada en comportamiento
 * - Integración con PostHog para análisis avanzado
 */

"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface UserPreferences {
  categories: string[];
  brands: string[];
  priceRange: { min: number; max: number };
  themes: string[];
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  shopping: {
    preferredPayment: string;
    preferredShipping: string;
    wishlist: string[];
  };
}

interface ConsumptionPattern {
  frequentCategories: string[];
  averageOrderValue: number;
  shoppingFrequency: "weekly" | "monthly" | "occasional";
  preferredTimes: string[];
  seasonalTrends: Record<string, string[]>;
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  patterns: ConsumptionPattern;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => void;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  trackProductView: (productId: string, category: string) => void;
  getPersonalizedRecommendations: () => string[];
  getUserSegment: () => string;
  loading: boolean;
}

const defaultPreferences: UserPreferences = {
  categories: [],
  brands: [],
  priceRange: { min: 0, max: 1000 },
  themes: [],
  notifications: {
    email: true,
    push: false,
    marketing: false,
  },
  shopping: {
    preferredPayment: "",
    preferredShipping: "",
    wishlist: [],
  },
};

const defaultPatterns: ConsumptionPattern = {
  frequentCategories: [],
  averageOrderValue: 0,
  shoppingFrequency: "monthly",
  preferredTimes: [],
  seasonalTrends: {},
};

const UserPreferencesContext = createContext<
  UserPreferencesContextType | undefined
>(undefined);

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error(
      "useUserPreferences must be used within UserPreferencesProvider"
    );
  }
  return context;
};

export const UserPreferencesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [preferences, setPreferences] =
    useState<UserPreferences>(defaultPreferences);
  const [patterns, setPatterns] = useState<ConsumptionPattern>(defaultPatterns);
  const [loading] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPrefs = localStorage.getItem("user_preferences");
      const savedPatterns = localStorage.getItem("consumption_patterns");

      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }
      if (savedPatterns) {
        setPatterns(JSON.parse(savedPatterns));
      }
    }
  }, []);

  const trackEvent = (event: string, properties?: Record<string, unknown>) => {
    // Mock tracking function - will be replaced with actual analytics
    console.log("User Preferences Event:", event, properties);
  };

  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    const updatedPrefs = { ...preferences, ...newPrefs };
    setPreferences(updatedPrefs);

    if (typeof window !== "undefined") {
      localStorage.setItem("user_preferences", JSON.stringify(updatedPrefs));
    }

    // Track preference changes
    trackEvent("preferences_updated", {
      updated_fields: Object.keys(newPrefs),
      preference_data: newPrefs,
    });
  };

  const addToWishlist = (productId: string) => {
    if (!preferences.shopping.wishlist.includes(productId)) {
      const newWishlist = [...preferences.shopping.wishlist, productId];
      updatePreferences({
        shopping: { ...preferences.shopping, wishlist: newWishlist },
      });

      trackEvent("wishlist_add", { product_id: productId });
    }
  };

  const removeFromWishlist = (productId: string) => {
    const newWishlist = preferences.shopping.wishlist.filter(
      (id) => id !== productId
    );
    updatePreferences({
      shopping: { ...preferences.shopping, wishlist: newWishlist },
    });

    trackEvent("wishlist_remove", { product_id: productId });
  };

  const trackProductView = (productId: string, category: string) => {
    // Update viewing patterns
    const updatedCategories = [...patterns.frequentCategories];
    const categoryIndex = updatedCategories.indexOf(category);

    if (categoryIndex === -1) {
      updatedCategories.push(category);
    }

    const updatedPatterns = {
      ...patterns,
      frequentCategories: updatedCategories.slice(0, 10), // Keep top 10
    };

    setPatterns(updatedPatterns);

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "consumption_patterns",
        JSON.stringify(updatedPatterns)
      );
    }

    // Track product view for analytics
    trackEvent("product_view", {
      product_id: productId,
      category,
      user_segment: getUserSegment(),
    });
  };

  const getPersonalizedRecommendations = (): string[] => {
    // Simple recommendation logic based on patterns
    // In real implementation, this would call ML service
    return patterns.frequentCategories.slice(0, 5);
  };

  const getUserSegment = (): string => {
    const { averageOrderValue, shoppingFrequency } = patterns;

    if (averageOrderValue > 500 && shoppingFrequency === "weekly") {
      return "premium_customer";
    } else if (averageOrderValue > 200 && shoppingFrequency === "monthly") {
      return "regular_customer";
    } else if (shoppingFrequency === "occasional") {
      return "occasional_buyer";
    } else {
      return "new_customer";
    }
  };

  const value: UserPreferencesContextType = {
    preferences,
    patterns,
    updatePreferences,
    addToWishlist,
    removeFromWishlist,
    trackProductView,
    getPersonalizedRecommendations,
    getUserSegment,
    loading,
  };

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
};
