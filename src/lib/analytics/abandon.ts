/**
 * Lógica de abandono de carrito y checkout
 *
 * Reglas:
 * - **Cart Abandon**: add_to_cart sin purchase en X horas
 * - **Checkout Abandon**: begin_checkout o add_payment_info sin purchase en Y minutos
 *
 * Persistencia en sessionStorage/localStorage con expiración.
 */

/** Namespace para storage */
const STORAGE_PREFIX = 'scl_abandon_';

/** Tiempo de expiración para cart abandon (24 horas en ms) */
const CART_ABANDON_TTL = 24 * 60 * 60 * 1000;

/** Tiempo de expiración para checkout abandon (30 minutos en ms) */
const CHECKOUT_ABANDON_TTL = 30 * 60 * 1000;

/** Estado de intención de compra en el carrito */
interface CartAbandonState {
  timestamp: number;
  items: Array<{ item_id: string; quantity: number }>;
  value?: number;
  currency?: string;
}

/** Estado de intención de compra en checkout */
interface CheckoutAbandonState {
  timestamp: number;
  step: 'begin_checkout' | 'add_payment_info';
  items: Array<{ item_id: string; quantity: number }>;
  value?: number;
  currency?: string;
}

/**
 * Registra intención de compra (add_to_cart)
 *
 * @param items - Items añadidos al carrito
 * @param value - Valor total del carrito
 * @param currency - Moneda
 */
export function markCartIntent(
  items: Array<{ item_id: string; quantity: number }>,
  value?: number,
  currency?: string
): void {
  if (typeof window === 'undefined') return;

  const state: CartAbandonState = {
    timestamp: Date.now(),
    items,
    value,
    currency: currency || 'COP',
  };

  try {
    localStorage.setItem(`${STORAGE_PREFIX}cart`, JSON.stringify(state));
    console.debug('[Abandon] Cart intent marked', state);
  } catch (error) {
    console.error('[Abandon] Failed to mark cart intent:', error);
  }
}

/**
 * Registra intención de checkout (begin_checkout o add_payment_info)
 *
 * @param step - Paso del checkout
 * @param items - Items en el checkout
 * @param value - Valor total
 * @param currency - Moneda
 */
export function markCheckoutIntent(
  step: 'begin_checkout' | 'add_payment_info',
  items: Array<{ item_id: string; quantity: number }>,
  value?: number,
  currency?: string
): void {
  if (typeof window === 'undefined') return;

  const state: CheckoutAbandonState = {
    timestamp: Date.now(),
    step,
    items,
    value,
    currency: currency || 'COP',
  };

  try {
    sessionStorage.setItem(`${STORAGE_PREFIX}checkout`, JSON.stringify(state));
    console.debug('[Abandon] Checkout intent marked', state);
  } catch (error) {
    console.error('[Abandon] Failed to mark checkout intent:', error);
  }
}

/**
 * Limpia intenciones al completar una compra
 *
 * Se debe llamar cuando se dispara el evento `purchase`
 */
export function clearAbandonIntents(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(`${STORAGE_PREFIX}cart`);
    sessionStorage.removeItem(`${STORAGE_PREFIX}checkout`);
    console.debug('[Abandon] Intents cleared (purchase completed)');
  } catch (error) {
    console.error('[Abandon] Failed to clear intents:', error);
  }
}

/**
 * Verifica si hay un abandono de carrito pendiente
 *
 * @returns Estado del carrito si hay abandono, null si no
 */
export function getCartAbandon(): CartAbandonState | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}cart`);
    if (!stored) return null;

    const state: CartAbandonState = JSON.parse(stored);

    // Verificar si ha expirado
    const elapsed = Date.now() - state.timestamp;
    if (elapsed > CART_ABANDON_TTL) {
      localStorage.removeItem(`${STORAGE_PREFIX}cart`);
      return null;
    }

    // Verificar que haya pasado al menos 1 hora (para no disparar inmediatamente)
    const MIN_TIME = 60 * 60 * 1000; // 1 hora
    if (elapsed < MIN_TIME) {
      return null;
    }

    return state;
  } catch (error) {
    console.error('[Abandon] Failed to get cart abandon:', error);
    return null;
  }
}

/**
 * Verifica si hay un abandono de checkout pendiente
 *
 * @returns Estado del checkout si hay abandono, null si no
 */
export function getCheckoutAbandon(): CheckoutAbandonState | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = sessionStorage.getItem(`${STORAGE_PREFIX}checkout`);
    if (!stored) return null;

    const state: CheckoutAbandonState = JSON.parse(stored);

    // Verificar si ha expirado
    const elapsed = Date.now() - state.timestamp;
    if (elapsed > CHECKOUT_ABANDON_TTL) {
      sessionStorage.removeItem(`${STORAGE_PREFIX}checkout`);
      return null;
    }

    // Verificar que haya pasado al menos 5 minutos
    const MIN_TIME = 5 * 60 * 1000; // 5 minutos
    if (elapsed < MIN_TIME) {
      return null;
    }

    return state;
  } catch (error) {
    console.error('[Abandon] Failed to get checkout abandon:', error);
    return null;
  }
}

/**
 * Resuelve abandono de carrito si aplica
 *
 * Esta función debe ser llamada periódicamente (ej: en page load, en heartbeat)
 * NO se dispara automáticamente.
 *
 * @returns true si se detectó y resolvió un abandono
 */
export function resolveCartAbandon(): boolean {
  const abandon = getCartAbandon();
  if (!abandon) return false;

  if (process.env.NODE_ENV === 'development') {
    console.debug('[Abandon] Cart abandonment detected', abandon);
  }

  // Aquí puedes disparar un evento custom a GTM/Meta/TikTok
  // o enviarlo a tu backend para remarketing

  // Ejemplo: Disparar evento a dataLayer
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'cart_abandon',
      ecommerce: {
        items: abandon.items,
        value: abandon.value,
        currency: abandon.currency,
      },
      ts: Date.now(),
    });
  }

  // Limpiar para no disparar múltiples veces
  localStorage.removeItem(`${STORAGE_PREFIX}cart`);

  return true;
}

/**
 * Resuelve abandono de checkout si aplica
 *
 * Esta función debe ser llamada periódicamente (ej: en page load, en heartbeat)
 * NO se dispara automáticamente.
 *
 * @returns true si se detectó y resolvió un abandono
 */
export function resolveCheckoutAbandon(): boolean {
  const abandon = getCheckoutAbandon();
  if (!abandon) return false;

  if (process.env.NODE_ENV === 'development') {
    console.debug('[Abandon] Checkout abandonment detected', abandon);
  }

  // Disparar evento a dataLayer
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'checkout_abandon',
      step: abandon.step,
      ecommerce: {
        items: abandon.items,
        value: abandon.value,
        currency: abandon.currency,
      },
      ts: Date.now(),
    });
  }

  // Limpiar para no disparar múltiples veces
  sessionStorage.removeItem(`${STORAGE_PREFIX}checkout`);

  return true;
}
