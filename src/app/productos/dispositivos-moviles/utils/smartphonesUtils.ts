/** 
 * Funciones utilitarias para la sección de smartphones
 */

import type { FilterState } from "../../components/FilterSidebar";
import type { ApiFilters } from "@/lib/sharedInterfaces";

/**
 * Convierte filtros de smartphones a filtros de API
 */
export function getApiFilters(filters: FilterState): ApiFilters {
  const apiFilters: ApiFilters = {
    subcategory: "Celulares",
  };

  // Aplicar filtros específicos si existen
  if (filters.almacenamiento && filters.almacenamiento.length > 0) {
    // Usar directamente los valores de almacenamiento con GB/TB
    apiFilters.capacity = filters.almacenamiento.join(',');
  }

  if (filters.serie && filters.serie.length > 0) {
    // Buscar por serie en el nombre del producto usando variantes de nombres
    const serieVariants = filters.serie.map(serie => {
      switch (serie) {
        case "Galaxy A":
          return "Galaxy A,Galaxy-A,+A+";
        case "Galaxy Z":
          return "Galaxy Z, Galaxy-Z,+Z+";
        case "Galaxy S":
          return "Galaxy S,Galaxy-S,+S+";
        case "Galaxy Note":
          return "Galaxy Note,Galaxy-Note,+Note+";
        default:
          return serie;
      }
    });
    apiFilters.name = serieVariants.join(',');
  }

  if (filters.caracteristicas && filters.caracteristicas.length > 0) {
    // Buscar características en la descripción
    const existingKeywords = apiFilters.descriptionKeyword || '';
    const newKeywords = filters.caracteristicas.join(',');
    apiFilters.descriptionKeyword = existingKeywords 
      ? `${existingKeywords},${newKeywords}` 
      : newKeywords;
  }

  // Filtro de RAM usando desDetallada con espacios alrededor
  if (filters.ram && filters.ram.length > 0) {
    // Para RAM, buscar en desDetallada con espacios alrededor del texto
    const selectedRAM = filters.ram;
    const ramKeywords = selectedRAM.map(ram => ` ${ram} `);
    
    // Si ya hay un descriptionKeyword, combinarlo con AND
    if (apiFilters.descriptionKeyword) {
      apiFilters.descriptionKeyword += `&${ramKeywords.join(',')}`;
    } else {
      apiFilters.descriptionKeyword = ramKeywords.join(',');
    }
  }

  // Filtro de color usando query param color
  if (filters.color && filters.color.length > 0) {
    // Para color, usar OR (unión) - múltiples colores separados por coma
    const selectedColors = filters.color;
    apiFilters.color = selectedColors.join(',');
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
