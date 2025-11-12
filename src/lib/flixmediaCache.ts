/**
 * Cache en memoria para resultados de búsquedas de Flixmedia
 * Evita hacer múltiples peticiones HTTP para el mismo producto
 */

interface FlixCacheEntry {
  mpn: string | null;
  ean: string | null;
  timestamp: number;
}

class FlixmediaCache {
  private cache = new Map<string, FlixCacheEntry>();
  private readonly TTL = 5 * 60 * 1000; // 5 minutos

  /**
   * Genera una clave única para el cache basada en los SKUs/EANs
   */
  private generateKey(mpn?: string | null, ean?: string | null): string {
    return `${mpn || ''}_${ean || ''}`;
  }

  /**
   * Obtiene un resultado del cache si existe y no ha expirado
   */
  get(mpn?: string | null, ean?: string | null): FlixCacheEntry | null {
    const key = this.generateKey(mpn, ean);
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Verificar si ha expirado
    const now = Date.now();
    if (now - entry.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }

    console.log(`✅ Cache hit para Flixmedia: ${key}`);
    return entry;
  }

  /**
   * Guarda un resultado en el cache
   */
  set(
    originalMpn: string | null | undefined,
    originalEan: string | null | undefined,
    foundMpn: string | null,
    foundEan: string | null
  ): void {
    const key = this.generateKey(originalMpn, originalEan);
    this.cache.set(key, {
      mpn: foundMpn,
      ean: foundEan,
      timestamp: Date.now(),
    });
    console.log(`💾 Cache guardado para Flixmedia: ${key}`);
  }

  /**
   * Limpia el cache completo
   */
  clear(): void {
    this.cache.clear();
    console.log('🗑️ Cache de Flixmedia limpiado');
  }

  /**
   * Limpia entradas expiradas del cache
   */
  cleanExpired(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.TTL) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`🗑️ ${cleaned} entradas expiradas eliminadas del cache`);
    }
  }
}

// Singleton global
export const flixmediaCache = new FlixmediaCache();

// Limpiar cache expirado cada 2 minutos
if (typeof window !== 'undefined') {
  setInterval(() => {
    flixmediaCache.cleanExpired();
  }, 2 * 60 * 1000);
}
