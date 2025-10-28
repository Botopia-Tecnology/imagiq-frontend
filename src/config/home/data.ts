/**
 * Hero section configuration
 * Modifica estos valores para cambiar el video, textos y CTA del Hero
 *
 * 🎯 Para modificar desde el dashboard en el futuro:
 * - Crear endpoint: GET /api/home/hero-config
 * - Descomentar fetchHeroConfig() en useHomeConfig.ts
 */

import type { HeroConfig } from './types';

/**
 * Configuración del Hero (video principal del home)
 *
 * MODIFICAR AQUÍ para cambiar:
 * - Videos y posters
 * - Títulos y subtítulos
 * - Texto y link del botón
 * - Comportamiento (loop, autoplay, etc.)
 */
export const HERO_CONFIG: HeroConfig = {
  id: 'hero-main',

  // Contenido que aparece al final del video
  title: 'AI, just for you',
  subtitle: '0% de interés a 3, 6 o 12 cuotas',
  description: '',

  // Call to Action (botón)
  buttonText: 'Más información',
  buttonLink: '/productos/ofertas?seccion=smartphones-tablets',

  // Videos
  videoSrc: 'https://res.cloudinary.com/dzi2p0pqa/video/upload/v1761667351/liknebcbt1qxzhps9vri.mp4',
  videoSrcMobile: 'https://res.cloudinary.com/dzi2p0pqa/video/upload/v1761667761/qhqdcbmrzkamiathgfqz.mp4',

  // Imágenes que aparecen al final del video
  posterSrc: 'https://res.cloudinary.com/dzi2p0pqa/image/upload/v1761667626/v2ky5inds2mhhdkcx6bu.webp',
  posterSrcMobile: 'https://res.cloudinary.com/dzi2p0pqa/image/upload/v1761667756/q3be3wuhnjgse3xkajxw.webp',

  // Configuración de comportamiento
  bgColor: '#000000',
  showContentOnEnd: true,  // Mostrar título/botón al finalizar video
  autoplay: true,          // Reproducir automáticamente
  loop: false,             // false = se detiene al final, true = se repite
  muted: true,             // true = sin sonido (requerido para autoplay)
};
