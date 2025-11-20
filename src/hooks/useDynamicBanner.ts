"use client";

/**
 * Hook genérico para obtener banners de cualquier placement
 *
 * A diferencia de useHeroBanner, este hook retorna el Banner directo
 * sin mapear, permitiendo usarlo para cualquier tipo de banner.
 */

import { useCallback, useEffect, useState } from 'react';
import { bannersService } from '@/services/banners.service';
import type { Banner } from '@/types/banner';

/**
 * Valor de retorno del hook
 */
export interface UseDynamicBannerReturn {
  /** Array de banners obtenidos del API (vacío si no existen) - NUEVO para carruseles */
  banners: Banner[];
  /** Primer banner o null - LEGACY para backward compatibility */
  banner: Banner | null;
  /** True mientras carga los banners */
  loading: boolean;
  /** Mensaje de error si falla la petición */
  error: string | null;
  /** Función para refetch manual */
  refetch: () => Promise<void>;
}

/**
 * Hook para obtener banners por placement
 *
 * NUEVO: Ahora retorna un array de banners para soportar carruseles
 * cuando hay múltiples banners activos del mismo placement.
 *
 * @param placement - Nombre del placement (ej: "home-2", "home-3")
 * @returns Array de banners, loading state y función refetch
 *
 * @example
 * const { banners, loading } = useDynamicBanner('home-2');
 * // banners puede ser: [], [banner1], o [banner1, banner2, ...]
 */
export function useDynamicBanner(placement: string): UseDynamicBannerReturn {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // CAMBIO: Obtener TODOS los banners del placement (no solo el primero)
      const fetchedBanners = await bannersService.getBannersByPlacement(placement);
      setBanners(fetchedBanners);

      if (fetchedBanners.length === 0) {
        console.warn(`[useDynamicBanner] No banners found for placement "${placement}"`);
      } else {
        console.log(`[useDynamicBanner] Found ${fetchedBanners.length} banner(s) for placement "${placement}"`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error(`[useDynamicBanner] Failed to fetch banners for "${placement}":`, errorMessage);
      setError(errorMessage);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, [placement]);

  // Fetch cuando cambia el placement
  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  return {
    banners,
    banner: banners[0] || null, // LEGACY: Primer banner para backward compatibility
    loading,
    error,
    refetch: fetchBanners,
  };
}
