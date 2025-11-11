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
 * Estructura de coordenadas procesadas del sistema 9x9
 * x,y van de 0-8 donde 0 es inicio y 8 es fin
 */
export interface BannerCoordinates {
  x: number;
  y: number;
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
  /** Coordenadas desktop en formato "x-y" (ej: "2-5") */
  coordinates: string;
  /** Coordenadas mobile en formato "x-y" (ej: "4-6") */
  coordinates_mobile: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
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
  /** Coordenadas desktop en formato "x-y" */
  coordinates: string;
  /** Coordenadas mobile en formato "x-y" */
  coordinatesMobile: string;
  showContentOnEnd: boolean;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
}
