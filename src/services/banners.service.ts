/**
 * Servicio de Banners Dinámicos
 *
 * Gestiona la obtención, caché y transformación de banners desde el API.
 * Implementa caché en memoria con TTL de 5 minutos para optimizar requests.
 */

import { apiClient } from "@/lib/api";
import type {
  Banner,
  BannerApiResponse,
  HeroBannerConfig,
} from "@/types/banner";
import { parsePosition, parseTextStyles } from "@/utils/bannerCoordinates";

/**
 * Servicio singleton para gestionar banners del API
 */
class BannersService {
  private cache: Banner[] | null = null;
  private cacheTimestamp: number | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  /**
   * Obtiene todos los banners activos del API
   * Implementa caché en memoria para reducir requests
   *
   * @returns Array de banners activos o array vacío en caso de error
   */
  async getActiveBanners(): Promise<Banner[]> {
    try {
      // Verificar si hay caché válido
      if (this.cache && this.cacheTimestamp) {
        const now = Date.now();
        if (now - this.cacheTimestamp < this.CACHE_DURATION) {
          return this.cache;
        }
      }

      // Fetch desde API
      const response = await apiClient.get<BannerApiResponse>(
        "/api/multimedia/banners?status=active"
      );

      if (response.success && response.data?.data) {
        this.cache = response.data.data;
        this.cacheTimestamp = Date.now();
        return this.cache;
      }

      console.error(
        "[BannersService] Failed to fetch banners:",
        response.message
      );
      return [];
    } catch (error) {
      console.error("[BannersService] Error fetching banners:", error);
      return [];
    }
  }

  /**
   * Obtiene banners filtrados por placement
   *
   * @param placement - Nombre del placement (ej: "hero", "home-2", "home-3")
   * @returns Array de banners del placement especificado
   */
  async getBannersByPlacement(placement: string): Promise<Banner[]> {
    const banners = await this.getActiveBanners();
    const filtered = banners.filter((banner) => banner.placement === placement);
    return filtered;
  }

  /**
   * Obtiene el primer banner de un placement específico
   *
   * @param placement - Nombre del placement
   * @returns Primer banner encontrado o null si no existe
   */
  async getFirstBannerByPlacement(placement: string): Promise<Banner | null> {
    const banners = await this.getBannersByPlacement(placement);
    return banners.length > 0 ? banners[0] : null;
  }

  /**
   * Mapea un Banner del API a HeroBannerConfig para HeroSection
   *
   * @param banner - Banner obtenido del API
   * @returns Configuración formateada para HeroSection
   */
  mapBannerToHeroConfig(banner: Banner): HeroBannerConfig {
    // URLs de video (solo si existen)
    const desktopVideo = banner.desktop_video_url || "";
    const mobileVideo = banner.mobile_video_url || "";

    // URLs de imagen (siempre disponibles)
    const desktopImage = banner.desktop_image_url || "";
    const mobileImage = banner.mobile_image_url || "";

    // Parsear posiciones del nuevo sistema
    const positionDesktop = parsePosition(banner.position_desktop);
    const positionMobile = parsePosition(banner.position_mobile);

    // Parsear estilos de texto (puede ser null)
    const textStyles = parseTextStyles(banner.text_styles);

    return {
      videoSrc: desktopVideo,
      mobileVideoSrc: mobileVideo,
      imageSrc: desktopImage,
      mobileImageSrc: mobileImage,
      // Mantener por compatibilidad
      poster: desktopImage,
      mobilePoster: mobileImage,
      heading: banner.title || "",
      subheading: banner.description || "",
      ctaText: banner.cta || "Ver más",
      ctaLink: banner.link_url || "#",
      textColor: banner.color_font || "#000000",
      // Posiciones parseadas
      positionDesktop: positionDesktop || undefined,
      positionMobile: positionMobile || undefined,
      // Estilos de texto personalizados
      textStyles: textStyles,
      // Mostrar el contenido cuando el video termine por defecto.
      // Si en el futuro el API incluye un flag específico, podemos mapearlo aquí.
      showContentOnEnd: true,
      autoplay: true,
      loop: false,
      muted: true,
    };
  }

  /**
   * Limpia el caché manualmente
   * Útil para forzar refresh de banners
   */
  clearCache(): void {
    this.cache = null;
    this.cacheTimestamp = null;
  }
}

// Exportar instancia singleton
export const bannersService = new BannersService();
