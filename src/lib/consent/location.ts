/**
 * API de Permisos de Ubicación para IMAGIQ
 *
 * Sistema completo para manejar permisos de geolocalización
 * de forma consistente con el sistema de consentimiento de cookies.
 *
 * @module consent/location
 */

import type { LocationPermissionState } from './types';

/** Key para almacenar permiso de ubicación en localStorage */
const LOCATION_STORAGE_KEY = 'imagiq_location_permission';

/** Key legacy para compatibilidad */
const LEGACY_REJECTED_KEY = 'imagiq_location_rejected';
const LEGACY_LOCATION_KEY = 'imagiq_user_location';

/** Versión actual del sistema de permisos de ubicación */
const LOCATION_VERSION = '1.0';

/**
 * Obtiene el estado de permiso de ubicación desde localStorage
 *
 * @returns Estado de permiso o null si no existe
 *
 * @example
 * ```typescript
 * const permission = getLocationPermission();
 * if (permission?.granted) {
 *   // Solicitar ubicación
 * }
 * ```
 */
export function getLocationPermission(): LocationPermissionState | null {
  if (typeof window === 'undefined') return null;

  try {
    // Intentar obtener del nuevo sistema
    const stored = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as LocationPermissionState;

      // Validar estructura
      if (
        typeof parsed.granted !== 'boolean' ||
        typeof parsed.timestamp !== 'number' ||
        typeof parsed.version !== 'string'
      ) {
        console.warn('[Location Permission] Invalid structure, clearing...');
        clearLocationPermission();
        return null;
      }

      return parsed;
    }

    // Migrar del sistema legacy si existe
    const wasRejected = localStorage.getItem(LEGACY_REJECTED_KEY);
    if (wasRejected) {
      const migrated: LocationPermissionState = {
        granted: false,
        timestamp: Date.now(),
        version: LOCATION_VERSION,
      };
      localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(migrated));
      localStorage.removeItem(LEGACY_REJECTED_KEY);
      return migrated;
    }

    return null;
  } catch (error) {
    console.error('[Location Permission] Error reading permission:', error);
    return null;
  }
}

/**
 * Guarda el permiso de ubicación en localStorage
 *
 * @param granted - Si el usuario otorgó el permiso
 *
 * @example
 * ```typescript
 * // Usuario acepta ubicación
 * saveLocationPermission(true);
 *
 * // Usuario rechaza ubicación
 * saveLocationPermission(false);
 * ```
 */
export function saveLocationPermission(granted: boolean): void {
  if (typeof window === 'undefined') return;

  try {
    const permissionState: LocationPermissionState = {
      granted,
      timestamp: Date.now(),
      version: LOCATION_VERSION,
    };

    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(permissionState));

    // Limpiar keys legacy
    localStorage.removeItem(LEGACY_REJECTED_KEY);

    console.debug('[Location Permission] Saved:', permissionState);

    // Disparar evento personalizado
    window.dispatchEvent(
      new CustomEvent('locationPermissionChange', {
        detail: permissionState,
      })
    );
  } catch (error) {
    console.error('[Location Permission] Error saving permission:', error);
  }
}

/**
 * Verifica si el usuario ha otorgado permiso de ubicación
 *
 * @returns true si el usuario otorgó permiso, false en caso contrario
 *
 * @example
 * ```typescript
 * if (hasLocationPermission()) {
 *   // Solicitar ubicación del navegador
 *   navigator.geolocation.getCurrentPosition(...)
 * }
 * ```
 */
export function hasLocationPermission(): boolean {
  const permission = getLocationPermission();
  return permission?.granted ?? false;
}

/**
 * Verifica si el usuario ya respondió sobre el permiso de ubicación
 *
 * @returns true si el usuario ya decidió (aceptó o rechazó), false si aún no
 *
 * @example
 * ```typescript
 * if (!hasLocationPermissionResponse()) {
 *   // Mostrar banner de ubicación
 * }
 * ```
 */
export function hasLocationPermissionResponse(): boolean {
  return getLocationPermission() !== null;
}

/**
 * Elimina el permiso de ubicación guardado
 *
 * @example
 * ```typescript
 * clearLocationPermission();
 * window.location.reload(); // Mostrar banner nuevamente
 * ```
 */
export function clearLocationPermission(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(LOCATION_STORAGE_KEY);
    localStorage.removeItem(LEGACY_REJECTED_KEY);
    localStorage.removeItem(LEGACY_LOCATION_KEY);

    console.debug('[Location Permission] Cleared');

    // Disparar evento
    window.dispatchEvent(new CustomEvent('locationPermissionCleared'));
  } catch (error) {
    console.error('[Location Permission] Error clearing permission:', error);
  }
}
