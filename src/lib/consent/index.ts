/**
 * API de Consentimiento de Cookies para IMAGIQ
 *
 * Sistema completo para manejar consentimiento de cookies respetando
 * la privacidad del usuario y cumpliendo con la legislación colombiana.
 *
 * @module consent
 */

import type { ConsentState, ConsentResponse } from './types';

/** Key para almacenar consentimiento en localStorage */
const STORAGE_KEY = 'imagiq_consent';

/** Versión actual del sistema de consentimiento */
const CONSENT_VERSION = '1.0';

/**
 * Declara el tipo global de window para TypeScript
 */
declare global {
  interface Window {
    getConsent?: () => ConsentResponse;
  }
}

/**
 * Obtiene el estado de consentimiento del usuario desde localStorage
 *
 * @returns Estado de consentimiento o null si no existe
 *
 * @example
 * ```typescript
 * const consent = getConsent();
 * if (consent?.analytics) {
 *   // Cargar Clarity
 * }
 * ```
 */
export function getConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as ConsentState;

    // Validar estructura
    if (
      typeof parsed.analytics !== 'boolean' ||
      typeof parsed.ads !== 'boolean' ||
      typeof parsed.timestamp !== 'number' ||
      typeof parsed.version !== 'string'
    ) {
      console.warn('[Consent] Invalid consent structure, clearing...');
      clearConsent();
      return null;
    }

    return parsed;
  } catch (error) {
    console.error('[Consent] Error reading consent:', error);
    return null;
  }
}

/**
 * Guarda el consentimiento del usuario en localStorage
 *
 * @param state - Estado de consentimiento (analytics y ads)
 *
 * @example
 * ```typescript
 * // Usuario acepta todo
 * saveConsent({ analytics: true, ads: true });
 *
 * // Usuario rechaza todo
 * saveConsent({ analytics: false, ads: false });
 *
 * // Usuario acepta solo analytics
 * saveConsent({ analytics: true, ads: false });
 * ```
 */
export function saveConsent(state: Omit<ConsentState, 'timestamp' | 'version'>): void {
  if (typeof window === 'undefined') return;

  try {
    const consentState: ConsentState = {
      ...state,
      timestamp: Date.now(),
      version: CONSENT_VERSION,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(consentState));

    console.debug('[Consent] Saved:', consentState);

    // Disparar evento personalizado para que otros componentes puedan reaccionar
    window.dispatchEvent(
      new CustomEvent('consentChange', {
        detail: consentState,
      })
    );
  } catch (error) {
    console.error('[Consent] Error saving consent:', error);
  }
}

/**
 * Verifica si el usuario dio consentimiento para cookies de Analytics (Clarity)
 *
 * @returns true si el usuario aceptó analytics, false en caso contrario
 *
 * @example
 * ```typescript
 * if (hasAnalyticsConsent()) {
 *   // Cargar Microsoft Clarity
 *   loadClarity();
 * }
 * ```
 */
export function hasAnalyticsConsent(): boolean {
  const consent = getConsent();
  return consent?.analytics ?? false;
}

/**
 * Verifica si el usuario dio consentimiento para cookies de Publicidad
 * (GTM, Meta Pixel, TikTok Pixel)
 *
 * @returns true si el usuario aceptó publicidad, false en caso contrario
 *
 * @example
 * ```typescript
 * if (hasAdsConsent()) {
 *   // Cargar GTM, Meta Pixel, TikTok Pixel
 *   loadMarketingScripts();
 * }
 * ```
 */
export function hasAdsConsent(): boolean {
  const consent = getConsent();
  return consent?.ads ?? false;
}

/**
 * Elimina el consentimiento guardado (útil para debugging o reset)
 *
 * @example
 * ```typescript
 * clearConsent();
 * window.location.reload(); // Mostrar banner nuevamente
 * ```
 */
export function clearConsent(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
    console.debug('[Consent] Cleared');

    // Disparar evento
    window.dispatchEvent(new CustomEvent('consentCleared'));
  } catch (error) {
    console.error('[Consent] Error clearing consent:', error);
  }
}

/**
 * Inicializa la API global window.getConsent()
 * para que esté disponible para scripts externos
 *
 * Esta función se debe llamar una vez al inicio de la aplicación
 */
export function initConsentAPI(): void {
  if (typeof window === 'undefined') return;

  window.getConsent = (): ConsentResponse => {
    const consent = getConsent();
    return {
      analytics: consent?.analytics ?? false,
      ads: consent?.ads ?? false,
    };
  };

  console.debug('[Consent] API initialized: window.getConsent()');
}
