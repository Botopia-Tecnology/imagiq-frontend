/**
 * Safe localStorage utilities
 *
 * Estos helpers previenen errores de JSON.parse cuando localStorage
 * contiene valores inválidos como "undefined", "null", o cadenas corruptas.
 *
 * Fixes IMAGIQ-8: SyntaxError: "undefined" is not valid JSON
 * Fixes IMAGIQ-16: También lee de SecureStorage para usuarios invitados
 */

import { getSecureStorage } from "@/lib/security/encryption/secureStorage";

/**
 * Lee un valor del localStorage de forma segura
 *
 * IMPORTANTE: Primero intenta leer de SecureStorage (datos encriptados),
 * y si no encuentra nada, intenta leer de localStorage plain (legacy).
 * Esto es necesario para soportar usuarios invitados que guardan datos
 * encriptados desde el checkout flow.
 *
 * @param key - Clave del localStorage
 * @param fallback - Valor por defecto si la clave no existe o contiene datos inválidos
 * @returns El valor parseado o el fallback
 *
 * @example
 * ```ts
 * // ✅ Seguro - maneja todos los casos edge y lee de SecureStorage
 * const user = safeGetLocalStorage("imagiq_user", {});
 *
 * // ❌ Inseguro - puede lanzar error si contiene "undefined"
 * const user = JSON.parse(localStorage.getItem("imagiq_user") || "{}");
 * ```
 */
export function safeGetLocalStorage<T>(key: string, fallback: T): T {
  // Solo ejecutar en el cliente (browser)
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    // 1. Primero intentar leer de SecureStorage (datos encriptados)
    // Esto es necesario para usuarios invitados que guardan datos en Step2
    try {
      const secureStorage = getSecureStorage();
      if (secureStorage) {
        const secureValue = secureStorage.getDecrypted<T>(key, undefined as unknown as T);
        if (secureValue !== null && secureValue !== undefined) {
          // Verificar que no sea un objeto vacío si el fallback es un objeto vacío
          if (typeof secureValue === "object" && Object.keys(secureValue as object).length > 0) {
            return secureValue;
          } else if (typeof secureValue !== "object") {
            return secureValue;
          }
        }
      }
    } catch {
      // SecureStorage no disponible o error, continuar con localStorage plain
    }

    // 2. Intentar leer de localStorage plain (legacy)
    const item = localStorage.getItem(key);

    // Casos edge: null, undefined, cadenas vacías o literales inválidos
    if (
      !item ||
      item === "undefined" ||
      item === "null" ||
      item.trim() === ""
    ) {
      return fallback;
    }

    return JSON.parse(item) as T;
  } catch (error) {
    // Si JSON.parse falla, retornar el fallback
    console.error(`[localStorage] Error parsing key "${key}":`, error);
    return fallback;
  }
}

/**
 * Escribe un valor en localStorage de forma segura
 *
 * @param key - Clave del localStorage
 * @param value - Valor a guardar (será serializado a JSON)
 *
 * @example
 * ```ts
 * safeSetLocalStorage("imagiq_user", { id: 123, email: "user@example.com" });
 * ```
 */
export function safeSetLocalStorage<T>(key: string, value: T): void {
  // Solo ejecutar en el cliente (browser)
  if (typeof window === "undefined") {
    return;
  }

  try {
    // Prevenir guardar undefined o null como strings literales
    if (value === undefined || value === null) {
      localStorage.removeItem(key);
      return;
    }

    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`[localStorage] Error setting key "${key}":`, error);
  }
}

/**
 * Remueve un valor del localStorage de forma segura
 *
 * @param key - Clave del localStorage a remover
 *
 * @example
 * ```ts
 * safeRemoveLocalStorage("imagiq_user");
 * ```
 */
export function safeRemoveLocalStorage(key: string): void {
  // Solo ejecutar en el cliente (browser)
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`[localStorage] Error removing key "${key}":`, error);
  }
}
