/**
 * Tipos TypeScript para Usuario
 * - Interfaces de usuario y autenticación
 * - Preferencias y configuraciones
 * - Historial y patrones de comportamiento
 */

// Interface from the backend microservice
export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  email_verificado?: boolean;
  contrasena: string;
  rol: 1 | 2 | 3 | 4;
  activo?: boolean;
  bloqueado?: boolean;
  fecha_creacion?: Date;
  ultimo_login?: Date | null;
  tipo_documento: string;
  numero_documento: string;
  telefono: string;
  codigo_pais: string;
}

// Internal user interface for the frontend
export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  role?: 1 | 2 | 3 | 4;
  telefono: string;
  numero_documento: string;
}

// Legacy interface - keeping for compatibility
export interface UserLegacy {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other" | "prefer-not-to-say";
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isVerified: boolean;
  role: "customer" | "admin" | "moderator";
}

export interface UserPreferences {
  id: string;
  userId: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisibility: "public" | "private";
    activityTracking: boolean;
    dataCollection: boolean;
  };
  shopping: {
    preferredCategories: string[];
    favoriteShippingAddress?: string;
    preferredPaymentMethod?: string;
    priceRange: {
      min: number;
      max: number;
    };
  };
  display: {
    theme: "light" | "dark" | "auto";
    language: string;
    currency: string;
    timezone: string;
  };
}

export interface UserAddress {
  id: string;
  userId: string;
  type: "home" | "work" | "other";
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserConsumptionPattern {
  userId: string;
  categoryPreferences: Array<{
    category: string;
    frequency: number;
    lastPurchase: string;
    averageSpent: number;
  }>;
  shoppingBehavior: {
    preferredShoppingTimes: string[];
    averageSessionDuration: number;
    averageCartValue: number;
    conversionRate: number;
    abandonmentRate: number;
  };
  seasonalTrends: Array<{
    season: string;
    categories: string[];
    spendingIncrease: number;
  }>;
  loyaltyMetrics: {
    loyaltyScore: number;
    repeatPurchaseRate: number;
    referralCount: number;
    reviewsCount: number;
    averageRating: number;
  };
}

export interface UserSession {
  id: string;
  userId: string;
  sessionStart: string;
  sessionEnd?: string;
  device: {
    type: "desktop" | "mobile" | "tablet";
    os: string;
    browser: string;
  };
  location: {
    country: string;
    city: string;
    ip?: string;
  };
  activities: UserActivity[];
}

export interface UserActivity {
  id: string;
  sessionId: string;
  type:
    | "page_view"
    | "product_view"
    | "search"
    | "add_to_cart"
    | "purchase"
    | "review";
  timestamp: string;
  data: Record<string, unknown>;
  metadata?: {
    source: string;
    campaign?: string;
    referrer?: string;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface Direccion {
  id: string;
  usuario_id: string;
  email: string;
  linea_uno: string;
  codigo_dane: string;
  ciudad: string;
  pais: string;
}
