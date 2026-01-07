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

import posthog from "posthog-js";
import type { CampaignData } from "@/components/InWebCampaign/types";

// Configuración de claves y host de PostHog
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || "";
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

// Configuración avanzada del cliente PostHog
export const posthogConfig = {
  api_host: POSTHOG_HOST, // URL del servidor PostHog
  loaded: (_posthog: unknown) => {
    // Callback cuando PostHog se carga correctamente
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
  // Only initialize in browser environment
  if (typeof window === "undefined") {
    return;
  }

  // Return early if PostHog key is empty
  if (!POSTHOG_KEY) {
    console.warn("PostHog key is not set. PostHog will not be initialized.");
    return;
  }

  // Check if PostHog is already initialized
  if (posthog.__loaded) {
    return;
  }

  try {
    posthog.init(POSTHOG_KEY, posthogConfig);
    console.log("PostHog initialized successfully");
  } catch (error) {
    console.error("Error initializing PostHog:", error);
  }
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
    if (typeof window === "undefined") return;
    try {
      posthog.identify(userId, userProperties);
      currentUserId = userId;
    } catch (error) {
      console.error("Error identifying user in PostHog:", error);
    }
  },

  /**
   * Captura un evento personalizado en PostHog, incluyendo el userId si está disponible
   * @param eventName - Nombre del evento
   * @param properties - Propiedades adicionales del evento
   */
  capture: (eventName: string, properties?: Record<string, unknown>) => {
    if (typeof window === "undefined") return;
    try {
      const eventProps = {
        ...(properties || {}),
        ...(currentUserId ? { userId: currentUserId } : {}),
      };
      posthog.capture(eventName, eventProps);
    } catch (error) {
      console.error("Error capturing event in PostHog:", error);
    }
  },

  /**
   * Captura una vista de página
   * @param pageName - Nombre de la página (opcional)
   */
  capturePageView: (pageName?: string) => {
    if (typeof window === "undefined") return;
    try {
      const page = pageName || window.location.pathname;
      posthog.capture("$pageview", { page });
    } catch (error) {
      console.error("Error capturing page view in PostHog:", error);
    }
  },

  /**
   * Evalúa si un feature flag está habilitado
   * @param flagKey - Clave del feature flag
   * @returns boolean
   */
  isFeatureEnabled: (flagKey: string): boolean => {
    if (typeof window === "undefined") return false;
    try {
      return posthog.isFeatureEnabled(flagKey) || false;
    } catch (error) {
      console.error("Error checking feature flag in PostHog:", error);
      return false;
    }
  },

  /**
   * Inicia la grabación de sesión (session replay)
   */
  startSessionRecording: () => {
    if (typeof window === "undefined") return;
    try {
      posthog.startSessionRecording();
    } catch (error) {
      console.error("Error starting session recording in PostHog:", error);
    }
  },

  /**
   * Detiene la grabación de sesión
   */
  stopSessionRecording: () => {
    if (typeof window === "undefined") return;
    try {
      posthog.stopSessionRecording();
    } catch (error) {
      console.error("Error stopping session recording in PostHog:", error);
    }
  },

  /**
   * Resetea el usuario (logout)
   */
  reset: () => {
    if (typeof window === "undefined") return;
    try {
      posthog.reset();
      currentUserId = null;
    } catch (error) {
      console.error("Error resetting user in PostHog:", error);
    }
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
  // Aquí iría la llamada real al SDK de PostHog
  void eventName;
  void eventData;
  // posthog.capture(eventName, eventData);
}

/**
 * Track when an in-web notification campaign is shown to the user
 * @param campaign - Campaign data object
 * @param userId - Optional user ID
 */
export function trackInWebNotificationShown(
  campaign: CampaignData,
  userId?: string
) {
  if (!campaign) return;

  const properties: Record<string, unknown> = {
    campaign_name: campaign.campaign_name,
    campaign_type: campaign.campaign_type,
    content_type: campaign.content_type,
    display_style: campaign.display_style,
    content_url: campaign.content_url,
  };

  if (userId) {
    properties.userId = userId;
  }

  posthogUtils.capture("inweb_notification_shown", properties);
}

/**
 * Track when a user clicks on an in-web notification campaign
 * @param campaign - Campaign data object
 * @param userId - Optional user ID
 */
export function trackInWebNotificationClicked(
  campaign: CampaignData,
  userId?: string
) {
  if (!campaign) return;

  const properties: Record<string, unknown> = {
    campaign_name: campaign.campaign_name,
    campaign_type: campaign.campaign_type,
    content_type: campaign.content_type,
    display_style: campaign.display_style,
    content_url: campaign.content_url,
  };

  if (userId) {
    properties.userId = userId;
  }

  posthogUtils.capture("inweb_notification_clicked", properties);
}

// -------------------------------------------------------------
// Los datos capturados se envían a los servidores de PostHog
// Puedes consultarlos en el dashboard web de PostHog
// -------------------------------------------------------------
