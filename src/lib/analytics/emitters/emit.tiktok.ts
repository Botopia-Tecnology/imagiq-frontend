/**
 * Emisor de eventos para TikTok Pixel
 *
 * Envía eventos a TikTok Pixel usando ttq.track() y ttq.identify() cuando el consentimiento de ads está activo.
 */

import type { TikTokEvent } from '../mappers';
import { canSendAds, logConsentBlocked } from '../utils';
import { hashUserData } from '../utils/hash';

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
  if (globalThis.window === undefined || !globalThis.ttq?.track) {
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
    globalThis.ttq.track(event.name, event.data, options);

    console.debug(`[TikTok Pixel] Event sent: ${event.name}`, {
      data: event.data,
      event_id: eventId,
      hasUserData: Boolean(userData),
    });
  } catch (error) {
    console.error('[TikTok Pixel] Failed to send event:', event.name, error);
  }
}

/**
 * Interfaz para datos de usuario sin hashear
 */
export interface TikTokUserData {
  email?: string;
  phone?: string;
  external_id?: string;
}

/**
 * Identifica un usuario en TikTok Pixel con datos hasheados (Advanced Matching)
 *
 * IMPORTANTE: Los datos se hashean automáticamente con SHA-256 antes de enviarlos a TikTok.
 * TikTok usa esta información para mejorar la atribución de conversiones.
 *
 * @param userData - Datos del usuario (email, phone, external_id) sin hashear
 *
 * @example
 * ```typescript
 * // Identificar usuario cuando inicia sesión
 * identifyTiktokUser({
 *   email: 'user@example.com',
 *   phone: '+573001234567',
 *   external_id: 'user123'
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Identificar solo con email
 * identifyTiktokUser({
 *   email: 'user@example.com'
 * });
 * ```
 */
export async function identifyTiktokUser(userData: TikTokUserData): Promise<void> {
  // Verificar consentimiento
  if (!canSendAds()) {
    logConsentBlocked('TikTok Pixel', 'identify');
    return;
  }

  // Verificar que ttq esté disponible
  if (globalThis.window === undefined || !globalThis.ttq?.identify) {
    console.warn('[TikTok Pixel] ttq.identify() not available');
    return;
  }

  try {
    // Hashear datos del usuario con SHA-256
    const hashedData = await hashUserData(userData);

    const identifyData: Record<string, string> = {};

    // Mapear datos hasheados al formato de TikTok
    if (hashedData.em) {
      identifyData.email = hashedData.em;
    }

    if (hashedData.ph) {
      identifyData.phone_number = hashedData.ph;
    }

    if (hashedData.external_id) {
      identifyData.external_id = hashedData.external_id;
    }

    // Enviar identificación a TikTok
    if (Object.keys(identifyData).length > 0) {
      globalThis.ttq.identify(identifyData);

      console.debug('[TikTok Pixel] User identified', {
        hasEmail: Boolean(identifyData.email),
        hasPhone: Boolean(identifyData.phone_number),
        hasExternalId: Boolean(identifyData.external_id),
      });
    } else {
      console.warn('[TikTok Pixel] No valid user data to identify');
    }
  } catch (error) {
    console.error('[TikTok Pixel] Failed to identify user:', error);
  }
}
