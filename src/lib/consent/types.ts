/**
 * Sistema de Consentimiento para IMAGIQ
 *
 * Tipos TypeScript para el manejo de consentimiento de cookies
 * cumpliendo con las políticas de privacidad colombianas.
 *
 * Categorías:
 * - Necesarias: Sesión, carrito, autenticación (siempre activas)
 * - Analytics: Microsoft Clarity (opcional)
 * - Marketing: Google Tag Manager, Meta Pixel, TikTok Pixel (opcional)
 */

/**
 * Estado de consentimiento del usuario
 */
export interface ConsentState {
  /** Consentimiento para cookies de análisis (Clarity) */
  analytics: boolean;

  /** Consentimiento para cookies de publicidad (GTM, Meta Pixel, TikTok) */
  ads: boolean;

  /** Timestamp de cuándo se guardó el consentimiento */
  timestamp: number;

  /** Versión del sistema de consentimiento */
  version: string;
}

/**
 * Categorías de cookies con sus metadatos
 */
export interface ConsentCategories {
  necessary: {
    enabled: boolean;
    locked: boolean;
    description: string;
    services: string[];
  };
  analytics: {
    enabled: boolean;
    locked: boolean;
    description: string;
    services: string[];
  };
  marketing: {
    enabled: boolean;
    locked: boolean;
    description: string;
    services: string[];
  };
}

/**
 * Respuesta simplificada para window.getConsent()
 */
export interface ConsentResponse {
  analytics: boolean;
  ads: boolean;
}

/**
 * Estado de permiso de ubicación
 */
export interface LocationPermissionState {
  /** Permiso de ubicación otorgado */
  granted: boolean;

  /** Timestamp de cuándo se guardó el permiso */
  timestamp: number;

  /** Versión del sistema de permisos */
  version: string;
}
