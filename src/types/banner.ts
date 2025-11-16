/**
 * Sistema de Banners Dinámicos - Definiciones de Tipos
 *
 * Define todas las interfaces y tipos para el sistema de banners
 * que consume el API /api/multimedia/banners
 */

/**
 * Estados posibles de un banner
 */
export type BannerStatus = 'active' | 'inactive' | 'scheduled';

/**
 * Estructura de posición en formato JSON del API
 * x,y son PORCENTAJES relativos (0-100)
 */
export interface BannerPosition {
  x: number;
  y: number;
  imageWidth: number;
  imageHeight: number;
}

/**
 * Estilos de texto personalizados para el banner
 */
export interface BannerTextStyles {
  title?: {
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    color?: string;
  };
  description?: {
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    color?: string;
  };
  cta?: {
    fontSize?: string;
    fontWeight?: string;
    padding?: string;
    borderRadius?: string;
    borderWidth?: string;
    backgroundColor?: string;
    color?: string;
  };
}

/**
 * Metadatos de paginación del API
 */
export interface BannerMeta {
  total: number;
  page: number;
  per_page: number;
}

/**
 * Estructura completa de un banner según el API
 * Representa la respuesta directa del endpoint /api/multimedia/banners
 */
export interface Banner {
  id: string;
  name: string;
  placement: string;
  desktop_image_url: string | null;
  desktop_video_url: string | null;
  mobile_image_url: string | null;
  mobile_video_url: string | null;
  link_url: string | null;
  status: BannerStatus;
  description: string | null;
  cta: string | null;
  title: string | null;
  /** Color del texto del banner en formato hex */
  color_font: string;
  /** Posición desktop como JSON string con porcentajes: {"x":50,"y":50,"imageWidth":1920,"imageHeight":1080} */
  position_desktop: string | null;
  /** Posición mobile como JSON string con porcentajes: {"x":50,"y":50,"imageWidth":750,"imageHeight":1334} */
  position_mobile: string | null;
  /** Estilos de texto como JSON string (puede ser null para usar estilos por defecto) */
  text_styles: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

/**
 * Respuesta del API de banners
 */
export interface BannerApiResponse {
  data: Banner[];
  meta: BannerMeta;
}

/**
 * Configuración procesada para HeroSection
 * Formato adaptado a las necesidades del componente Hero
 */
export interface HeroBannerConfig {
  /** URL del video desktop (vacío si solo hay imagen) */
  videoSrc: string;
  /** URL del video mobile (vacío si solo hay imagen) */
  mobileVideoSrc: string;
  /** URL de la imagen desktop (se usa como poster si hay video, o como imagen principal si no) */
  imageSrc: string;
  /** URL de la imagen mobile (se usa como poster si hay video, o como imagen principal si no) */
  mobileImageSrc: string;
  /** @deprecated Use imageSrc instead */
  poster: string;
  /** @deprecated Use mobileImageSrc instead */
  mobilePoster: string;
  heading: string;
  subheading: string;
  ctaText: string;
  ctaLink: string;
  /** Color del texto en formato hex */
  textColor: string;
  /** Posición desktop parseada (porcentajes) */
  positionDesktop?: BannerPosition;
  /** Posición mobile parseada (porcentajes) */
  positionMobile?: BannerPosition;
  /** Estilos de texto personalizados (null = usar por defecto) */
  textStyles?: BannerTextStyles | null;
  showContentOnEnd: boolean;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
}
