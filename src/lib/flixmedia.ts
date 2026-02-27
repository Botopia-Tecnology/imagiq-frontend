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

// Cache in-memory para respuestas del Match API (TTL: 5 minutos)
const matchCache = new Map<string, { result: FlixmediaAvailability; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function getCachedMatch(cacheKey: string): FlixmediaAvailability | null {
  const cached = matchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.result;
  }
  if (cached) matchCache.delete(cacheKey);
  return null;
}

function setCachedMatch(cacheKey: string, result: FlixmediaAvailability): void {
  matchCache.set(cacheKey, { result, timestamp: Date.now() });
}

/**
 * Verifica si Flixmedia tiene contenido para un MPN/SKU específico
 */
export async function checkFlixmediaAvailability(
  mpn: string,
  distributorId: string = FLIXMEDIA_CONFIG.distributorId,
  language: string = FLIXMEDIA_CONFIG.language
): Promise<FlixmediaAvailability> {
  const cacheKey = `mpn:${distributorId}:${language}:${mpn}`;
  const cached = getCachedMatch(cacheKey);
  if (cached) return cached;

  try {
    const url = `${FLIXMEDIA_CONFIG.matchApiUrl}/${distributorId}/${language}/mpn/${mpn}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.event === "matchhit" && data.product_id) {
      const result = { available: true, productId: data.product_id };
      setCachedMatch(cacheKey, result);
      return result;
    } else {
      const result = { available: false };
      setCachedMatch(cacheKey, result);
      return result;
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
  const cacheKey = `ean:${distributorId}:${language}:${ean}`;
  const cached = getCachedMatch(cacheKey);
  if (cached) return cached;

  try {
    const url = `${FLIXMEDIA_CONFIG.matchApiUrl}/${distributorId}/${language}/ean/${ean}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.event === "matchhit" && data.product_id) {
      const result = { available: true, productId: data.product_id };
      setCachedMatch(cacheKey, result);
      return result;
    } else {
      const result = { available: false };
      setCachedMatch(cacheKey, result);
      return result;
    }
  } catch {
    return { available: false };
  }
}

/**
 * Busca el primer SKU disponible en una lista de SKUs
 * Usa Promise.any() para búsqueda paralela
 */
export async function findAvailableSku(skus: string[]): Promise<string | null> {
  try {
    const promises = skus.map(async (sku) => {
      const result = await checkFlixmediaAvailability(sku);
      if (result.available) {
        return sku;
      }
      throw new Error(`SKU ${sku} no disponible`);
    });

    const availableSku = await Promise.any(promises);
    return availableSku;
  } catch {
    return null;
  }
}

/**
 * Busca el primer EAN disponible en una lista de EANs
 * Usa Promise.any() para búsqueda paralela
 */
export async function findAvailableEan(eans: string[]): Promise<string | null> {
  try {
    const promises = eans.map(async (ean) => {
      const result = await checkFlixmediaAvailabilityByEan(ean);
      if (result.available) {
        return ean;
      }
      throw new Error(`EAN ${ean} no disponible`);
    });

    const availableEan = await Promise.any(promises);
    return availableEan;
  } catch {
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
  const variants: string[] = [mpn];

  const normalized = mpn.replace(/[-\/\s]/g, '');
  if (normalized !== mpn) {
    variants.push(normalized);
  }

  const withSlash = mpn.replace(/-/g, '/');
  if (withSlash !== mpn && !variants.includes(withSlash)) {
    variants.push(withSlash);
  }

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
 */
export function prefetchFlixmediaScript() {
  if (typeof window === 'undefined') return;

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
}

/**
 * Precarga el script de Flixmedia al cargar la página
 */
export function preloadFlixmediaScriptEarly() {
  if (typeof window === 'undefined') return;

  const dnsPrefetch = document.createElement('link');
  dnsPrefetch.rel = 'dns-prefetch';
  dnsPrefetch.href = '//media.flixfacts.com';
  document.head.appendChild(dnsPrefetch);

  const preconnect = document.createElement('link');
  preconnect.rel = 'preconnect';
  preconnect.href = 'https://media.flixfacts.com';
  preconnect.crossOrigin = 'anonymous';
  document.head.appendChild(preconnect);

  prefetchFlixmediaScript();
}

/**
 * Verifica si un producto tiene contenido premium (imágenes o videos)
 * Utilidad compartida entre FlixmediaPlayer y la página multimedia
 */
export function hasPremiumContent(
  apiProduct?: {
    imagenPremium?: string[][];
    videoPremium?: string[][];
    imagen_premium?: string[][];
    video_premium?: string[][];
  },
  productColors?: Array<{
    imagen_premium?: string[];
    video_premium?: string[];
  }>
): boolean {
  const checkArrayOfArrays = (arr?: string[][]): boolean => {
    if (!arr || !Array.isArray(arr)) return false;
    return arr.some((innerArray: string[]) => {
      if (!Array.isArray(innerArray) || innerArray.length === 0) return false;
      return innerArray.some(item => item && typeof item === 'string' && item.trim() !== '');
    });
  };

  const hasApiPremiumContent =
    checkArrayOfArrays(apiProduct?.imagenPremium) ||
    checkArrayOfArrays(apiProduct?.videoPremium) ||
    checkArrayOfArrays(apiProduct?.imagen_premium) ||
    checkArrayOfArrays(apiProduct?.video_premium);

  const hasColorPremiumContent = productColors?.some(color => {
    const hasColorImages = color.imagen_premium && Array.isArray(color.imagen_premium) &&
      color.imagen_premium.length > 0 &&
      color.imagen_premium.some(img => img && typeof img === 'string' && img.trim() !== '');
    const hasColorVideos = color.video_premium && Array.isArray(color.video_premium) &&
      color.video_premium.length > 0 &&
      color.video_premium.some(vid => vid && typeof vid === 'string' && vid.trim() !== '');
    return hasColorImages || hasColorVideos;
  }) || false;

  return hasApiPremiumContent || hasColorPremiumContent;
}
