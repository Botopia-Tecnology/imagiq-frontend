/** 
 * Funciones utilitarias para la sección de smartphones
 */

import type { FilterState } from "../../components/FilterSidebar";
import type { ApiFilters } from "./sharedInterfaces";

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
    console.log(`🧠 Buscando RAM "${selectedRAM.join(', ')}" con palabras clave: "${ramKeywords.join(',')}"`);
  }

  // Filtro de color usando query param color
  if (filters.color && filters.color.length > 0) {
    // Para color, usar OR (unión) - múltiples colores separados por coma
    const selectedColors = filters.color;
    apiFilters.color = selectedColors.join(',');
    console.log(`🎨 Filtrando smartphones por colores: "${selectedColors.join(', ')}"`);
  }

  return apiFilters;
}
