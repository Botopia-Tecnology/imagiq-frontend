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
  /** Banner obtenido del API o null si no existe */
  banner: Banner | null;
  /** True mientras carga el banner */
  loading: boolean;
  /** Mensaje de error si falla la petición */
  error: string | null;
  /** Función para refetch manual */
  refetch: () => Promise<void>;
}

/**
 * Hook para obtener un banner por placement
 *
 * @param placement - Nombre del placement (ej: "home-2", "home-3")
 * @returns Banner, loading state y función refetch
 *
 * @example
 * const { banner, loading } = useDynamicBanner('home-2');
 */
export function useDynamicBanner(placement: string): UseDynamicBannerReturn {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBanner = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchedBanner = await bannersService.getFirstBannerByPlacement(placement);
      setBanner(fetchedBanner);

      if (!fetchedBanner) {
        console.warn(`[useDynamicBanner] No banner found for placement "${placement}"`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error(`[useDynamicBanner] Failed to fetch banner for "${placement}":`, errorMessage);
      setError(errorMessage);
      setBanner(null);
    } finally {
      setLoading(false);
    }
  }, [placement]);

  // Fetch cuando cambia el placement
  useEffect(() => {
    fetchBanner();
  }, [fetchBanner]);

  return {
    banner,
    loading,
    error,
    refetch: fetchBanner,
  };
}
