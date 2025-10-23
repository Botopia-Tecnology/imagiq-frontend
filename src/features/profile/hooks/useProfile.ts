/**
 * @module useProfile
 * @description Hook simplificado para perfil usando datos del AuthContext
 */

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/features/auth/context";
import { ProfileState, ProfileUser, DBAddress, DBCard } from "../types";
import { profileService, ProfileResponse } from "@/services/profile.service";

interface UseProfileReturn {
  state: ProfileState;
  actions: {
    loadProfile: () => Promise<void>;
    refreshData: () => Promise<void>;
    logout: () => Promise<void>;
  };
  isLoading: boolean;
}

/**
 * Hook principal de perfil - simplificado
 */
export const useProfile = (): UseProfileReturn => {
  const authContext = useAuthContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);

  // Cargar perfil completo desde la DB
  const loadProfile = useCallback(async () => {
    if (!authContext.user?.id) {
      setError("Usuario no autenticado");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const profileData: ProfileResponse = await profileService.getUserProfile(authContext.user.id);

      // Parsear direcciones y tarjetas si vienen como strings
      let direcciones: DBAddress[] = [];
      let tarjetas: DBCard[] = [];

      if (typeof profileData.direcciones === "string") {
        try {
          direcciones = JSON.parse(profileData.direcciones);
        } catch {
          direcciones = [];
        }
      } else if (Array.isArray(profileData.direcciones)) {
        direcciones = profileData.direcciones;
      }

      if (typeof profileData.tarjetas === "string") {
        try {
          tarjetas = JSON.parse(profileData.tarjetas);
        } catch {
          tarjetas = [];
        }
      } else if (Array.isArray(profileData.tarjetas)) {
        tarjetas = profileData.tarjetas;
      }

      // Crear usuario de perfil con datos parseados
      const user: ProfileUser = {
        id: profileData.id,
        nombre: profileData.nombre,
        apellido: profileData.apellido,
        email: profileData.email,
        telefono: profileData.telefono,
        numero_documento: profileData.numero_documento,
        direcciones,
        tarjetas,
      };

      setProfileUser(user);
    } catch (err) {
      console.error("Error cargando perfil:", err);
      const errorMessage = err instanceof Error ? err.message : "Error al cargar perfil";
      setError(errorMessage);

      // Si es error de autenticación (token expirado), hacer logout y redirigir
      if (
        errorMessage.includes("401") ||
        errorMessage.includes("403") ||
        errorMessage.includes("Unauthorized") ||
        errorMessage.includes("No se encontró el ID del usuario") ||
        errorMessage.toLowerCase().includes("token")
      ) {
        console.log("🔒 Token expirado o inválido, cerrando sesión y redirigiendo al login...");
        authContext.logout();
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [authContext, router]);

  // Refrescar datos
  const refreshData = useCallback(async () => {
    await loadProfile();
  }, [loadProfile]);

  // Logout
  const logout = useCallback(async () => {
    authContext.logout();
    setProfileUser(null);
    router.push("/login");
  }, [authContext, router]);

  // Cargar perfil al montar si hay usuario autenticado
  useEffect(() => {
    if (authContext.user && !profileUser) {
      loadProfile();
    }
  }, [authContext.user, profileUser, loadProfile]);

  // Estado del perfil
  const profileState: ProfileState = {
    user: profileUser,
    loading,
    error,
  };

  return {
    state: profileState,
    actions: {
      loadProfile,
      refreshData,
      logout,
    },
    isLoading: loading,
  };
};
