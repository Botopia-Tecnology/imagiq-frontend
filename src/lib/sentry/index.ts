/**
 * Sentry Integration for IMAGIQ Frontend
 *
 * Sistema completo de error tracking, performance monitoring y session replay
 * integrado con el backend para evitar exponer credenciales.
 *
 * @module sentry
 *
 * @example
 * ```typescript
 * // Capturar un error
 * import { captureError } from '@/lib/sentry';
 *
 * try {
 *   throw new Error('Something went wrong');
 * } catch (error) {
 *   captureError(error as Error, {
 *     component: 'ProductCard',
 *     action: 'addToCart',
 *   });
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Setear usuario después del login
 * import { setUser } from '@/lib/sentry';
 *
 * setUser({
 *   id: user.id,
 *   email: user.email,
 *   username: user.username,
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Limpiar usuario al hacer logout
 * import { clearUser } from '@/lib/sentry';
 *
 * clearUser();
 * ```
 */

export {
  initSentry,
  captureError,
  captureMessage,
  setUser,
  clearUser,
  isSentryInitialized,
} from './client';

export { sentryConfig } from './config';
