/**
 * Mapeador de eventos a formato GA4 Enhanced Ecommerce
 *
 * Transforma eventos del dataLayer al formato esperado por Google Analytics 4.
 *
 * **Referencia**: https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
 */

import type { DlAny, DlItem } from "../types";

/** Evento GA4 con nombre y parámetros */
export interface GA4Event {
  name: string;
  params: Record<string, unknown>;
}

/**
 * Transforma un evento del dataLayer a formato GA4
 *
 * @param event - Evento del dataLayer
 * @returns Evento formateado para GA4
 *
 * @example
 * ```typescript
 * const dlEvent: DlViewItem = {
 *   event: 'view_item',
 *   ts: Date.now(),
 *   ecommerce: {
 *     items: [{ item_id: 'SKU123', item_name: 'Product', price: 100 }]
 *   }
 * };
 *
 * const ga4Event = toGa4Event(dlEvent);
 * // { name: 'view_item', params: { items: [...], currency: 'COP' } }
 * ```
 */
export function toGa4Event(event: DlAny): GA4Event {
  switch (event.event) {
    case "view_item":
      return {
        name: "view_item",
        params: {
          items: mapItems(event.ecommerce.items),
          currency: "COP",
        },
      };

    case "add_to_cart":
      return {
        name: "add_to_cart",
        params: {
          items: mapItems(event.ecommerce.items),
          value: event.ecommerce.value,
          currency: event.ecommerce.currency || "COP",
        },
      };

    case "purchase":
      return {
        name: "purchase",
        params: {
          transaction_id: event.ecommerce.transaction_id,
          value: event.ecommerce.value,
          currency: event.ecommerce.currency,
          coupon: event.ecommerce.coupon,
          items: mapItems(event.ecommerce.items),
        },
      };

    case "search":
      return {
        name: "search",
        params: {
          search_term: event.search_term,
          results: event.results,
        },
      };

    case "begin_checkout":
    case "add_payment_info":
      return {
        name: event.event,
        params: {
          items: mapItems(event.ecommerce.items),
          value: event.ecommerce.value,
          currency: event.ecommerce.currency || "COP",
          checkout_step: event.step,
        },
      };

    case "category_click":
      // Enviar como evento custom category_click para GTM
      return {
        name: "category_click",
        params: {
          category_name: event.nav.category_name,
          category_id: event.nav.category_id,
          position: event.nav.position,
        },
      };

    default:
      // Fallback: evento custom
      return {
        name: "custom_event",
        params: { event_data: event },
      };
  }
}

/**
 * Mapea items del dataLayer a formato GA4
 *
 * @param items - Items del ecommerce
 * @returns Items en formato GA4
 */
function mapItems(items: DlItem[]): Array<Record<string, unknown>> {
  return items.map((item) => ({
    item_id: item.item_id,
    item_name: item.item_name,
    item_brand: item.item_brand,
    item_category: item.item_category,
    item_variant: item.item_variant,
    price: item.price,
    quantity: item.quantity || 1,
    currency: item.currency || "COP",
  }));
}
