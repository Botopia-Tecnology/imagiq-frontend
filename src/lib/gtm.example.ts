/**
 * Ejemplos de uso de Google Tag Manager
 *
 * Este archivo muestra cómo usar las utilidades de GTM
 * en diferentes partes de la aplicación.
 */

import {
  gtmEvent,
  gtmPageView,
  gtmPurchase,
  gtmAddToCart,
  gtmRemoveFromCart,
  gtmViewItem,
  gtmBeginCheckout,
  gtmIdentifyUser,
  gtmConsent,
  gtmPush,
} from './gtm';

// ============================================================================
// EJEMPLO 1: Trackear páginas
// ============================================================================

export function trackPageView(path: string, title?: string) {
  gtmPageView(path, title);
}

// Uso en Next.js con App Router
export function useGTMPageTracking() {
  // En un componente o hook
  // useEffect(() => {
  //   gtmPageView(window.location.pathname);
  // }, []);
}

// ============================================================================
// EJEMPLO 2: Enhanced Ecommerce - Ver Producto
// ============================================================================

export function trackProductView(product: {
  id: string;
  name: string;
  price: number;
  category?: string;
  brand?: string;
}) {
  gtmViewItem({
    item_id: product.id,
    item_name: product.name,
    price: product.price,
    item_category: product.category,
    item_brand: product.brand,
  });
}

// ============================================================================
// EJEMPLO 3: Enhanced Ecommerce - Agregar al Carrito
// ============================================================================

export function trackAddToCart(product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  brand?: string;
}) {
  gtmAddToCart({
    item_id: product.id,
    item_name: product.name,
    price: product.price,
    quantity: product.quantity,
    item_category: product.category,
    item_brand: product.brand,
  });
}

// ============================================================================
// EJEMPLO 4: Enhanced Ecommerce - Remover del Carrito
// ============================================================================

export function trackRemoveFromCart(product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}) {
  gtmRemoveFromCart({
    item_id: product.id,
    item_name: product.name,
    price: product.price,
    quantity: product.quantity,
  });
}

// ============================================================================
// EJEMPLO 5: Enhanced Ecommerce - Inicio de Checkout
// ============================================================================

export function trackCheckoutStart(cart: {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
}) {
  gtmBeginCheckout({
    value: cart.total,
    currency: 'USD',
    items: cart.items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
}

// ============================================================================
// EJEMPLO 6: Enhanced Ecommerce - Compra Completada
// ============================================================================

export function trackPurchase(order: {
  orderId: string;
  total: number;
  tax?: number;
  shipping?: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    category?: string;
    brand?: string;
  }>;
}) {
  gtmPurchase({
    transaction_id: order.orderId,
    value: order.total,
    currency: 'USD',
    tax: order.tax,
    shipping: order.shipping,
    items: order.items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
      item_category: item.category,
      item_brand: item.brand,
    })),
  });
}

// ============================================================================
// EJEMPLO 7: Eventos Personalizados
// ============================================================================

export function trackCustomEvent(eventName: string, data?: Record<string, unknown>) {
  gtmEvent(eventName, data);
}

// Ejemplos específicos
export function trackNewsletterSignup(email?: string) {
  gtmEvent('newsletter_signup', {
    method: 'footer_form',
  });
}

export function trackSearch(searchTerm: string, resultsCount: number) {
  gtmEvent('search', {
    search_term: searchTerm,
    results_count: resultsCount,
  });
}

export function trackFilterApplied(filterType: string, filterValue: string) {
  gtmEvent('filter_applied', {
    filter_type: filterType,
    filter_value: filterValue,
  });
}

export function trackShareProduct(productId: string, method: string) {
  gtmEvent('share', {
    content_type: 'product',
    content_id: productId,
    method: method, // 'facebook', 'twitter', 'whatsapp', etc.
  });
}

// ============================================================================
// EJEMPLO 8: Identificar Usuario (después del login)
// ============================================================================

export function identifyUserAfterLogin(userId: string) {
  // IMPORTANTE: Hashear el ID antes de enviarlo
  const hashedUserId = `user_${btoa(userId).substring(0, 10)}`;
  gtmIdentifyUser(hashedUserId);

  // También enviar evento de login
  gtmEvent('login', {
    method: 'email',
  });
}

export function trackUserRegistration(method: string = 'email') {
  gtmEvent('sign_up', {
    method: method,
  });
}

// ============================================================================
// EJEMPLO 9: Gestión de Consentimiento (GDPR/CCPA)
// ============================================================================

export function handleCookieConsentAccepted() {
  gtmConsent({
    analytics: true,
    marketing: true,
    preferences: true,
  });

  // También enviar evento de consentimiento
  gtmEvent('consent_granted', {
    consent_type: 'all',
  });
}

export function handleCookieConsentRejected() {
  gtmConsent({
    analytics: false,
    marketing: false,
    preferences: false,
  });

  gtmEvent('consent_denied', {
    consent_type: 'all',
  });
}

export function handlePartialConsent(analytics: boolean, marketing: boolean) {
  gtmConsent({
    analytics: analytics,
    marketing: marketing,
    preferences: true, // Preferences generalmente siempre se permite
  });

  gtmEvent('consent_granted', {
    consent_type: 'partial',
    analytics: analytics,
    marketing: marketing,
  });
}

// ============================================================================
// EJEMPLO 10: Uso en Componentes React
// ============================================================================

/**
 * Ejemplo de uso en un componente de producto
 */
export function ProductCardExample() {
interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  brand?: string;
}
  const handleViewProduct = (product: Product) => {
    trackProductView({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      brand: product.brand,
    });
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    trackAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      category: product.category,
      brand: product.brand,
    });
  };

  // ... resto del componente
}

/**
 * Ejemplo de uso en la página de checkout
 */
export function CheckoutPageExample() {
  interface Product {
    id: string;
    name: string;
    price: number;
    quantity: number;
    category?: string;
    brand?: string;
  }

  interface Cart {
    items: Product[];
    total: number;
  }

  interface Order {
    id: string;
    items: Product[];
    total: number;
    currency: string;
    tax?: number;
    shipping?: number;
  }

  const handleCheckoutStart = (cart: Cart) => {
    trackCheckoutStart({
      items: cart.items,
      total: cart.total,
    });
  };

  const handlePurchaseComplete = (order: Order) => {
    trackPurchase({
      orderId: order.id,
      total: order.total,
      tax: order.tax,
      shipping: order.shipping,
      items: order.items,
    });
  };

  // ... resto del componente
}

/**
 * Ejemplo de uso en un modal de consentimiento de cookies
 */
export function CookieConsentBannerExample() {
  const handleAcceptAll = () => {
    handleCookieConsentAccepted();
    // Cerrar banner
  };

  const handleRejectAll = () => {
    handleCookieConsentRejected();
    // Cerrar banner
  };

  const handleCustomize = (analytics: boolean, marketing: boolean) => {
    handlePartialConsent(analytics, marketing);
    // Cerrar banner
  };

  // ... resto del componente
}

// ============================================================================
// EJEMPLO 11: Datos Personalizados Avanzados
// ============================================================================

export function trackUserTier(tier: string) {
  gtmPush({
    user_tier: tier, // 'free', 'premium', 'enterprise'
  });
}

export function trackExperimentVariant(experimentId: string, variantId: string) {
  gtmPush({
    experiment_id: experimentId,
    experiment_variant: variantId,
  });
}

export function trackErrorPage(errorCode: number, errorMessage?: string) {
  gtmEvent('error_page', {
    error_code: errorCode,
    error_message: errorMessage,
  });
}

export function trackVideoPlay(videoId: string, videoTitle: string) {
  gtmEvent('video_start', {
    video_id: videoId,
    video_title: videoTitle,
  });
}

export function trackFormSubmission(formName: string, success: boolean) {
  gtmEvent('form_submit', {
    form_name: formName,
    success: success,
  });
}
