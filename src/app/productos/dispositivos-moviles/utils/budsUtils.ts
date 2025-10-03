/** 
 * Funciones utilitarias para la sección de Galaxy Buds
 */

import type { FilterState } from "../../components/FilterSidebar";
import type { ApiFilters } from "@/lib/sharedInterfaces";

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

  // Filtro de color usando query param color
  if (filters.color && filters.color.length > 0) {
    // Para color, usar OR (unión) - múltiples colores separados por coma
    const selectedColors = filters.color;
    apiFilters.color = selectedColors.join(',');
  }

  // Filtro de rango de precios usando precioMin y precioMax
  if (filters.rangoPrecio && filters.rangoPrecio.length > 0) {
    const selectedPriceRanges = filters.rangoPrecio;
    
    // Procesar cada rango de precio seleccionado
    let minPrice: number | undefined;
    let maxPrice: number | undefined;
    
    selectedPriceRanges.forEach(range => {
      // Para "Menos de $200.000" usar solo maxPrice
      if (range === "Menos de $200.000") {
        maxPrice = 200000;
      }
      // Para "Más de $600.000" usar solo minPrice
      else if (range === "Más de $600.000") {
        minPrice = 600000;
      }
      // Para rangos intermedios, usar ambos valores
      else if (range === "$200.000 - $400.000") {
        minPrice = minPrice ? Math.min(minPrice, 200000) : 200000;
        maxPrice = maxPrice ? Math.max(maxPrice, 400000) : 400000;
      }
      else if (range === "$400.000 - $600.000") {
        minPrice = minPrice ? Math.min(minPrice, 400000) : 400000;
        maxPrice = maxPrice ? Math.max(maxPrice, 600000) : 600000;
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
