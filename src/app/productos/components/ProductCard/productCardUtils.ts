/**
 * Utilidades y helpers para ProductCard
 * - Limpieza de nombres de productos
 * - Cálculos de precios
 * - Tracking de eventos
 */

import { posthogUtils } from "@/lib/posthogClient";
import type { ProductColor, ProductCapacity } from "../ProductCard";

/**
 * Limpia el nombre del producto eliminando conectividad y almacenamiento
 */
export function cleanProductName(productName: string): string {
  const connectivityPatterns = [
    /\s*5G\s*/gi,
    /\s*4G\s*/gi,
    /\s*LTE\s*/gi,
    /\s*Wi-Fi\s*/gi,
    /\s*Bluetooth\s*/gi,
  ];

  const storagePatterns = [
    /\s*64GB\s*/gi,
    /\s*32GB\s*/gi,
    /\s*128GB\s*/gi,
    /\s*256GB\s*/gi,
    /\s*512GB\s*/gi,
    /\s*1TB\s*/gi,
    /\s*2TB\s*/gi,
    /\s*16GB\s*/gi,
    /\s*8GB\s*/gi,
  ];

  let cleanedName = productName;

  connectivityPatterns.forEach((pattern) => {
    cleanedName = cleanedName.replace(pattern, " ");
  });

  storagePatterns.forEach((pattern) => {
    cleanedName = cleanedName.replace(pattern, " ");
  });

  return cleanedName.replace(/\s+/g, " ").trim();
}

/**
 * Calcula el precio mensual
 */
export function calculateMonthlyPrice(
  currentPrice: string | undefined,
  installments: number
): string | null {
  if (!currentPrice) return null;

  const priceNumber = parseInt(currentPrice.replace(/[^\d]/g, ""));
  return (priceNumber / installments).toLocaleString("es-CO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Calcula el ahorro entre dos precios
 */
export function calculateSavings(
  originalPrice: string | undefined,
  currentPrice: string | undefined
): number {
  if (!originalPrice || !currentPrice || originalPrice === currentPrice) {
    return 0;
  }

  const original = parseInt(originalPrice.replace(/[^\d]/g, ""));
  const current = parseInt(currentPrice.replace(/[^\d]/g, ""));

  return original - current;
}

/**
 * Tracking de selección de color
 */
export function trackColorSelection(
  productId: string,
  productName: string,
  color: ProductColor
) {
  posthogUtils.capture("product_color_selected", {
    product_id: productId,
    product_name: productName,
    color_name: color.name,
    color_label: color.label,
    color_sku: color.sku,
  });
}

/**
 * Tracking de selección de capacidad
 */
export function trackCapacitySelection(
  productId: string,
  productName: string,
  capacity: ProductCapacity
) {
  posthogUtils.capture("product_capacity_selected", {
    product_id: productId,
    product_name: productName,
    capacity_value: capacity.value,
    capacity_sku: capacity.sku,
  });
}

/**
 * Tracking de agregar al carrito
 */
export function trackAddToCart(
  productId: string,
  productName: string,
  selectedColor: ProductColor | null,
  sku: string | null
) {
  posthogUtils.capture("add_to_cart_click", {
    product_id: productId,
    product_name: productName,
    selected_color: selectedColor?.name || "Sin color",
    selected_color_sku: selectedColor?.sku || sku || productId,
    source: "product_card",
  });
}

/**
 * Tracking de más información
 */
export function trackMoreInfo(productId: string, productName: string) {
  posthogUtils.capture("product_more_info_click", {
    product_id: productId,
    product_name: productName,
    source: "product_card",
    destination: "multimedia_page",
  });
}
