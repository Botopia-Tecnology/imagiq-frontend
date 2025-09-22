/** 
 * Funciones utilitarias para la sección de Galaxy Buds
 */

import type { FilterState } from "../../components/FilterSidebar";
import type { ApiFilters } from "./sharedInterfaces";

/**
 * Convierte filtros de Galaxy Buds a filtros de API
 */
export function getApiFilters(filters: FilterState): ApiFilters {
  const apiFilters: ApiFilters = {
    name: "buds", // Filtrar productos que contengan "buds" en el nombre
  };

  // Aplicar filtros específicos si existen
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

  if (filters.tipoAjuste && filters.tipoAjuste.length > 0) {
    // Buscar tipo de ajuste en la descripción
    const existingKeywords = apiFilters.descriptionKeyword || '';
    const newKeywords = filters.tipoAjuste.join(',');
    apiFilters.descriptionKeyword = existingKeywords 
      ? `${existingKeywords},${newKeywords}` 
      : newKeywords;
  }

  if (filters.cancelacionRuido && filters.cancelacionRuido.length > 0) {
    // Buscar cancelación de ruido en la descripción
    const existingKeywords = apiFilters.descriptionKeyword || '';
    const newKeywords = filters.cancelacionRuido.join(',');
    apiFilters.descriptionKeyword = existingKeywords 
      ? `${existingKeywords},${newKeywords}` 
      : newKeywords;
  }

  return apiFilters;
}
