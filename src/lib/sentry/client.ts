/**
 * Cliente de Sentry para IMAGIQ Frontend
 *
 * Proporciona funciones para:
 * - Inicializar Sentry desde el backend
 * - Capturar errores y mensajes
 * - Gestionar información del usuario
 * - Configurar el tunnel para enviar eventos
 *
 * @module sentry/client
 */

import * as Sentry from '@sentry/nextjs';
import { sentryConfig } from './config';
import { apiGet } from '@/lib/api-client';

/** Flag para evitar inicializaciones múltiples */
let sentryInitialized = false;

/** Flag para rastrear si la configuración está siendo cargada */
let configLoading = false;

/**
 * Inicializa Sentry obteniendo la configuración desde el backend
 *
 * Condiciones para inicializar:
 * 1. Sentry debe estar habilitado en la configuración
 * 2. Debe ejecutarse en el cliente (no SSR)
 * 3. No debe haberse inicializado antes
 * 4. El usuario debe haber dado consentimiento de analytics
 *
 * @example
 * ```typescript
 * import { initSentry } from '@/lib/sentry/client';
 *
 * if (hasAnalyticsConsent()) {
 *   initSentry();
 * }
 * ```
 */
export async function initSentry(): Promise<void> {
  // Validaciones previas
  if (!sentryConfig.enabled) {
    console.log('[Sentry] Disabled via config');
    return;
  }

  if (sentryInitialized) {
    console.log('[Sentry] Already initialized');
    return;
  }

  if (configLoading) {
    console.log('[Sentry] Already loading configuration');
    return;
  }

  if (globalThis.window === undefined) {
    console.log('[Sentry] Running in server, skipping');
    return;
  }

  try {
    configLoading = true;
    console.log('[Sentry] Fetching configuration from backend...');

    // Obtener la configuración desde el backend con autenticación API Key
    const config = await apiGet<{
      dsn: string;
      environment?: string;
      tracesSampleRate?: number;
      replaysSessionSampleRate?: number;
      replaysOnErrorSampleRate?: number;
    }>('/api/custommer/analytics/sentry/config');

    if (!config || !config.dsn) {
      console.warn('[Sentry] Configuration not available from backend, skipping initialization');
      configLoading = false;
      return;
    }

    console.log('[Sentry] Configuration received, initializing SDK...');

    // Inicializar Sentry con la configuración obtenida del backend
    Sentry.init({
      dsn: config.dsn,
      environment: config.environment || 'production',
      tracesSampleRate: config.tracesSampleRate ?? 0.1,
      replaysSessionSampleRate: config.replaysSessionSampleRate ?? 0.1,
      replaysOnErrorSampleRate: config.replaysOnErrorSampleRate ?? 1,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
    });

    // Exponer Sentry globalmente para compatibilidad
    if (globalThis.window) {
      globalThis.window.Sentry = Sentry as unknown as typeof globalThis.window.Sentry;
    }

    sentryInitialized = true;
    configLoading = false;
    console.log('[Sentry] Initialization complete');
  } catch (error) {
    console.error('[Sentry] Error during initialization:', error);
    configLoading = false;
  }
}

/**
 * Captura un error y lo envía a Sentry
 *
 * @param error - Error a capturar
 * @param context - Contexto adicional (componente, acción, etc.)
 *
 * @example
 * ```typescript
 * import { captureError } from '@/lib/sentry/client';
 *
 * try {
 *   throw new Error('Something went wrong');
 * } catch (error) {
 *   captureError(error as Error, {
 *     component: 'ProductCard',
 *     action: 'addToCart',
 *     productId: '123',
 *   });
 * }
 * ```
 */
export function captureError(error: Error, context?: Record<string, unknown>): void {
  if (!sentryInitialized) {
    console.log('[Sentry] Not initialized, skipping error capture');
    return;
  }

  try {
    Sentry.captureException(error, {
      contexts: context ? { custom: context } : undefined,
    });
    console.log('[Sentry] Error captured:', error.message);
  } catch (err) {
    console.error('[Sentry] Failed to capture error:', err);
  }
}

/**
 * Captura un mensaje y lo envía a Sentry
 *
 * @param message - Mensaje a capturar
 * @param level - Nivel de severidad
 *
 * @example
 * ```typescript
 * import { captureMessage } from '@/lib/sentry/client';
 *
 * captureMessage('User completed checkout', 'info');
 * captureMessage('Payment gateway timeout', 'warning');
 * captureMessage('Critical database error', 'error');
 * ```
 */
export function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info'
): void {
  if (!sentryInitialized) {
    console.log('[Sentry] Not initialized, skipping message capture');
    return;
  }

  try {
    Sentry.captureMessage(message, level);
    console.log('[Sentry] Message captured:', message, `(${level})`);
  } catch (err) {
    console.error('[Sentry] Failed to capture message:', err);
  }
}

/**
 * Establece información del usuario para asociarla con los eventos
 *
 * Útil para rastrear errores por usuario específico
 *
 * @param user - Información del usuario
 *
 * @example
 * ```typescript
 * import { setUser } from '@/lib/sentry/client';
 *
 * // Después del login
 * setUser({
 *   id: user.id,
 *   email: user.email,
 *   username: user.username,
 * });
 * ```
 */
export function setUser(user: {
  id?: string;
  email?: string;
  username?: string;
}): void {
  if (!sentryInitialized) {
    console.debug('[Sentry] Not initialized, skipping setUser');
    return;
  }

  try {
    Sentry.setUser(user);
    console.debug('[Sentry] User set:', user.id || user.email || 'anonymous');
  } catch (err) {
    console.error('[Sentry] Failed to set user:', err);
  }
}

/**
 * Limpia la información del usuario
 *
 * Debe llamarse al hacer logout para no asociar eventos futuros con el usuario anterior
 *
 * @example
 * ```typescript
 * import { clearUser } from '@/lib/sentry/client';
 *
 * // Al hacer logout
 * clearUser();
 * ```
 */
export function clearUser(): void {
  if (!sentryInitialized) {
    console.debug('[Sentry] Not initialized, skipping clearUser');
    return;
  }

  try {
    Sentry.setUser(null);
    console.debug('[Sentry] User cleared');
  } catch (err) {
    console.error('[Sentry] Failed to clear user:', err);
  }
}

/**
 * Verifica si Sentry está inicializado y listo para usar
 *
 * @returns true si Sentry está inicializado
 *
 * @example
 * ```typescript
 * import { isSentryInitialized } from '@/lib/sentry/client';
 *
 * if (isSentryInitialized()) {
 *   captureError(new Error('Test'));
 * }
 * ```
 */
export function isSentryInitialized(): boolean {
  return sentryInitialized;
}
