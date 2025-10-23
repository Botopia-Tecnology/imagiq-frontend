/**
 * PRODUCT CARD HELPERS - IMAGIQ ECOMMERCE
 *
 * Funciones auxiliares para el componente ProductCard:
 * - Limpieza de nombres de productos
 * - Cálculos de precios dinámicos
 * - Cálculos de ahorros
 * - Validación de SKU para carrito
 */

import type { ProductColor, ProductCapacity } from "../ProductCard";

/**
 * Limpia el nombre del producto eliminando patrones de conectividad y almacenamiento
 * 
 *  FUNCIÓN MANTENIDA PARA REFERENCIA - NO USAR EN TÍTULOS DE PRODUCTOS 
 * Los títulos ahora vienen directamente del atributo 'modelo' de la API sin procesar
 */
export const cleanProductName = (productName: string): string => {
  // Patrones para eliminar conectividad
  const connectivityPatterns = [
    /\s*5G\s*/gi,
    /\s*4G\s*/gi,
    /\s*LTE\s*/gi,
    /\s*Wi-Fi\s*/gi,
    /\s*Bluetooth\s*/gi,
  ];

  // Patrones para eliminar almacenamiento
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

  // Eliminar patrones de conectividad
  connectivityPatterns.forEach((pattern) => {
    cleanedName = cleanedName.replace(pattern, " ");
  });

  // Eliminar patrones de almacenamiento
  storagePatterns.forEach((pattern) => {
    cleanedName = cleanedName.replace(pattern, " ");
  });

  // Limpiar espacios múltiples y espacios al inicio/final
  cleanedName = cleanedName.replace(/\s+/g, " ").trim();

  return cleanedName;
};

/**
 * Interfaz para el resultado del cálculo de precios
 */
export interface PriceCalculation {
  currentPrice?: string;
  currentOriginalPrice?: string;
  currentDiscount?: string;
}

/**
 * Calcula precios dinámicos basados en capacidad seleccionada (prioridad) o color
 */
export const calculateDynamicPrices = (
  selectedCapacity: ProductCapacity | null,
  selectedColor: ProductColor | null,
  basePrice?: string,
  baseOriginalPrice?: string,
  baseDiscount?: string
): PriceCalculation => {
  return {
    currentPrice: selectedCapacity?.price || selectedColor?.price || basePrice,
    currentOriginalPrice:
      selectedCapacity?.originalPrice ||
      selectedColor?.originalPrice ||
      baseOriginalPrice,
    currentDiscount:
      selectedCapacity?.discount || selectedColor?.discount || baseDiscount,
  };
};

/**
 * Interfaz para información de ahorros
 */
export interface SavingsInfo {
  hasSavings: boolean;
  savings: number;
}

/**
 * Calcula si hay ahorros y el monto
 */
export const calculateSavings = (
  currentPrice?: string,
  currentOriginalPrice?: string
): SavingsInfo => {
  if (!currentPrice || !currentOriginalPrice || currentPrice === currentOriginalPrice) {
    return { hasSavings: false, savings: 0 };
  }

  const priceNum = parseInt(currentPrice.replace(/[^\d]/g, ""));
  const originalPriceNum = parseInt(currentOriginalPrice.replace(/[^\d]/g, ""));
  const savings = originalPriceNum - priceNum;

  return {
    hasSavings: savings > 0,
    savings,
  };
};

/**
 * Valida que exista un SKU válido antes de agregar al carrito
 */
export const validateCartSku = (
  selectedColor: ProductColor | null,
  productId: string,
  productName: string,
  colors: ProductColor[]
): boolean => {
  if (!selectedColor?.sku) {
    console.error("Error al agregar al carrito:", {
      product_id: productId,
      product_name: productName,
      selectedColor,
      available_colors: colors,
      error: "No se ha seleccionado un color válido con SKU",
    });
    alert("Por favor selecciona un color antes de agregar al carrito");
    return false;
  }
  return true;
};
