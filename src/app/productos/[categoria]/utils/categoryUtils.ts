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

// Los mapeos de categorías ahora son dinámicos desde la API
// Ya no se importa CATEGORY_MAPPING porque todo es dinámico

// Mapeo de slugs dinámicos a configuraciones de filtros estáticos
// Esto permite que filtros dinámicos (por API) funcionen con filtros estáticos
const FILTER_CONFIG_MAP: Record<string, string> = {
  'dispositivos-moviles': 'dispositivos-moviles',
  'electrodomesticos': 'electrodomesticos',
  'televisores': 'televisores',
  'tv-y-av': 'televisores', // Mapear slug dinámico a configuración estática
  'tv-y-audio': 'televisores', // Variación del slug
  'monitores': 'monitores',
  'audio': 'audio',
};

/**
 * Obtiene los filtros base para una categoría específica
 * NOTA: Ya NO usamos subcategory, ahora usamos menuUuid y submenuUuid
 * Ahora es dinámico - no necesita mapeos estáticos
 */
export function getCategoryBaseFilters(
  categoria: CategoriaParams,
  _seccion?: string // Parámetro mantenido por compatibilidad pero ya no se usa
): ApiFilters {
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

  // Normalizar el slug a la configuración de filtros conocida
  // Esto asegura que categorías como "tv-y-av" o "tv-y-audio" se mapeen correctamente a "televisores"
  const normalizedCategoria = FILTER_CONFIG_MAP[categoria] || categoria;

  // Aplicar filtros comunes
  if (filters.rangoPrecio && filters.rangoPrecio.length > 0) {
    const { minPrice, maxPrice } = processPriceRanges(filters.rangoPrecio);
    if (minPrice) apiFilters.precioMin = minPrice;
    if (maxPrice) apiFilters.precioMax = maxPrice;
  }

  if (filters.color && filters.color.length > 0) {
    apiFilters.nombreColor = filters.color.join(",");
  }

  // Filtros específicos por categoría
  // Si hay submenuUuid (selección del carousel), no aplicar filtros de serie
  // para evitar conflictos entre carousel y panel de filtros
  switch (normalizedCategoria) {
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
    // Rangos para dispositivos móviles
    "Menos de $500.000": { max: 500000 },
    "$500.000 - $1.000.000": { min: 500000, max: 1000000 },
    "$1.000.000 - $2.000.000": { min: 1000000, max: 2000000 },
    "Más de $2.000.000": { min: 2000000 },
    // Rangos para electrodomésticos
    "Menos de $1.000.000": { max: 1000000 },
    "$2.000.000 - $3.000.000": { min: 2000000, max: 3000000 },
    "Más de $3.000.000": { min: 3000000 },
    // Rangos para TVs
    "Menos de $1.500.000": { max: 1500000 },
    "$1.500.000 - $3.000.000": { min: 1500000, max: 3000000 },
    "$3.000.000 - $5.000.000": { min: 3000000, max: 5000000 },
    "Más de $5.000.000": { min: 5000000 },
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

  // RAM - usar memoriaram con valores exactos
  if (filters.ram && filters.ram.length > 0) {
    result.memoriaram = filters.ram.join(",");
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

  // Tamaño de pantalla - usar capacity como query param
  if (filters.tamanoPantalla && filters.tamanoPantalla.length > 0) {
    result.capacity = filters.tamanoPantalla.join(",");
  }

  return result;
}

/**
 * Valida si una categoría es soportada
 * Ahora es dinámico - solo valida "ofertas" como estática
 */
export function isValidCategory(
  categoria: string
): categoria is CategoriaParams {
  // Solo "ofertas" es estático, el resto viene dinámicamente de la API
  return categoria === "ofertas" || categoria.length > 0;
}

/**
 * Obtiene las subcategorías disponibles para una categoría
 * Ahora es dinámico - retorna array vacío ya que los menús vienen de la API
 */
export function getAvailableSubcategories(
  categoria: CategoriaParams
): string[] {
  // Los menús ahora vienen dinámicamente desde la API
  return [];
}
