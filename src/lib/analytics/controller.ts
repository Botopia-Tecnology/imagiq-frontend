/**
 * Controlador principal de analytics
 *
 * Orquesta el flujo de eventos:
 * 1. Escucha eventos del dataLayer
 * 2. Genera event_id deduplicable
 * 3. Mapea eventos a cada plataforma (GA4, Meta, TikTok)
 * 4. Envía eventos si hay consentimiento
 * 5. Registra intenciones de abandono
 */

import type { DlAny } from './types';
import { generateEventId } from './utils';
import { toGa4Event, toMetaEvent, toTiktokEvent } from './mappers';
import { sendGa4, sendMeta, sendTiktok } from './emitters';
import {
  markCartIntent,
  markCheckoutIntent,
  clearAbandonIntents,
  resolveCartAbandon,
  resolveCheckoutAbandon,
} from './abandon';

/**
 * Procesa un evento del dataLayer y lo envía a todas las plataformas
 *
 * @param event - Evento del dataLayer
 * @param user - Datos de usuario para Advanced Matching (opcional)
 *
 * @example
 * ```typescript
 * // En tu componente
 * const handleAddToCart = async (product) => {
 *   const dlEvent: DlAddToCart = {
 *     event: 'add_to_cart',
 *     ts: Date.now(),
 *     ecommerce: {
 *       items: [{ item_id: product.sku, item_name: product.name, price: product.price }],
 *       value: product.price,
 *       currency: 'COP',
 *     },
 *   };
 *
 *   await processAnalyticsEvent(dlEvent);
 * };
 * ```
 */
export async function processAnalyticsEvent(
  event: DlAny,
  user?: { email?: string; phone?: string }
): Promise<void> {
  console.debug('[Analytics] Processing event:', event.event, event);

  try {
    // 1. Generar event_id deduplicable
    const eventId = await generateEventIdForEvent(event);

    // 2. Mapear a cada plataforma
    const ga4Event = toGa4Event(event);
    const metaEvent = toMetaEvent(event, eventId, user);
    const tiktokEvent = toTiktokEvent(event, eventId, user);

    // 3. Enviar a cada plataforma (con verificación de consentimiento interna)
    sendGa4(ga4Event);
    sendMeta(metaEvent, eventId);
    sendTiktok(tiktokEvent, eventId);

    // 4. Registrar intenciones de abandono
    handleAbandonTracking(event);

    console.debug('[Analytics] Event processed successfully:', event.event);
  } catch (error) {
    console.error('[Analytics] Failed to process event:', event.event, error);
  }
}

/**
 * Genera event_id para un evento del dataLayer
 */
async function generateEventIdForEvent(event: DlAny): Promise<string> {
  const { event: eventName, ts } = event;

  // Extraer items/SKUs según el tipo de evento
  let items: string[] = [];
  let transactionId: string | undefined;
  let value: number | undefined;

  if ('ecommerce' in event) {
    if ('items' in event.ecommerce) {
      items = event.ecommerce.items.map((i) => i.item_id);
    }

    if ('transaction_id' in event.ecommerce) {
      transactionId = event.ecommerce.transaction_id;
    }

    if ('value' in event.ecommerce) {
      value = event.ecommerce.value;
    }
  }

  return generateEventId(eventName, ts, items, transactionId, value);
}

/**
 * Maneja el tracking de abandono según el tipo de evento
 */
function handleAbandonTracking(event: DlAny): void {
  switch (event.event) {
    case 'add_to_cart':
      // Registrar intención de carrito
      markCartIntent(
        event.ecommerce.items.map((i) => ({ item_id: i.item_id, quantity: i.quantity || 1 })),
        event.ecommerce.value,
        event.ecommerce.currency
      );
      break;

    case 'begin_checkout':
    case 'add_payment_info':
      // Registrar intención de checkout
      markCheckoutIntent(
        event.event,
        event.ecommerce.items.map((i) => ({ item_id: i.item_id, quantity: i.quantity || 1 })),
        event.ecommerce.value,
        event.ecommerce.currency
      );
      break;

    case 'purchase':
      // Limpiar intenciones al completar compra
      clearAbandonIntents();
      break;
  }
}

/**
 * Inicializa el sistema de analytics
 *
 * Debe llamarse una vez al cargar la aplicación.
 * - Verifica abandono pendiente en page load
 * - (Opcional) Configura heartbeat para chequear abandono periódicamente
 */
export function initAnalytics(): void {
  if (typeof window === 'undefined') return;

  console.debug('[Analytics] Initializing analytics system');

  // Verificar abandono al cargar la página
  setTimeout(() => {
    resolveCartAbandon();
    resolveCheckoutAbandon();
  }, 5000); // Esperar 5s después del page load

  // (Opcional) Heartbeat cada 10 minutos para chequear abandono
  // Descomentar si quieres chequeo periódico
  /*
  setInterval(() => {
    resolveCartAbandon();
    resolveCheckoutAbandon();
  }, 10 * 60 * 1000); // 10 minutos
  */

  console.debug('[Analytics] Analytics system initialized');
}

/**
 * Push de evento al dataLayer (helper)
 *
 * Wrapper para pushear eventos al dataLayer de forma type-safe
 *
 * @param event - Evento del dataLayer
 *
 * @example
 * ```typescript
 * pushToDataLayer({
 *   event: 'view_item',
 *   ts: Date.now(),
 *   ecommerce: { items: [...] }
 * });
 * ```
 */
export function pushToDataLayer(event: DlAny): void {
  if (typeof window === 'undefined') return;

  if (!window.dataLayer) {
    window.dataLayer = [];
  }

  window.dataLayer.push(event);
  console.debug('[Analytics] Event pushed to dataLayer:', event.event);
}
