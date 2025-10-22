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
    console.log(`🔍 Verificando disponibilidad en Flixmedia: ${mpn}`);

    const response = await fetch(url);
    const data = await response.json();

    if (data.event === "matchhit" && data.product_id) {
      console.log(`✅ SKU encontrado en Flixmedia: ${mpn} (Product ID: ${data.product_id})`);
      return { available: true, productId: data.product_id };
    } else {
      console.log(`❌ SKU no encontrado en Flixmedia: ${mpn}`);
      return { available: false };
    }
  } catch (error) {
    console.error(`❌ Error verificando Flixmedia para ${mpn}:`, error);
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
    console.log(`🔍 Verificando disponibilidad por EAN en Flixmedia: ${ean}`);

    const response = await fetch(url);
    const data = await response.json();

    if (data.event === "matchhit" && data.product_id) {
      console.log(`✅ EAN encontrado en Flixmedia: ${ean} (Product ID: ${data.product_id})`);
      return { available: true, productId: data.product_id };
    } else {
      console.log(`❌ EAN no encontrado en Flixmedia: ${ean}`);
      return { available: false };
    }
  } catch (error) {
    console.error(`❌ Error verificando Flixmedia para EAN ${ean}:`, error);
    return { available: false };
  }
}

/**
 * Busca el primer SKU disponible en una lista de SKUs
 */
export async function findAvailableSku(skus: string[]): Promise<string | null> {
  console.log(`🔢 SKUs a verificar:`, skus);

  for (const sku of skus) {
    const result = await checkFlixmediaAvailability(sku);
    if (result.available) {
      return sku;
    }
  }

  return null;
}

/**
 * Busca el primer EAN disponible en una lista de EANs
 */
export async function findAvailableEan(eans: string[]): Promise<string | null> {
  console.log(`🔢 EANs a verificar:`, eans);

  for (const ean of eans) {
    const result = await checkFlixmediaAvailabilityByEan(ean);
    if (result.available) {
      return ean;
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
