/**
 * ========================================================================
 * NOTA: Los mapeos de categorías ahora se obtienen dinámicamente desde la API.
 * Usar useCategoryMetadata() de @/contexts/CategoryMetadataContext
 * Estas constantes se mantienen temporalmente como fallback durante la migración.
 * ========================================================================
 */

/**
 * Category name mappings for breadcrumbs
 * Maps URL slugs to display names
 * @deprecated Usar useCategoryMetadata().getCategoryDisplayName() para lookups dinámicos
 */
export const CATEGORY_NAMES: Record<string, string> = {
  "dispositivos-moviles": "Dispositivos móviles",
  "computadores": "Computadores",
  "tablets": "Tablets",
  "accesorios": "Accesorios",
  "audio": "Audio",
  "wearables": "Wearables",
  "electrodomesticos": "Electrodomésticos",
  "televisores": "Televisores",
  "monitores": "Monitores",
};

/**
 * Section name mappings for breadcrumbs
 * Maps URL slugs to display names (subsections)
 */
export const SECTION_NAMES: Record<string, string> = {
  // Móviles
  smartphones: "Smartphones",
  tabletas: "Tabletas",
  relojes: "Relojes",
  buds: "Galaxy Buds",

  // Electrodomésticos
  refrigeradores: "Refrigeradores",
  lavadoras: "Lavadoras",
  lavavajillas: "Lavavajillas",
  "aire-acondicionado": "Aire Acondicionado",
  microondas: "Microondas",
  aspiradoras: "Aspiradoras",
  hornos: "Hornos",

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
  "torres-sonido": "Torres de Sonido",
  parlantes: "Parlantes",
};

/**
 * Filter name mappings for breadcrumbs
 * Maps filter keys to human-readable labels
 */
export const FILTER_LABELS: Record<string, string> = {
  serie: "Serie",
  almacenamiento: "Almacenamiento",
  color: "Color",
  marca: "Marca",
  modelo: "Modelo",
  precio: "Precio",
};

/**
 * Brand/Series name mappings
 * Maps URL slugs to display names
 */
export const SERIES_NAMES: Record<string, string> = {
  "galaxy-z": "Galaxy Z",
  "galaxy-s": "Galaxy S",
  "galaxy-a": "Galaxy A",
  "iphone": "iPhone",
  "ipad": "iPad",
  "macbook": "MacBook",
  "galaxy-tab": "Galaxy Tab",
};

/**
 * Storage option mappings
 * Maps URL slugs to display names
 */
export const STORAGE_NAMES: Record<string, string> = {
  "64gb": "64 GB",
  "128gb": "128 GB",
  "256gb": "256 GB",
  "512gb": "512 GB",
  "1tb": "1 TB",
  "2tb": "2 TB",
};

/**
 * Color name mappings
 * Maps URL slugs to display names
 */
export const COLOR_NAMES: Record<string, string> = {
  negro: "Negro",
  blanco: "Blanco",
  gris: "Gris",
  azul: "Azul",
  rojo: "Rojo",
  verde: "Verde",
  morado: "Morado",
  rosa: "Rosa",
  dorado: "Dorado",
  plateado: "Plateado",
};

/**
 * Reverse category mappings
 * Maps display names and API values to URL slugs
 * @deprecated Usar useCategoryMetadata().getCategorySlug() para lookups dinámicos
 */
export const CATEGORY_TO_SLUG: Record<string, string> = {
  // Display names
  "Dispositivos móviles": "dispositivos-moviles",
  "Dispositivos moviles": "dispositivos-moviles",
  "Computadores": "computadores",
  "Tablets": "tablets",
  "Accesorios": "accesorios",
  "Audio": "audio",
  "Wearables": "wearables",
  "Electrodomésticos": "electrodomesticos",
  "Electrodomesticos": "electrodomesticos",
  "Televisores": "televisores",
  "Televisores y AV": "televisores",
  "Monitores": "monitores",
  // API values / DB codes
  "IM": "dispositivos-moviles",
  "MOVILES": "dispositivos-moviles",
  "MOVIL": "dispositivos-moviles",
  "Móviles": "dispositivos-moviles",
  "Moviles": "dispositivos-moviles",
  "TV": "televisores",
  "TVs": "televisores",
  "HA": "electrodomesticos",
  "IT": "computadores",
  "CE": "electrodomesticos",
  "VD": "televisores",
};

/**
 * Subcategory mappings
 * Maps API subcategory values to section slugs
 * @deprecated Usar useCategoryMetadata().getMenuDisplayName() para lookups dinámicos
 */
export const SUBCATEGORY_TO_SECTION: Record<string, string> = {
  "Smartphones": "smartphones",
  "Smartphone": "smartphones",
  "SMARTPHONE": "smartphones",
  "Celulares": "smartphones",
  "Tabletas": "tabletas",
  "Tablet": "tabletas",
  "TABLET": "tabletas",
  "Relojes": "relojes",
  "Watch": "relojes",
  "WATCH": "relojes",
  "Buds": "buds",
  "BUDS": "buds",
  "Auriculares": "buds",
  // TVs
  "QLED": "qled",
  "Neo QLED": "neo-qled",
  "OLED": "oled",
  "Crystal UHD": "crystal-uhd",
  "Smart TV": "smart-tv",
  "The Frame": "the-frame",
  "Proyectores": "proyectores",
  // Electrodomésticos
  "Refrigeradores": "refrigeradores",
  "Neveras": "refrigeradores",
  "Lavadoras": "lavadoras",
  "Secadoras": "lavadoras",
  "Lavavajillas": "lavavajillas",
  "Aire Acondicionado": "aire-acondicionado",
  "Microondas": "microondas",
  "Aspiradoras": "aspiradoras",
  "Hornos": "hornos",
};
