/**
 * 🔧 ACCESORIOS UTILITIES
 *
 * Funciones utilitarias para la sección de accesorios
 */

import type { FilterState } from "../../components/FilterSidebar";
import { keywordMap } from "../constants/accesoriosConstants";

// Interfaces de tipos necesarias
export interface ApiFilters {
  category?: string;
  subcategory?: string;
  priceRange?: { min: number; max: number };
  color?: string;
  capacity?: string;
  name?: string;
  withDiscount?: boolean;
  minStock?: number;
  descriptionKeyword?: string;
}

/**
 * Convierte filtros de tipo de accesorio a filtros de API
 */
export function getApiFilters(filters: FilterState): ApiFilters {
  const apiFilters: ApiFilters = {
    subcategory: "Accesorios",
  };

  // Si hay filtros de tipo de accesorio seleccionados, buscar por descripción
  if (filters.tipoAccesorio && filters.tipoAccesorio.length > 0) {
    // Usar el primer filtro seleccionado para buscar
    const selectedType = filters.tipoAccesorio[0];
    const keywords = keywordMap[selectedType];
    if (keywords && keywords.length > 0) {
      // Usar la primera palabra clave como filtro principal
      apiFilters.descriptionKeyword = keywords[0];
      console.log(
        `🔍 Buscando accesorios tipo "${selectedType}" con palabra clave: "${keywords[0]}"`
      );
      console.log(`📋 Palabras clave disponibles: ${keywords.join(", ")}`);
      console.log(`🔧 Filtros API generados:`, apiFilters);
    }
  }

  return apiFilters;
}
