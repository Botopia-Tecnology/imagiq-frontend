/**
 * 🛡️ DEVTOOLS PROTECTION - Protección integrada contra DevTools
 *
 * Coordina el detector y bloqueador de DevTools.
 * Acciones al detectar DevTools abierto:
 * - Modo Agresivo: Limpiar storage + redirigir
 * - Modo Moderado: Warning + limpieza selectiva
 * - Modo Pasivo: Solo warning
 *
 * @author Imagiq Security Team
 * @version 1.0.0
 */

import { startDevToolsDetection, stopDevToolsDetection } from './detector';
import { enableDevToolsBlocking, disableDevToolsBlocking } from './blocker';
import { performEmergencyCleanup } from '../encryption/migrator';
import Swal from 'sweetalert2';

export type ProtectionMode = 'aggressive' | 'moderate' | 'passive' | 'disabled';

export interface ProtectionConfig {
  mode?: ProtectionMode; // Modo de protección (default: 'aggressive')
  clearStorage?: boolean; // Limpiar localStorage al detectar (default: true)
  clearSessionStorage?: boolean; // Limpiar sessionStorage (default: true)
  redirectTo?: string; // URL a redirigir (default: '/login')
  reloadPage?: boolean; // Recargar página (default: false)
  showModal?: boolean; // Mostrar modal de advertencia (default: true)
  modalTitle?: string; // Título del modal
  modalMessage?: string; // Mensaje del modal
  debug?: boolean; // Modo debug (default: false)
  detectorInterval?: number; // Intervalo del detector en ms (default: 1000)
}

const DEFAULT_CONFIG: Required<ProtectionConfig> = {
  mode: 'aggressive',
  clearStorage: true,
  clearSessionStorage: true,
  redirectTo: '/login',
  reloadPage: false,
  showModal: true,
  modalTitle: '⚠️ Advertencia de Seguridad',
  modalMessage:
    'Se ha detectado el uso de herramientas de desarrollo. Por seguridad, su sesión será cerrada y será redirigido a la página de inicio.',
  debug: false,
  detectorInterval: 1000,
};

let protectionActive = false;
let currentMode: ProtectionMode = 'disabled';
let stopDetector: (() => void) | null = null;
let stopBlocker: (() => void) | null = null;

/**
 * Maneja la detección de DevTools abierto
 */
function handleDevToolsDetected(config: Required<ProtectionConfig>): void {
  switch (config.mode) {
    case 'aggressive':
      handleAggressiveMode(config);
      break;

    case 'moderate':
      handleModerateMode(config);
      break;

    case 'passive':
      handlePassiveMode(config);
      break;

    case 'disabled':
      // No hacer nada
      break;
  }
}

/**
 * Modo Agresivo: Limpiar todo y redirigir
 */
async function handleAggressiveMode(config: Required<ProtectionConfig>): Promise<void> {
  // Mostrar modal primero (si está habilitado)
  if (config.showModal) {
    await showWarningModal(config.modalTitle, config.modalMessage);
  }

  // Limpiar storages
  if (config.clearStorage) {
    performEmergencyCleanup();
  }

  if (config.clearSessionStorage) {
    try {
      sessionStorage.clear();
    } catch (error) {
      // Ignore errors
    }
  }

  // Redirigir o recargar
  if (config.reloadPage) {
    window.location.reload();
  } else if (config.redirectTo) {
    window.location.href = config.redirectTo;
  }
}

/**
 * Modo Moderado: Warning + limpieza selectiva
 */
async function handleModerateMode(config: Required<ProtectionConfig>): Promise<void> {
  // Mostrar modal de warning
  if (config.showModal) {
    const result = await Swal.fire({
      title: config.modalTitle,
      html: `
        <p>${config.modalMessage}</p>
        <p class="text-sm text-gray-600 mt-4">
          Por favor, cierre las herramientas de desarrollo para continuar navegando con seguridad.
        </p>
      `,
      icon: 'warning',
      confirmButtonText: 'Entendido',
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded',
      },
    });

    if (result.isConfirmed) {
      // Solo limpiar datos sensibles, no todo
      if (config.clearStorage) {
        clearSensitiveData();
      }
    }
  }
}

/**
 * Modo Pasivo: Solo warning educativo
 */
async function handlePassiveMode(config: Required<ProtectionConfig>): Promise<void> {
  if (config.showModal) {
    Swal.fire({
      title: 'ℹ️ Información',
      html: `
        <p>Hemos detectado que las herramientas de desarrollo están abiertas.</p>
        <p class="text-sm text-gray-600 mt-4">
          Por favor, tenga en cuenta que modificar datos en el navegador puede causar
          errores en la aplicación y comprometer la seguridad de su cuenta.
        </p>
      `,
      icon: 'info',
      confirmButtonText: 'Entendido',
      timer: 5000,
      timerProgressBar: true,
      customClass: {
        confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded',
      },
    });
  }
}

/**
 * Muestra modal de advertencia
 */
async function showWarningModal(title: string, message: string): Promise<void> {
  await Swal.fire({
    title,
    text: message,
    icon: 'error',
    confirmButtonText: 'OK',
    allowOutsideClick: false,
    allowEscapeKey: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      confirmButton: 'bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded',
    },
  });
}

/**
 * Limpia solo datos sensibles del localStorage
 * (usado en modo moderado)
 */
function clearSensitiveData(): void {
  if (typeof window === 'undefined') return;

  const sensitiveKeys = [
    'imagiq_token',
    'imagiq_user',
    'checkout-card-data',
    'checkout-payment-method',
    'checkout-saved-card-id',
  ];

  sensitiveKeys.forEach(key => {
    try {
      localStorage.removeItem(key);
      // También intentar con prefijo encriptado
      const encryptedKey = `_enc_${key}`;
      localStorage.removeItem(encryptedKey);
    } catch (error) {
      // Ignore errors
    }
  });
}

/**
 * Inicializa la protección de DevTools
 */
export function initDevToolsProtection(config: ProtectionConfig = {}): () => void {
  if (typeof window === 'undefined') {
    return () => { };
  }

  if (protectionActive) {
    return stopDevToolsProtection;
  }

  // Merge con configuración por defecto
  const finalConfig: Required<ProtectionConfig> = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  currentMode = finalConfig.mode;

  // Si está deshabilitado, no hacer nada
  if (currentMode === 'disabled') {
    return () => { };
  }

  // Activar bloqueador (en todos los modos excepto disabled)
  stopBlocker = enableDevToolsBlocking({
    blockRightClick: true,
    blockTextSelection: finalConfig.mode === 'aggressive',
    blockCopy: false, // No bloquear copy para no molestar al usuario
    blockViewSource: true,
    showWarning: finalConfig.mode === 'passive',
    debug: finalConfig.debug,
  });

  // Activar detector (solo en modo aggressive y moderate)
  if (finalConfig.mode === 'aggressive' || finalConfig.mode === 'moderate') {
    stopDetector = startDevToolsDetection({
      interval: finalConfig.detectorInterval,
      onDetected: () => handleDevToolsDetected(finalConfig),
      debug: finalConfig.debug,
    });
  }

  protectionActive = true;

  // Retornar función para detener
  return stopDevToolsProtection;
}

/**
 * Detiene la protección de DevTools
 */
export function stopDevToolsProtection(): void {
  if (!protectionActive) {
    return;
  }

  // Detener detector
  if (stopDetector) {
    stopDetector();
    stopDetector = null;
  }

  // Detener bloqueador
  if (stopBlocker) {
    stopBlocker();
    stopBlocker = null;
  }

  protectionActive = false;
  currentMode = 'disabled';
}

/**
 * Verifica si la protección está activa
 */
export function isProtectionActive(): boolean {
  return protectionActive;
}

/**
 * Obtiene el modo actual de protección
 */
export function getCurrentMode(): ProtectionMode {
  return currentMode;
}

/**
 * Cambia el modo de protección sin reiniciar
 */
export function setProtectionMode(mode: ProtectionMode, config?: ProtectionConfig): void {
  if (mode === currentMode) {
    return;
  }

  // Detener protección actual
  stopDevToolsProtection();

  // Iniciar con nuevo modo
  if (mode !== 'disabled') {
    initDevToolsProtection({ ...config, mode });
  }
}

/**
 * Export por defecto
 */
export default {
  initDevToolsProtection,
  stopDevToolsProtection,
  isProtectionActive,
  getCurrentMode,
  setProtectionMode,
};
