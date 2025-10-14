/**
 * Ejemplos de uso de Microsoft Clarity
 *
 * Este archivo muestra cómo usar las utilidades de Clarity
 * en diferentes partes de la aplicación.
 */

import {
  clarityEvent,
  clarityIdentify,
  claritySet,
  clarityConsent,
} from './clarity';

// ============================================================================
// EJEMPLO 1: Trackear eventos de E-commerce
// ============================================================================

export function trackProductView(productId: string, productName: string) {
  // Evento cuando el usuario ve un producto
  clarityEvent('ProductView');

  // Opcional: agregar contexto adicional
  claritySet('last_product_viewed', productId);
}

export function trackAddToCart(productId: string, quantity: number) {
  // Evento cuando el usuario agrega al carrito
  clarityEvent('AddToCart');

  // Guardar el último producto agregado
  claritySet('last_added_product', productId);
  claritySet('cart_items_count', quantity);
}

export function trackCheckoutStarted(cartTotal: number) {
  // Evento cuando inicia el checkout
  clarityEvent('CheckoutStarted');

  // Guardar el valor del carrito
  claritySet('cart_total', cartTotal);
}

export function trackPurchaseCompleted(orderId: string, total: number) {
  // Evento de compra exitosa
  clarityEvent('PurchaseCompleted');

  // Guardar información de la orden
  claritySet('last_order_id', orderId);
  claritySet('last_order_total', total);
}

// ============================================================================
// EJEMPLO 2: Identificar usuarios (después del login)
// ============================================================================

export function identifyUserOnLogin(userId: string) {
  /**
   * IMPORTANTE: Nunca pasar información personal directamente
   * Usar un hash o ID anónimo
   */
  const hashedUserId = `user_${btoa(userId).substring(0, 10)}`;
  clarityIdentify(hashedUserId);

  // Marcar como usuario registrado
  claritySet('user_type', 'registered');
}

export function identifyGuestUser() {
  // Para usuarios no logueados
  claritySet('user_type', 'guest');
}

// ============================================================================
// EJEMPLO 3: Trackear búsquedas y filtros
// ============================================================================

export function trackSearch(searchQuery: string, resultsCount: number) {
  // Evento de búsqueda
  clarityEvent('Search');

  // Guardar última búsqueda (sin info sensible)
  claritySet('last_search_results', resultsCount);
}

export function trackFilterApplied(filterType: string, filterValue: string) {
  // Evento cuando aplica filtros
  clarityEvent('FilterApplied');

  // Guardar el tipo de filtro usado
  claritySet(`filter_${filterType}`, filterValue);
}

// ============================================================================
// EJEMPLO 4: Gestión de consentimiento de cookies
// ============================================================================

export function handleCookieConsent(accepted: boolean) {
  if (accepted) {
    // Usuario aceptó cookies de analytics
    clarityConsent('grant');

    // Marcar que el usuario dio consentimiento
    claritySet('analytics_consent', 'granted');
  } else {
    // Usuario rechazó cookies
    clarityConsent('deny');

    // Marcar rechazo
    claritySet('analytics_consent', 'denied');
  }
}

// ============================================================================
// EJEMPLO 5: Trackear interacciones clave
// ============================================================================

export function trackNewsletterSignup() {
  clarityEvent('NewsletterSignup');
}

export function trackWishlistAdd(productId: string) {
  clarityEvent('WishlistAdd');
  claritySet('last_wishlist_item', productId);
}

export function trackShareProduct(productId: string, platform: string) {
  clarityEvent('ProductShared');
  claritySet('last_share_platform', platform);
}

export function trackVideoPlay(videoId: string) {
  clarityEvent('VideoPlayed');
  claritySet('last_video_played', videoId);
}

// ============================================================================
// EJEMPLO 6: Trackear errores y problemas
// ============================================================================

export function trackError(errorType: string, errorMessage: string) {
  clarityEvent('Error');
  claritySet('last_error_type', errorType);
  // NO enviar el mensaje completo si tiene info sensible
}

export function trackPaymentFailed(reason: string) {
  clarityEvent('PaymentFailed');
  claritySet('payment_failure_reason', reason);
}

// ============================================================================
// EJEMPLO 7: Uso en componentes React
// ============================================================================

/**
 * Ejemplo de uso en un componente de producto
 */
export function ProductCardExample() {
  // ... código del componente

  const handleViewProduct = (productId: string) => {
    trackProductView(productId, 'Product Name');
  };

  const handleAddToCart = (productId: string) => {
    trackAddToCart(productId, 1);
  };

  // ... resto del componente
}

/**
 * Ejemplo de uso en el componente de login
 */
export function LoginPageExample() {
  const handleLoginSuccess = (userId: string) => {
    identifyUserOnLogin(userId);
  };

  // ... resto del componente
}

/**
 * Ejemplo de uso en un modal de consentimiento de cookies
 */
export function CookieConsentBannerExample() {
  const handleAccept = () => {
    handleCookieConsent(true);
    // Cerrar banner
  };

  const handleReject = () => {
    handleCookieConsent(false);
    // Cerrar banner
  };

  // ... resto del componente
}
