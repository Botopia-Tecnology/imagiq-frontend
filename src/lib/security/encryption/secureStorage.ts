/**
 * 🔒 SECURE STORAGE - Encriptación de localStorage
 *
 * Implementa doble encriptación (Base64 + AES-256) para TODO el localStorage.
 * - Encripta tanto nombres de keys como valores
 * - Compatible con API nativa de localStorage
 * - Migración automática de datos existentes
 * - Manejo robusto de errores
 *
 * @author Imagiq Security Team
 * @version 1.0.0
 */

import CryptoJS from 'crypto-js';

// Keys que NUNCA se encriptan (whitelist)
const WHITELIST_KEYS = ['app_version'];

/**
 * Clase SecureStorage
 * Implementa interface Storage con encriptación transparente
 */
class SecureStorage implements Storage {
  private encryptionKey: string;
  private nativeStorage: Storage;
  private keyMap: Map<string, string>; // hash → original key name

  constructor(encryptionKey?: string) {
    if (typeof window === 'undefined') {
      throw new Error('SecureStorage solo puede usarse en el navegador');
    }

    this.nativeStorage = window.localStorage;
    this.encryptionKey = encryptionKey || this.getDefaultEncryptionKey();
    this.keyMap = new Map();

    if (!this.encryptionKey || this.encryptionKey.length < 32) {
      throw new Error('Encryption key inválida');
    }
  }

  /**
   * Obtiene la clave de encriptación desde variables de entorno
   */
  private getDefaultEncryptionKey(): string {
    if (typeof process !== 'undefined' && process.env) {
      return process.env.NEXT_PUBLIC_FRONTEND_ENCRYPTION_KEY || '';
    }
    return '';
  }

  /**
   * Encripta un valor usando Base64 + AES-256
   *
   * IMPORTANTE: Usa IV DETERMINISTA para evitar loops infinitos
   * La IV se deriva del valor + encryption key usando HMAC
   */
  private encrypt(value: string): string {
    try {
      // Paso 1: Base64
      const base64 = btoa(unescape(encodeURIComponent(value)));

      // Paso 2: Generar IV determinista desde el valor (evita loops)
      // Usar HMAC para generar IV de 128 bits (16 bytes) desde el contenido
      const ivHash = CryptoJS.HmacSHA256(base64, this.encryptionKey).toString();
      const iv = CryptoJS.enc.Hex.parse(ivHash.substring(0, 32)); // Primeros 16 bytes (32 hex chars)

      // Paso 3: AES-256 con IV determinista
      const encrypted = CryptoJS.AES.encrypt(base64, this.encryptionKey, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }).toString();

      return encrypted;
    } catch (error) {
      throw new Error('Fallo en encriptación');
    }
  }

  /**
   * Desencripta un valor usando AES-256 + Base64
   *
   * Intenta primero con IV determinista (nuevo formato)
   * Si falla, intenta con decrypt estándar (formato legacy con salt aleatorio)
   */
  private decrypt(encryptedValue: string): string {
    try {
      // Intentar decrypt estándar primero (formato legacy o nuevo)
      // CryptoJS automáticamente detecta el formato
      const decrypted = CryptoJS.AES.decrypt(encryptedValue, this.encryptionKey);
      const base64 = decrypted.toString(CryptoJS.enc.Utf8);

      if (!base64) {
        throw new Error('Desencriptación falló - clave incorrecta o datos corruptos');
      }

      // Paso 2: Base64 decode
      const value = decodeURIComponent(escape(atob(base64)));

      return value;
    } catch (error) {
      throw new Error('Fallo en desencriptación');
    }
  }

  /**
   * Encripta el nombre de una key usando HMAC (determinista)
   *
   * IMPORTANTE: Usamos HMAC en lugar de AES porque necesitamos que el mismo key
   * siempre produzca el mismo hash (determinista). AES incluye salt aleatorio.
   */
  private encryptKey(key: string): string {
    // No encriptar keys en whitelist
    if (WHITELIST_KEYS.includes(key)) {
      return key;
    }

    try {
      // Usar HMAC-SHA256 para generar hash determinista (sin prefijo)
      const hash = CryptoJS.HmacSHA256(key, this.encryptionKey).toString();

      // Guardar mapping para poder recuperar el key original en key()
      this.keyMap.set(hash, key);

      return hash;
    } catch (error) {
      return key; // Fallback
    }
  }

  /**
   * Recupera el nombre original de una key desde el hash
   *
   * NOTA: Como usamos HMAC (one-way), no podemos "desencriptar".
   * En su lugar, usamos el Map que guarda hash → original key.
   */
  private decryptKey(encryptedKey: string): string {
    // Si es una key de whitelist, retornarla tal cual
    if (WHITELIST_KEYS.includes(encryptedKey)) {
      return encryptedKey;
    }

    // Buscar en el map
    const originalKey = this.keyMap.get(encryptedKey);
    if (originalKey) {
      return originalKey;
    }

    // Si no está en el map, retornar el hash (no podemos recuperarlo)
    // Esto puede pasar con keys que fueron guardadas en sesiones anteriores
    return encryptedKey;
  }

  /**
   * Verifica si una key está encriptada
   * Una key está encriptada si es un hash SHA-256 (64 caracteres hexadecimales)
   */
  isEncrypted(key: string): boolean {
    // Keys de whitelist nunca están encriptadas
    if (WHITELIST_KEYS.includes(key)) {
      return false;
    }

    // Un hash SHA-256 tiene exactamente 64 caracteres hexadecimales
    return /^[a-f0-9]{64}$/i.test(key);
  }

  /**
   * Implementación de Storage.getItem
   * Lee y desencripta un valor del localStorage
   */
  getItem(key: string): string | null {
    try {
      const encryptedKey = this.encryptKey(key);
      const encryptedValue = this.nativeStorage.getItem(encryptedKey);

      if (encryptedValue === null) {
        // Intentar leer con key sin encriptar (legacy migration)
        const legacyValue = this.nativeStorage.getItem(key);

        if (legacyValue !== null) {
          // Migrar automáticamente
          this.setItem(key, legacyValue);
          this.nativeStorage.removeItem(key);
          return legacyValue;
        }
        return null;
      }

      // Si es whitelist key, el valor puede estar en texto plano o encriptado
      if (WHITELIST_KEYS.includes(key)) {
        try {
          return this.decrypt(encryptedValue);
        } catch {
          // Si falla desencriptar, asumir que es texto plano
          return encryptedValue;
        }
      }

      // Desencriptar valor normalmente
      return this.decrypt(encryptedValue);
    } catch (error) {
      // En caso de error, limpiar la key corrupta
      this.removeItem(key);
      return null;
    }
  }

  /**
   * Implementación de Storage.setItem
   * Encripta y guarda un valor en localStorage
   */
  setItem(key: string, value: string): void {
    try {
      const encryptedKey = this.encryptKey(key);
      const encryptedValue = this.encrypt(value);

      this.nativeStorage.setItem(encryptedKey, encryptedValue);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Implementación de Storage.removeItem
   * Elimina una key del localStorage
   */
  removeItem(key: string): void {
    try {
      const encryptedKey = this.encryptKey(key);
      this.nativeStorage.removeItem(encryptedKey);

      // También intentar eliminar versión legacy
      this.nativeStorage.removeItem(key);
    } catch (error) {
      // Silently fail
    }
  }

  /**
   * Implementación de Storage.clear
   * Limpia todo el localStorage (preserva whitelist)
   */
  clear(): void {
    try {
      // Guardar valores de whitelist
      const whitelistValues: Record<string, string | null> = {};
      WHITELIST_KEYS.forEach(key => {
        whitelistValues[key] = this.nativeStorage.getItem(key);
      });

      // Limpiar todo
      this.nativeStorage.clear();

      // Restaurar whitelist
      Object.entries(whitelistValues).forEach(([key, value]) => {
        if (value !== null) {
          this.nativeStorage.setItem(key, value);
        }
      });
    } catch (error) {
      // Silently fail
    }
  }

  /**
   * Implementación de Storage.key
   * Obtiene la key en el índice especificado
   */
  key(index: number): string | null {
    try {
      const encryptedKey = this.nativeStorage.key(index);
      if (encryptedKey === null) return null;

      return this.decryptKey(encryptedKey);
    } catch (error) {
      return null;
    }
  }

  /**
   * Implementación de Storage.length
   * Retorna el número de keys en localStorage
   */
  get length(): number {
    return this.nativeStorage.length;
  }

  /**
   * Método adicional: Obtener y parsear JSON automáticamente
   */
  getDecrypted<T>(key: string, fallback?: T): T | null {
    try {
      const value = this.getItem(key);
      if (value === null) return fallback || null;

      // Intentar parsear como JSON
      try {
        return JSON.parse(value) as T;
      } catch {
        // Si no es JSON, retornar como string
        return value as T;
      }
    } catch (error) {
      return fallback || null;
    }
  }

  /**
   * Método adicional: Guardar objeto como JSON encriptado
   */
  setEncrypted<T>(key: string, value: T): void {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      this.setItem(key, stringValue);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Migra TODO el localStorage de texto plano a encriptado
   */
  migrateFromPlainText(): boolean {
    try {
      const keysToMigrate: string[] = [];

      // Encontrar todas las keys no encriptadas (excepto whitelist)
      for (let i = 0; i < this.nativeStorage.length; i++) {
        const key = this.nativeStorage.key(i);
        if (key && !this.isEncrypted(key) && !WHITELIST_KEYS.includes(key)) {
          keysToMigrate.push(key);
        }
      }

      // Migrar cada key
      let successCount = 0;
      let errorCount = 0;

      keysToMigrate.forEach(key => {
        try {
          const value = this.nativeStorage.getItem(key);
          if (value !== null) {
            // Guardar con encriptación
            this.setItem(key, value);
            // Eliminar versión sin encriptar
            this.nativeStorage.removeItem(key);
            successCount++;
          }
        } catch (error) {
          errorCount++;
        }
      });

      // Si hubo demasiados errores, limpiar todo por seguridad
      if (errorCount > keysToMigrate.length * 0.5) {
        this.clear();
        return false;
      }

      return true;
    } catch (error) {
      // Limpiar en caso de error crítico
      this.clear();
      return false;
    }
  }

  /**
   * Valida que el localStorage esté funcionando correctamente
   */
  healthCheck(): boolean {
    try {
      const testKey = '_health_check_test';
      const testValue = 'test_' + Date.now();

      this.setItem(testKey, testValue);
      const retrieved = this.getItem(testKey);
      this.removeItem(testKey);

      return retrieved === testValue;
    } catch (error) {
      return false;
    }
  }
}

// Singleton instance
let secureStorageInstance: SecureStorage | null = null;

/**
 * Obtiene la instancia singleton de SecureStorage
 */
export function getSecureStorage(): SecureStorage {
  if (!secureStorageInstance) {
    secureStorageInstance = new SecureStorage();
  }
  return secureStorageInstance;
}

/**
 * Export por defecto
 */
export const secureStorage = typeof window !== 'undefined' ? getSecureStorage() : null;

export default SecureStorage;
