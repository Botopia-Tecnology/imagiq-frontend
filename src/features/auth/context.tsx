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

    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);

        // Set token in API client if available
        if (savedToken) {
          apiClient.setAuthToken(savedToken);
        }
      } catch (error) {
        console.error("Error parsing saved user data:", error);
        localStorage.removeItem("imagiq_user");
        localStorage.removeItem("imagiq_token");
      }
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

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
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
