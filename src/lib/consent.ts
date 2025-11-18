/**
 * Sistema de Consentimiento de Cookies - SIMPLIFICADO
 *
 * Cumple con Ley 1581/2012 de Colombia
 *
 * ESTRATEGIA DUAL:
 * - CLIENT-SIDE: Pixels (requieren consentimiento)
 * - SERVER-SIDE: CAPI (siempre activo, anónimo sin consentimiento)
 */

const STORAGE_KEY = "imagiq_consent";
const CONSENT_VERSION = "2.0";

export interface ConsentState {
  analytics: boolean;  // Clarity, Sentry
  marketing: boolean;  // GTM, Meta Pixel, TikTok Pixel
  timestamp: number;
  version: string;
}

/**
 * Obtiene el consentimiento guardado
 */
export function getConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as ConsentState;

    // Validar estructura
    if (
      typeof parsed.analytics !== "boolean" ||
      typeof parsed.marketing !== "boolean" ||
      typeof parsed.timestamp !== "number"
    ) {
      console.warn("[Consent] Invalid structure, clearing...");
      clearConsent();
      return null;
    }

    return parsed;
  } catch (error) {
    console.error("[Consent] Error reading:", error);
    return null;
  }
}

/**
 * Guarda el consentimiento
 */
export function saveConsent(analytics: boolean, marketing: boolean): void {
  if (typeof window === "undefined") return;

  const consent: ConsentState = {
    analytics,
    marketing,
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  console.log("[Consent] Saved:", consent);

  // Disparar evento
  window.dispatchEvent(
    new CustomEvent("consentChange", { detail: consent })
  );
}

/**
 * Limpia el consentimiento
 */
export function clearConsent(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEY);
  console.log("[Consent] Cleared");

  window.dispatchEvent(new CustomEvent("consentCleared"));
}

/**
 * Verifica si hay consentimiento de analytics
 */
export function hasAnalyticsConsent(): boolean {
  const consent = getConsent();
  return consent?.analytics ?? false;
}

/**
 * Verifica si hay consentimiento de marketing
 */
export function hasMarketingConsent(): boolean {
  const consent = getConsent();
  return consent?.marketing ?? false;
}

/**
 * Alias para compatibilidad con código existente
 */
export function hasAdsConsent(): boolean {
  return hasMarketingConsent();
}

/**
 * Inicializa la API global (para scripts externos)
 */
export function initConsentAPI(): void {
  if (typeof window === "undefined") return;

  // Extender window con tipo seguro
  interface WindowWithConsent extends Window {
    getConsent: () => { analytics: boolean; ads: boolean };
  }

  const windowWithConsent = window as unknown as WindowWithConsent;

  windowWithConsent.getConsent = () => {
    const consent = getConsent();
    return {
      analytics: consent?.analytics ?? false,
      ads: consent?.marketing ?? false, // 'marketing' se mapea a 'ads' para compatibilidad
    };
  };

  console.log("[Consent] API initialized: window.getConsent()");
}
