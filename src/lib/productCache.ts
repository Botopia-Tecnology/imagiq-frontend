/**
 * Sistema de caché en memoria para productos con expiración automática (TTL)
 * 
 * Reduce llamadas redundantes a la API almacenando respuestas temporalmente.
 * Las entradas expiran automáticamente después del TTL configurado.
 */

import type { ProductApiResponse } from "./api";
import type { ApiResponse } from "./api";
import type { ProductFilterParams } from "./sharedInterfaces";

/**
 * Entrada en el caché con datos y metadata
 */
interface CacheEntry {
  data: ApiResponse<ProductApiResponse>;
  timestamp: number;
  ttl: number; // Time-to-live en milisegundos
}

/**
 * Entrada en el caché para productos individuales
 */
interface SingleProductCacheEntry {
  data: ApiResponse<ProductApiResponse>;
  timestamp: number;
  ttl: number;
}

/**
 * Configuración del caché
 */
interface CacheConfig {
  defaultTTL: number; // TTL por defecto en milisegundos (5 minutos)
  cleanupInterval: number; // Intervalo de limpieza automática en milisegundos (1 minuto)
  maxEntries: number; // Máximo número de entradas en caché (prevenir memory leak)
}

/**
 * Clase singleton para gestionar el caché de productos
 */
class ProductCache {
  private cache: Map<string, CacheEntry> = new Map();
  private singleProductCache: Map<string, SingleProductCacheEntry> = new Map();
  private prefetchedKeys: Set<string> = new Set(); // Set para verificación rápida O(1)
  private config: CacheConfig;
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;

  constructor(config?: Partial<CacheConfig>) {
    this.config = {
      defaultTTL: 5 * 60 * 1000, // 5 minutos por defecto
      cleanupInterval: 60 * 1000, // Limpiar cada minuto
      maxEntries: 100, // Máximo 100 entradas
      ...config,
    };

    // Iniciar limpieza automática
    this.startCleanup();
  }

  /**
   * Genera una clave única basada en los parámetros de filtro
   */
  private generateCacheKey(params: ProductFilterParams): string {
    // Crear objeto normalizado sin valores undefined/null/vacíos
    const normalized: Record<string, string | number> = {};
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        // Normalizar números a string para consistencia
        normalized[key] = typeof value === 'number' ? value : String(value);
      }
    });

    // Ordenar claves para garantizar consistencia independientemente del orden
    const sortedKeys = Object.keys(normalized).sort();
    const sortedParams = sortedKeys.map(key => `${key}:${normalized[key]}`).join('|');
    
    return `products:${sortedParams}`;
  }

  /**
   * Verifica si una entrada está expirada
   */
  private isExpired(entry: CacheEntry): boolean {
    const now = Date.now();
    return now - entry.timestamp > entry.ttl;
  }

  /**
   * Verifica si una clave está marcada como precargada (verificación rápida O(1))
   */
  isPrefetched(key: string): boolean {
    return this.prefetchedKeys.has(key);
  }

  /**
   * Marca una clave como precargada
   */
  markAsPrefetched(key: string): void {
    this.prefetchedKeys.add(key);
  }

  /**
   * Obtiene una entrada del caché si existe y no está expirada
   * También busca variaciones ignorando sortBy/sortOrder para mayor flexibilidad
   */
  get(params: ProductFilterParams): ApiResponse<ProductApiResponse> | null {
    // Primero verificar rápidamente si está en el Set de precargadas
    const exactKey = this.generateCacheKey(params);
    if (this.prefetchedKeys.has(exactKey)) {
      // Si está marcada como precargada, buscar en el caché
      const exactEntry = this.cache.get(exactKey);
      if (exactEntry && !this.isExpired(exactEntry)) {
        return exactEntry.data;
      }
      // Si está expirada, remover del Set
      this.prefetchedKeys.delete(exactKey);
    }

    // Intentar búsqueda exacta
    const exactEntry = this.cache.get(exactKey);
    
    if (exactEntry && !this.isExpired(exactEntry)) {
      // Marcar como precargada si no estaba
      this.prefetchedKeys.add(exactKey);
      return exactEntry.data;
    }
    
    // Si no hay coincidencia exacta, buscar ignorando sortBy/sortOrder, page, lazyLimit y lazyOffset
    // Esto permite que el prefetch (con lazyLimit/lazyOffset) coincida con la búsqueda real (sin ellos o con valores diferentes)
    const paramsWithoutSort: ProductFilterParams = { ...params };
    delete paramsWithoutSort.sortBy;
    delete paramsWithoutSort.sortOrder;
    delete paramsWithoutSort.page;
    delete paramsWithoutSort.lazyLimit;
    delete paramsWithoutSort.lazyOffset;
    
    // Buscar todas las claves que coincidan con los parámetros sin sort/page/lazy
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) continue;
      
      // Extraer parámetros de la clave para comparar
      const keyParams = this.parseCacheKey(key);
      if (!keyParams) continue;
      
      // Comparar ignorando sortBy, sortOrder, page, lazyLimit y lazyOffset
      const matchParams: ProductFilterParams = { ...keyParams };
      delete matchParams.sortBy;
      delete matchParams.sortOrder;
      delete matchParams.page;
      delete matchParams.lazyLimit;
      delete matchParams.lazyOffset;
      
      const searchParams: ProductFilterParams = { ...paramsWithoutSort };
      
      // Comparar solo parámetros críticos (categoria, menuUuid, submenuUuid, precioMin, etc.)
      // Manejar undefined correctamente: undefined debe coincidir con undefined o ausencia de propiedad
      const categoriaMatch = 
        (matchParams.categoria === undefined && searchParams.categoria === undefined) ||
        matchParams.categoria === searchParams.categoria;
      
      const menuUuidMatch = 
        (matchParams.menuUuid === undefined && searchParams.menuUuid === undefined) ||
        matchParams.menuUuid === searchParams.menuUuid;
      
      const submenuUuidMatch = 
        (matchParams.submenuUuid === undefined && searchParams.submenuUuid === undefined) ||
        matchParams.submenuUuid === searchParams.submenuUuid;
      
      // Comparar precioMin (importante para filtros)
      const precioMinMatch = 
        (matchParams.precioMin === undefined && searchParams.precioMin === undefined) ||
        matchParams.precioMin === searchParams.precioMin;
      
      // Solo comparar parámetros críticos, ignorando limit, lazyLimit, lazyOffset, page, sortBy, sortOrder
      const criticalMatch = 
        categoriaMatch &&
        menuUuidMatch &&
        submenuUuidMatch &&
        precioMinMatch;
      
      if (criticalMatch) {
        // Marcar como precargada si no estaba (usar la clave encontrada)
        this.prefetchedKeys.add(key);
        return entry.data;
      }
    }
    
    return null;
  }
  
  /**
   * Parsea una clave de caché para extraer los parámetros
   * Público para permitir invalidación selectiva basada en patrones
   */
  public parseCacheKey(key: string): ProductFilterParams | null {
    if (!key.startsWith('products:')) {
      return null;
    }
    
    const paramsString = key.replace('products:', '');
    const params: Record<string, string | number> = {};
    
    paramsString.split('|').forEach(param => {
      const [paramKey, paramValue] = param.split(':');
      if (paramKey && paramValue) {
        // Intentar convertir a número si es posible
        const numValue = Number(paramValue);
        params[paramKey] = isNaN(numValue) ? paramValue : numValue;
      }
    });
    
    return params as ProductFilterParams;
  }

  /**
   * Almacena una respuesta en el caché
   */
  set(
    params: ProductFilterParams,
    data: ApiResponse<ProductApiResponse>,
    ttl?: number
  ): void {
    // Si el caché está lleno, eliminar la entrada más antigua
    if (this.cache.size >= this.config.maxEntries) {
      const oldestKey = this.findOldestEntry();
      if (oldestKey) {
        this.cache.delete(oldestKey);
        this.prefetchedKeys.delete(oldestKey);
      }
    }

    const key = this.generateCacheKey(params);
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultTTL,
    };

    this.cache.set(key, entry);
    // Marcar automáticamente como precargada
    this.prefetchedKeys.add(key);
  }

  /**
   * Encuentra la entrada más antigua para eliminación cuando el caché está lleno
   */
  private findOldestEntry(): string | null {
    let oldestKey: string | null = null;
    let oldestTimestamp = Infinity;

    this.cache.forEach((entry, key) => {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = key;
      }
    });

    return oldestKey;
  }

  /**
   * Invalida una entrada específica del caché
   */
  invalidate(params: ProductFilterParams): boolean {
    const key = this.generateCacheKey(params);
    this.prefetchedKeys.delete(key);
    return this.cache.delete(key);
  }

  /**
   * Invalida todas las entradas que coincidan con un patrón
   * Útil para invalidar caché cuando cambia una categoría o filtro base
   */
  invalidatePattern(patternFn: (key: string) => boolean): number {
    let deletedCount = 0;
    const keysToDelete: string[] = [];

    this.cache.forEach((_, key) => {
      if (patternFn(key)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => {
      if (this.cache.delete(key)) {
        this.prefetchedKeys.delete(key);
        deletedCount++;
      }
    });

    return deletedCount;
  }

  /**
   * Limpia todas las entradas expiradas del caché
   */
  cleanup(): number {
    let deletedCount = 0;
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (this.isExpired(entry)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => {
      if (this.cache.delete(key)) {
        this.prefetchedKeys.delete(key);
        deletedCount++;
      }
    });

    // Limpiar también el caché de productos individuales
    const singleProductKeysToDelete: string[] = [];
    this.singleProductCache.forEach((entry, key) => {
      if (this.isExpired(entry)) {
        singleProductKeysToDelete.push(key);
      }
    });

    singleProductKeysToDelete.forEach(key => {
      if (this.singleProductCache.delete(key)) {
        deletedCount++;
      }
    });

    return deletedCount;
  }

  /**
   * Limpia completamente el caché
   */
  clear(): void {
    this.cache.clear();
    this.singleProductCache.clear();
    this.prefetchedKeys.clear();
  }

  /**
   * Obtiene un producto individual del caché por su ID
   */
  getSingleProduct(productId: string): ApiResponse<ProductApiResponse> | null {
    const key = `product:${productId}`;
    const entry = this.singleProductCache.get(key);

    if (entry && !this.isExpired(entry)) {
      return entry.data;
    }

    // Si está expirado, eliminarlo
    if (entry) {
      this.singleProductCache.delete(key);
    }

    return null;
  }

  /**
   * Almacena un producto individual en el caché
   */
  setSingleProduct(
    productId: string,
    data: ApiResponse<ProductApiResponse>,
    ttl?: number
  ): void {
    const key = `product:${productId}`;
    const entry: SingleProductCacheEntry = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultTTL,
    };

    this.singleProductCache.set(key, entry);
  }

  /**
   * Invalida el caché de un producto individual
   */
  invalidateSingleProduct(productId: string): boolean {
    const key = `product:${productId}`;
    return this.singleProductCache.delete(key);
  }

  /**
   * Obtiene estadísticas del caché
   */
  getStats() {
    const now = Date.now();
    let expiredCount = 0;
    let validCount = 0;

    this.cache.forEach((entry) => {
      if (this.isExpired(entry)) {
        expiredCount++;
      } else {
        validCount++;
      }
    });

    return {
      totalEntries: this.cache.size,
      validEntries: validCount,
      expiredEntries: expiredCount,
      maxEntries: this.config.maxEntries,
    };
  }

  /**
   * Inicia el proceso de limpieza automática
   */
  private startCleanup(): void {
    if (this.cleanupTimer) {
      return;
    }

    this.cleanupTimer = setInterval(() => {
      const deleted = this.cleanup();
      if (deleted > 0) {
        console.debug(`[ProductCache] Limpiadas ${deleted} entradas expiradas`);
      }
    }, this.config.cleanupInterval);
  }

  /**
   * Detiene el proceso de limpieza automática
   */
  stopCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  /**
   * Actualiza la configuración del caché
   */
  updateConfig(config: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...config };
    
    // Reiniciar limpieza si cambió el intervalo
    if (config.cleanupInterval !== undefined) {
      this.stopCleanup();
      this.startCleanup();
    }
  }
}

// Instancia singleton del caché
export const productCache = new ProductCache({
  defaultTTL: 5 * 60 * 1000, // 5 minutos
  cleanupInterval: 60 * 1000, // Limpiar cada minuto
  maxEntries: 100, // Máximo 100 entradas
});

/**
 * Función helper para generar clave de caché desde parámetros
 * Útil para debugging o logging
 */
export function getCacheKey(params: ProductFilterParams): string {
  const normalized: Record<string, string | number> = {};
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      normalized[key] = typeof value === 'number' ? value : String(value);
    }
  });

  const sortedKeys = Object.keys(normalized).sort();
  const sortedParams = sortedKeys.map(key => `${key}:${normalized[key]}`).join('|');
  
  return `products:${sortedParams}`;
}

