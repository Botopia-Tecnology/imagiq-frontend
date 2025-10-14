/**
 * Meta Pixel (Facebook Pixel) - Ejemplos de Uso
 *
 * Este archivo contiene ejemplos prácticos de cómo usar Meta Pixel
 * en diferentes escenarios de un ecommerce.
 *
 * NO IMPORTAR ESTE ARCHIVO - Solo para referencia
 */

import {
  fbqPageView,
  fbqViewContent,
  fbqSearch,
  fbqAddToCart,
  fbqAddToWishlist,
  fbqInitiateCheckout,
  fbqAddPaymentInfo,
  fbqPurchase,
  fbqLead,
  fbqCompleteRegistration,
  fbqContact,
  fbqSubscribe,
  fbqTrackCustom,
  fbqConsent,
} from './meta-pixel';

// ============================================================
// EJEMPLO 1: Tracking de PageView en cambio de ruta (SPA)
// ============================================================
// Usar cuando el usuario navega a una nueva página en tu SPA
function example_trackPageView() {
  fbqPageView();
}

// ============================================================
// EJEMPLO 2: ViewContent - Ver producto
// ============================================================
// Disparar cuando un usuario ve un producto individual
function example_viewProduct() {
  fbqViewContent({
    content_name: 'Camiseta Nike Deportiva',
    content_ids: ['PROD-12345'],
    content_type: 'product',
    value: 29.99,
    currency: 'USD',
  });
}

// ============================================================
// EJEMPLO 3: Search - Búsqueda de productos
// ============================================================
// Disparar cuando un usuario realiza una búsqueda
function example_searchProducts() {
  fbqSearch({
    search_string: 'zapatillas running',
    content_category: 'Deportes',
    value: 0,
    currency: 'USD',
  });
}

// ============================================================
// EJEMPLO 4: AddToCart - Agregar al carrito
// ============================================================
// Disparar cuando un usuario agrega un producto al carrito
function example_addToCart() {
  fbqAddToCart({
    content_name: 'Zapatillas Adidas Running',
    content_ids: ['PROD-67890'],
    content_type: 'product',
    value: 89.99,
    currency: 'USD',
  });
}

// ============================================================
// EJEMPLO 5: AddToWishlist - Agregar a favoritos
// ============================================================
// Disparar cuando un usuario agrega un producto a su wishlist
function example_addToWishlist() {
  fbqAddToWishlist({
    content_name: 'Laptop Dell XPS 13',
    content_ids: ['PROD-11111'],
    content_category: 'Electrónica',
    value: 1299.99,
    currency: 'USD',
  });
}

// ============================================================
// EJEMPLO 6: InitiateCheckout - Iniciar checkout
// ============================================================
// Disparar cuando un usuario inicia el proceso de checkout
function example_initiateCheckout() {
  fbqInitiateCheckout({
    content_ids: ['PROD-12345', 'PROD-67890'],
    num_items: 2,
    value: 119.98,
    currency: 'USD',
  });
}

// ============================================================
// EJEMPLO 7: AddPaymentInfo - Agregar info de pago
// ============================================================
// Disparar cuando un usuario agrega información de pago
function example_addPaymentInfo() {
  fbqAddPaymentInfo({
    content_ids: ['PROD-12345', 'PROD-67890'],
    value: 119.98,
    currency: 'USD',
  });
}

// ============================================================
// EJEMPLO 8: Purchase - Compra completada
// ============================================================
// Disparar cuando un usuario completa una compra exitosamente
function example_purchase() {
  fbqPurchase({
    content_ids: ['PROD-12345', 'PROD-67890'],
    content_type: 'product',
    value: 119.98,
    currency: 'USD',
    num_items: 2,
  });
}

// ============================================================
// EJEMPLO 9: CompleteRegistration - Registro completado
// ============================================================
// Disparar cuando un usuario completa el registro
function example_completeRegistration() {
  fbqCompleteRegistration({
    content_name: 'Usuario registrado',
    status: 'completed',
    value: 0,
    currency: 'USD',
  });
}

// ============================================================
// EJEMPLO 10: Lead - Formulario de contacto
// ============================================================
// Disparar cuando un usuario completa un formulario de leads
function example_lead() {
  fbqLead({
    content_name: 'Formulario de contacto empresarial',
    content_category: 'Ventas Corporativas',
    value: 0,
    currency: 'USD',
  });
}

// ============================================================
// EJEMPLO 11: Contact - Usuario contacta
// ============================================================
// Disparar cuando un usuario inicia contacto (chat, teléfono)
function example_contact() {
  fbqContact();
}

// ============================================================
// EJEMPLO 12: Subscribe - Suscripción a newsletter
// ============================================================
// Disparar cuando un usuario se suscribe al newsletter
function example_subscribe() {
  fbqSubscribe({
    value: 0,
    currency: 'USD',
    predicted_ltv: 100, // Valor de vida predicho del cliente
  });
}

// ============================================================
// EJEMPLO 13: Custom Event - Evento personalizado
// ============================================================
// Disparar un evento personalizado para tracking específico
function example_customEvent() {
  fbqTrackCustom('ProductReviewed', {
    product_id: 'PROD-12345',
    rating: 5,
    review_text_length: 250,
  });
}

// ============================================================
// EJEMPLO 14: Gestión de consentimiento GDPR/CCPA
// ============================================================
// Otorgar o revocar consentimiento según preferencias del usuario
function example_consentManagement() {
  // Usuario acepta cookies
  fbqConsent('grant');

  // Usuario rechaza cookies
  // fbqConsent('revoke');
}

// ============================================================
// EJEMPLO 15: Integración con React Component - Producto
// ============================================================
/*
'use client';

import { useEffect } from 'react';
import { fbqViewContent } from '@/lib/meta-pixel';

interface ProductPageProps {
  product: {
    id: string;
    name: string;
    price: number;
  };
}

export default function ProductPage({ product }: ProductPageProps) {
  useEffect(() => {
    // Track view cuando el componente se monta
    fbqViewContent({
      content_name: product.name,
      content_ids: [product.id],
      content_type: 'product',
      value: product.price,
      currency: 'USD',
    });
  }, [product.id, product.name, product.price]);

  return (
    <div>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
    </div>
  );
}
*/

// ============================================================
// EJEMPLO 16: Integración con botón Add to Cart
// ============================================================
/*
'use client';

import { fbqAddToCart } from '@/lib/meta-pixel';

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  productPrice: number;
}

export default function AddToCartButton({
  productId,
  productName,
  productPrice,
}: AddToCartButtonProps) {
  const handleAddToCart = () => {
    // Lógica de agregar al carrito...

    // Track el evento
    fbqAddToCart({
      content_name: productName,
      content_ids: [productId],
      content_type: 'product',
      value: productPrice,
      currency: 'USD',
    });
  };

  return (
    <button onClick={handleAddToCart}>
      Agregar al carrito
    </button>
  );
}
*/

// ============================================================
// EJEMPLO 17: Integración con Success Page de Checkout
// ============================================================
/*
'use client';

import { useEffect } from 'react';
import { fbqPurchase } from '@/lib/meta-pixel';

interface CheckoutSuccessProps {
  order: {
    items: Array<{ id: string }>;
    total: number;
    itemCount: number;
  };
}

export default function CheckoutSuccess({ order }: CheckoutSuccessProps) {
  useEffect(() => {
    // Track purchase una sola vez
    fbqPurchase({
      content_ids: order.items.map(item => item.id),
      content_type: 'product',
      value: order.total,
      currency: 'USD',
      num_items: order.itemCount,
    });
  }, []); // Array vacío = ejecutar solo una vez

  return (
    <div>
      <h1>¡Compra exitosa!</h1>
      <p>Total: ${order.total}</p>
    </div>
  );
}
*/

// ============================================================
// EJEMPLO 18: Integración con Hook useEffect en Next.js
// ============================================================
/*
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { fbqPageView } from '@/lib/meta-pixel';

export function MetaPixelPageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track page view en cada cambio de ruta
    fbqPageView();
  }, [pathname, searchParams]);

  return null;
}

// Agregar en layout.tsx dentro del body:
// <MetaPixelPageViewTracker />
*/

// ============================================================
// EJEMPLO 19: Integración con Context de Consentimiento
// ============================================================
/*
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { fbqConsent } from '@/lib/meta-pixel';

const ConsentContext = createContext<{
  hasConsent: boolean;
  grantConsent: () => void;
  revokeConsent: () => void;
} | null>(null);

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [hasConsent, setHasConsent] = useState(false);

  const grantConsent = () => {
    setHasConsent(true);
    fbqConsent('grant');
    localStorage.setItem('analytics-consent', 'granted');
  };

  const revokeConsent = () => {
    setHasConsent(false);
    fbqConsent('revoke');
    localStorage.setItem('analytics-consent', 'denied');
  };

  useEffect(() => {
    const consent = localStorage.getItem('analytics-consent');
    if (consent === 'granted') {
      setHasConsent(true);
      fbqConsent('grant');
    }
  }, []);

  return (
    <ConsentContext.Provider value={{ hasConsent, grantConsent, revokeConsent }}>
      {children}
    </ConsentContext.Provider>
  );
}

export const useConsent = () => {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error('useConsent must be used within ConsentProvider');
  }
  return context;
};
*/
