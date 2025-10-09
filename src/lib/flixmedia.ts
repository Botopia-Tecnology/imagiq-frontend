/**
 * Utilidades para la integración con Flixmedia
 * Funciones para verificar disponibilidad de contenido multimedia
 */

const FLIXMEDIA_CONFIG = {
  distributorId: "9329",
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
  } catch (error) {
    console.error(`❌ Error verificando Flixmedia para ${mpn}:`, error);
    return { available: false };
  }
}

/**
 * Busca el primer SKU disponible en una lista de SKUs
 */
export async function findAvailableSku(skus: string[]): Promise<string | null> {

  for (const sku of skus) {
    const result = await checkFlixmediaAvailability(sku);
    if (result.available) {
      return sku;
    }
  }

  return null;
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
 * Procesa una cadena de SKUs (separados por comas) y devuelve un array
 */
export function parseSkuString(skuString: string): string[] {
  return skuString
    .split(",")
    .map((sku) => sku.trim())
    .filter((sku) => sku.length > 0);
}
