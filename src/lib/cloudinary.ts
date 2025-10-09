/**
 * Cloudinary Image Optimization Configuration
 *
 * Centraliza la lógica de transformación de imágenes usando Cloudinary
 * para garantizar tamaños consistentes y optimización automática.
 */

// Configuración de Cloudinary desde variables de entorno
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Tipos de transformación disponibles por contexto de uso
 */
export type ImageTransformType =
  | 'catalog'          // Grid de productos (400x400)
  | 'product-main'     // Vista principal de producto (800x800)
  | 'product-detail'   // Detalle ampliado (1000x1000)
  | 'thumbnail'        // Miniaturas (150x150)
  | 'comparison'       // Comparación de productos (300x300)
  | 'hero'             // Banners/Hero sections (1200x600)
  | 'original';        // Sin transformación

/**
 * Configuración de transformaciones por tipo
 * Usa las mejores prácticas de Cloudinary:
 * - f_auto: Formato automático (WebP/AVIF cuando disponible)
 * - q_auto: Calidad automática optimizada
 * - c_fill/pad/fit: Estrategia de crop según necesidad
 * - g_auto: Gravity automático (enfoca en contenido importante)
 * - b_auto:predominant: Rellena espacios vacíos con color predominante
 */
const TRANSFORM_CONFIGS: Record<ImageTransformType, string> = {
  // Catálogo - 400x400, fill_pad mantiene proporciones y rellena con color
  catalog: 'f_auto,q_auto,c_fill_pad,g_auto,w_400,h_400,b_auto:predominant',

  // Vista principal producto - 800x800, fill_pad (mantiene proporciones, rellena espacios)
  'product-main': 'f_auto,q_auto:good,c_fill_pad,g_auto,w_800,h_800,b_auto:predominant',

  // Detalle producto - 1000x1000, fill_pad (mantiene proporciones completas, máxima calidad)
  'product-detail': 'f_auto,q_auto:best,c_fill_pad,g_auto,w_1000,h_1000,b_auto:predominant',

  // Thumbnail - 150x150, fill_pad con relleno
  thumbnail: 'f_auto,q_auto,c_fill_pad,g_auto,w_150,h_150,b_auto:predominant',

  // Comparación - 300x300, fill_pad
  comparison: 'f_auto,q_auto,c_fill_pad,g_auto,w_300,h_300,b_auto:predominant',

  // Hero/Banner - 1200x600, fill (recorta para llenar completamente)
  hero: 'f_auto,q_auto,c_fill,g_auto,w_1200,h_600',

  // Original - solo formato y calidad automática
  original: 'f_auto,q_auto',
};

/**
 * Extrae información de una URL de Cloudinary existente
 * o determina si es una URL externa que necesita ser proxied
 */
function extractCloudinaryInfo(url: string): {
  publicId: string;
  cloudName: string | null;
  isExternal: boolean;
  versionPrefix: string;
} {
  // Si la URL ya es de Cloudinary, extraer cloud name, version y public_id
  const cloudinaryRegex = /cloudinary\.com\/([^\/]+)\/image\/upload\/(v\d+\/)?(.+)$/;
  const match = url.match(cloudinaryRegex);

  if (match) {
    return {
      cloudName: match[1],      // Ej: "dnglv0zqg"
      versionPrefix: match[2] || '',  // Ej: "v1759796902/"
      publicId: match[3],       // Ej: "botopia/audio_video/..."
      isExternal: false
    };
  }

  // Si es una URL externa, usar fetch para proxiar a través de Cloudinary
  return {
    publicId: url,
    cloudName: null,
    versionPrefix: '',
    isExternal: true
  };
}

/**
 * Genera una URL de Cloudinary optimizada con las transformaciones especificadas
 *
 * @param imageUrl - URL de la imagen (puede ser Cloudinary o externa)
 * @param transformType - Tipo de transformación a aplicar
 * @returns URL optimizada de Cloudinary
 *
 * @example
 * ```ts
 * // Imagen del catálogo
 * const catalogUrl = getCloudinaryUrl(product.image, 'catalog');
 *
 * // Imagen detalle del producto
 * const detailUrl = getCloudinaryUrl(product.image, 'product-detail');
 * ```
 */
export function getCloudinaryUrl(
  imageUrl: string | undefined | null,
  transformType: ImageTransformType = 'original'
): string {
  // Si no hay imagen, devolver placeholder
  if (!imageUrl || typeof imageUrl !== 'string') {
    return '/placeholder-product.png';
  }

  // Si es un StaticImageData o path local, devolverlo tal cual
  if (imageUrl.startsWith('/') || imageUrl.startsWith('data:')) {
    return imageUrl;
  }

  const { publicId, cloudName, versionPrefix, isExternal } = extractCloudinaryInfo(imageUrl);
  const transformation = TRANSFORM_CONFIGS[transformType];

  if (isExternal) {
    // Usar fetch para URLs externas
    return `${CLOUDINARY_BASE_URL}/${transformation}/f_auto/fetch:${encodeURIComponent(publicId)}`;
  }

  // Si la URL ya tenía un cloud name, usar ese en lugar del de .env
  // Esto preserva las URLs completas que vienen del backend
  const baseUrl = cloudName
    ? `https://res.cloudinary.com/${cloudName}/image/upload`
    : CLOUDINARY_BASE_URL;

  // URL de Cloudinary nativa con transformaciones inyectadas
  return `${baseUrl}/${transformation}/${versionPrefix}${publicId}`;
}

/**
 * Genera múltiples tamaños para srcset (responsive images)
 *
 * @param imageUrl - URL de la imagen
 * @param transformType - Tipo base de transformación
 * @returns String para srcset con múltiples tamaños
 */
export function getResponsiveSrcSet(
  imageUrl: string | undefined | null,
  transformType: ImageTransformType
): string {
  if (!imageUrl) return '';

  const baseConfig = TRANSFORM_CONFIGS[transformType];
  const { publicId, cloudName, versionPrefix, isExternal } = extractCloudinaryInfo(imageUrl);

  // Generar variantes: 1x, 1.5x, 2x para dispositivos de alta densidad
  const sizes = [1, 1.5, 2];

  // Determinar el base URL (preservar cloud name de la URL original si existe)
  const baseUrl = cloudName
    ? `https://res.cloudinary.com/${cloudName}/image/upload`
    : CLOUDINARY_BASE_URL;

  const srcset = sizes.map(multiplier => {
    // Extraer dimensiones del baseConfig
    const widthMatch = baseConfig.match(/w_(\d+)/);
    const heightMatch = baseConfig.match(/h_(\d+)/);

    if (!widthMatch || !heightMatch) return null;

    const width = Math.round(parseInt(widthMatch[1]) * multiplier);
    const height = Math.round(parseInt(heightMatch[1]) * multiplier);

    // Reemplazar dimensiones en la config
    const scaledConfig = baseConfig
      .replace(/w_\d+/, `w_${width}`)
      .replace(/h_\d+/, `h_${height}`);

    const url = isExternal
      ? `${CLOUDINARY_BASE_URL}/${scaledConfig}/f_auto/fetch:${encodeURIComponent(publicId)}`
      : `${baseUrl}/${scaledConfig}/${versionPrefix}${publicId}`;

    return `${url} ${multiplier}x`;
  }).filter(Boolean).join(', ');

  return srcset;
}

/**
 * Configuración de dimensiones CSS por tipo de transformación
 * Para usar con Next.js Image component
 */
export const IMAGE_DIMENSIONS: Record<ImageTransformType, { width: number; height: number }> = {
  catalog: { width: 400, height: 400 },
  'product-main': { width: 800, height: 800 },
  'product-detail': { width: 1000, height: 1000 },
  thumbnail: { width: 150, height: 150 },
  comparison: { width: 300, height: 300 },
  hero: { width: 1200, height: 600 },
  original: { width: 800, height: 800 }, // Fallback
};
