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
 * basándose en su categoría o subcategoría
 *
 * @param categoria - Categoría del producto (puede venir de apiProduct.categoria)
 * @param subcategoria - Subcategoría del producto (opcional)
 * @returns true si debe mostrar selector de color, false en caso contrario
 *
 * @example
 * ```ts
 * shouldShowColorSelector('Dispositivos móviles'); // true
 * shouldShowColorSelector('Televisores', 'Accesorios'); // true
 * shouldShowColorSelector('Electrodomésticos'); // false
 * ```
 */
export function shouldShowColorSelector(
  categoria?: string | null,
  subcategoria?: string | null
): boolean {
  // Si no hay categoría ni subcategoría, MOSTRAR selector por defecto
  // Esto mantiene compatibilidad con productos legacy y dispositivos móviles
  if (!categoria && !subcategoria) {
    console.log('[shouldShowColorSelector] Sin categoría/subcategoría -> Mostrar selector (true)');
    return true;
  }

  // Normalizar para comparación
  const normalizedCategoria = categoria ? normalizeString(categoria) : '';
  const normalizedSubcategoria = subcategoria ? normalizeString(subcategoria) : '';

  console.log('[shouldShowColorSelector] Debug:', {
    categoriaOriginal: categoria,
    subcategoriaOriginal: subcategoria,
    categorianormalizada: normalizedCategoria,
    subcategorianormalizada: normalizedSubcategoria,
  });

  // Verificar si la categoría está en la lista permitida
  const categoryMatch = CATEGORIES_WITH_COLOR_SELECTOR.some(cat => {
    const normalized = normalizeString(cat);
    const match = normalized === normalizedCategoria;
    console.log(`  Comparando "${normalized}" === "${normalizedCategoria}": ${match}`);
    return match;
  });

  if (categoryMatch) {
    console.log('[shouldShowColorSelector] Categoría coincide -> Mostrar selector (true)');
    return true;
  }

  // Verificar si la subcategoría está en la lista permitida
  const subcategoryMatch = SUBCATEGORIES_WITH_COLOR_SELECTOR.some(subcat => {
    const normalized = normalizeString(subcat);
    const match = normalized === normalizedSubcategoria;
    console.log(`  Comparando subcategoría "${normalized}" === "${normalizedSubcategoria}": ${match}`);
    return match;
  });

  console.log(`[shouldShowColorSelector] Resultado final: ${subcategoryMatch}`);
  return subcategoryMatch;
}

/**
 * Determina si un producto debe mostrar selector de capacidad
 * Por ahora, sigue la misma lógica que el selector de color
 * pero se mantiene como función separada para futura customización
 *
 * @param categoria - Categoría del producto
 * @param subcategoria - Subcategoría del producto (opcional)
 * @returns true si debe mostrar selector de capacidad
 */
export function shouldShowCapacitySelector(
  categoria?: string | null,
  subcategoria?: string | null
): boolean {
  // Por ahora, misma lógica que color selector
  // Puede ser customizada en el futuro si necesitan lógica diferente
  return shouldShowColorSelector(categoria, subcategoria);
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
