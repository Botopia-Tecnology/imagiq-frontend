/**
 * Utilidad para obtener la imagen del producto
 * Por ahora solo retorna la imagen principal
 * TODO: Integrar con imageDetailsUrls del backend cuando esté disponible
 */

interface ProductWithImages {
  image: string | { src: string };
}

/**
 * Obtiene la imagen principal del producto
 * @param product - Producto con imagen
 * @returns Array con la imagen del producto
 */
export function getProductImages(product: ProductWithImages): string[] {
  const imageSrc = typeof product.image === "string" ? product.image : product.image.src;
  return [imageSrc];
}

