"use client";
/**
 * Context de Autenticación
 * - Provider para el estado global de auth
 * - Persistencia del token en localStorage/cookies
 * - Renovación automática de tokens
 * - Protección de rutas privadas
 * - Integración con PostHog para user identification
 */


import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiClient } from "@/lib/api";
import { User } from "@/types/user";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => Promise<void>;
  logout: () => void;
  hasRole: (role: number | number[]) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("imagiq_user");
    const savedToken = localStorage.getItem("imagiq_token");

    // Validar token: debe existir, no estar vacío, y tener formato JWT (3 partes separadas por punto)
    const isTokenValid =
      savedToken &&
      typeof savedToken === "string" &&
      savedToken.split(".").length === 3;

    if (savedUser && isTokenValid) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        apiClient.setAuthToken(savedToken!);
      } catch (error) {
        console.error("Error parsing saved user data:", error);
        localStorage.removeItem("imagiq_token");
        setUser(null);
      }
    } else {
      // Si el token no es válido, limpiar sesión
      localStorage.removeItem("imagiq_token");
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (userData: User) => {
    setUser(userData);
    localStorage.setItem("imagiq_user", JSON.stringify(userData));

    // Set token in API client if available
    const token = localStorage.getItem("imagiq_token");
    if (token) {
      apiClient.setAuthToken(token);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);

    // Limpiar todo el localStorage EXCEPTO datos críticos que deben persistir
    const VERSION_KEY = "app_version";
    const CONSENT_KEY = "imagiq_consent";
    const LOCATION_PERMISSION_KEY = "imagiq_location_permission";

    const appVersion = localStorage.getItem(VERSION_KEY);
    const userConsent = localStorage.getItem(CONSENT_KEY);
    const locationPermission = localStorage.getItem(LOCATION_PERMISSION_KEY);

    localStorage.clear();

    // Restaurar datos que deben persistir entre sesiones
    if (appVersion) {
      localStorage.setItem(VERSION_KEY, appVersion);
    }
    if (userConsent) {
      localStorage.setItem(CONSENT_KEY, userConsent);
    }
    if (locationPermission) {
      localStorage.setItem(LOCATION_PERMISSION_KEY, locationPermission);
    }

    apiClient.removeAuthToken();

    // Disparar evento para que otros componentes se enteren del cambio
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("localStorageChange"));
  };

  // Role checking utilities
  const hasRole = (roles: number | number[]) => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(Number(user.role));
  };

  const isAdmin = () => {
    return hasRole([1, 4]);
  };

  const isSuperAdmin = () => {
    return hasRole(4);
  };

  /**
   * Solo se considera autenticado si existe usuario y el token es válido
   */
  const savedToken =
    typeof window !== "undefined" ? localStorage.getItem("imagiq_token") : null;
  const isTokenValidBool = !!(
    savedToken &&
    typeof savedToken === "string" &&
    savedToken.split(".").length === 3
  );
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && isTokenValidBool,
    isLoading,
    login,
    logout,
    hasRole,
    isAdmin,
    isSuperAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
