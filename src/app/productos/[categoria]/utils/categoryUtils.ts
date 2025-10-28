/**
 * Utilidades centralizadas para manejo de categorías de productos
 * Basado en el patrón utilizado en dispositivos-moviles
 */

import type { FilterState } from "../../components/FilterSidebar";
import type { CategoriaParams } from "../types";

// Usando interfaces centralizadas desde sharedInterfaces.ts
import type { CategoryApiFilters } from "@/lib/sharedInterfaces";

// Alias local para mantener compatibilidad
export type ApiFilters = CategoryApiFilters;

// Importar la nueva fuente de verdad
import { CATEGORY_MAPPING, getSubcategoryForSection } from "../config/category-mappings";
import type { CategoryMapping } from "../config/category-mappings";

// CATEGORY_MAPPING_LEGACY se eliminó - usar CATEGORY_MAPPING desde ../config/category-mappings.ts

/**
 * Obtiene los filtros base para una categoría específica
 * NOTA: Ya NO usamos subcategory, ahora usamos menuUuid y submenuUuid
 */
export function getCategoryBaseFilters(
  categoria: CategoriaParams,
  _seccion?: string // Parámetro mantenido por compatibilidad pero ya no se usa
): ApiFilters {
  const categoryConfig = CATEGORY_MAPPING[categoria];

  if (!categoryConfig) {
    throw new Error(`Categoría ${categoria} no encontrada`);
  }

  const baseFilters: ApiFilters = {};

  // Ya NO agregamos subcategory - usamos menuUuid y submenuUuid en su lugar
  // Los filtros específicos se manejan ahora a través de la jerarquía de categoría/menú/submenú

  return baseFilters;
}

/**
 * Convierte filtros del frontend a filtros de API
 * Función centralizada que puede ser extendida según las necesidades de cada categoría
 */
export function convertFiltersToApi(
  categoria: CategoriaParams,
  filters: FilterState,
  seccion?: string,
  submenuUuid?: string
): ApiFilters {
  const baseFilters = getCategoryBaseFilters(categoria, seccion);
  let apiFilters: ApiFilters = { ...baseFilters };

  // Aplicar filtros comunes
  if (filters.rangoPrecio && filters.rangoPrecio.length > 0) {
    const { minPrice, maxPrice } = processPriceRanges(filters.rangoPrecio);
    if (minPrice) apiFilters.precioMin = minPrice;
    if (maxPrice) apiFilters.precioMax = maxPrice;
  }

  if (filters.color && filters.color.length > 0) {
    apiFilters.color = filters.color.join(",");
  }

  // Filtros específicos por categoría
  // Si hay submenuUuid (selección del carousel), no aplicar filtros de serie
  // para evitar conflictos entre carousel y panel de filtros
  switch (categoria) {
    case "electrodomesticos":
      apiFilters = applyElectrodomesticoFilters(apiFilters, filters);
      break;
    case "dispositivos-moviles":
      apiFilters = applyMovilesFilters(apiFilters, filters, submenuUuid);
      break;
    case "televisores":
    case "monitores":
    case "audio":
      apiFilters = applyTvsFilters(apiFilters, filters);
      break;
  }

  return apiFilters;
}

/**
 * Procesa rangos de precio seleccionados
 */
function processPriceRanges(ranges: string[]): {
  minPrice?: number;
  maxPrice?: number;
} {
  let minPrice: number | undefined;
  let maxPrice: number | undefined;

  const priceRangeMap: Record<string, { min?: number; max?: number }> = {
    "Menos de $500.000": { max: 500000 },
    "$500.000 - $1.000.000": { min: 500000, max: 1000000 },
    "$1.000.000 - $2.000.000": { min: 1000000, max: 2000000 },
    "Más de $2.000.000": { min: 2000000 },
  };

  ranges.forEach((range) => {
    const rangeConfig = priceRangeMap[range];
    if (rangeConfig) {
      if (rangeConfig.min) {
        minPrice = minPrice
          ? Math.min(minPrice, rangeConfig.min)
          : rangeConfig.min;
      }
      if (rangeConfig.max) {
        maxPrice = maxPrice
          ? Math.min(maxPrice, rangeConfig.max)
          : rangeConfig.max;
      }
    }
  });

  return { minPrice, maxPrice };
}

/**
 * Aplica filtros específicos para electrodomésticos
 */
function applyElectrodomesticoFilters(
  apiFilters: ApiFilters,
  filters: FilterState
): ApiFilters {
  const result = { ...apiFilters };

  // Capacidad para refrigeradores, lavadoras, etc.
  if (filters.capacidad && filters.capacidad.length > 0) {
    result.capacity = filters.capacidad.join(",");
  }

  // Eficiencia energética
  if (filters.eficienciaEnergetica && filters.eficienciaEnergetica.length > 0) {
    const existing = result.descriptionKeyword || "";
    const newKeywords = filters.eficienciaEnergetica.join(",");
    result.descriptionKeyword = existing
      ? `${existing},${newKeywords}`
      : newKeywords;
  }

  // Tecnología
  if (filters.tecnologia && filters.tecnologia.length > 0) {
    const existing = result.descriptionKeyword || "";
    const newKeywords = filters.tecnologia.join(",");
    result.descriptionKeyword = existing
      ? `${existing},${newKeywords}`
      : newKeywords;
  }

  return result;
}

/**
 * Aplica filtros específicos para dispositivos móviles
 */
function applyMovilesFilters(
  apiFilters: ApiFilters,
  filters: FilterState,
  submenuUuid?: string
): ApiFilters {
  const result = { ...apiFilters };

  // Almacenamiento
  if (filters.almacenamiento && filters.almacenamiento.length > 0) {
    result.capacity = filters.almacenamiento.join(",");
  }

  // RAM
  if (filters.ram && filters.ram.length > 0) {
    const ramKeywords = filters.ram.map((ram) => ` ${ram} `);
    const existing = result.descriptionKeyword || "";
    result.descriptionKeyword = existing
      ? `${existing}&${ramKeywords.join(",")}`
      : ramKeywords.join(",");
  }

  // Serie (Galaxy S, Galaxy A, etc.)
  // Solo aplicar filtros de serie si NO hay submenuUuid (evitar conflicto con carousel)
  if (filters.serie && filters.serie.length > 0 && !submenuUuid) {
    const serieVariants = filters.serie.map((serie) => {
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
    result.name = serieVariants.join(",");
  }

  // Filtros específicos para accesorios
  if (filters.tipoAccesorio && filters.tipoAccesorio.length > 0) {
    const tipoAccesorioKeywords = filters.tipoAccesorio.map((tipo) => {
      switch (tipo) {
        case "Cargadores":
          return "charger,cargador,carga,power,adaptador";
        case "Cables":
          return "cable,usb,c-type,lightning,conector";
        case "Fundas":
          return "case,funda,cover,protector,silicone";
        case "Protectores de pantalla":
          return "protector,screen,pantalla,vidrio,tempered,glass";
        case "Correas":
          return "strap,correa,band,banda,pulsera,bracelet";
        case "Soportes":
          return "soporte,stand,holder";
        case "PowerBank":
          return "powerbank,bateria,portatil";
        default:
          return tipo;
      }
    });

    const existing = result.descriptionKeyword || "";
    const newKeywords = tipoAccesorioKeywords.join(",");
    result.descriptionKeyword = existing
      ? `${existing},${newKeywords}`
      : newKeywords;
  }

  if (filters.compatibilidad && filters.compatibilidad.length > 0) {
    const existing = result.descriptionKeyword || "";
    const newKeywords = filters.compatibilidad.join(",");
    result.descriptionKeyword = existing
      ? `${existing},${newKeywords}`
      : newKeywords;
  }

  if (filters.material && filters.material.length > 0) {
    const existing = result.descriptionKeyword || "";
    const newKeywords = filters.material.join(",");
    result.descriptionKeyword = existing
      ? `${existing},${newKeywords}`
      : newKeywords;
  }

  if (filters.marca && filters.marca.length > 0) {
    const existing = result.name || "";
    const newKeywords = filters.marca.join(",");
    result.name = existing ? `${existing},${newKeywords}` : newKeywords;
  }

  if (filters.tipoConector && filters.tipoConector.length > 0) {
    const existing = result.descriptionKeyword || "";
    const newKeywords = filters.tipoConector.join(",");
    result.descriptionKeyword = existing
      ? `${existing},${newKeywords}`
      : newKeywords;
  }

  return result;
}

/**
 * Aplica filtros específicos para TVs
 */
function applyTvsFilters(
  apiFilters: ApiFilters,
  filters: FilterState
): ApiFilters {
  const result = { ...apiFilters };

  // Tamaño de pantalla
  if (filters.tamanoPantalla && filters.tamanoPantalla.length > 0) {
    const existing = result.descriptionKeyword || "";
    const sizeKeywords = filters.tamanoPantalla.map((size) => `${size}"`);
    result.descriptionKeyword = existing
      ? `${existing},${sizeKeywords.join(",")}`
      : sizeKeywords.join(",");
  }

  // Resolución
  if (filters.resolucion && filters.resolucion.length > 0) {
    const existing = result.descriptionKeyword || "";
    const newKeywords = filters.resolucion.join(",");
    result.descriptionKeyword = existing
      ? `${existing},${newKeywords}`
      : newKeywords;
  }

  // Smart TV features
  if (filters.smartFeatures && filters.smartFeatures.length > 0) {
    const existing = result.descriptionKeyword || "";
    const newKeywords = filters.smartFeatures.join(",");
    result.descriptionKeyword = existing
      ? `${existing},${newKeywords}`
      : newKeywords;
  }

  return result;
}

/**
 * Valida si una categoría es soportada
 */
export function isValidCategory(
  categoria: string
): categoria is CategoriaParams {
  return categoria in CATEGORY_MAPPING;
}

/**
 * Obtiene las subcategorías disponibles para una categoría
 */
export function getAvailableSubcategories(
  categoria: CategoriaParams
): string[] {
  const categoryConfig = CATEGORY_MAPPING[categoria];
  return Object.keys(categoryConfig.sections);
}
