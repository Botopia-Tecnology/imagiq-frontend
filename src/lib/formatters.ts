/**
 * Utilidades de formateo centralizadas
 */

/**
 * Formatea un número como precio en pesos colombianos
 */
export const formatPrice = (price: number): string => {
  return price.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

/**
 * Formatea un número como porcentaje
 */
export const formatPercentage = (value: number): string => {
  return `${value}%`;
};

/**
 * Formatea un número con separadores de miles
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString("es-CO");
};
