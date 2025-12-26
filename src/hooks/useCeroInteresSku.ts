import { useState, useEffect } from 'react';
import {
  buscarCeroInteresPorSkus,
  ZeroInterestSkuResult,
} from '@/services/cero-interes-sku.service';

/**
 * Mapa que relaciona cada SKU con sus opciones de cero interés
 * Un SKU puede tener múltiples entidades (C1 y C2)
 */
export type ZeroInterestMap = Map<string, ZeroInterestSkuResult[]>;

interface UseCeroInteresSkuReturn {
  data: ZeroInterestMap;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook para obtener información de cero interés por SKUs
 * 
 * Hace UNA sola petición al backend con todos los SKUs que tienen indcerointeres=1
 * y organiza el resultado en un mapa para fácil acceso por SKU.
 * 
 * @param skus - Array de SKUs a consultar (productos con indcerointeres=1)
 * @returns Mapa de SKU → array de opciones de cero interés
 * 
 * @example
 * const { data, isLoading } = useCeroInteresSku(['SKU1', 'SKU2']);
 * const skuOptions = data.get('SKU1'); // [{ codEntidad: 'C1', ... }, { codEntidad: 'C2', ... }]
 */
export function useCeroInteresSku(skus: string[]): UseCeroInteresSkuReturn {
  const [data, setData] = useState<ZeroInterestMap>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [fetchedSkus, setFetchedSkus] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Si no hay SKUs, resetear estado
    if (!skus || skus.length === 0) {
      setData(new Map());
      setIsLoading(false);
      return;
    }

    // Detectar SKUs nuevos que NO hemos consultado
    const newSkus = skus.filter(sku => !fetchedSkus.has(sku));
    
    // Si no hay SKUs nuevos, no hacer nada
    if (newSkus.length === 0) {
      return;
    }

    let isMounted = true;

    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        // Solo consultar los SKUs nuevos
        const results = await buscarCeroInteresPorSkus(newSkus);

        if (!isMounted) return;

        // AGREGAR resultados al mapa existente (no reemplazar)
        setData(prevData => {
          const newMap = new Map(prevData);
          
          results.forEach((result) => {
            const existing = newMap.get(result.sku) || [];
            existing.push(result);
            newMap.set(result.sku, existing);
          });

          return newMap;
        });

        // Marcar los nuevos SKUs como consultados
        setFetchedSkus(prev => {
          const newSet = new Set(prev);
          newSkus.forEach(sku => newSet.add(sku));
          return newSet;
        });
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [skus.join(',')]); // Dependency: detectar cuando cambia el array de SKUs

  return { data, isLoading, error };
}
