/**
 * Emisor de eventos para Google Analytics 4
 *
 * Envía eventos a GA4 usando gtag() cuando el consentimiento de analytics está activo.
 */

import type { GA4Event } from "../mappers";
import { canSendAnalytics, logConsentBlocked } from "../utils";

/**
 * Envía un evento a GA4 vía dataLayer
 *
 * En lugar de usar gtag() directamente, enviamos al dataLayer
 * que GTM procesará automáticamente.
 *
 * @param event - Evento formateado para GA4
 *
 * @example
 * ```typescript
 * const ga4Event = toGa4Event(dlEvent);
 * sendGa4(ga4Event);
 * ```
 */
export function sendGa4(event: GA4Event): void {
  // Verificar consentimiento
  if (!canSendAnalytics()) {
    logConsentBlocked("GA4", event.name);
    return;
  }

  // Verificar que estamos en el cliente
  if (typeof window === "undefined") {
    console.warn("[GA4] Not in browser, skipping event:", event.name);
    return;
  }

  // Inicializar dataLayer si no existe
  if (!window.dataLayer) {
    window.dataLayer = [];
  }

  try {
    // Enviar evento al dataLayer (GTM lo procesará)
    window.dataLayer.push({
      event: event.name,
      ...event.params,
    });

    console.debug(`[GA4] Event sent to dataLayer: ${event.name}`, event.params);
  } catch (error) {
    console.error("[GA4] Failed to send event:", event.name, error);
  }
}
