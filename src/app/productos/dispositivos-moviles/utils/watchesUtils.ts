/** 
 * Funciones utilitarias para la sección de relojes
 */

import type { FilterState } from "../../components/FilterSidebar";
import type { ApiFilters } from "./sharedInterfaces";

/**
 * Convierte filtros de relojes a filtros de API
 */
export function getApiFilters(filters: FilterState): ApiFilters {
  const apiFilters: ApiFilters = {
    subcategory: "Wearables",
  };

  // Aplicar filtros específicos si existen
  if (filters.serie && filters.serie.length > 0) {
    // Buscar por serie con lógica específica para Galaxy Watch Classic
    const selectedSeries = filters.serie;
    const seriesKeywords: string[] = [];
    
    selectedSeries.forEach(series => {
      if (series === "Galaxy Watch Classic") {
        // Para Galaxy Watch Classic, buscar solo "Classic" en desDetallada
        seriesKeywords.push("Classic");
      } else {
        // Para otras series, usar el nombre completo
        seriesKeywords.push(series);
      }
    });
    
    apiFilters.descriptionKeyword = seriesKeywords.join(',');
  }

  if (filters.caracteristicas && filters.caracteristicas.length > 0) {
    // Buscar características en la descripción
    const existingKeywords = apiFilters.descriptionKeyword || '';
    const newKeywords = filters.caracteristicas.join(',');
    apiFilters.descriptionKeyword = existingKeywords 
      ? `${existingKeywords},${newKeywords}` 
      : newKeywords;
  }

  if (filters.material && filters.material.length > 0) {
    // Buscar material en la descripción
    const existingKeywords = apiFilters.descriptionKeyword || '';
    const newKeywords = filters.material.join(',');
    apiFilters.descriptionKeyword = existingKeywords 
      ? `${existingKeywords},${newKeywords}` 
      : newKeywords;
  }

  if (filters.color && filters.color.length > 0) {
    // Buscar color en la descripción
    const existingKeywords = apiFilters.descriptionKeyword || '';
    const newKeywords = filters.color.join(',');
    apiFilters.descriptionKeyword = existingKeywords 
      ? `${existingKeywords},${newKeywords}` 
      : newKeywords;
  }

  return apiFilters;
}
