/**
 * Emisor de eventos para TikTok Pixel
 *
 * Envía eventos a TikTok Pixel usando ttq.track() cuando el consentimiento de ads está activo.
 */

import type { TikTokEvent } from '../mappers';
import { canSendAds, logConsentBlocked } from '../utils';

/**
 * Envía un evento a TikTok Pixel vía ttq.track()
 *
 * @param event - Evento formateado para TikTok Pixel
 * @param eventId - Event ID para deduplicación con Events API
 * @param userData - Datos de usuario hasheados para Advanced Matching (opcional)
 *
 * @example
 * ```typescript
 * const tiktokEvent = toTiktokEvent(dlEvent, eventId);
 * const userData = await hashUserData({ email: 'user@example.com' });
 * sendTiktok(tiktokEvent, eventId, userData);
 * ```
 */
export function sendTiktok(
  event: TikTokEvent,
  eventId: string,
  userData?: Record<string, string>
): void {
  // Verificar consentimiento
  if (!canSendAds()) {
    logConsentBlocked('TikTok Pixel', event.name);
    return;
  }

  // Verificar que ttq esté disponible
  if (typeof window === 'undefined' || !window.ttq?.track) {
    console.warn('[TikTok Pixel] ttq.track() not available, skipping event:', event.name);
    return;
  }

  try {
    // Preparar opciones con event_id para deduplicación
    const options: Record<string, unknown> = {
      event_id: eventId,
    };

    // Si hay datos de usuario, añadir para Advanced Matching
    if (userData && Object.keys(userData).length > 0) {
      // TikTok espera external_id, email (hashed), phone_number (hashed)
      // Mapeamos nuestro formato al de TikTok
      if (userData.em) options.email = userData.em;
      if (userData.ph) options.phone_number = userData.ph;
    }

    // Enviar evento
    window.ttq.track(event.name, event.data, options);

    console.debug(`[TikTok Pixel] Event sent: ${event.name}`, {
      data: event.data,
      event_id: eventId,
      hasUserData: Boolean(userData),
    });
  } catch (error) {
    console.error('[TikTok Pixel] Failed to send event:', event.name, error);
  }
}
