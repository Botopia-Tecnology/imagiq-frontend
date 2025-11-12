/**
 * Utilidad para insertar banners en el grid de productos
 * Los banners se insertan cada N productos
 */

import type { ProductCardProps } from "../components/ProductCard";
import type { Banner } from "@/types/banner";

export interface GridItem {
  type: "product" | "banner";
  data: ProductCardProps | Banner;
  key: string;
}

/**
 * Inserta banners en el array de productos
 * - Primer banner al inicio (antes del primer producto)
 * - Luego cada N productos (después del producto N, 2N, 3N, etc.)
 * @param products - Array de productos
 * @param banner - Configuración del banner a insertar
 * @param interval - Intervalo de productos entre banners (default: 15)
 * @returns Array mezclado de productos y banners
 */
export function insertBannersInGrid(
  products: ProductCardProps[],
  banner: Banner | null,
  interval: number = 15
): GridItem[] {
  // Si no hay banner, retornar solo productos
  if (!banner) {
    return products.map((product, index) => ({
      type: "product" as const,
      data: product,
      key: `product-${index}`,
    }));
  }

  const result: GridItem[] = [];
  let bannerCount = 0;

  // Insertar primer banner al inicio
  result.push({
    type: "banner" as const,
    data: banner,
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
        data: banner,
        key: `banner-${bannerCount}`,
      });
      bannerCount++;
    }
  }

  return result;
}
