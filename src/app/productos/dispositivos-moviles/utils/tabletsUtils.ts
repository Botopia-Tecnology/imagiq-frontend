/** 
 * Funciones utilitarias para la sección de tablets
 */

import type { FilterState } from "../../components/FilterSidebar";
import type { ApiFilters } from "./sharedInterfaces";

/**
 * Convierte filtros de tablets a filtros de API
 */
export function getApiFilters(filters: FilterState): ApiFilters {
  const apiFilters: ApiFilters = {
    subcategory: "Tablets",
  };

  // Aplicar filtros específicos si existen
  if (filters.almacenamiento && filters.almacenamiento.length > 0) {
    // Mapear almacenamiento a capacidad
    const capacityMap: Record<string, string> = {
      "32GB": "32",
      "64GB": "64",
      "128GB": "128", 
      "256GB": "256",
      "512GB": "512"
    };
    
    const capacities = filters.almacenamiento.map(size => capacityMap[size]).filter(Boolean);
    if (capacities.length > 0) {
      apiFilters.capacity = capacities.join(',');
    }
  }

  if (filters.serie && filters.serie.length > 0) {
    // Buscar por serie en el nombre del producto
    apiFilters.descriptionKeyword = filters.serie.join(',');
  }

  if (filters.caracteristicas && filters.caracteristicas.length > 0) {
    // Buscar características en la descripción
    const existingKeywords = apiFilters.descriptionKeyword || '';
    const newKeywords = filters.caracteristicas.join(',');
    apiFilters.descriptionKeyword = existingKeywords 
      ? `${existingKeywords},${newKeywords}` 
      : newKeywords;
  }

  if (filters.uso && filters.uso.length > 0) {
    // Buscar uso en la descripción
    const existingKeywords = apiFilters.descriptionKeyword || '';
    const newKeywords = filters.uso.join(',');
    apiFilters.descriptionKeyword = existingKeywords 
      ? `${existingKeywords},${newKeywords}` 
      : newKeywords;
  }

  return apiFilters;
}
