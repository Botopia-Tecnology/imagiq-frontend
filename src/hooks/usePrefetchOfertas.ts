/**
 * Hook para prefetch de las 4 secciones de ofertas
 * Se ejecuta cuando el usuario hace hover o click en el link "Ofertas" del navbar
 */

import { useCallback, useRef } from "react";
import { productEndpoints } from "@/lib/api";
import { productCache } from "@/lib/productCache";
import type { ProductFilterParams } from "@/lib/sharedInterfaces";

// Mapeo de secciones a filtros de API (igual que en OfertasSection.tsx)
const ofertasFiltersMap: Record<string, { category?: string; menuUuid?: string }> = {
  accesorios: { category: "IM", menuUuid: '87c54352-5181-45b7-831d-8e9470d2288c' },
  "tv-monitores-audio": { category: "AV,IT" },
  "smartphones-tablets": { category: "IM", menuUuid: 'ff59c937-78ac-4f83-8c5e-2c3048b4ebb7,7609faf8-4c39-4227-915e-0d439d717e84' },
  electrodomesticos: { category: "DA" },
};

// Parámetros base para todas las secciones de ofertas
// Estos deben coincidir exactamente con los que se usan en OfertasSection.tsx
const getBaseParams = (): Partial<ProductFilterParams> => ({
  page: 1,
  limit: 50,
  sortBy: 'precio',
  sortOrder: 'desc',
  precioMin: 1,
  stockMinimo: 1, // stockMin: 1 se convierte a stockMinimo: 1
  conDescuento: true, // withDiscount: true se convierte a conDescuento: true
});

/**
 * Construye los parámetros de API para una sección específica de ofertas
 */
const buildOfertasParams = (seccion: string): ProductFilterParams | null => {
  const sectionFilters = ofertasFiltersMap[seccion];
  if (!sectionFilters) {
    return null;
  }

  const baseParams = getBaseParams();
  const params: ProductFilterParams = {
    ...baseParams,
    ...sectionFilters,
  } as ProductFilterParams;

  return params;
};

/**
 * Genera una clave única para el caché basada en los parámetros
 */
const getCacheKey = (params: ProductFilterParams): string => {
  const sorted = Object.keys(params)
    .sort()
    .map((key) => `${key}:${params[key as keyof ProductFilterParams]}`)
    .join("|");
  return `ofertas:${sorted}`;
};

/**
 * Hook para prefetch de ofertas
 */
export function usePrefetchOfertas() {
  const prefetchingRef = useRef<Set<string>>(new Set()); // Rastrear prefetches en curso
  const prefetchedRef = useRef<Set<string>>(new Set()); // Rastrear secciones ya prefetcheadas

  /**
   * Prefetch de una sección específica de ofertas
   */
  const prefetchSeccion = useCallback(
    async (seccion: string): Promise<void> => {
      const params = buildOfertasParams(seccion);
      if (!params) {
        return;
      }

      const cacheKey = getCacheKey(params);

      // Evitar prefetch duplicado
      if (prefetchingRef.current.has(cacheKey)) {
        return;
      }

      // Verificar si ya está en caché
      const cached = productCache.get(params);
      if (cached) {
        // Ya está cacheado, marcar como prefetcheado
        prefetchedRef.current.add(seccion);
        return;
      }

      // Marcar como en curso
      prefetchingRef.current.add(cacheKey);

      try {
        // Llamada silenciosa a la API (sin mostrar loading ni errores)
        const response = await productEndpoints.getFilteredV2(params);

        if (response.success && response.data) {
          // Guardar en caché para uso inmediato
          productCache.set(params, response);
          prefetchedRef.current.add(seccion);
        }
      } catch (error) {
        // Silenciar errores pero loguear en desarrollo
        if (process.env.NODE_ENV === 'development') {
          console.debug(`[PrefetchOfertas] Error al prefetchear sección ${seccion}:`, error);
        }
      } finally {
        // Remover del set de prefetches en curso
        prefetchingRef.current.delete(cacheKey);
      }
    },
    []
  );

  /**
   * Prefetch de todas las secciones de ofertas de forma independiente
   * Se ejecutan en paralelo pero con un pequeño delay entre cada una para evitar rate limiting
   */
  const prefetchAllOfertas = useCallback(async (): Promise<void> => {
    const secciones = [
      "smartphones-tablets",
      "tv-monitores-audio",
      "accesorios",
      "electrodomesticos",
    ];

    // Verificar si ya se prefetchearon todas
    const allPrefetched = secciones.every(seccion => prefetchedRef.current.has(seccion));
    if (allPrefetched) {
      return;
    }

    // Ejecutar prefetch de todas las secciones con un pequeño delay entre cada una
    // para evitar rate limiting pero mantenerlas independientes
    secciones.forEach((seccion, index) => {
      // Delay escalonado: 0ms, 100ms, 200ms, 300ms
      setTimeout(() => {
        prefetchSeccion(seccion).catch(() => {
          // Silenciar errores individuales
        });
      }, index * 100);
    });
  }, [prefetchSeccion]);

  /**
   * Verifica si una sección ya fue prefetcheada
   */
  const isPrefetched = useCallback((seccion: string): boolean => {
    return prefetchedRef.current.has(seccion);
  }, []);

  /**
   * Verifica si todas las secciones ya fueron prefetcheadas
   */
  const areAllPrefetched = useCallback((): boolean => {
    const secciones = [
      "smartphones-tablets",
      "tv-monitores-audio",
      "accesorios",
      "electrodomesticos",
    ];
    return secciones.every(seccion => prefetchedRef.current.has(seccion));
  }, []);

  return {
    prefetchAllOfertas,
    prefetchSeccion,
    isPrefetched,
    areAllPrefetched,
  };
}

