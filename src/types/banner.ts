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
 * Caja de texto individual con posición independiente
 * Cada caja puede ser posicionada de manera diferente en desktop y mobile
 * Soporta saltos de línea, justificación y estilos personalizados
 */
export interface TextBox {
  id: string;
  text: string;  // Puede incluir \n para saltos de línea
  position_desktop: {
    x: number;  // 0-100 (porcentaje)
    y: number;  // 0-100 (porcentaje)
  };
  position_mobile: {
    x: number;
    y: number;
  };
  styles?: {
    fontSize?: string;
    fontWeight?: string;  // '300', '400', '500', '600', '700', '800', '900'
    lineHeight?: string;
    color?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    letterSpacing?: string;
    textShadow?: string;
    maxWidth?: string;  // Ancho máximo de la caja
    whiteSpace?: 'normal' | 'pre-line' | 'pre-wrap';  // Para controlar saltos de línea
  };
}

/**
 * Caja de CTA (Call To Action) con posición independiente
 */
export interface CTABox {
  id: string;
  text: string;
  link_url?: string;
  position_desktop: {
    x: number;
    y: number;
  };
  position_mobile: {
    x: number;
    y: number;
  };
  styles?: {
    fontSize?: string;
    fontWeight?: string;
    backgroundColor?: string;
    color?: string;
    padding?: string;
    borderRadius?: string;
    borderWidth?: string;
    borderColor?: string;
    textAlign?: 'left' | 'center' | 'right';
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    letterSpacing?: string;
    boxShadow?: string;
    transition?: string;
  };
}

/**
 * Bloque de contenido agrupado (NUEVO SISTEMA)
 * Cada bloque puede contener múltiples elementos (título, subtítulo, descripción, CTA)
 * Soporta configuraciones independientes para desktop y mobile
 */
export interface ContentBlock {
  id: string;
  position_desktop: { x: number; y: number };
  position_mobile: { x: number; y: number };
  
  // Alineación del bloque completo (desktop)
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  maxWidth?: string;
  gap?: string;
  
  // Configuraciones mobile del contenedor (opcional, fallback a desktop)
  textAlign_mobile?: 'left' | 'center' | 'right' | 'justify';
  maxWidth_mobile?: string;
  gap_mobile?: string;
  
  // Elementos opcionales dentro del bloque
  title?: {
    text: string;
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    lineHeight?: string;
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    letterSpacing?: string;
    textShadow?: string;
  };
  
  // Configuración mobile del título (opcional, fallback a desktop)
  title_mobile?: {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    lineHeight?: string;
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    letterSpacing?: string;
    textShadow?: string;
  };
  
  subtitle?: {
    text: string;
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    lineHeight?: string;
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    letterSpacing?: string;
    textShadow?: string;
  };
  
  // Configuración mobile del subtítulo (opcional)
  subtitle_mobile?: {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    lineHeight?: string;
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    letterSpacing?: string;
    textShadow?: string;
  };
  
  description?: {
    text: string;
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    lineHeight?: string;
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    letterSpacing?: string;
    textShadow?: string;
  };
  
  // Configuración mobile de la descripción (opcional)
  description_mobile?: {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    lineHeight?: string;
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    letterSpacing?: string;
    textShadow?: string;
  };
  
  cta?: {
    text: string;
    link_url?: string;
    fontSize?: string;
    fontWeight?: string;
    backgroundColor?: string;
    color?: string;
    padding?: string;
    borderRadius?: string;
    border?: string;
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    // Efecto glassmorphism
    backdropFilter?: string;
    boxShadow?: string;
  };
  
  // Configuración mobile del CTA (opcional)
  cta_mobile?: {
    fontSize?: string;
    fontWeight?: string;
    backgroundColor?: string;
    color?: string;
    padding?: string;
    borderRadius?: string;
    border?: string;
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    // Efecto glassmorphism
    backdropFilter?: string;
    boxShadow?: string;
  };
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
  
  // CAMPOS LEGACY (opcionales cuando se usa content_blocks)
  /** @deprecated Usar content_blocks[].title en su lugar */
  description?: string | null;
  /** @deprecated Usar content_blocks[].cta en su lugar */
  cta?: string | null;
  /** @deprecated Usar content_blocks[].title en su lugar */
  title?: string | null;
  /** @deprecated Cada elemento en content_blocks tiene su propio color */
  color_font?: string;
  /** Campo del backend para color del header en banners hero */
  text_color_default?: string | null;
  /** @deprecated Sistema legacy: Coordenadas en formato "X-Y" (ej: "2-4") */
  coordinates?: string | null;
  coordinates_mobile?: string | null;
  /** @deprecated Usar content_blocks[].position_desktop en su lugar */
  position_desktop?: string | null;
  /** @deprecated Usar content_blocks[].position_mobile en su lugar */
  position_mobile?: string | null;
  /** @deprecated Cada elemento en content_blocks tiene sus propios estilos */
  text_styles?: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  
  // NUEVO SISTEMA: Cajas de contenido con posiciones independientes
  /** Array de cajas de título como JSON string */
  title_boxes: string | null;
  /** Array de cajas de descripción como JSON string */
  description_boxes: string | null;
  /** Array de cajas de CTA como JSON string */
  cta_boxes: string | null;
  
  // NUEVO SISTEMA V2: Bloques de contenido agrupado
  /** Array de bloques de contenido como JSON string */
  content_blocks?: string | ContentBlock[] | null;
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
  /** Color del header/navbar para banners hero (#ffffff = claro, #000000 = oscuro) */
  colorFont?: string;
  /** Posición desktop parseada (porcentajes) */
  positionDesktop?: BannerPosition;
  /** Posición mobile parseada (porcentajes) */
  positionMobile?: BannerPosition;
  /** Estilos de texto personalizados (null = usar por defecto) */
  textStyles?: BannerTextStyles | null;
  /** Bloques de contenido con configuración desktop/mobile independiente */
  content_blocks?: string | ContentBlock[];
  showContentOnEnd: boolean;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
}
