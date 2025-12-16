/**
 * Hook para coordinar prefetches entre componentes
 * 
 * Evita que múltiples componentes precarguen las mismas combinaciones
 * simultáneamente, reduciendo peticiones duplicadas.
 * 
 * Usa un Set global compartido para rastrear qué se está precargando.
 */

import { useCallback, useRef } from 'react';
import type { ProductFilterParams } from '@/lib/sharedInterfaces';
import { productCache } from '@/lib/productCache';

// Set global compartido para rastrear prefetches en curso
// Clave: string generada desde ProductFilterParams
const globalPrefetching = new Set<string>();

/**
 * Genera una clave única para un conjunto de parámetros de prefetch
 * Similar a la lógica de productCache pero simplificada para coordinación
 */
function generatePrefetchKey(params: ProductFilterParams): string {
  const critical: Record<string, string> = {};
  
  if (params.categoria) critical.categoria = String(params.categoria);
  if (params.menuUuid) critical.menuUuid = String(params.menuUuid);
  if (params.submenuUuid) critical.submenuUuid = String(params.submenuUuid);
  if (params.precioMin !== undefined) critical.precioMin = String(params.precioMin);
  if (params.lazyLimit !== undefined) critical.lazyLimit = String(params.lazyLimit);
  if (params.lazyOffset !== undefined) critical.lazyOffset = String(params.lazyOffset);
  
  // Ignorar: sortBy, sortOrder, page, limit (no afectan qué productos se obtienen)
  
  return Object.keys(critical).sort().map(k => `${k}:${critical[k]}`).join('|');
}

/**
 * Hook para coordinar prefetches entre componentes
 */
export function usePrefetchCoordinator() {
  // Ref local para rastrear prefetches iniciados por este componente
  const localPrefetchingRef = useRef<Set<string>>(new Set());

  /**
   * Verifica si se debe hacer prefetch de una query
   * Retorna false si ya está en caché o se está precargando
   */
  const shouldPrefetch = useCallback((params: ProductFilterParams): boolean => {
    // Verificar si ya está en caché
    if (productCache.get(params)) {
      return false;
    }

    // Generar clave para coordinación
    const key = generatePrefetchKey(params);

    // Verificar si ya se está precargando globalmente
    if (globalPrefetching.has(key)) {
      return false;
    }

    // Marcar como en proceso
    globalPrefetching.add(key);
    localPrefetchingRef.current.add(key);

    return true;
  }, []);

  /**
   * Marca una query como precargada (para limpiar el estado)
   */
  const markPrefetched = useCallback((params: ProductFilterParams): void => {
    const key = generatePrefetchKey(params);
    globalPrefetching.delete(key);
    localPrefetchingRef.current.delete(key);
  }, []);

  /**
   * Limpia todos los prefetches locales cuando el componente se desmonta
   */
  const cleanup = useCallback((): void => {
    localPrefetchingRef.current.forEach(key => {
      globalPrefetching.delete(key);
    });
    localPrefetchingRef.current.clear();
  }, []);

  return {
    shouldPrefetch,
    markPrefetched,
    cleanup,
  };
}

