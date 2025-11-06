import { useState, useEffect, useCallback } from 'react';
import {
  getCurrentLocation,
  getLocationFromStorage,
  isGeolocationSupported,
  getPermissionStatus,
  type GeolocationData,
  type GeolocationError,
} from '@/lib/geolocation';

interface UseGeolocationOptions {
  /**
   * Solicitar ubicación automáticamente al montar el componente
   */
  immediate?: boolean;

  /**
   * Usar ubicación guardada en cache si está disponible
   */
  useCache?: boolean;

  /**
   * Callback cuando se obtiene la ubicación exitosamente
   */
  onSuccess?: (location: GeolocationData) => void;

  /**
   * Callback cuando ocurre un error
   */
  onError?: (error: GeolocationError) => void;
}

interface UseGeolocationReturn {
  location: GeolocationData | null;
  error: GeolocationError | null;
  isLoading: boolean;
  isSupported: boolean;
  permissionStatus: PermissionState | 'unsupported' | null;
  requestLocation: () => Promise<void>;
  clearLocation: () => void;
}

/**
 * Hook personalizado para manejar geolocalización
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { location, requestLocation, isLoading } = useGeolocation({
 *     immediate: true,
 *     onSuccess: (loc) => console.log('Ubicación:', loc)
 *   });
 *
 *   return (
 *     <div>
 *       {isLoading && <p>Obteniendo ubicación...</p>}
 *       {location && <p>Lat: {location.latitude}, Lon: {location.longitude}</p>}
 *       <button onClick={requestLocation}>Actualizar ubicación</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useGeolocation(options: UseGeolocationOptions = {}): UseGeolocationReturn {
  const { immediate = false, useCache = true, onSuccess, onError } = options;

  const [location, setLocation] = useState<GeolocationData | null>(null);
  const [error, setError] = useState<GeolocationError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<PermissionState | 'unsupported' | null>(null);
  const isSupported = isGeolocationSupported();

  // Verificar estado del permiso
  useEffect(() => {
    if (!isSupported) return;

    getPermissionStatus().then(setPermissionStatus);
  }, [isSupported]);

  // Cargar ubicación del cache si está disponible
  useEffect(() => {
    if (useCache && !location) {
      const cached = getLocationFromStorage();
      if (cached) {
        setLocation(cached);
      }
    }
  }, [useCache, location]);

  /**
   * Solicita la ubicación actual del usuario
   */
  const requestLocation = useCallback(async () => {
    if (!isSupported) {
      const notSupportedError: GeolocationError = {
        code: -1,
        message: 'Geolocation is not supported',
        type: 'NOT_SUPPORTED',
      };
      setError(notSupportedError);
      onError?.(notSupportedError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const locationData = await getCurrentLocation();
      setLocation(locationData);
      onSuccess?.(locationData);
    } catch (err) {
      const geolocationError = err as GeolocationError;
      setError(geolocationError);
      onError?.(geolocationError);
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, onSuccess, onError]);

  /**
   * Limpia la ubicación almacenada
   */
  const clearLocation = useCallback(() => {
    setLocation(null);
    setError(null);
    localStorage.removeItem('imagiq_user_location');
  }, []);

  // Solicitar ubicación automáticamente si immediate = true
  useEffect(() => {
    if (immediate && !location && !isLoading) {
      requestLocation();
    }
  }, [immediate, location, isLoading, requestLocation]);

  return {
    location,
    error,
    isLoading,
    isSupported,
    permissionStatus,
    requestLocation,
    clearLocation,
  };
}
