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
      errorMessage: "Para aplicar el beneficio Estreno y Entrego solo puedes tener un producto en el carrito. Quita este beneficio para continuar o remueve los productos adicionales y deja un único producto.",
    };
  }

  // Validación 2: Buscar productos que tienen indRetoma === 0 (no aplican para el beneficio)
  // IMPORTANTE: 
  // - indRetoma === 0 significa NO aplica
  // - indRetoma === 1 significa SÍ aplica
  // - indRetoma === undefined significa que aún no se ha verificado, NO tratarlo como "no aplica"
  const productsWithoutRetoma = products.filter(
    (product) => product.indRetoma === 0
  );

  // Si hay productos con indRetoma === 0 (no aplican) y había un trade-in activo, 
  // significa que el producto cambió de 1 (aplicaba) a 0 (no aplica)
  // IMPORTANTE: Solo mostrar el mensaje "Te removimos" si había un trade-in activo en localStorage
  if (productsWithoutRetoma.length > 0 && hasActiveTradeIn) {
    return {
      isValid: false,
      productsWithoutRetoma,
      hasMultipleProducts: false,
      errorMessage: "Te removimos el cupón de entrego y estreno. El producto seleccionado ya no aplica para este beneficio.",
    };
  }

  // Si hay productos sin retoma pero NO había trade-in activo, no mostrar el mensaje de "Te removimos"
  // Solo retornar que no es válido sin el mensaje personalizado
  if (productsWithoutRetoma.length > 0) {
    return {
      isValid: false,
      productsWithoutRetoma,
      hasMultipleProducts: false,
    };
  }

  // IMPORTANTE: Si el producto tiene indRetoma === undefined, no validar aún (aún no se ha verificado)
  // Solo validar cuando indRetoma está definido (0 o 1)
  const productsWithUndefined = products.filter(
    (product) => product.indRetoma === undefined
  );
  
  // Si hay productos con indRetoma undefined y hay un trade-in activo, mantener el trade-in
  // hasta que se verifique el indRetoma
  if (productsWithUndefined.length > 0 && hasActiveTradeIn) {
    // Mantener el trade-in activo hasta que se verifique indRetoma
    return {
      isValid: true,
      productsWithoutRetoma: [],
      hasMultipleProducts: false,
    };
  }

  return {
    isValid: true,
    productsWithoutRetoma: [],
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
  // Si hay un mensaje de error personalizado (múltiples productos o cuando cambió de 1 a 0), usarlo
  if (validationResult.errorMessage) {
    return validationResult.errorMessage;
  }

  const { productsWithoutRetoma } = validationResult;

  if (productsWithoutRetoma.length === 0) {
    return "";
  }

  if (productsWithoutRetoma.length === 1) {
    return `El producto "${productsWithoutRetoma[0].name}" ya no aplica para el beneficio Estreno y Entrego. Quita este beneficio para continuar o remueve el producto y deja un único producto que sí aplique.`;
  }

  const productNames = productsWithoutRetoma
    .map((p) => `"${p.name}"`)
    .join(", ");
  return `Los siguientes productos ya no aplican para el beneficio Estreno y Entrego: ${productNames}. Quita este beneficio para continuar o remueve estos productos y deja un único producto que sí aplique.`;
}

