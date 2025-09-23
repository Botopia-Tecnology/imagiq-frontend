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

  if (filters.tamaño && filters.tamaño.length > 0) {
    // Buscar tamaño en la descripción detallada
    const existingKeywords = apiFilters.descriptionKeyword || '';
    const sizeKeywords = filters.tamaño.map(size => ` ${size} `).join(',');
    apiFilters.descriptionKeyword = existingKeywords 
      ? `${existingKeywords},${sizeKeywords}` 
      : sizeKeywords;
  }

  // Filtro de rango de precios usando query params precioMin y precioMax
  if (filters.rangoPrecio && filters.rangoPrecio.length > 0) {
    const selectedPriceRanges = filters.rangoPrecio;
    
    // Procesar cada rango de precio seleccionado
    let minPrice: number | undefined;
    let maxPrice: number | undefined;
    
    selectedPriceRanges.forEach(range => {
      // Para "Menos de $500.000" usar solo maxPrice
      if (range === "Menos de $500.000") {
        maxPrice = 500000;
      }
      // Para "Más de $2.000.000" usar solo minPrice
      else if (range === "Más de $2.000.000") {
        minPrice = 2000000;
      }
      // Para rangos intermedios, usar ambos valores
      else if (range === "$500.000 - $1.000.000") {
        minPrice = minPrice ? Math.min(minPrice, 500000) : 500000;
        maxPrice = maxPrice ? Math.max(maxPrice, 1000000) : 1000000;
      }
      else if (range === "$1.000.000 - $2.000.000") {
        minPrice = minPrice ? Math.min(minPrice, 1000000) : 1000000;
        maxPrice = maxPrice ? Math.max(maxPrice, 2000000) : 2000000;
      }
    });
    
    // Aplicar los valores de precio a los filtros de API
    if (minPrice !== undefined) {
      apiFilters.precioMin = minPrice;
    }
    if (maxPrice !== undefined) {
      apiFilters.precioMax = maxPrice;
    }
  }

  return apiFilters;
}
