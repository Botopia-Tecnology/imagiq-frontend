/**
 * Constantes relacionadas con checkout y facturación
 */

/** Tasa de impuesto (IVA) */
export const TAX_RATE = 0.09;

/** Costo de envío actual (gratis) */
export const SHIPPING_COST = 0;

/** Costo de envío original antes de promoción */
export const ORIGINAL_SHIPPING_COST = 20000;

/** Opciones de ítems por página en listados */
export const ITEMS_PER_PAGE_OPTIONS = [10, 15, 20, 25, 50] as const;
