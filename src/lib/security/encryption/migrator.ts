/**
 * 🔄 MIGRATION MANAGER - Migración automática de localStorage
 *
 * Migra automáticamente datos del localStorage sin encriptar al formato encriptado.
 * - Detección de datos legacy
 * - Migración transparente
 * - Limpieza en caso de error
 * - Preservación de keys críticas
 *
 * @author Imagiq Security Team
 * @version 1.0.0
 */

import { getSecureStorage } from './secureStorage';

// Keys que se preservan SIEMPRE (incluso en limpieza de emergencia)
const CRITICAL_KEYS = ['app_version'];

// Keys que indican que el sistema ya migró
const MIGRATION_FLAG_KEY = '_migration_completed_v1';

export interface MigrationResult {
  success: boolean;
  migratedKeys: number;
  skippedKeys: number;
  errors: string[];
  forcedCleanup: boolean;
  duration: number; // milliseconds
}

export interface MigrationStats {
  totalKeys: number;
  encryptedKeys: number;
  plainTextKeys: number;
  whitelistKeys: number;
  needsMigration: boolean;
}

/**
 * Analiza el estado actual del localStorage sin modificarlo
 */
export function analyzeMigrationNeeds(): MigrationStats {
  if (typeof window === 'undefined') {
    return {
      totalKeys: 0,
      encryptedKeys: 0,
      plainTextKeys: 0,
      whitelistKeys: 0,
      needsMigration: false,
    };
  }

  try {
    const storage = window.localStorage;
    let totalKeys = 0;
    let encryptedKeys = 0;
    let plainTextKeys = 0;
    let whitelistKeys = 0;

    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (!key) continue;

      totalKeys++;

      // Verificar si es key encriptada (prefijo _enc_)
      if (key.startsWith('_enc_')) {
        encryptedKeys++;
      }
      // Verificar si es whitelist
      else if (CRITICAL_KEYS.includes(key) || key === MIGRATION_FLAG_KEY) {
        whitelistKeys++;
      }
      // Es plain text
      else {
        plainTextKeys++;
      }
    }

    const needsMigration = plainTextKeys > 0;

    return {
      totalKeys,
      encryptedKeys,
      plainTextKeys,
      whitelistKeys,
      needsMigration,
    };
  } catch (error) {
    return {
      totalKeys: 0,
      encryptedKeys: 0,
      plainTextKeys: 0,
      whitelistKeys: 0,
      needsMigration: false,
    };
  }
}

/**
 * Verifica si la migración ya se completó previamente
 */
export function isMigrationCompleted(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const flag = window.localStorage.getItem(MIGRATION_FLAG_KEY);
    return flag === 'true';
  } catch {
    return false;
  }
}

/**
 * Marca la migración como completada
 */
function setMigrationCompleted(): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(MIGRATION_FLAG_KEY, 'true');
  } catch (error) {
    // Ignore errors
  }
}

/**
 * Migra TODO el localStorage al formato encriptado
 */
export function migrateLocalStorage(): MigrationResult {
  const startTime = Date.now();
  const result: MigrationResult = {
    success: false,
    migratedKeys: 0,
    skippedKeys: 0,
    errors: [],
    forcedCleanup: false,
    duration: 0,
  };

  if (typeof window === 'undefined') {
    result.errors.push('No se puede ejecutar migración en servidor');
    result.duration = Date.now() - startTime;
    return result;
  }

  try {
    // Verificar si ya migró
    if (isMigrationCompleted()) {
      result.success = true;
      result.duration = Date.now() - startTime;
      return result;
    }

    // Analizar qué hay que migrar
    const stats = analyzeMigrationNeeds();

    if (!stats.needsMigration) {
      setMigrationCompleted();
      result.success = true;
      result.duration = Date.now() - startTime;
      return result;
    }

    // Obtener SecureStorage
    const secureStorage = getSecureStorage();
    if (!secureStorage) {
      throw new Error('SecureStorage no disponible');
    }

    // Health check antes de migrar
    if (!secureStorage.healthCheck()) {
      throw new Error('SecureStorage health check falló');
    }

    const storage = window.localStorage;
    const keysToMigrate: string[] = [];

    // Recolectar keys a migrar
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (!key) continue;

      // Saltar keys ya encriptadas
      if (key.startsWith('_enc_')) {
        result.skippedKeys++;
        continue;
      }

      // Saltar keys críticas y flag de migración
      if (CRITICAL_KEYS.includes(key) || key === MIGRATION_FLAG_KEY) {
        result.skippedKeys++;
        continue;
      }

      keysToMigrate.push(key);
    }

    // Migrar cada key
    keysToMigrate.forEach((key, index) => {
      try {
        const value = storage.getItem(key);

        if (value === null || value === undefined) {
          result.skippedKeys++;
          return;
        }

        // Validar que el valor no esté corrupto
        if (value === 'undefined' || value === 'null') {
          storage.removeItem(key);
          result.skippedKeys++;
          return;
        }

        // Guardar con encriptación
        secureStorage.setItem(key, value);

        // Eliminar versión sin encriptar
        storage.removeItem(key);

        result.migratedKeys++;
      } catch (error) {
        const errorMsg = `Error migrando key "${key}": ${error instanceof Error ? error.message : 'Unknown error'}`;
        result.errors.push(errorMsg);
      }
    });

    // Verificar si hubo demasiados errores
    const errorRate = result.errors.length / keysToMigrate.length;
    if (errorRate > 0.3) {
      // Más del 30% de errores
      performEmergencyCleanup();
      result.forcedCleanup = true;
      result.success = false;
    } else {
      // Marcar migración como exitosa
      setMigrationCompleted();
      result.success = true;
    }
  } catch (error) {
    const errorMsg = `Error fatal en migración: ${error instanceof Error ? error.message : 'Unknown error'}`;
    result.errors.push(errorMsg);

    // Limpieza de emergencia
    performEmergencyCleanup();
    result.forcedCleanup = true;
    result.success = false;
  }

  result.duration = Date.now() - startTime;

  return result;
}

/**
 * Limpieza de emergencia: limpia TODO excepto keys críticas
 */
export function performEmergencyCleanup(): void {
  if (typeof window === 'undefined') return;

  try {
    const storage = window.localStorage;

    // Guardar valores críticos
    const criticalValues: Record<string, string | null> = {};
    CRITICAL_KEYS.forEach(key => {
      criticalValues[key] = storage.getItem(key);
    });

    // Limpiar TODO
    storage.clear();

    // Restaurar valores críticos
    Object.entries(criticalValues).forEach(([key, value]) => {
      if (value !== null) {
        storage.setItem(key, value);
      }
    });
  } catch (error) {
    // Último recurso: limpiar todo sin preservar nada
    try {
      window.localStorage.clear();
    } catch {
      // No hay nada más que hacer
    }
  }
}

/**
 * Migración automática que se ejecuta al cargar la app
 * Es non-blocking y reporta resultados
 */
export function autoMigrate(): Promise<MigrationResult> {
  return new Promise((resolve) => {
    // Ejecutar en el siguiente tick para no bloquear el render inicial
    setTimeout(() => {
      try {
        const result = migrateLocalStorage();
        resolve(result);
      } catch (error) {
        resolve({
          success: false,
          migratedKeys: 0,
          skippedKeys: 0,
          errors: [error instanceof Error ? error.message : 'Unknown error'],
          forcedCleanup: false,
          duration: 0,
        });
      }
    }, 100);
  });
}

/**
 * Fuerza una re-migración (útil para debugging)
 */
export function forceMigration(): MigrationResult {
  if (typeof window === 'undefined') {
    return {
      success: false,
      migratedKeys: 0,
      skippedKeys: 0,
      errors: ['No se puede ejecutar en servidor'],
      forcedCleanup: false,
      duration: 0,
    };
  }

  // Eliminar flag de migración
  window.localStorage.removeItem(MIGRATION_FLAG_KEY);

  // Ejecutar migración
  return migrateLocalStorage();
}

/**
 * Export de funciones para uso externo
 */
export default {
  analyzeMigrationNeeds,
  isMigrationCompleted,
  migrateLocalStorage,
  performEmergencyCleanup,
  autoMigrate,
  forceMigration,
};
