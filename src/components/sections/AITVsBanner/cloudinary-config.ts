/**
 * Cloudinary Configuration - AI TVs Banner
 *
 * INSTRUCCIONES PARA ACTUALIZAR LAS URLs:
 * 1. Ve a: https://cloudinary.com/console/media_library
 * 2. Busca las imágenes en la carpeta Samsung/Home
 * 3. Haz clic en cada imagen
 * 4. Copia el "Public ID" (ejemplo: Samsung/Home/imagen_123)
 * 5. Reemplaza los valores abajo manteniendo el formato:
 *    https://res.cloudinary.com/[CLOUD_NAME]/image/upload/[PUBLIC_ID]
 */

export const CLOUDINARY_CLOUD_NAME = "dqsdl9bwv";

// URLs de Cloudinary - URLs completas verificadas
export const BANNER_IMAGES = {
  desktop: {
    publicId: "MDVD_Feature_KV_PC_1440x810_LTR_trxgtb",
    url: "https://res.cloudinary.com/dqsdl9bwv/image/upload/v1759811545/MDVD_Feature_KV_PC_1440x810_LTR_trxgtb.avif",
  },
  mobile: {
    publicId: "MDVD_Feature_KV_MO_720X1120_e18si6",
    url: "https://res.cloudinary.com/dqsdl9bwv/image/upload/v1759811702/MDVD_Feature_KV_MO_720X1120_e18si6.webp",
  },
};

// Función helper para construir URLs de Cloudinary con transformaciones
export function buildCloudinaryUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  }
): string {
  const transformations: string[] = [];

  if (options?.width) transformations.push(`w_${options.width}`);
  if (options?.height) transformations.push(`h_${options.height}`);
  if (options?.quality) transformations.push(`q_${options.quality}`);
  if (options?.format) transformations.push(`f_${options.format}`);

  const transformString =
    transformations.length > 0 ? `${transformations.join(",")}/` : "";

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformString}${publicId}`;
}
