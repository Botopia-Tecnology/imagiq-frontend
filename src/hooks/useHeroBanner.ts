"use client";

/**
 * Hook para obtener configuración del Hero banner desde el API
 *
 * Fetch el banner con placement="hero" y lo mapea a HeroBannerConfig.
 * Usa DEFAULT_HERO_CONFIG como fallback si no hay banner o hay error.
 */

import { useCallback, useEffect, useState } from 'react';
import { bannersService } from '@/services/banners.service';
import type { HeroBannerConfig } from '@/types/banner';

/**
 * Configuración por defecto del Hero (fallback)
 * Se usa cuando el API no tiene banners o falla
 */
const DEFAULT_HERO_CONFIG: HeroBannerConfig = {
  videoSrc: 'https://res.cloudinary.com/dzi2p0pqa/video/upload/v1761667351/liknebcbt1qxzhps9vri.mp4',
  mobileVideoSrc: 'https://res.cloudinary.com/dzi2p0pqa/video/upload/v1761667761/qhqdcbmrzkamiathgfqz.mp4',
  imageSrc: 'https://res.cloudinary.com/dzi2p0pqa/image/upload/v1761667626/v2ky5inds2mhhdkcx6bu.webp',
  mobileImageSrc: 'https://res.cloudinary.com/dzi2p0pqa/image/upload/v1761667756/q3be3wuhnjgse3xkajxw.webp',
  poster: 'https://res.cloudinary.com/dzi2p0pqa/image/upload/v1761667626/v2ky5inds2mhhdkcx6bu.webp',
  mobilePoster: 'https://res.cloudinary.com/dzi2p0pqa/image/upload/v1761667756/q3be3wuhnjgse3xkajxw.webp',
  heading: 'AI, just for you',
  subheading: '0% de interés a 3, 6 o 12 cuotas',
  ctaText: 'Más información',
  ctaLink: '/productos/ofertas?seccion=smartphones-tablets',
  textColor: '#ffffff',
  coordinates: '4-4',
  coordinatesMobile: '4-6',
  showContentOnEnd: true,
  autoplay: true,
  loop: false,
  muted: true,
};

/**
 * Valor de retorno del hook
 */
export interface UseHeroBannerReturn {
  /** Configuración del Hero (desde API o fallback) */
  config: HeroBannerConfig;
  /** True mientras carga el banner del API */
  loading: boolean;
  /** Mensaje de error si falla la petición */
  error: string | null;
  /** Función para refetch manual */
  refetch: () => Promise<void>;
}

/**
 * Hook para obtener el Hero banner desde el API
 *
 * @returns Configuración del Hero, loading state y función refetch
 *
 * @example
 * const { config, loading } = useHeroBanner();
 */
export function useHeroBanner(): UseHeroBannerReturn {
  const [config, setConfig] = useState<HeroBannerConfig>(DEFAULT_HERO_CONFIG);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBanner = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const banner = await bannersService.getFirstBannerByPlacement('hero');

      if (banner) {
        const mappedConfig = bannersService.mapBannerToHeroConfig(banner);
        setConfig(mappedConfig);
      } else {
        console.warn('[useHeroBanner] No banner found for placement "hero" - Using default config');
        setConfig(DEFAULT_HERO_CONFIG);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('[useHeroBanner] Failed to fetch hero banner:', errorMessage);
      setError(errorMessage);
      setConfig(DEFAULT_HERO_CONFIG);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch al montar
  useEffect(() => {
    fetchBanner();
  }, [fetchBanner]);

  return {
    config,
    loading,
    error,
    refetch: fetchBanner,
  };
}
