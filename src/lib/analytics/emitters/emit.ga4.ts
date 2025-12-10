/**
 * Emisor de eventos para Google Analytics 4
 *
 * Envía eventos a GA4 usando gtag() cuando el consentimiento de analytics está activo.
 * Incluye soporte para Enhanced Conversions mediante datos de usuario hasheados.
 */

import type { GA4Event } from "../mappers";
import { canSendAnalytics, logConsentBlocked } from "../utils";
import { hashUserData } from "../utils/hash";

/**
 * Interfaz para datos de usuario sin hashear
 */
export interface GA4UserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  address?: {
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
}

/**
 * Envía un evento a GA4 vía dataLayer
 *
 * En lugar de usar gtag() directamente, enviamos al dataLayer
 * que GTM procesará automáticamente.
 *
 * @param event - Evento formateado para GA4
 * @param userData - Datos de usuario sin hashear para Enhanced Conversions (opcional)
 *
 * @example
 * ```typescript
 * const ga4Event = toGa4Event(dlEvent);
 * const userData = { email: 'user@example.com', phone: '+573001234567' };
 * sendGa4(ga4Event, userData);
 * ```
 */
export async function sendGa4(event: GA4Event, userData?: GA4UserData): Promise<void> {
  // Verificar consentimiento
  if (!canSendAnalytics()) {
    logConsentBlocked("GA4", event.name);
    return;
  }

  // Verificar que estamos en el cliente
  if (globalThis.window === undefined) {
    console.warn("[GA4] Not in browser, skipping event:", event.name);
    return;
  }

  // Inicializar dataLayer si no existe
  globalThis.window.dataLayer ??= [];

  try {
    // Preparar datos del evento
    const eventData: Record<string, unknown> = {
      event: event.name,
      ...event.params,
    };

    // Si hay datos de usuario, hashearlos y agregarlos para Enhanced Conversions
    if (userData && (userData.email || userData.phone)) {
      const hashedData = await hashUserData({
        email: userData.email,
        phone: userData.phone,
        firstName: userData.firstName,
        lastName: userData.lastName,
        city: userData.address?.city,
        state: userData.address?.state,
        country: userData.address?.country,
        zipCode: userData.address?.zipCode,
      });

      // Agregar user_data hasheados según el formato de Enhanced Conversions
      // https://support.google.com/google-ads/answer/9888656
      // Nota: Los datos ya vienen hasheados con SHA-256, pero usamos nombres genéricos
      eventData.user_data = {
        email_address: hashedData.em,
        phone_number: hashedData.ph,
        address: {
          first_name: hashedData.fn,
          last_name: hashedData.ln,
          city: hashedData.ct,
          region: hashedData.st,
          country: hashedData.country,
          postal_code: hashedData.zp,
        },
      };

    }

    // Enviar evento al dataLayer (GTM lo procesará)
    globalThis.window.dataLayer.push(eventData);
  } catch (error) {
    console.error("[GA4] Failed to send event:", event.name, error);
  }
}
