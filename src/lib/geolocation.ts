/**
 * Geolocation Service
 *
 * Funcionalidades:
 * - Obtiene ubicación del usuario con máxima precisión
 * - Guarda en localStorage y opcionalmente en backend
 * - Maneja permisos y errores
 * - Cachea resultados para evitar solicitudes repetidas
 */

export interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number; // Precisión en metros
  timestamp: number;
  // Datos opcionales adicionales
  altitude?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null; // Dirección en grados
  speed?: number | null; // Velocidad en m/s
}

export interface GeolocationError {
  code: number;
  message: string;
  type: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'NOT_SUPPORTED';
}

// Configuración para máxima precisión
const HIGH_ACCURACY_OPTIONS: PositionOptions = {
  enableHighAccuracy: true, // Usa GPS si está disponible
  timeout: 10000, // 10 segundos máximo
  maximumAge: 0, // No usar cache del navegador
};

// Configuración balanceada (más rápida)
const BALANCED_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 300000, // Cache de 5 minutos
};

// Keys para localStorage
const STORAGE_KEYS = {
  LOCATION: 'imagiq_user_location',
  PERMISSION_STATUS: 'imagiq_location_permission',
  LAST_REQUEST: 'imagiq_location_last_request',
};

/**
 * Verifica si la API de geolocalización está disponible
 */
export function isGeolocationSupported(): boolean {
  return 'geolocation' in navigator;
}

/**
 * Obtiene el estado del permiso de geolocalización
 */
export async function getPermissionStatus(): Promise<PermissionState | 'unsupported'> {
  if (!('permissions' in navigator)) {
    return 'unsupported';
  }

  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    return result.state;
  } catch {
    return 'unsupported';
  }
}

/**
 * Convierte GeolocationPosition a nuestro formato
 */
function mapPositionToData(position: GeolocationPosition): GeolocationData {
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
    timestamp: position.timestamp,
    altitude: position.coords.altitude,
    altitudeAccuracy: position.coords.altitudeAccuracy,
    heading: position.coords.heading,
    speed: position.coords.speed,
  };
}

/**
 * Convierte GeolocationPositionError a nuestro formato
 */
function mapPositionError(error: GeolocationPositionError): GeolocationError {
  const errorTypes = {
    1: 'PERMISSION_DENIED' as const,
    2: 'POSITION_UNAVAILABLE' as const,
    3: 'TIMEOUT' as const,
  };

  return {
    code: error.code,
    message: error.message,
    type: errorTypes[error.code as 1 | 2 | 3] || 'POSITION_UNAVAILABLE',
  };
}

/**
 * Guarda la ubicación en localStorage
 */
export function saveLocationToStorage(location: GeolocationData): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LOCATION, JSON.stringify(location));
    localStorage.setItem(STORAGE_KEYS.LAST_REQUEST, Date.now().toString());
  } catch (error) {
    console.error('Error saving location to localStorage:', error);
  }
}

/**
 * Obtiene la ubicación guardada en localStorage
 */
export function getLocationFromStorage(): GeolocationData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LOCATION);
    if (!stored) return null;

    const location: GeolocationData = JSON.parse(stored);

    // Verificar si la ubicación es reciente (menos de 1 hora)
    const ONE_HOUR = 60 * 60 * 1000;
    if (Date.now() - location.timestamp > ONE_HOUR) {
      return null; // Ubicación muy antigua
    }

    return location;
  } catch (error) {
    console.error('Error reading location from localStorage:', error);
    return null;
  }
}

/**
 * Limpia los datos de ubicación almacenados
 */
export function clearStoredLocation(): void {
  localStorage.removeItem(STORAGE_KEYS.LOCATION);
  localStorage.removeItem(STORAGE_KEYS.LAST_REQUEST);
}

/**
 * Obtiene la ubicación actual del usuario con máxima precisión
 *
 * @param options Opciones de configuración (por defecto: alta precisión)
 * @returns Promise con la ubicación o error
 */
export function getCurrentLocation(
  options: PositionOptions = HIGH_ACCURACY_OPTIONS
): Promise<GeolocationData> {
  return new Promise((resolve, reject) => {
    if (!isGeolocationSupported()) {
      reject({
        code: -1,
        message: 'Geolocation is not supported by this browser',
        type: 'NOT_SUPPORTED',
      } as GeolocationError);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const data = mapPositionToData(position);
        saveLocationToStorage(data);
        resolve(data);
      },
      (error) => {
        reject(mapPositionError(error));
      },
      options
    );
  });
}

/**
 * Observa cambios en la ubicación del usuario en tiempo real
 *
 * @param callback Función que se ejecuta cada vez que la ubicación cambia
 * @param options Opciones de configuración
 * @returns ID del watcher para poder detenerlo después
 */
export function watchLocation(
  callback: (location: GeolocationData) => void,
  onError?: (error: GeolocationError) => void,
  options: PositionOptions = BALANCED_OPTIONS
): number | null {
  if (!isGeolocationSupported()) {
    return null;
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      const data = mapPositionToData(position);
      saveLocationToStorage(data);
      callback(data);
    },
    (error) => {
      if (onError) {
        onError(mapPositionError(error));
      }
    },
    options
  );
}

/**
 * Detiene el seguimiento de ubicación
 */
export function stopWatchingLocation(watchId: number): void {
  if (isGeolocationSupported()) {
    navigator.geolocation.clearWatch(watchId);
  }
}

/**
 * Calcula la distancia entre dos puntos (en kilómetros)
 * Usa la fórmula de Haversine
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Formatea la precisión para mostrar al usuario
 */
export function formatAccuracy(accuracy: number): string {
  if (accuracy < 50) return 'Muy precisa';
  if (accuracy < 100) return 'Precisa';
  if (accuracy < 500) return 'Moderada';
  return 'Aproximada';
}
