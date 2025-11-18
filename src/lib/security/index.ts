/**
 * 🔐 SECURITY MODULE - Módulo principal de seguridad
 *
 * Este módulo sobrescribe el localStorage nativo con SecureStorage
 * para que TODA la aplicación use encriptación automáticamente.
 *
 * IMPORTANTE: Este archivo debe importarse en el layout principal
 * ANTES de cualquier otro código que use localStorage.
 *
 * @author Imagiq Security Team
 * @version 1.0.0
 */

import { getSecureStorage } from './encryption/secureStorage';

// Export de todos los módulos
export * from './encryption/secureStorage';
export * from './encryption/keyManagement';
export * from './encryption/migrator';
export * from './devtools/detector';
export * from './devtools/blocker';
export * from './devtools/protection';

/**
 * Inicializa el sistema de seguridad
 * - Sobrescribe localStorage con SecureStorage (solo si NEXT_PUBLIC_ENABLE_DEVTOOLS_PROTECTION=true)
 * - Prepara el sistema para protección de DevTools
 */
export function initializeSecurity(): void {
  if (typeof window === 'undefined') {
    return;
  }

  // PREVENIR múltiples inicializaciones
  if ((window as Window & { __IMAGIQ_SECURITY_INITIALIZED__?: boolean }).__IMAGIQ_SECURITY_INITIALIZED__) {
    return;
  }

  // Verificar si la protección está habilitada
  const isProtectionEnabled = process.env.NEXT_PUBLIC_ENABLE_DEVTOOLS_PROTECTION !== 'false';

  if (!isProtectionEnabled) {
    // Marcar como inicializado para no reintentar
    (window as Window & { __IMAGIQ_SECURITY_INITIALIZED__?: boolean }).__IMAGIQ_SECURITY_INITIALIZED__ = true;
    return;
  }

  try {
    // Obtener instancia de SecureStorage
    const secureStorage = getSecureStorage();

    if (!secureStorage) {
      return;
    }

    // Verificar que está funcionando correctamente
    if (!secureStorage.healthCheck()) {
      return;
    }

    // ⚠️ CRÍTICO: Sobrescribir localStorage ANTES de que cualquier código lo use
    // Usar Object.defineProperty con configurable: true para permitir redefinición
    Object.defineProperty(window, 'localStorage', {
      value: secureStorage,
      writable: false,
      configurable: true, // ✅ Permitir que se redefina (importante para HMR en dev)
      enumerable: true,
    });

    // Marcar como inicializado
    (window as Window & { __IMAGIQ_SECURITY_INITIALIZED__?: boolean }).__IMAGIQ_SECURITY_INITIALIZED__ = true;
  } catch (error) {
    // NO lanzar error para no romper la aplicación
    // En caso de fallo, seguir usando localStorage nativo
  }
}

// ⚡ EJECUCIÓN INMEDIATA: Inicializar TAN PRONTO como se carga este módulo
// Esto garantiza que localStorage esté sobrescrito ANTES de que cualquier otro código se ejecute
if (typeof window !== 'undefined') {
  // Ejecutar SÍNCRONAMENTE (no en nextTick, no en setTimeout)
  initializeSecurity();
}

/**
 * Export default del módulo
 */
export default {
  initializeSecurity,
};
