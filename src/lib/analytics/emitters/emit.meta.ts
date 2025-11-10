/**
 * Emisor de eventos para Meta Pixel (Facebook Pixel)
 *
 * Envía eventos a Meta Pixel usando fbq() cuando el consentimiento de ads está activo.
 */

import type { MetaEvent } from '../mappers';
import { canSendAds, logConsentBlocked } from '../utils';

/**
 * Envía un evento a Meta Pixel vía fbq()
 *
 * @param event - Evento formateado para Meta Pixel
 * @param eventId - Event ID para deduplicación con CAPI
 * @param userData - Datos de usuario hasheados para Advanced Matching (opcional)
 *
 * @example
 * ```typescript
 * const metaEvent = toMetaEvent(dlEvent, eventId);
 * const userData = await hashUserData({ email: 'user@example.com' });
 * sendMeta(metaEvent, eventId, userData);
 * ```
 */
export function sendMeta(
  event: MetaEvent,
  eventId: string,
  userData?: Record<string, string>
): void {
  // Verificar consentimiento
  if (!canSendAds()) {
    logConsentBlocked('Meta Pixel', event.name);
    return;
  }

  // Verificar que fbq esté disponible
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') {
    console.warn('[Meta Pixel] fbq() not available, skipping event:', event.name);
    return;
  }

  try {
    // Preparar opciones con eventID para deduplicación
    const options: Record<string, unknown> = {
      eventID: eventId,
    };

    // Si hay datos de usuario, añadir para Advanced Matching
    if (userData && Object.keys(userData).length > 0) {
      // fbq espera user_data en el tercer parámetro
      // pero también puede ir en el segundo parámetro como parte de custom_data
      // Para Advanced Matching, lo mejor es usar fbq('track', event, data, { eventID, em, ph, ... })
      Object.assign(options, userData);
    }

    // Enviar evento
    window.fbq('track', event.name, event.data, options);

    console.debug(`[Meta Pixel] Event sent: ${event.name}`, {
      data: event.data,
      eventID: eventId,
      hasUserData: Boolean(userData),
    });
  } catch (error) {
    console.error('[Meta Pixel] Failed to send event:', event.name, error);
  }
}

/**
 * Envía un evento custom a Meta Pixel
 *
 * @param eventName - Nombre del evento custom
 * @param data - Datos del evento
 * @param eventId - Event ID para deduplicación
 */
export function sendMetaCustom(
  eventName: string,
  data: Record<string, unknown>,
  eventId: string
): void {
  if (!canSendAds()) {
    logConsentBlocked('Meta Pixel', eventName);
    return;
  }

  if (typeof window === 'undefined' || typeof window.fbq !== 'function') {
    console.warn('[Meta Pixel] fbq() not available');
    return;
  }

  try {
    window.fbq('trackCustom', eventName, data, { eventID: eventId });
    console.debug(`[Meta Pixel] Custom event sent: ${eventName}`, data);
  } catch (error) {
    console.error('[Meta Pixel] Failed to send custom event:', eventName, error);
  }
}
