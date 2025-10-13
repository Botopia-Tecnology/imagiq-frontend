/**
 * Utilidades para Microsoft Clarity
 *
 * Helper functions para interactuar con Clarity sin exponer
 * ningún Project ID en el frontend.
 */

/**
 * Tipo para el objeto global de Clarity
 */
declare global {
  interface Window {
    clarity?: {
      (action: 'event', eventName: string): void;
      (action: 'identify', userId: string): void;
      (action: 'set', key: string, value: string | number | boolean): void;
      (action: 'consent', granted: boolean): void;
      (action: 'upgrade', userId: string): void;
      (action: 'set', key: 'project', projectId: string): void;
      q?: [action: string, ...params: unknown[]][];
    };
  }
}

/**
 * Envía un evento personalizado a Microsoft Clarity
 *
 * @param eventName - Nombre del evento (ej: 'AddToCart', 'Checkout', etc.)
 * @example
 * ```ts
 * clarityEvent('AddToCart');
 * clarityEvent('PurchaseCompleted');
 * ```
 */
export function clarityEvent(eventName: string): void {
  try {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('event', eventName);
    }
  } catch (error) {
    // Fallar silenciosamente - analytics no debe romper la app
    console.debug('Clarity event error:', error);
  }
}

/**
 * Identifica al usuario actual en Clarity
 *
 * IMPORTANTE: Pasar solo un hash o ID anónimo, nunca información personal
 *
 * @param userId - ID hasheado o anónimo del usuario
 * @example
 * ```ts
 * clarityIdentify('user_abc123_hashed');
 * ```
 */
export function clarityIdentify(userId: string): void {
  try {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('identify', userId);
    }
  } catch (error) {
    console.debug('Clarity identify error:', error);
  }
}

/**
 * Envía una métrica personalizada a Clarity
 *
 * @param key - Nombre de la métrica
 * @param value - Valor de la métrica
 * @example
 * ```ts
 * claritySet('plan', 'premium');
 * claritySet('user_type', 'returning');
 * ```
 */
export function claritySet(key: string, value: string | number | boolean): void {
  try {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('set', key, String(value));
    }
  } catch (error) {
    console.debug('Clarity set error:', error);
  }
}

/**
 * Actualiza el consentimiento de Clarity
 *
 * @param consent - 'grant' para permitir, 'deny' para denegar
 * @example
 * ```ts
 * clarityConsent('grant'); // Usuario aceptó cookies
 * clarityConsent('deny');  // Usuario rechazó cookies
 * ```
 */
export function clarityConsent(consent: 'grant' | 'deny'): void {
  try {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('consent', consent === 'grant');
    }
  } catch (error) {
    console.debug('Clarity consent error:', error);
  }
}
