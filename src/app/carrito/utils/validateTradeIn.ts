import type { CartProduct } from "@/hooks/useCart";

/**
 * Valida si los productos en el carrito siguen aplicando para el beneficio de Estreno y Entrego
 * @param products - Lista de productos en el carrito
 * @returns Objeto con isValid (boolean), productsWithoutRetoma (array de productos que no aplican), y hasMultipleProducts (boolean)
 */
export function validateTradeInProducts(products: CartProduct[]): {
  isValid: boolean;
  productsWithoutRetoma: CartProduct[];
  hasMultipleProducts: boolean;
  errorMessage?: string;
} {
  // Verificar si hay un trade-in activo
  const hasActiveTradeIn = (() => {
    try {
      const storedTradeIn = localStorage.getItem("imagiq_trade_in");
      if (!storedTradeIn) return false;
      const parsed = JSON.parse(storedTradeIn);
      return parsed?.completed === true;
    } catch {
      return false;
    }
  })();

  // Si no hay trade-in activo, no hay nada que validar
  if (!hasActiveTradeIn) {
    return { isValid: true, productsWithoutRetoma: [], hasMultipleProducts: false };
  }

  // Validación 1: Solo puede haber un producto en el carrito cuando hay trade-in activo
  if (products.length > 1) {
    return {
      isValid: false,
      productsWithoutRetoma: [],
      hasMultipleProducts: true,
      errorMessage: "Para aplicar el beneficio Estreno y Entrego, solo puedes tener un producto en el carrito. Por favor, elimina los productos adicionales para continuar.",
    };
  }

  // Validación 2: Buscar productos que tienen indRetoma === 0 o undefined
  const productsWithoutRetoma = products.filter(
    (product) => product.indRetoma === 0 || product.indRetoma === undefined
  );

  return {
    isValid: productsWithoutRetoma.length === 0,
    productsWithoutRetoma,
    hasMultipleProducts: false,
  };
}

/**
 * Genera un mensaje de error cuando algún producto ya no aplica para el beneficio
 * @param validationResult - Resultado de la validación de Trade-In
 * @returns Mensaje de error formateado
 */
export function getTradeInValidationMessage(
  validationResult: {
    productsWithoutRetoma: CartProduct[];
    hasMultipleProducts: boolean;
    errorMessage?: string;
  }
): string {
  // Si hay un mensaje de error personalizado (múltiples productos), usarlo
  if (validationResult.errorMessage) {
    return validationResult.errorMessage;
  }

  const { productsWithoutRetoma } = validationResult;

  if (productsWithoutRetoma.length === 0) {
    return "";
  }

  if (productsWithoutRetoma.length === 1) {
    return `El producto "${productsWithoutRetoma[0].name}" ya no aplica para el beneficio Estreno y Entrego. Por favor, remuévelo del carrito para continuar.`;
  }

  const productNames = productsWithoutRetoma
    .map((p) => `"${p.name}"`)
    .join(", ");
  return `Los siguientes productos ya no aplican para el beneficio Estreno y Entrego: ${productNames}. Por favor, remuévelos del carrito para continuar.`;
}

