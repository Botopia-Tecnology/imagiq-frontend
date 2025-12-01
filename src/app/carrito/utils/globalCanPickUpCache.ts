// Caché en memoria para el valor global de canPickUp del carrito
// Se comparte entre Step1 y Step3 para evitar llamar dos veces seguidas
// al endpoint /api/products/candidate-stores con el mismo estado.
// Ahora guarda toda la respuesta completa (canPickUp, stores, cities) para evitar skeleton al cambiar a "tienda"

import type { CandidateStoresResponse } from "@/lib/api";

interface CacheKeyInput {
  userId?: string | null;
  products: { sku: string; quantity: number }[];
  addressId?: string | null;
}

interface CacheEntry {
  key: string;
  value: boolean; // canPickUp boolean (para compatibilidad con código existente)
  fullResponse: CandidateStoresResponse | null; // Respuesta completa del endpoint
  timestamp: number;
}

const TTL_MS = 5 * 60 * 1000; // 5 minutos

let cache: CacheEntry | null = null;

export function buildGlobalCanPickUpKey(input: CacheKeyInput): string {
  const userPart = input.userId ?? "anonymous";
  const addressPart = input.addressId ?? "no-address";

  // Ordenar productos por SKU para que la clave sea estable
  const productsPart = [...input.products]
    .sort((a, b) => a.sku.localeCompare(b.sku))
    .map((p) => `${p.sku}:${p.quantity}`)
    .join("|");

  return `${userPart}::${addressPart}::${productsPart}`;
}

export function getGlobalCanPickUpFromCache(key: string): boolean | null {
  if (!cache) return null;
  if (cache.key !== key) return null;

  const isExpired = Date.now() - cache.timestamp > TTL_MS;
  if (isExpired) {
    cache = null;
    return null;
  }

  return cache.value;
}

/**
 * Obtiene la respuesta completa del caché (tiendas, ciudades, canPickUp)
 * Útil para evitar skeleton al cambiar a "recoger en tienda"
 */
export function getFullCandidateStoresResponseFromCache(key: string): CandidateStoresResponse | null {
  if (!cache) return null;
  if (cache.key !== key) return null;

  const isExpired = Date.now() - cache.timestamp > TTL_MS;
  if (isExpired) {
    cache = null;
    return null;
  }

  return cache.fullResponse;
}

export function setGlobalCanPickUpCache(
  key: string,
  value: boolean,
  fullResponse?: CandidateStoresResponse | null
): void {
  cache = {
    key,
    value,
    fullResponse: fullResponse ?? null,
    timestamp: Date.now(),
  };
}

export function clearGlobalCanPickUpCache(): void {
  cache = null;
}


