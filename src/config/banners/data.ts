/**
 * Banner configuration for ofertas pages
 * Modifica estos valores para cambiar los banners en ofertas
 *
 * 🎯 Para modificar desde el dashboard en el futuro:
 * - Crear endpoint: GET /api/banners/ofertas
 */

import type { BannerConfig } from './types';

/**
 * Banner para la sección de Smartphones y Tablets en ofertas
 *
 * MODIFICAR AQUÍ para cambiar:
 * - Imágenes del banner
 * - Textos y Call to Action
 * - Colores y altura
 */
export const SMARTPHONES_TABLETS_BANNER: BannerConfig = {
  id: 'banner-smartphones-tablets-ofertas',

  // Textos (opcional, si quieres texto sobre la imagen)
  title: 'Los intereses te valen cero',
  subtitle: 'Comprando a 3, 6, 12 o 24 cuotas con bancos aliados',
  description: '',

  // Imágenes del banner
  imageUrl: 'https://res.cloudinary.com/dzi2p0pqa/image/upload/v1761672108/ihta784agvob9hp49hr8.jpg',
  imageUrlMobile: 'https://res.cloudinary.com/dzi2p0pqa/image/upload/v1761672127/q2rrxwakbz5fqkditjgd.jpg',

  // Call to Action (botón)
  buttonText: 'Comprar ahora',
  buttonLink: '/productos/ofertas?seccion=smartphones-tablets',

  // Estilos
  backgroundColor: '#000000',
  textColor: '#ffffff',
  height: '280px',        // Altura en desktop
  heightMobile: '180px',  // Altura en mobile

  // Control
  enabled: false,  // Deshabilitado
};

/**
 * Banners para otras secciones de ofertas
 */
export const ACCESORIOS_BANNER: BannerConfig = {
  id: 'banner-accesorios-ofertas',
  imageUrl: '',
  enabled: false,  // Deshabilitado por defecto
};

export const TV_MONITORES_AUDIO_BANNER: BannerConfig = {
  id: 'banner-tv-monitores-audio-ofertas',
  imageUrl: '',
  enabled: false,  // Deshabilitado por defecto
};

export const ELECTRODOMESTICOS_BANNER: BannerConfig = {
  id: 'banner-electrodomesticos-ofertas',
  imageUrl: '',
  enabled: false,  // Deshabilitado por defecto
};

/**
 * Mapeo de sección a banner correspondiente
 */
export const OFERTAS_BANNERS_MAP: Record<string, BannerConfig> = {
  'smartphones-tablets': SMARTPHONES_TABLETS_BANNER,
  'accesorios': ACCESORIOS_BANNER,
  'tv-monitores-audio': TV_MONITORES_AUDIO_BANNER,
  'electrodomesticos': ELECTRODOMESTICOS_BANNER,
};
