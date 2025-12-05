"use client";
import React, { useState } from "react";
import { getCurrentLocation, GeolocationError } from "@/lib/geolocation";
import type { Address } from "@/types/address";
import { syncAddress } from "@/lib/addressSync";
import { useAuthContext } from "@/features/auth/context";
import { apiPost } from "@/lib/api-client";
import { safeGetLocalStorage } from "@/lib/localStorage";

interface NearbyLocationButtonProps {
  onAddressAdded?: (address: Address) => void;
  className?: string;
}

/**
 * Componente que permite a usuarios no logueados obtener su ubicación actual
 * y guardarla como dirección predeterminada usando geolocalización y reverse geocoding.
 */
export function NearbyLocationButton({ onAddressAdded, className }: NearbyLocationButtonProps) {
  const { user, login } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtiene el ID del usuario usando la MISMA lógica que addressesService
   * para garantizar consistencia entre creación manual y "Cerca de mí"
   *
   * Si no existe usuario en imagiq_user, genera un guest ID temporal
   */
  const getUserId = (): string => {
    if (user?.id) {
      console.log("✅ Cerca de mí: Usando user.id del context:", user.id);
      return user.id;
    }

    // Usuario no logueado: usar la MISMA lógica que addressesService
    // Obtener del localStorage imagiq_user (creado en Step2)
    const userInfo = safeGetLocalStorage<{ id?: string; email?: string }>("imagiq_user", {});

    if (userInfo.id) {
      console.log("✅ Cerca de mí: Usando userInfo.id desde imagiq_user:", userInfo.id);
      return userInfo.id;
    }

    if (userInfo.email) {
      console.log("✅ Cerca de mí: Usando userInfo.email desde imagiq_user:", userInfo.email);
      return userInfo.email;
    }

    // Si no hay usuario en imagiq_user, generar un guest ID temporal
    // Este ID se usará hasta que el usuario complete Step 2
    let guestId = localStorage.getItem("imagiq_guest_id");
    if (!guestId) {
      guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem("imagiq_guest_id", guestId);
      console.log("🆕 Cerca de mí: Nuevo guest ID generado:", guestId);
    } else {
      console.log("✅ Cerca de mí: Usando guest ID existente:", guestId);
    }

    return guestId;
  };

  /**
   * Maneja el click en "Cerca de mí"
   * OPTIMIZADO: Una sola petición al backend que hace geocoding + creación de dirección
   */
  const handleNearbyClick = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Obtener ubicación del usuario
      console.log("📍 Obteniendo ubicación del usuario...");
      const location = await getCurrentLocation();
      console.log("✅ Ubicación obtenida:", { lat: location.latitude, lng: location.longitude });

      // 2. Obtener ID del usuario (logueado o guest)
      const userId = getUserId();

      // 3. Crear dirección con geolocalización (TODO en una sola petición)
      console.log("🚀 Creando dirección con geolocalización...");
      const data = await apiPost<{ success: boolean; data: Address; error?: string; message?: string }>(
        "/api/addresses/create-from-geolocation",
        {
          latitude: location.latitude,
          longitude: location.longitude,
          usuarioId: userId,
          tipoDireccion: "casa",
          esPredeterminada: true,
        }
      );

      console.log("📦 Respuesta del servidor:", data);

      if (!data.success) {
        console.error("❌ Error al crear dirección:", data.error, data.message);
        throw new Error(data.message || "No se pudo crear la dirección");
      }

      const newAddress = data.data;
      console.log("✅ Dirección creada:", newAddress);

      // 4. Sincronizar con el estado global y localStorage
      await syncAddress({
        address: newAddress,
        userEmail: user?.email,
        user: user || undefined,
        loginFn: login,
        fromHeader: false,
      });

      // 5. Notificar al componente padre
      if (onAddressAdded) {
        onAddressAdded(newAddress);
      }

      console.log("✅ Dirección agregada correctamente");
    } catch (err) {
      console.error("❌ Error al obtener ubicación:", err);

      // Manejar errores específicos de geolocalización
      if ((err as GeolocationError).type) {
        const geoError = err as GeolocationError;
        switch (geoError.type) {
          case "PERMISSION_DENIED":
            setError("Necesitamos permiso para acceder a tu ubicación. Por favor, habilita la geolocalización en tu navegador.");
            break;
          case "POSITION_UNAVAILABLE":
            setError("No pudimos obtener tu ubicación. Por favor, verifica que tu dispositivo tenga GPS habilitado.");
            break;
          case "TIMEOUT":
            setError("La solicitud de ubicación tardó demasiado. Por favor, intenta de nuevo.");
            break;
          case "NOT_SUPPORTED":
            setError("Tu navegador no soporta geolocalización. Por favor, ingresa tu dirección manualmente.");
            break;
          default:
            setError("No pudimos obtener tu ubicación. Por favor, intenta de nuevo.");
        }
      } else {
        setError(err instanceof Error ? err.message : "Error al obtener ubicación");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleNearbyClick}
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#222] hover:bg-[#333] text-white rounded-lg text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${className || ""}`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span>Verificando tu tienda más cercana...</span>
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="10" r="3" />
              <path d="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8z" />
            </svg>
            <span>Cerca de mí</span>
          </>
        )}
      </button>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}
