/**
 * Utilidades para manejo de ordenamiento de productos
 */

export interface SortParams {
  sortBy?: string;
  sortOrder?: string;
}

export interface SortOptions {
  value: string;
  label: string;
}

/**
 * Interfaz base para filtros que pueden incluir parámetros de ordenamiento
 */
export interface BaseFilterParams {
  page?: number;
  limit?: number;
  categoria?: string;
  subcategoria?: string;
  precioMin?: number;
  precioMax?: number;
  color?: string;
  capacidad?: string;
  nombre?: string;
  desDetallada?: string;
  modelo?: string;
  codigoMarket?: string;
  conDescuento?: boolean;
  stockMinimo?: number;
  filterMode?: "AND" | "OR";
}

/**
 * Interfaz para filtros del frontend que extiende BaseFilterParams
 */
export interface FrontendFilterParams extends BaseFilterParams {
  sortBy?: string;
  sortOrder?: string;
  // Campos específicos del frontend con mapeo a API
  category?: string;     // maps to categoria
  subcategory?: string; // maps to subcategoria  
  capacity?: string;    // maps to capacidad
  name?: string;        // maps to nombre
  withDiscount?: boolean; // maps to conDescuento
  minStock?: number;    // maps to stockMinimo
  descriptionKeyword?: string; // maps to desDetallada
  model?: string;       // maps to modelo
}

/**
 * Convierte el valor del dropdown de ordenamiento a parámetros de API
 */
export function getSortParams(sortValue: string): SortParams {
  switch (sortValue) {
    case "nombre":
      return {
        sortBy: "nombre",
        sortOrder: "asc",
      };
    case "precio-menor":
      return {
        sortBy: "precio",
        sortOrder: "asc",
      };
    case "precio-mayor":
      return {
        sortBy: "precio",
        sortOrder: "desc",
      };
    default:
      // Para "Sin ordenar" (valor vacío) u otros valores no reconocidos
      return {};
  }
}

/**
 * Combina los filtros base con los parámetros de ordenamiento
 */
export function applySortToFilters<T extends BaseFilterParams>(
  baseFilters: T, 
  sortValue: string
): T & SortParams {
  const sortParams = getSortParams(sortValue);
  const result: T & SortParams = {
    ...baseFilters,
    ...sortParams,
  };
  
  return result;
}

/**
 * Opciones por defecto del dropdown de ordenamiento
 */
export const DEFAULT_SORT_OPTIONS: SortOptions[] = [
  { value: "", label: "Sin ordenar" },
  { value: "precio-menor", label: "Precio: menor a mayor" },
  { value: "precio-mayor", label: "Precio: mayor a menor" },
  { value: "nombre", label: "Nombre A-Z" },
];
