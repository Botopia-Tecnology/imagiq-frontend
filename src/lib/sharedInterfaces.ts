/**
 * Interfaces compartidas centralizadas para filtros de productos
 * Consolidación de interfaces duplicadas del proyecto
 */

/**
 * Estados de filtros basado en UI del FilterSidebar
 */
export interface FilterState {
  [key: string]: string[];
}

/**
 * Parámetros base para filtros de API (formato castellano de API)
 */
export interface BaseApiFilters {
  categoria?: string;
  subcategoria?: string;
  menuUuid?: string;
  submenuUuid?: string;
  precioMin?: number;
  precioMax?: number;
  conDescuento?: boolean;
  stockMinimo?: number;
  color?: string;
  nombreColor?: string; // Nombre del color para filtrar
  capacidad?: string;
  memoriaram?: string; // Memoria RAM para filtrar (valores exactos como "4GB", "6GB", etc.)
  nombre?: string;
  desDetallada?: string;
  modelo?: string;
  codigoMarket?: string;
  filterMode?: "AND" | "OR";
  page?: number;
  limit?: number;
  lazyLimit?: number;
  lazyOffset?: number;
}

/**
 * Parámetros de API con capacidades de ordenamiento
 */
export interface ApiFiltersWithSort extends BaseApiFilters {
  sortBy?: string;
  sortOrder?: string;
}

/**
 * Parámetros de filtros del frontend (formato inglés/reducido)
 */
export interface FrontendApiFilters {
  category?: string;     // maps to categoria
  subcategory?: string;  // maps to subcategoria
  menuUuid?: string;    // maps to menuUuid
  submenuUuid?: string; // maps to submenuUuid
  precioMin?: number;
  precioMax?: number;
  color?: string;
  nombreColor?: string; // maps to nombreColor (nombre del color para filtrar)
  capacity?: string;     // maps to capacidad
  memoriaram?: string;   // maps to memoriaram (memoria RAM con valores exactos)
  name?: string;         // maps to nombre
  withDiscount?: boolean; // maps to conDescuento
  minStock?: number;    // maps to stockMinimo
  descriptionKeyword?: string; // maps to desDetallada
  model?: string;        // maps to modelo
  page?: number;
  limit?: number;
  lazyLimit?: number;
  lazyOffset?: number;
}

/**
 * Filtros del frontend con capacidades de ordenamiento
 */
export interface FrontendFiltersWithSort extends FrontendApiFilters {
  sortBy?: string;
  sortOrder?: string;
  filterMode?: "AND" | "OR";
}

/**
 * Parámetros para ordenamiento
 */
export interface SortParams {
  sortBy?: string;
  sortOrder?: string;
}

/**
 * Opciones de ordenamiento para dropdowns
 */
export interface SortOptions {
  value: string;
  label: string;
}

/**
 * Configuración de filtros para componentes específicos
 */
export interface FilterConfig {
  [key: string]: {
    label: string;
    type: "checkbox" | "radio" | "range";
    options?: Array<{ value: string; label: string }>;
  };
}

/**
 * Alias tipos para mantener compatibilidad hacia atrás
 */

// Para dispositivos móviles
export type ApiFilters = FrontendApiFilters;

// Para categorías
export type CategoryApiFilters = FrontendApiFilters;

// Para productos principales (equivalente a ProductFilterParams)
export type ProductFilterParams = ApiFiltersWithSort;

// Para frontend product filters 
export type FrontendFilterParams = FrontendFiltersWithSort;

/**
 * Utilities interface común
 */
export interface FilterUtils {
  getApiFilters: (filters: FilterState) => FrontendApiFilters;
}
