/**
 * Utilidades para anonimización de datos personales
 *
 * Cumplimiento Ley 1581 de 2012 (Colombia):
 * - Datos anonimizados NO son considerados datos personales
 * - No se puede identificar al titular con estos datos
 *
 * @module analytics/utils/anonymize
 */

/**
 * Anonimiza una dirección IP reemplazando el último octeto con 0
 *
 * Esto hace que la IP sea NO identificable según Ley 1581:
 * - No puede asociarse a una persona natural determinada
 * - Útil para análisis geográfico agregado (ciudad/región)
 * - No útil para identificación individual
 *
 * @param ip - Dirección IP a anonimizar (IPv4 o IPv6)
 * @returns IP anonimizada
 *
 * @example
 * ```typescript
 * anonymizeIP('203.0.113.45')  // → '203.0.113.0'
 * anonymizeIP('192.168.1.100') // → '192.168.1.0'
 * anonymizeIP('2001:db8::1')   // → '2001:db8::'
 * ```
 */
export function anonymizeIP(ip: string): string {
  if (!ip) return '0.0.0.0';

  // IPv4
  if (ip.includes('.')) {
    const parts = ip.split('.');
    if (parts.length !== 4) return '0.0.0.0';

    // Reemplazar último octeto con 0
    parts[3] = '0';
    return parts.join('.');
  }

  // IPv6
  if (ip.includes(':')) {
    const parts = ip.split(':');
    // Mantener solo los primeros 4 grupos (equivalente a /64)
    const anonymized = parts.slice(0, 4).join(':');
    return `${anonymized}::`;
  }

  return '0.0.0.0';
}

/**
 * Resultado de extracción de cookies de Facebook
 */
export interface FacebookCookies {
  fbp: string | null;
  fbc: string | null;
}

/**
 * Extrae cookies de Facebook del navegador
 *
 * @returns Objeto con fbp y fbc (o null si no existen)
 *
 * @example
 * ```typescript
 * const { fbp, fbc } = getFacebookCookies();
 * // { fbp: 'fb.1.xxx', fbc: 'fb.2.yyy' }
 * ```
 */
export function getFacebookCookies(): FacebookCookies {
  if (typeof document === 'undefined') {
    return { fbp: null, fbc: null };
  }

  const cookies = document.cookie.split(';').reduce<Record<string, string>>((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    if (key && value) {
      acc[key] = value;
    }
    return acc;
  }, {});

  return {
    fbp: cookies['_fbp'] ?? null,
    fbc: cookies['_fbc'] ?? null,
  };
}
