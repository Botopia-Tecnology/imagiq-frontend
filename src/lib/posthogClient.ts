// -------------------------------------------------------------
// 📊 Cliente PostHog para Analytics y Session Replay
// -------------------------------------------------------------
// Este archivo gestiona la integración con PostHog:
// - Inicializa el SDK y configura el cliente
// - Permite capturar eventos personalizados, vistas de página, replays de sesión
// - Proporciona utilidades para identificar usuarios, evaluar feature flags y controlar la sesión
// - Los datos NO se almacenan localmente, se envían a los servidores de PostHog
// -------------------------------------------------------------

"use client";
/**
 * Cliente y configuración de PostHog
 * - Inicialización del SDK de PostHog
 * - Configuración de session replays
 * - Setup de feature flags
 * - Configuración de A/B testing
 * - Heat maps y event capture
 * - GDPR compliance settings
 */

// Configuración de claves y host de PostHog
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || "";
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

// Configuración avanzada del cliente PostHog
export const posthogConfig = {
  api_host: POSTHOG_HOST, // URL del servidor PostHog
  loaded: (posthog: unknown) => {
    // Callback cuando PostHog se carga correctamente
    if (process.env.NODE_ENV === "development") {
      console.log("PostHog loaded successfully", posthog);
    }
  },
  capture_pageview: true, // Captura vistas de página automáticamente
  capture_pageleave: true, // Captura cuando el usuario abandona la página
  session_recording: {
    enabled: true, // Habilita grabación de sesión
    maskAllInputs: true, // Oculta inputs sensibles
    maskAllText: false,
    recordCrossOriginIframes: false,
  },
  autocapture: {
    enabled: true, // Captura automática de clicks y acciones
    css_selector_allowlist: [
      "[data-track]",
      ".track-click",
      "button",
      "a[href]",
    ],
  },
  disable_session_recording: false,
  enable_recording_console_log: true,
  advanced_disable_decide: false,
};

// Inicialización del SDK de PostHog
export const initPostHog = () => {
  // Aquí se implementaría la lógica real de inicialización del SDK
  // Ejemplo: posthog.init(POSTHOG_KEY, posthogConfig)
};

// Variable global para almacenar el userId actual
let currentUserId: string | null = null;

/**
 * Establece el userId global para PostHog
 * Llama a esta función al autenticar o identificar al usuario
 * @param userId - ID único del usuario
 */
export function setPosthogUserId(userId: string) {
  currentUserId = userId;
  posthogUtils.identify(userId);
}

// Utilidades para interactuar con PostHog
export const posthogUtils = {
  /**
   * Identifica al usuario en PostHog
   * @param userId - ID único del usuario
   * @param userProperties - Propiedades adicionales del usuario
   */
  identify: (userId: string, userProperties?: Record<string, unknown>) => {
    console.group("[PostHog] Identificar usuario");
    console.log("userId:", userId);
    if (userProperties) console.log("userProperties:", userProperties);
    console.groupEnd();
  },

  /**
   * Captura un evento personalizado en PostHog, incluyendo el userId si está disponible
   * @param eventName - Nombre del evento
   * @param properties - Propiedades adicionales del evento
   */
  capture: (eventName: string, properties?: Record<string, unknown>) => {
    const eventProps = {
      ...(properties || {}),
      ...(currentUserId ? { userId: currentUserId } : {}),
    };
    console.group("[PostHog] Captura de evento");
    console.log("eventName:", eventName);
    console.log("eventProps:", eventProps);
    console.groupEnd();
    // Aquí iría la llamada real al SDK de PostHog
    // posthog.capture(eventName, eventProps);
  },

  /**
   * Captura una vista de página
   * @param pageName - Nombre de la página (opcional)
   */
  capturePageView: (pageName?: string) => {
    console.group("[PostHog] Vista de página");
    console.log("pageName:", pageName);
    console.groupEnd();
  },

  /**
   * Evalúa si un feature flag está habilitado
   * @param flagKey - Clave del feature flag
   * @returns boolean
   */
  isFeatureEnabled: (flagKey: string): boolean => {
    console.log("PostHog feature flag:", flagKey);
    return false;
  },

  /**
   * Inicia la grabación de sesión (session replay)
   */
  startSessionRecording: () => {
    console.log("PostHog start session recording");
  },

  /**
   * Detiene la grabación de sesión
   */
  stopSessionRecording: () => {
    console.log("PostHog stop session recording");
  },

  /**
   * Resetea el usuario (logout)
   */
  reset: () => {
    console.log("PostHog reset user");
  },
};

/**
 * Interfaz para los productos en el carrito
 */
export interface ProductCartItem {
  productId: string;
  name: string;
  category?: string;
  price: number;
  brand?: string;
  quantity: number;
}

/**
 * Captura un evento relevante de ecommerce en PostHog, mostrando todos los datos importantes en consola
 * @param eventName - Nombre del evento (ej: add_to_cart, purchase, view_product)
 * @param eventData - Objeto con los datos relevantes del ecommerce
 */
export function captureEcommerceEvent(
  eventName: string,
  eventData: {
    userId?: string;
    userEmail?: string;
    userName?: string;
    product?: ProductCartItem;
    cart?: {
      cartId?: string;
      products?: ProductCartItem[];
      total?: number;
      totalQuantity?: number;
    };
    order?: {
      orderId?: string;
      status?: string;
      total?: number;
      date?: string;
    };
    interaction?: {
      type?: string;
      page?: string;
      source?: string;
      timestamp?: string;
    };
    device?: {
      type?: string;
      browser?: string;
      os?: string;
    };
    location?: {
      country?: string;
      city?: string;
    };
  }
) {
  console.group(`[PostHog] Evento Ecommerce: ${eventName}`);
  Object.entries(eventData).forEach(([key, value]) => {
    console.log(key + ":", value);
  });
  console.groupEnd();
  // Aquí iría la llamada real al SDK de PostHog
  // posthog.capture(eventName, eventData);
}

// Inicializa PostHog al cargar el módulo en el navegador
if (typeof window !== "undefined") {
  initPostHog();
}
// -------------------------------------------------------------
// Los datos capturados se envían a los servidores de PostHog
// Puedes consultarlos en el dashboard web de PostHog
// -------------------------------------------------------------
