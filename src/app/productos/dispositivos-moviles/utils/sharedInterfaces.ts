/**
 *
 * Interfaces compartidas para todas las secciones de dispositivos móviles
 */

import type { FilterState } from "../../components/FilterSidebar";

// Interface común para filtros de API
export interface ApiFilters {
  category?: string;
  subcategory?: string;
  name?: string;
  priceRange?: { min: number; max: number };
  color?: string;
  capacity?: string;
  withDiscount?: boolean;
  minStock?: number;
  descriptionKeyword?: string;
}

// Interface común para funciones de filtros
export interface FilterUtils {
  getApiFilters: (filters: FilterState) => ApiFilters;
}
