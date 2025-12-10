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

// Tipo para errores HTTP que pueden tener statusCode
interface HttpError {
  statusCode: number;
  message?: string;
  [key: string]: unknown;
}

// Tipo para errores que pueden ocurrir en prefetch
type PrefetchError = Error | HttpError;

// Sistema de cola para controlar concurrencia y evitar errores 429
interface QueuedPrefetch {
  options: PrefetchOptions;
  resolve: () => void;
  reject: (error: PrefetchError) => void;
}

// Cola global de prefetches pendientes
const prefetchQueue: QueuedPrefetch[] = [];
// Número máximo de peticiones simultáneas (reducido para evitar 429)
const MAX_CONCURRENT_PREFETCHES = 4;
// Contador de peticiones activas
let activePrefetches = 0;
// Flag para indicar si el procesador de cola está corriendo
let isProcessingQueue = false;
// Delay mínimo entre peticiones (en ms) - aumentado para evitar rate limiting
const MIN_DELAY_BETWEEN_REQUESTS = 300;
// Delay cuando hay un error 429 (en ms)
const DELAY_AFTER_429 = 2000;
// Timestamp de la última petición para rate limiting
let lastRequestTime = 0;
// Flag para indicar si estamos en cooldown después de un 429
let isInCooldown = false;
// Timestamp del último error 429
let last429ErrorTime = 0;

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
   * Ejecuta un prefetch individual con retry y backoff exponencial para errores 429
   */
  const executePrefetch = useCallback(
    async (options: PrefetchOptions, retryCount = 0): Promise<void> => {
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

      // Verificar si estamos en cooldown después de un 429
      const timeSinceLast429 = Date.now() - last429ErrorTime;
      if (isInCooldown && timeSinceLast429 < DELAY_AFTER_429) {
        // Reencolar para más tarde
        const remainingCooldown = DELAY_AFTER_429 - timeSinceLast429;
        setTimeout(() => {
          prefetchQueue.push({
            options,
            resolve: () => {},
            reject: () => {},
          });
          processPrefetchQueue();
        }, remainingCooldown);
        return;
      }

      // Asegurar delay mínimo entre peticiones
      const timeSinceLastRequest = Date.now() - lastRequestTime;
      if (timeSinceLastRequest < MIN_DELAY_BETWEEN_REQUESTS) {
        const delayNeeded = MIN_DELAY_BETWEEN_REQUESTS - timeSinceLastRequest;
        await new Promise(resolve => setTimeout(resolve, delayNeeded));
      }

      // Marcar como en curso
      prefetchingRef.current.add(prefetchKey);
      lastRequestTime = Date.now();

      try {
        // Llamada silenciosa a la API (sin mostrar loading ni errores)
        const response = await productEndpoints.getFilteredV2(params);

        // Verificar si la respuesta indica un error 429
        // El backend devuelve statusCode: 429 en la respuesta
        const is429Error = 
          !response.success && 
          (response.statusCode === 429 ||
           response.message?.includes('429') || 
           response.message?.includes('Too Many Requests') ||
           response.message?.includes('ThrottlerException'));

        if (is429Error) {
          last429ErrorTime = Date.now();
          isInCooldown = true;

          // Máximo 3 reintentos con backoff exponencial
          if (retryCount < 3) {
            const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 10000); // 1s, 2s, 4s, max 10s
            console.debug(`[Prefetch] Rate limit 429 detectado, reintentando en ${backoffDelay}ms (intento ${retryCount + 1}/3)`);
            
            // Esperar antes de reintentar
            await new Promise(resolve => setTimeout(resolve, backoffDelay));
            
            // Reintentar
            return executePrefetch(options, retryCount + 1);
          } else {
            console.debug("[Prefetch] Rate limit 429, máximo de reintentos alcanzado. Reencolando para más tarde.");
            // Reencolar para más tarde después del cooldown
            setTimeout(() => {
              prefetchQueue.push({
                options,
                resolve: () => {},
                reject: () => {},
              });
              processPrefetchQueue();
            }, DELAY_AFTER_429);
          }
          return;
        }

        if (response.success && response.data) {
          // Guardar en caché para uso inmediato
          productCache.set(params, response);
        }

        // Si llegamos aquí, no hubo error 429, salir del cooldown después de un tiempo
        if (isInCooldown && Date.now() - last429ErrorTime > DELAY_AFTER_429) {
          isInCooldown = false;
        }
      } catch (error) {
        // Manejar errores de red u otros errores inesperados
        // Verificar si es un error 429
        const is429Error = 
          error && 
          typeof error === 'object' && 
          ('statusCode' in error && (error as HttpError).statusCode === 429 ||
           'message' in error && typeof (error as { message?: string }).message === 'string' &&
           ((error as { message: string }).message.includes('429') || 
            (error as { message: string }).message.includes('Too Many Requests')));

        if (is429Error) {
          last429ErrorTime = Date.now();
          isInCooldown = true;

          // Máximo 3 reintentos con backoff exponencial
          if (retryCount < 3) {
            const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 10000);
            console.debug(`[Prefetch] Rate limit 429 (catch), reintentando en ${backoffDelay}ms (intento ${retryCount + 1}/3)`);
            
            await new Promise(resolve => setTimeout(resolve, backoffDelay));
            return executePrefetch(options, retryCount + 1);
          } else {
            console.debug("[Prefetch] Rate limit 429 (catch), máximo de reintentos alcanzado. Reencolando.");
            setTimeout(() => {
              prefetchQueue.push({
                options,
                resolve: () => {},
                reject: () => {},
              });
              processPrefetchQueue();
            }, DELAY_AFTER_429);
          }
        } else {
          // Otros errores se silencian pero se loguean
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
   * Procesa la cola de prefetches de forma controlada con rate limiting
   */
  const processPrefetchQueue = useCallback(async () => {
    // Si ya está procesando o no hay items en la cola, salir
    if (isProcessingQueue || prefetchQueue.length === 0) {
      return;
    }

    // Si estamos en cooldown después de un 429, esperar
    const timeSinceLast429 = Date.now() - last429ErrorTime;
    if (isInCooldown && timeSinceLast429 < DELAY_AFTER_429) {
      const remainingCooldown = DELAY_AFTER_429 - timeSinceLast429;
      setTimeout(() => processPrefetchQueue(), remainingCooldown);
      return;
    }

    // Si ya alcanzamos el límite de concurrencia, esperar
    if (activePrefetches >= MAX_CONCURRENT_PREFETCHES) {
      // Reintentar después de un delay más largo
      setTimeout(() => processPrefetchQueue(), MIN_DELAY_BETWEEN_REQUESTS);
      return;
    }

    // Verificar delay mínimo desde la última petición
    const timeSinceLastRequest = Date.now() - lastRequestTime;
    if (timeSinceLastRequest < MIN_DELAY_BETWEEN_REQUESTS) {
      const delayNeeded = MIN_DELAY_BETWEEN_REQUESTS - timeSinceLastRequest;
      setTimeout(() => processPrefetchQueue(), delayNeeded);
      return;
    }

    isProcessingQueue = true;

    // Procesar solo un item a la vez para mejor control de rate limiting
    if (prefetchQueue.length > 0 && activePrefetches < MAX_CONCURRENT_PREFETCHES) {
      const queued = prefetchQueue.shift();
      if (queued) {
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
            isProcessingQueue = false;
            // Continuar procesando la cola después de un delay
            setTimeout(() => processPrefetchQueue(), MIN_DELAY_BETWEEN_REQUESTS);
          });
        return; // Salir después de procesar un item
      }
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

      // Si hay espacio disponible y no estamos en cooldown, ejecutar
      const timeSinceLast429 = Date.now() - last429ErrorTime;
      if (activePrefetches < MAX_CONCURRENT_PREFETCHES && 
          (!isInCooldown || timeSinceLast429 >= DELAY_AFTER_429)) {
        activePrefetches++;
        return executePrefetch(options)
          .finally(() => {
            activePrefetches--;
            // Procesar cola después de completar con delay apropiado
            setTimeout(() => processPrefetchQueue(), MIN_DELAY_BETWEEN_REQUESTS);
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
    (options: PrefetchOptions, delay: number = 400) => {
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

