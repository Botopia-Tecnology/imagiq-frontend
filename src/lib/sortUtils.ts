/**
 * Utilidades para manejo de ordenamiento de productos
 */

import type { 
  SortParams, 
  SortOptions, 
  BaseApiFilters 
} from "./sharedInterfaces";

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
export function applySortToFilters<T extends BaseApiFilters>(
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
