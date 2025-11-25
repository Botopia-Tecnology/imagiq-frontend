/**
 * 🔄 VERSION MANAGER
 *
 * Gestiona la versión de la aplicación y limpia el localStorage
 * cuando detecta una nueva versión en producción.
 */

import { APP_VERSION } from "@/config/version";

const VERSION_KEY = "app_version";

/**
 * Verifica la versión actual y limpia el localStorage si ha cambiado
 * @returns true si se limpió el localStorage, false si no hubo cambios
 */
export function checkAndUpdateVersion(): boolean {
  if (typeof window === "undefined") {
    return false; // No ejecutar en servidor
  }

  try {
    const storedVersion = localStorage.getItem(VERSION_KEY);

    // Si no hay versión guardada o es diferente a la actual
    if (storedVersion !== APP_VERSION) {
      // Limpiar todo el localStorage excepto la versión
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key !== VERSION_KEY) {
          keysToRemove.push(key);
        }
      }

      // Remover las claves identificadas
      keysToRemove.forEach((key) => localStorage.removeItem(key));

      // Guardar la nueva versión
      localStorage.setItem(VERSION_KEY, APP_VERSION);

      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Obtiene la versión actual de la aplicación
 */
export function getCurrentVersion(): string {
  return APP_VERSION;
}

/**
 * Obtiene la versión almacenada en localStorage
 */
export function getStoredVersion(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(VERSION_KEY);
}
