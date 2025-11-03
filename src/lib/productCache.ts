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
   * Obtiene una entrada del caché si existe y no está expirada
   * También busca variaciones ignorando sortBy/sortOrder para mayor flexibilidad
   */
  get(params: ProductFilterParams): ApiResponse<ProductApiResponse> | null {
    // Primero intentar búsqueda exacta
    const exactKey = this.generateCacheKey(params);
    const exactEntry = this.cache.get(exactKey);
    
    if (exactEntry && !this.isExpired(exactEntry)) {
      return exactEntry.data;
    }
    
    // Si no hay coincidencia exacta, buscar ignorando sortBy/sortOrder
    // Esto permite que el prefetch (sin sortBy) coincida con la búsqueda real (con sortBy)
    const paramsWithoutSort: ProductFilterParams = { ...params };
    delete paramsWithoutSort.sortBy;
    delete paramsWithoutSort.sortOrder;
    
    // También intentar sin page (para que cache de página 1 sirva como base)
    const paramsWithoutSortPage: ProductFilterParams = { ...paramsWithoutSort };
    delete paramsWithoutSortPage.page;
    
    // Buscar todas las claves que coincidan con los parámetros sin sort
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) continue;
      
      // Extraer parámetros de la clave para comparar
      const keyParams = this.parseCacheKey(key);
      if (!keyParams) continue;
      
      // Comparar ignorando sortBy, sortOrder y page
      const matchParams: ProductFilterParams = { ...keyParams };
      delete matchParams.sortBy;
      delete matchParams.sortOrder;
      delete matchParams.page;
      
      const searchParams: ProductFilterParams = { ...paramsWithoutSortPage };
      
      // Comparar parámetros críticos
      const criticalMatch = 
        matchParams.categoria === searchParams.categoria &&
        matchParams.menuUuid === searchParams.menuUuid &&
        matchParams.submenuUuid === searchParams.submenuUuid &&
        matchParams.lazyLimit === searchParams.lazyLimit &&
        matchParams.lazyOffset === searchParams.lazyOffset;
      
      if (criticalMatch) {
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
      }
    }

    const key = this.generateCacheKey(params);
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultTTL,
    };

    this.cache.set(key, entry);
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

