/**
 * Utilidades para la integración con Flixmedia
 * Funciones para verificar disponibilidad de contenido multimedia
 */

const FLIXMEDIA_CONFIG = {
  distributorId: "17257",
  language: "f5",
  matchApiUrl: "https://media.flixcar.com/delivery/webcall/match",
  contentUrl: "https://media.flixcar.com/delivery/webcall/content",
} as const;

export interface FlixmediaAvailability {
  available: boolean;
  productId?: string;
}

/**
 * Verifica si Flixmedia tiene contenido para un MPN/SKU específico
 */
export async function checkFlixmediaAvailability(
  mpn: string,
  distributorId: string = FLIXMEDIA_CONFIG.distributorId,
  language: string = FLIXMEDIA_CONFIG.language
): Promise<FlixmediaAvailability> {
  try {
    const url = `${FLIXMEDIA_CONFIG.matchApiUrl}/${distributorId}/${language}/mpn/${mpn}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.event === "matchhit" && data.product_id) {
      return { available: true, productId: data.product_id };
    } else {
      return { available: false };
    }
  } catch {
    return { available: false };
  }
}

/**
 * Verifica si Flixmedia tiene contenido para un EAN/Barcode específico
 */
export async function checkFlixmediaAvailabilityByEan(
  ean: string,
  distributorId: string = FLIXMEDIA_CONFIG.distributorId,
  language: string = FLIXMEDIA_CONFIG.language
): Promise<FlixmediaAvailability> {
  try {
    const url = `${FLIXMEDIA_CONFIG.matchApiUrl}/${distributorId}/${language}/ean/${ean}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.event === "matchhit" && data.product_id) {
      return { available: true, productId: data.product_id };
    } else {
      return { available: false };
    }
  } catch {
    return { available: false };
  }
}

/**
 * Busca el primer SKU disponible en una lista de SKUs
 * OPTIMIZADO: Usa Promise.any() para búsqueda paralela en lugar de secuencial
 * Esto reduce el tiempo de búsqueda de O(n) a O(1) en el mejor caso
 */
export async function findAvailableSku(skus: string[]): Promise<string | null> {
  try {
    // Crear una promesa por cada SKU que resuelva solo si tiene contenido disponible
    const promises = skus.map(async (sku) => {
      const result = await checkFlixmediaAvailability(sku);
      if (result.available) {
        return sku; // Resuelve con el SKU si está disponible
      }
      throw new Error(`SKU ${sku} no disponible`); // Rechaza si no está disponible
    });

    // Promise.any() devuelve el primer SKU que tenga contenido disponible
    // Todas las peticiones se hacen en paralelo, reduciendo el tiempo total
    const availableSku = await Promise.any(promises);
    return availableSku;
  } catch {
    // Solo llega aquí si TODOS los SKUs fallaron (AggregateError)
    return null;
  }
}

/**
 * Busca el primer EAN disponible en una lista de EANs
 * OPTIMIZADO: Usa Promise.any() para búsqueda paralela en lugar de secuencial
 * Esto reduce el tiempo de búsqueda de O(n) a O(1) en el mejor caso
 */
export async function findAvailableEan(eans: string[]): Promise<string | null> {
  try {
    // Crear una promesa por cada EAN que resuelva solo si tiene contenido disponible
    const promises = eans.map(async (ean) => {
      const result = await checkFlixmediaAvailabilityByEan(ean);
      if (result.available) {
        return ean; // Resuelve con el EAN si está disponible
      }
      throw new Error(`EAN ${ean} no disponible`); // Rechaza si no está disponible
    });

    // Promise.any() devuelve el primer EAN que tenga contenido disponible
    // Todas las peticiones se hacen en paralelo, reduciendo el tiempo total
    const availableEan = await Promise.any(promises);
    return availableEan;
  } catch {
    // Solo llega aquí si TODOS los EANs fallaron (AggregateError)
    return null;
  }
}

/**
 * Construye la URL del iframe de Flixmedia
 */
export function buildFlixmediaUrl(
  mpn: string,
  distributorId: string = FLIXMEDIA_CONFIG.distributorId,
  language: string = FLIXMEDIA_CONFIG.language
): string {
  return `${FLIXMEDIA_CONFIG.contentUrl}/${distributorId}/${language}/mpn/${mpn}`;
}

/**
 * Genera variantes del MPN para probar con Flixmedia
 * Algunos productos usan formato con guiones/barras y otros sin ellos
 */
export function generateMpnVariants(mpn: string): string[] {
  const variants: string[] = [mpn]; // Original primero
  
  // Variante sin caracteres especiales (guiones, barras, espacios)
  const normalized = mpn.replace(/[-\/\s]/g, '');
  if (normalized !== mpn) {
    variants.push(normalized);
  }
  
  // Variante con guiones convertidos a barras
  const withSlash = mpn.replace(/-/g, '/');
  if (withSlash !== mpn && !variants.includes(withSlash)) {
    variants.push(withSlash);
  }
  
  // Variante con barras convertidas a guiones
  const withDash = mpn.replace(/\//g, '-');
  if (withDash !== mpn && !variants.includes(withDash)) {
    variants.push(withDash);
  }
  
  return variants;
}

/**
 * Procesa una cadena de SKUs (separados por comas) y devuelve un array
 */
export function parseSkuString(skuString: string): string[] {
  return skuString
    .split(",")
    .map((sku) => sku.trim())
    .filter((sku) => sku.length > 0);
}

/**
 * Prefetch del script de Flixmedia para mejorar la velocidad de carga
 * Se debe llamar en eventos como hover o focus, o al inicio de la página
 */
export function prefetchFlixmediaScript() {
  if (typeof window === 'undefined') return;

  // Verificar si ya existe el preload o el script
  if (
    document.querySelector('link[href*="flixfacts.com/js/loader.js"]') ||
    document.querySelector('script[src*="flixfacts.com/js/loader.js"]')
  ) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'script';
  link.href = '//media.flixfacts.com/js/loader.js';
  document.head.appendChild(link);

  console.log('🚀 [Flixmedia] Script prefetching initiated');
}

/**
 * Precarga el script de Flixmedia INMEDIATAMENTE al cargar la página
 * Esto reduce significativamente el tiempo de carga del contenido multimedia
 * Según la guía de Flixmedia, esto mejora la percepción de velocidad
 */
export function preloadFlixmediaScriptEarly() {
  if (typeof window === 'undefined') return;

  // Usar dns-prefetch y preconnect para optimizar la conexión
  const dnsPrefetch = document.createElement('link');
  dnsPrefetch.rel = 'dns-prefetch';
  dnsPrefetch.href = '//media.flixfacts.com';
  document.head.appendChild(dnsPrefetch);

  const preconnect = document.createElement('link');
  preconnect.rel = 'preconnect';
  preconnect.href = 'https://media.flixfacts.com';
  preconnect.crossOrigin = 'anonymous';
  document.head.appendChild(preconnect);

  // Precargar el script de loader
  prefetchFlixmediaScript();

  console.log('🚀 [Flixmedia] Early preload + DNS prefetch + preconnect initialized');
}
