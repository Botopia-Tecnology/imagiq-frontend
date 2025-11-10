/**
 * Mapeador de eventos a formato TikTok Pixel
 *
 * Transforma eventos del dataLayer al formato esperado por TikTok Pixel.
 *
 * **Referencia**: https://ads.tiktok.com/marketing_api/docs?id=1739585700402178
 */

import type { DlAny, DlItem } from '../types';

/** Evento TikTok Pixel */
export interface TikTokEvent {
  name: 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'AddPaymentInfo' | 'CompletePayment' | 'Search' | 'ClickButton';
  data: {
    contents?: Array<{ content_id: string; quantity: number; price?: number }>;
    content_type?: 'product' | 'product_group';
    content_name?: string;
    value?: number;
    currency?: string;
    query?: string;
    description?: string;
    [key: string]: unknown;
  };
}

/**
 * Transforma un evento del dataLayer a formato TikTok Pixel
 *
 * @param event - Evento del dataLayer
 * @param eventId - Event ID para deduplicación (generado con utils/id.ts)
 * @param user - Datos de usuario para Advanced Matching (opcional)
 * @returns Evento formateado para TikTok Pixel
 *
 * @example
 * ```typescript
 * const dlEvent: DlViewItem = {
 *   event: 'view_item',
 *   ts: Date.now(),
 *   ecommerce: { items: [{ item_id: 'SKU123', item_name: 'Product', price: 100 }] }
 * };
 *
 * const eventId = await generateEventId('view_item', dlEvent.ts, ['SKU123']);
 * const tiktokEvent = toTiktokEvent(dlEvent, eventId);
 * // { name: 'ViewContent', data: { contents: [...], ... } }
 * ```
 */
export function toTiktokEvent(
  event: DlAny,
  eventId: string,
  user?: { email?: string; phone?: string }
): TikTokEvent {
  switch (event.event) {
    case 'view_item':
      return {
        name: 'ViewContent',
        data: {
          contents: mapContents(event.ecommerce.items),
          content_type: 'product',
          content_name: event.ecommerce.items[0]?.item_name,
          currency: 'COP',
        },
      };

    case 'add_to_cart':
      return {
        name: 'AddToCart',
        data: {
          contents: mapContents(event.ecommerce.items),
          content_type: 'product',
          value: event.ecommerce.value,
          currency: event.ecommerce.currency || 'COP',
        },
      };

    case 'begin_checkout':
      return {
        name: 'InitiateCheckout',
        data: {
          contents: mapContents(event.ecommerce.items),
          content_type: 'product',
          value: event.ecommerce.value,
          currency: event.ecommerce.currency || 'COP',
        },
      };

    case 'add_payment_info':
      return {
        name: 'AddPaymentInfo',
        data: {
          contents: mapContents(event.ecommerce.items),
          content_type: 'product',
          value: event.ecommerce.value,
          currency: event.ecommerce.currency || 'COP',
        },
      };

    case 'purchase':
      // TikTok usa "CompletePayment" en lugar de "Purchase"
      return {
        name: 'CompletePayment',
        data: {
          contents: mapContents(event.ecommerce.items),
          content_type: 'product',
          value: event.ecommerce.value,
          currency: event.ecommerce.currency,
        },
      };

    case 'search':
      return {
        name: 'Search',
        data: {
          query: event.search_term,
          content_type: 'product',
        },
      };

    case 'category_click':
      // Category Click va como "ClickButton"
      return {
        name: 'ClickButton',
        data: {
          description: `Category: ${event.nav.category_name}`,
          content_name: event.nav.category_name,
        },
      };

    default:
      return {
        name: 'ClickButton',
        data: {
          description: 'Unknown Event',
          event_data: event,
        },
      };
  }
}

/**
 * Mapea items del dataLayer a formato TikTok Pixel `contents`
 *
 * @param items - Items del ecommerce
 * @returns Contents en formato TikTok Pixel
 */
function mapContents(items: DlItem[]): Array<{ content_id: string; quantity: number; price?: number }> {
  return items.map((item) => ({
    content_id: item.item_id,
    quantity: item.quantity || 1,
    price: item.price,
  }));
}
