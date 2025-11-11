/**
 * Hook para prefetching silencioso de productos
 * 
 * Pre-carga productos cuando el usuario hace hover sobre menús/submenús
 * para mejorar la velocidad percibida al hacer click.
 */

import { useCallback, useRef } from "react";
import { productEndpoints } from "@/lib/api";
import { productCache } from "@/lib/productCache";
import type { ProductFilterParams } from "@/lib/sharedInterfaces";
import type { CategoriaParams } from "@/app/productos/[categoria]/types";

interface PrefetchOptions {
  categoryCode?: string;
  menuUuid?: string;
  submenuUuid?: string;
  categoria?: CategoriaParams;
}

// Debounce timer para evitar múltiples llamadas rápidas
const prefetchTimers = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * Hook para prefetching de productos
 */
export function usePrefetchProducts() {
  const prefetchingRef = useRef<Set<string>>(new Set()); // Rastrear prefetches en curso

  /**
   * Construye los parámetros de API para el prefetch
   */
  const buildPrefetchParams = useCallback(
    (options: PrefetchOptions): ProductFilterParams | null => {
      const { categoryCode, menuUuid, submenuUuid, categoria } = options;

      // Necesitamos al menos categoryCode para hacer prefetch
      if (!categoryCode) {
        return null;
      }

      const params: ProductFilterParams = {
        page: 1,
        limit: 50, // Valor por defecto de itemsPerPage (verificado en useCategoryPagination)
        precioMin: 1,
        lazyLimit: 50, // Primer grupo de 6 productos
        lazyOffset: 0,
        // Usar sortBy por defecto "precio-mayor" que es el valor inicial en useCategorySorting
        sortBy: "precio",
        sortOrder: "desc",
      };

      // Aplicar filtros de jerarquía
      // categoryCode es el código de API (ej: "AV", "DA") que se usa directamente
      if (categoryCode) {
        params.categoria = categoryCode;
      }
      if (menuUuid) {
        params.menuUuid = menuUuid;
      }
      if (submenuUuid) {
        params.submenuUuid = submenuUuid;
      }

      return params;
    },
    []
  );

  /**
   * Genera una clave única para el prefetch basada en los parámetros
   */
  const getPrefetchKey = useCallback((params: ProductFilterParams): string => {
    const sorted = Object.keys(params)
      .sort()
      .map((key) => `${key}:${params[key as keyof ProductFilterParams]}`)
      .join("|");
    return `prefetch:${sorted}`;
  }, []);

  /**
   * Realiza el prefetch de productos
   */
  const prefetchProducts = useCallback(
    async (options: PrefetchOptions) => {
      const params = buildPrefetchParams(options);
      if (!params) {
        return;
      }

      const prefetchKey = getPrefetchKey(params);

      // Evitar prefetch duplicado
      if (prefetchingRef.current.has(prefetchKey)) {
        return;
      }

      // Verificar si ya está en caché
      const cached = productCache.get(params);
      if (cached) {
        // Ya está cacheado, no necesitamos prefetch
        return;
      }

      // Marcar como en curso
      prefetchingRef.current.add(prefetchKey);

      try {
        // Llamada silenciosa a la API (sin mostrar loading ni errores)
        const response = await productEndpoints.getFiltered(params);

        if (response.success && response.data) {
          // Guardar en caché para uso inmediato
          productCache.set(params, response);
        }
      } catch (error) {
        // Silenciar errores en prefetch - no afectar la UX
        console.debug("[Prefetch] Error silencioso:", error);
      } finally {
        // Remover del set de prefetches en curso
        prefetchingRef.current.delete(prefetchKey);
      }
    },
    [buildPrefetchParams, getPrefetchKey]
  );

  /**
   * Prefetch con debounce para evitar múltiples llamadas rápidas
   * Útil cuando el usuario pasa el mouse rápidamente sobre varios items
   */
  const prefetchWithDebounce = useCallback(
    (options: PrefetchOptions, delay: number = 200) => {
      const params = buildPrefetchParams(options);
      if (!params) {
        return;
      }

      const prefetchKey = getPrefetchKey(params);

      // Limpiar timer anterior si existe
      const existingTimer = prefetchTimers.get(prefetchKey);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      // Crear nuevo timer
      const timer = setTimeout(() => {
        prefetchProducts(options);
        prefetchTimers.delete(prefetchKey);
      }, delay);

      prefetchTimers.set(prefetchKey, timer);
    },
    [buildPrefetchParams, getPrefetchKey, prefetchProducts]
  );

  /**
   * Cancela un prefetch pendiente
   */
  const cancelPrefetch = useCallback(
    (options: PrefetchOptions) => {
      const params = buildPrefetchParams(options);
      if (!params) {
        return;
      }

      const prefetchKey = getPrefetchKey(params);

      // Cancelar timer si existe
      const timer = prefetchTimers.get(prefetchKey);
      if (timer) {
        clearTimeout(timer);
        prefetchTimers.delete(prefetchKey);
      }
    },
    [buildPrefetchParams, getPrefetchKey]
  );

  return {
    prefetchProducts,
    prefetchWithDebounce,
    cancelPrefetch,
  };
}

