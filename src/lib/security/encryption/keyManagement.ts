/**
 * 🔑 KEY MANAGEMENT - Gestión de claves de encriptación
 *
 * Gestiona las claves de encriptación para SecureStorage.
 * - Derivación de keys desde master key
 * - Generación de salt único por usuario
 * - Rotación de keys (futuro)
 *
 * @author Imagiq Security Team
 * @version 1.0.0
 */

import CryptoJS from 'crypto-js';

// Key para guardar el salt en localStorage (NO encriptada, es pública)
const SALT_STORAGE_KEY = '_security_salt';

/**
 * Obtiene la clave maestra desde variables de entorno
 */
export function getMasterEncryptionKey(): string {
  if (typeof process !== 'undefined' && process.env) {
    const key = process.env.NEXT_PUBLIC_FRONTEND_ENCRYPTION_KEY;

    if (!key) {
      throw new Error('Master encryption key no encontrada');
    }

    if (key.length < 32) {
      throw new Error('Master encryption key demasiado corta');
    }

    return key;
  }

  throw new Error('Variables de entorno no disponibles');
}

/**
 * Genera un salt único para el usuario actual
 * El salt se guarda en localStorage sin encriptar (es público)
 */
export function generateUserSalt(): string {
  if (typeof window === 'undefined') {
    throw new Error('generateUserSalt solo puede usarse en el navegador');
  }

  try {
    // Intentar obtener salt existente
    const existingSalt = window.localStorage.getItem(SALT_STORAGE_KEY);
    if (existingSalt) {
      return existingSalt;
    }

    // Generar nuevo salt usando datos únicos del navegador
    const randomBytes = CryptoJS.lib.WordArray.random(16); // 128 bits
    const timestamp = Date.now().toString();
    const userAgent = navigator.userAgent;
    const screenInfo = `${screen.width}x${screen.height}x${screen.colorDepth}`;

    // Combinar todo y hashear
    const combined = `${randomBytes.toString()}${timestamp}${userAgent}${screenInfo}`;
    const salt = CryptoJS.SHA256(combined).toString();

    // Guardar salt (sin encriptar, es público)
    window.localStorage.setItem(SALT_STORAGE_KEY, salt);

    return salt;
  } catch (error) {
    // Fallback: salt basado solo en timestamp
    const fallbackSalt = CryptoJS.SHA256(Date.now().toString()).toString();
    return fallbackSalt;
  }
}

/**
 * Obtiene el salt del usuario actual
 * Si no existe, lo genera
 */
export function getUserSalt(): string {
  return generateUserSalt();
}

/**
 * Deriva una clave de encriptación desde la master key y el salt del usuario
 * Esto permite tener keys únicas por usuario sin almacenarlas
 */
export function deriveEncryptionKey(masterKey: string, salt: string): string {
  try {
    // Usar PBKDF2 para derivar una key robusta
    const derived = CryptoJS.PBKDF2(masterKey, salt, {
      keySize: 256 / 32, // 256 bits = 8 words de 32 bits
      iterations: 1000, // Número de iteraciones (balance seguridad/performance)
    });

    return derived.toString();
  } catch (error) {
    // Fallback: usar master key directamente
    return masterKey;
  }
}

/**
 * Obtiene la clave de encriptación final para usar en SecureStorage
 * Combina master key + salt del usuario
 */
export function getFinalEncryptionKey(): string {
  try {
    const masterKey = getMasterEncryptionKey();
    const userSalt = getUserSalt();
    return deriveEncryptionKey(masterKey, userSalt);
  } catch (error) {
    // Fallback: solo master key
    return getMasterEncryptionKey();
  }
}

/**
 * Limpia el salt del usuario (útil para logout completo)
 */
export function clearUserSalt(): void {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(SALT_STORAGE_KEY);
    } catch (error) {
      // Ignore errors
    }
  }
}

/**
 * Rotación de keys (FUTURO)
 * Permite cambiar la master key sin perder datos
 */
export interface KeyRotationResult {
  success: boolean;
  keysRotated: number;
  errors: string[];
}

export function rotateEncryptionKey(
  oldMasterKey: string,
  newMasterKey: string
): KeyRotationResult {
  return {
    success: false,
    keysRotated: 0,
    errors: ['Función no implementada'],
  };
}

/**
 * Valida que una encryption key sea válida
 */
export function validateEncryptionKey(key: string): boolean {
  if (!key || typeof key !== 'string') {
    return false;
  }

  // Mínimo 32 caracteres (256 bits hex)
  if (key.length < 32) {
    return false;
  }

  // Debe contener variedad de caracteres (no puede ser '0000...')
  const uniqueChars = new Set(key.split(''));
  if (uniqueChars.size < 10) {
    return false;
  }

  return true;
}

/**
 * Obtiene metadata de la configuración de seguridad actual
 */
export function getSecurityMetadata() {
  try {
    const masterKey = getMasterEncryptionKey();
    const hasSalt = !!getUserSalt();

    return {
      masterKeyConfigured: true,
      masterKeyLength: masterKey.length,
      masterKeyValid: validateEncryptionKey(masterKey),
      userSaltGenerated: hasSalt,
      derivationMethod: 'PBKDF2',
      iterations: 1000,
      keySize: 256,
    };
  } catch (error) {
    return {
      masterKeyConfigured: false,
      masterKeyLength: 0,
      masterKeyValid: false,
      userSaltGenerated: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
