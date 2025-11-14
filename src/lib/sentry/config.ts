/**
 * Configuración de Sentry para IMAGIQ Frontend
 *
 * - Carga el SDK desde el backend (first-party)
 * - Usa tunnel para enviar eventos a través del backend
 * - Respeta el consentimiento de analytics del usuario
 * - No expone credenciales (DSN) en el frontend
 *
 * @module sentry/config
 */

/**
 * Configuración de Sentry para IMAGIQ
 *
 * Arquitectura:
 * - El backend expone el DSN y configuración via API
 * - El frontend inicializa el SDK con la configuración del backend
 * - Los eventos se envían directamente al DSN de Sentry
 */
export const sentryConfig = {
  /**
   * Habilita/deshabilita Sentry globalmente
   */
  enabled: process.env.NEXT_PUBLIC_ENABLE_SENTRY !== 'false',

  /**
   * Integraciones esperadas
   */
  expectedIntegrations: ['BrowserTracing', 'Replay'],
} as const;

/**
 * Declaración de tipos globales para TypeScript
 */
declare global {
  interface Window {
    Sentry?: {
      captureException: (exception: unknown, context?: unknown) => string;
      captureMessage: (message: string, level?: 'info' | 'warning' | 'error') => string;
      setUser: (user: { id?: string; email?: string; username?: string } | null) => void;
    };
  }
}
