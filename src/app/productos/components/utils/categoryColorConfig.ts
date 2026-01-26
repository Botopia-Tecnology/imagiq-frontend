/**
 * Configuración de categorías que deben mostrar selector de color
 *
 * Este módulo define qué categorías y subcategorías deben mostrar
 * selectores de color en las tarjetas de producto y páginas de detalle.
 */

/**
 * Categorías que deben mostrar selector de color
 * Incluye tanto nombres completos como códigos del backend (ej: "IM" = Informática/Dispositivos Móviles)
 */
const CATEGORIES_WITH_COLOR_SELECTOR = [
  'Dispositivos móviles',
  'Dispositivos Móviles',
  'dispositivos-moviles',
  'dispositivos moviles',
  'IM', // Código del backend para Dispositivos Móviles/Informática
  'im',
] as const;

/**
 * Subcategorías que deben mostrar selector de color
 */
const SUBCATEGORIES_WITH_COLOR_SELECTOR = [
  'Accesorios',
  'accesorios',
] as const;

/**
 * Normaliza un string para comparación
 * Elimina tildes, convierte a minúsculas y normaliza espacios
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar tildes
    .replace(/\s+/g, ' ') // Normalizar espacios
    .trim();
}

/**
 * Determina si un producto debe mostrar selector de color
 *
 * CAMBIO: Ahora retorna true siempre porque la visibilidad
 * se determina por la disponibilidad de datos válidos (hex + nombre),
 * no por la categoría del producto.
 *
 * La validación de datos se hace en:
 * - shouldRenderColor() en shouldRenderValue.ts
 * - El filtrado de colores en ProductCard.tsx
 *
 * @param categoria - Categoría del producto (ignorado)
 * @param subcategoria - Subcategoría del producto (ignorado)
 * @returns true siempre - la visibilidad depende de datos válidos
 */
export function shouldShowColorSelector(
  categoria?: string | null,
  subcategoria?: string | null
): boolean {
  // Siempre mostrar selector si hay colores válidos disponibles
  // La validación de datos (hex válido + nombre válido) se hace en el componente
  return true;
}

/**
 * Categorías que deben mostrar selector de capacidad (almacenamiento/pulgadas)
 * Incluye dispositivos móviles (GB), TVs (pulgadas) y electrodomésticos (capacidad)
 */
const CATEGORIES_WITH_CAPACITY_SELECTOR = [
  'Dispositivos móviles',
  'Dispositivos Móviles',
  'dispositivos-moviles',
  'dispositivos moviles',
  'IM', // Dispositivos Móviles
  'im',
  'Televisores',
  'televisores',
  'TV', // Televisores
  'tv',
  'AV', // TV y Audio
  'av',
  'Electrodomésticos',
  'Electrodomesticos',
  'electrodomesticos',
  'electrodomésticos',
  'EL', // Electrodomésticos
  'el',
  'DA', // Neveras/Electrodomésticos
  'da',
] as const;

/**
 * Determina si un producto debe mostrar selector de capacidad
 * Incluye:
 * - Dispositivos móviles: almacenamiento (128GB, 256GB, etc.)
 * - Televisores: pulgadas (43", 55", 65", etc.)
 * - Electrodomésticos: capacidad (según el producto)
 * - Neveras: capacidad en litros (809 LT, 810 LT, etc.)
 *
 * @param categoria - Categoría del producto
 * @param subcategoria - Subcategoría del producto (opcional)
 * @returns true si debe mostrar selector de capacidad
 */
export function shouldShowCapacitySelector(
  categoria?: string | null,
  subcategoria?: string | null
): boolean {
  // Si no hay categoría, MOSTRAR selector por defecto para compatibilidad
  if (!categoria && !subcategoria) {
    return true;
  }

  // Normalizar para comparación
  const normalizedCategoria = categoria ? normalizeString(categoria) : '';

  // Verificar si la categoría está en la lista permitida
  const categoryMatch = CATEGORIES_WITH_CAPACITY_SELECTOR.some(cat => {
    const normalized = normalizeString(cat);
    return normalized === normalizedCategoria;
  });

  return categoryMatch;
}

/**
 * Determina si un producto debe mostrar selector de memoria RAM
 * Solo dispositivos móviles (IM) deben mostrar selector de RAM
 *
 * @param categoria - Categoría del producto
 * @param subcategoria - Subcategoría del producto (opcional)
 * @returns true si debe mostrar selector de RAM
 */
export function shouldShowRamSelector(
  categoria?: string | null,
  subcategoria?: string | null
): boolean {
  // RAM solo para dispositivos móviles (IM)
  return shouldShowColorSelector(categoria, subcategoria);
}
