/**
 * Utilidad para insertar banners en el grid de productos
 * Los banners se insertan cada N productos
 */

import type { ProductCardProps } from "../components/ProductCard";
import type { Banner } from "@/types/banner";

export interface GridItem {
  type: "product" | "banner";
  data: ProductCardProps | Banner | Banner[]; // Puede ser un solo banner o array para carrusel
  key: string;
}

/**
 * Inserta banners en el array de productos
 * - Primer banner al inicio (antes del primer producto)
 * - Luego cada N productos (después del producto N, 2N, 3N, etc.)
 * - Si hay múltiples banners, se inserta el array completo para carrusel
 * @param products - Array de productos
 * @param banners - Array de banners o banner individual (si hay múltiples, se rotarán en carrusel)
 * @param interval - Intervalo de productos entre banners (default: 15)
 * @returns Array mezclado de productos y banners
 */
export function insertBannersInGrid(
  products: ProductCardProps[],
  banners: Banner[] | Banner | null,
  interval: number = 15
): GridItem[] {
  // Normalizar banners a array
  const bannerArray = !banners 
    ? [] 
    : Array.isArray(banners) 
      ? banners 
      : [banners];

  // Si no hay banners, retornar solo productos
  if (bannerArray.length === 0) {
    return products.map((product, index) => ({
      type: "product" as const,
      data: product,
      key: `product-${index}`,
    }));
  }

  const result: GridItem[] = [];
  let bannerCount = 0;

  // Insertar primer banner/carrusel al inicio
  result.push({
    type: "banner" as const,
    data: bannerArray.length > 1 ? bannerArray : bannerArray[0],
    key: `banner-${bannerCount}`,
  });
  bannerCount++;

  // Insertar productos y banners adicionales
  for (let i = 0; i < products.length; i++) {
    // Insertar producto
    result.push({
      type: "product" as const,
      data: products[i],
      key: `product-${i}`,
    });

    // Insertar banner cada N productos (después del producto N, 2N, 3N, etc.)
    if ((i + 1) % interval === 0 && i < products.length - 1) {
      result.push({
        type: "banner" as const,
        data: bannerArray.length > 1 ? bannerArray : bannerArray[0],
        key: `banner-${bannerCount}`,
      });
      bannerCount++;
    }
  }

  return result;
}
