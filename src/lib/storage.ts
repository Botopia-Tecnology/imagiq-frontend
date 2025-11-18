/**
 * 🔐 STORAGE HELPERS
 *
 * Helpers para acceder a localStorage de forma segura.
 * SIEMPRE usan window.localStorage (que está sobrescrito por SecureStorage)
 *
 * IMPORTANTE: TODO el código debe usar estos helpers en lugar de localStorage directamente
 */

/**
 * Obtiene un valor del localStorage encriptado
 */
export function getStorageItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(key);
}

/**
 * Guarda un valor en el localStorage encriptado
 */
export function setStorageItem(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, value);
}

/**
 * Elimina un valor del localStorage
 */
export function removeStorageItem(key: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(key);
}

/**
 * Limpia todo el localStorage
 */
export function clearStorage(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.clear();
}

/**
 * Obtiene la cantidad de items en localStorage
 */
export function getStorageLength(): number {
  if (typeof window === 'undefined') return 0;
  return window.localStorage.length;
}

/**
 * Obtiene una key por índice
 */
export function getStorageKey(index: number): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.key(index);
}
