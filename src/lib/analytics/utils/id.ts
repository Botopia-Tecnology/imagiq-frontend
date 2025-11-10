/**
 * Generación de event_id estable y deduplicable
 *
 * El event_id se usa para deduplicar eventos entre client-side y server-side (CAPI/EAPI).
 * Debe ser determinista: el mismo evento debe generar el mismo ID tanto en cliente como en servidor.
 */

/**
 * Convierte ArrayBuffer a base64url (URL-safe)
 */
export function toBase64Url(buf: ArrayBuffer): string {
  const b = btoa(String.fromCharCode(...new Uint8Array(buf)));
  return b.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

/**
 * Genera un event_id único y deduplicable basado en un seed
 *
 * @param seed - String que identifica unívocamente el evento
 * @returns Event ID en formato base64url
 *
 * @example
 * ```typescript
 * // Para add_to_cart
 * const seed = `add_to_cart|${Date.now()}|${item.sku}|${cartValue}`;
 * const id = await eventId(seed);
 *
 * // Para purchase
 * const seed = `purchase|${Date.now()}|${transactionId}|${total}`;
 * const id = await eventId(seed);
 * ```
 */
export async function eventId(seed: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    // Fallback para SSR o navegadores antiguos
    return simpleHash(seed);
  }

  try {
    const enc = new TextEncoder().encode(seed);
    const digest = await crypto.subtle.digest('SHA-256', enc);
    return toBase64Url(digest);
  } catch (error) {
    console.warn('[Analytics] Failed to generate event ID with crypto:', error);
    return simpleHash(seed);
  }
}

/**
 * Hash simple como fallback (no criptográfico)
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Genera event_id para eventos de e-commerce
 *
 * @param eventName - Nombre del evento (view_item, add_to_cart, etc.)
 * @param timestamp - Timestamp del evento (epoch ms)
 * @param items - Array de SKUs o item IDs
 * @param transactionId - ID de transacción (opcional, para purchase)
 * @param value - Valor monetario (opcional)
 * @returns Event ID
 */
export async function generateEventId(
  eventName: string,
  timestamp: number,
  items: string[],
  transactionId?: string,
  value?: number
): Promise<string> {
  const skus = items.join(',');
  const txId = transactionId || '';
  const val = value !== undefined ? value.toFixed(2) : '';

  const seed = `${eventName}|${timestamp}|${skus}|${txId}|${val}`;
  return eventId(seed);
}
