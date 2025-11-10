/**
 * Helpers de consentimiento para analytics
 * Wrapper sobre la API de consentimiento existente
 */

import { hasAdsConsent as hasAdsConsentBase, hasAnalyticsConsent as hasAnalyticsConsentBase } from '@/lib/consent';

/**
 * Verifica si se puede enviar eventos de analytics (GA4, Clarity)
 *
 * @returns true si el usuario dio consentimiento de analytics
 */
export function canSendAnalytics(): boolean {
  return hasAnalyticsConsentBase();
}

/**
 * Verifica si se puede enviar eventos de publicidad (GTM, Meta Pixel, TikTok Pixel)
 *
 * @returns true si el usuario dio consentimiento de ads
 */
export function canSendAds(): boolean {
  return hasAdsConsentBase();
}

/**
 * Log de debug para eventos bloqueados por falta de consentimiento
 *
 * @param platform - Plataforma (GA4, Meta, TikTok)
 * @param eventName - Nombre del evento
 */
export function logConsentBlocked(platform: string, eventName: string): void {
  console.debug(
    `[Analytics] Event blocked by consent: ${platform}.${eventName} (user has not granted permission)`
  );
}
