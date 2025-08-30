/**
 * Context de Autenticación
 * - Provider para el estado global de auth
 * - Persistencia del token en localStorage/cookies
 * - Renovación automática de tokens
 * - Protección de rutas privadas
 * - Integración con PostHog para user identification
 */

"use client";

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
  hasRole: (role: string | string[]) => boolean;
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
        localStorage.removeItem("imagiq_user");
        localStorage.removeItem("imagiq_token");
        setUser(null);
      }
    } else {
      // Si el token no es válido, limpiar sesión
      localStorage.removeItem("imagiq_user");
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
    localStorage.removeItem("imagiq_user");
    localStorage.removeItem("imagiq_token");
    apiClient.removeAuthToken();
  };

  // Role checking utilities
  const hasRole = (roles: string | string[]) => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const isAdmin = () => {
    return hasRole(["admin", "superadmin"]);
  };

  const isSuperAdmin = () => {
    return hasRole("superadmin");
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
