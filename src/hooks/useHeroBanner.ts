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
  colorFont: '#ffffff',
  // Posiciones en porcentajes (centro)
  positionDesktop: { x: 50, y: 50, imageWidth: 1920, imageHeight: 1080 },
  positionMobile: { x: 50, y: 75, imageWidth: 750, imageHeight: 1334 },
  textStyles: null,
  showContentOnEnd: true,
  autoplay: true,
  loop: false,
  muted: true,
};

/**
 * Valor de retorno del hook
 */
export interface UseHeroBannerReturn {
  /** Array de configuraciones del Hero - NUEVO para carruseles */
  configs: HeroBannerConfig[];
  /** Configuración del Hero (primer banner o fallback) - LEGACY para backward compatibility */
  config: HeroBannerConfig;
  /** True mientras carga el banner del API */
  loading: boolean;
  /** Mensaje de error si falla la petición */
  error: string | null;
  /** Función para refetch manual */
  refetch: () => Promise<void>;
}

/**
 * Hook para obtener banners del Hero desde el API
 *
 * NUEVO: Ahora retorna un array de configuraciones para soportar carruseles
 * cuando hay múltiples banners activos con placement="hero".
 *
 * @returns Array de configuraciones del Hero, loading state y función refetch
 *
 * @example
 * const { configs, config, loading } = useHeroBanner();
 * // configs: Array de todos los banners
 * // config: Primer banner o fallback (para backward compatibility)
 */
export function useHeroBanner(): UseHeroBannerReturn {
  const [configs, setConfigs] = useState<HeroBannerConfig[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // CAMBIO: Obtener TODOS los banners del placement (no solo el primero)
      const banners = await bannersService.getBannersByPlacement('hero');

      if (banners.length > 0) {
        const mappedConfigs = banners.map(banner =>
          bannersService.mapBannerToHeroConfig(banner)
        );
        setConfigs(mappedConfigs);
        console.log(`[useHeroBanner] Found ${banners.length} banner(s) for placement "hero"`);
      } else {
        console.warn('[useHeroBanner] No banners found for placement "hero" - Using default config');
        setConfigs([DEFAULT_HERO_CONFIG]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('[useHeroBanner] Failed to fetch hero banners:', errorMessage);
      setError(errorMessage);
      setConfigs([DEFAULT_HERO_CONFIG]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch al montar
  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  return {
    configs,
    config: configs[0] || DEFAULT_HERO_CONFIG, // LEGACY: Primer config para backward compatibility
    loading,
    error,
    refetch: fetchBanners,
  };
}
