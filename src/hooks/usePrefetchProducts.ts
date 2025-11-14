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

// Sistema de cola para controlar concurrencia y evitar errores 429
interface QueuedPrefetch {
  options: PrefetchOptions;
  resolve: () => void;
  reject: (error: any) => void;
}

// Cola global de prefetches pendientes
const prefetchQueue: QueuedPrefetch[] = [];
// Número máximo de peticiones simultáneas
const MAX_CONCURRENT_PREFETCHES = 7;
// Contador de peticiones activas
let activePrefetches = 0;
// Flag para indicar si el procesador de cola está corriendo
let isProcessingQueue = false;

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
        limit: 15, // Valor por defecto de itemsPerPage (verificado en useCategoryPagination)
        precioMin: 1,
        lazyLimit: 6, // Primer grupo de 6 productos
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
   * Ejecuta un prefetch individual
   */
  const executePrefetch = useCallback(
    async (options: PrefetchOptions): Promise<void> => {
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
        // Pero loguear errores 429 para debugging
        if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 429) {
          console.debug("[Prefetch] Rate limit alcanzado, reintentando más tarde:", error);
        } else {
          console.debug("[Prefetch] Error silencioso:", error);
        }
      } finally {
        // Remover del set de prefetches en curso
        prefetchingRef.current.delete(prefetchKey);
      }
    },
    [buildPrefetchParams, getPrefetchKey]
  );

  /**
   * Procesa la cola de prefetches de forma controlada
   */
  const processPrefetchQueue = useCallback(async () => {
    // Si ya está procesando o no hay items en la cola, salir
    if (isProcessingQueue || prefetchQueue.length === 0) {
      return;
    }

    // Si ya alcanzamos el límite de concurrencia, esperar
    if (activePrefetches >= MAX_CONCURRENT_PREFETCHES) {
      // Reintentar después de un breve delay
      setTimeout(() => processPrefetchQueue(), 100);
      return;
    }

    isProcessingQueue = true;

    while (prefetchQueue.length > 0 && activePrefetches < MAX_CONCURRENT_PREFETCHES) {
      const queued = prefetchQueue.shift();
      if (!queued) break;

      activePrefetches++;
      
      // Ejecutar el prefetch
      executePrefetch(queued.options)
        .then(() => {
          queued.resolve();
        })
        .catch((error) => {
          queued.reject(error);
        })
        .finally(() => {
          activePrefetches--;
          // Continuar procesando la cola
          setTimeout(() => processPrefetchQueue(), 50); // Pequeño delay entre peticiones
        });
    }

    isProcessingQueue = false;
  }, [executePrefetch]);

  /**
   * Realiza el prefetch de productos usando cola para controlar concurrencia
   * Retorna una Promise que se resuelve cuando el prefetch termina
   */
  const prefetchProducts = useCallback(
    async (options: PrefetchOptions): Promise<void> => {
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

      // Si hay espacio disponible, ejecutar inmediatamente
      if (activePrefetches < MAX_CONCURRENT_PREFETCHES) {
        activePrefetches++;
        return executePrefetch(options)
          .finally(() => {
            activePrefetches--;
            // Procesar cola después de completar
            setTimeout(() => processPrefetchQueue(), 50);
          });
      }

      // Si no hay espacio, encolar
      return new Promise<void>((resolve, reject) => {
        prefetchQueue.push({ options, resolve, reject });
        processPrefetchQueue();
      });
    },
    [buildPrefetchParams, getPrefetchKey, executePrefetch, processPrefetchQueue]
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

