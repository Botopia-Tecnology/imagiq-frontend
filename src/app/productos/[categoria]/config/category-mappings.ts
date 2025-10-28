/**
 *  CONFIGURACIÓN CENTRALIZADA DE CATEGORÍAS
 * Única fuente de verdad para todos los mapeos entre frontend y backend
 * 
 * Este archivo consolida:
 * - Mapeo de categorías frontend → API
 * - Mapeo de secciones frontend → nombres de menú API
 * - Configuración de códigos de API por categoría
 */

import type { CategoriaParams, Seccion } from "../types";

/**
 * Códigos de categoría para la API
 */
export const CATEGORY_API_CODES: Record<CategoriaParams, string> = {
  'dispositivos-moviles': 'IM',
  'televisores': 'AV',
  'electrodomesticos': 'DA',
  'monitores': 'IT',
  'audio': 'AV',
  'ofertas': 'ofertas'
};

/**
 * Mapeo de categorías frontend → API
 * Define cómo se traduce cada categoría y sus secciones a los nombres que la API espera
 */
export interface CategoryMapping {
  apiCategory: string;
  sections: Record<string, {
    menuName: string;
    subcategory?: string;
  }>;
}

export const CATEGORY_MAPPING: Record<CategoriaParams, CategoryMapping> = {
  electrodomesticos: {
    apiCategory: "Electrodoméstico",
    sections: {
      microondas: { menuName: "Hornos Microondas", subcategory: "Hornos Microondas" },
      "hornos-microondas": { menuName: "Hornos Microondas", subcategory: "Hornos Microondas" },
      refrigeradores: { menuName: "Neveras", subcategory: "Neveras" },
      neveras: { menuName: "Neveras", subcategory: "Neveras" },
      lavadoras: { menuName: "Lavadoras y Secadoras", subcategory: "Lavadoras y Secadoras" },
      "lavadoras-secadoras": { menuName: "Lavadoras y Secadoras", subcategory: "Lavadoras y Secadoras" },
      "lavadoras-y-secadoras": { menuName: "Lavadoras y Secadoras", subcategory: "Lavadoras y Secadoras" },
      lavavajillas: { menuName: "Lavavajillas", subcategory: "Lavavajillas" },
      "aire-acondicionado": { menuName: "Aire Acondicionado", subcategory: "Aire Acondicionado" },
      "aires-acondicionados": { menuName: "Aire Acondicionado", subcategory: "Aire Acondicionado" },
      aspiradoras: { menuName: "Aspiradoras", subcategory: "Aspiradoras" },
      hornos: { menuName: "Hornos", subcategory: "Hornos" },
    },
  },
  "dispositivos-moviles": {
    apiCategory: "Dispositivos Móviles",
    sections: {
      smartphones: { menuName: "Smartphones Galaxy", subcategory: "Celulares" },
      tabletas: { menuName: "Galaxy Tab", subcategory: "Tablets" },
      relojes: { menuName: "Galaxy Watch", subcategory: "Wearables" },
      buds: { menuName: "Galaxy Buds", subcategory: "buds" },
      accesorios: { menuName: "Accesorios para Galaxy", subcategory: "Accesorios" },
    },
  },
  televisores: {
    apiCategory: "TV & Audio",
    sections: {
      "crystal-uhd": { menuName: "Crystal UHD", subcategory: "Crystal UHD" },
      "neo-qled": { menuName: "Neo QLED", subcategory: "Neo QLED" },
      "oled": { menuName: "OLED", subcategory: "OLED" },
      "proyectores": { menuName: "Proyectores", subcategory: "Proyectores" },
      "qled": { menuName: "QLED", subcategory: "QLED" },
      "smart-tv": { menuName: "Smart TV", subcategory: "Smart TV" },
      "the-frame": { menuName: "The Frame", subcategory: "The Frame" },
      "dispositivo-audio": { menuName: "Dispositivo de Audio", subcategory: "Dispositivo de Audio" },
    },
  },
  monitores: {
    apiCategory: "TV & Audio",
    sections: {
      "corporativo": { menuName: "Corporativo", subcategory: "Monitores" },
      "essential-monitor": { menuName: "Essential Monitor", subcategory: "Monitores" },
      "odyssey-gaming": { menuName: "Odyssey Gaming", subcategory: "Monitores" },
      "viewfinity-high-resolution": { menuName: "ViewFinity High Resolution", subcategory: "Monitores" },
    },
  },
  audio: {
    apiCategory: "TV & Audio",
    sections: {
      "barras-sonido": { menuName: "Barras de Sonido", subcategory: "Soundbars" },
      sistemas: { menuName: "Sistemas de Audio", subcategory: "Sistemas de Audio" },
    },
  },
  ofertas: {
    apiCategory: "Ofertas",
    sections: {
      accesorios: { menuName: "Accesorios", subcategory: "Accesorios" },
      "tv-monitores-audio": { menuName: "TV & Audio", subcategory: "TV & Audio" },
      "smartphones-tablets": { menuName: "Dispositivos Móviles", subcategory: "Dispositivos Móviles" },
      electrodomesticos: { menuName: "Electrodoméstico", subcategory: "Electrodoméstico" },
    },
  },
};

/**
 * Títulos legibles para las secciones (UI)
 */
export const SECTION_TITLES: Record<Seccion, string> = {
  // Electrodomésticos
  neveras: "Neveras",
  refrigeradores: "Refrigeradores",
  lavadoras: "Lavadoras",
  "lavadoras-secadoras": "Lavadoras y Secadoras",
  "lavadoras-y-secadoras": "Lavadoras y Secadoras",
  lavavajillas: "Lavavajillas",
  "aire-acondicionado": "Aire Acondicionado",
  "aires-acondicionados": "Aires Acondicionados",
  microondas: "Microondas",
  "hornos-microondas": "Hornos Microondas",
  aspiradoras: "Aspiradoras",
  hornos: "Hornos",

  // Móviles
  smartphones: "Smartphones",
  tabletas: "Tabletas",
  relojes: "Relojes",
  buds: "Galaxy Buds",
  accesorios: "Accesorios",

  // TVs
  "smart-tv": "Smart TV",
  qled: "QLED",
  "crystal-uhd": "Crystal UHD",
  "neo-qled": "Neo QLED",
  oled: "OLED",
  proyectores: "Proyectores",
  "the-frame": "The Frame",
  "dispositivo-audio": "Dispositivo de Audio",

  // Monitores
  corporativo: "Corporativo",
  "essential-monitor": "Essential Monitor",
  "odyssey-gaming": "Odyssey Gaming",
  "viewfinity-high-resolution": "ViewFinity High Resolution",

  // Audio
  "barras-sonido": "Barras de Sonido",
  sistemas: "Sistemas de Audio",

  // Ofertas
  "tv-monitores-audio": "TV, Monitores y Audio",
  "smartphones-tablets": "Smartphones y Tablets",
  electrodomesticos: "Electrodomésticos",
};

/**
 * Secciones disponibles por categoría
 */
export const CATEGORY_SECTIONS: Record<CategoriaParams, Seccion[]> = {
  electrodomesticos: [
    "neveras",
    "refrigeradores",
    "microondas",
    "hornos-microondas",
    "lavadoras",
    "lavadoras-secadoras",
    "lavadoras-y-secadoras",
    "lavavajillas",
    "aire-acondicionado",
    "aires-acondicionados",
    "aspiradoras",
    "hornos",
  ],
  "dispositivos-moviles": [
    "smartphones",
    "tabletas",
    "relojes",
    "buds",
    "accesorios",
  ],
  televisores: ["crystal-uhd", "neo-qled", "oled", "proyectores", "qled", "smart-tv", "the-frame", "dispositivo-audio"],
  monitores: ["corporativo", "essential-monitor", "odyssey-gaming", "viewfinity-high-resolution"],
  audio: ["barras-sonido", "sistemas"],
  ofertas: [
    "accesorios",
    "tv-monitores-audio",
    "smartphones-tablets",
    "electrodomesticos",
  ],
};

/**
 * Sección por defecto para cada categoría
 */
export const DEFAULT_SECTION: Record<CategoriaParams, Seccion> = {
  electrodomesticos: "neveras",
  "dispositivos-moviles": "smartphones",
  televisores: "crystal-uhd",
  monitores: "corporativo",
  audio: "barras-sonido",
  ofertas: "accesorios",
};

/**
 * Helper: Obtiene el nombre del menú para una sección
 */
export function getMenuNameForSection(categoria: CategoriaParams, seccion: string): string | null {
  const mapping = CATEGORY_MAPPING[categoria];
  if (!mapping) return null;
  
  const sectionConfig = mapping.sections[seccion];
  return sectionConfig?.menuName || null;
}

/**
 * Helper: Obtiene la subcategoría para una sección
 */
export function getSubcategoryForSection(categoria: CategoriaParams, seccion: string): string | null {
  const mapping = CATEGORY_MAPPING[categoria];
  if (!mapping) return null;
  
  const sectionConfig = mapping.sections[seccion];
  return sectionConfig?.subcategory || null;
}

/**
 * Helper: Obtiene el código de categoría API
 */
export function getCategoryApiCode(categoria: CategoriaParams): string {
  return CATEGORY_API_CODES[categoria];
}

/**
 * Helper: Obtiene el título legible para una sección
 */
export function getSectionTitle(seccion: Seccion): string {
  return SECTION_TITLES[seccion] || seccion;
}

/**
 * Helper: Valida si una sección es válida para una categoría específica
 */
export function isValidSectionForCategory(
  categoria: CategoriaParams,
  seccion: string
): boolean {
  const validSections = CATEGORY_SECTIONS[categoria];
  return validSections ? validSections.includes(seccion as Seccion) : false;
}

/**
 * Helper: Obtiene todas las secciones para una categoría
 */
export function getSectionsForCategory(categoria: CategoriaParams): Seccion[] {
  return CATEGORY_SECTIONS[categoria] || [];
}

/**
 * Helper: Obtiene la sección por defecto para una categoría
 */
export function getDefaultSection(categoria: CategoriaParams): Seccion {
  return DEFAULT_SECTION[categoria];
}

/**
 * Helper: Obtiene la configuración de mapeo completa para una categoría
 */
export function getCategoryMapping(categoria: CategoriaParams): CategoryMapping | null {
  return CATEGORY_MAPPING[categoria] || null;
}

/**
 * Helper: Genera mapeo legado para compatibilidad con categoryUtils
 * @deprecated Usar directamente CATEGORY_MAPPING
 */
export function getLegacyCategoryMapping() {
  const legacy: Record<CategoriaParams, { apiCategory: string; subcategorias: Record<string, string> }> = {} as any;
  
  Object.keys(CATEGORY_MAPPING).forEach(categoria => {
    const cat = categoria as CategoriaParams;
    const mapping = CATEGORY_MAPPING[cat];
    legacy[cat] = {
      apiCategory: mapping.apiCategory,
      subcategorias: Object.entries(mapping.sections).reduce((acc, [key, value]) => {
        acc[key] = value.subcategory || value.menuName;
        return acc;
      }, {} as Record<string, string>)
    };
  });
  
  return legacy;
}

