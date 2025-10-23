/**
 * Constantes centralizadas para configuración de categorías
 * Define las secciones, filtros y configuración específica para cada categoría
 */

import type { CategoriaParams, Seccion } from "../types";
import type { FilterConfig, FilterState } from "../../components/FilterSidebar";
import type { Category } from "../../components/CategorySlider";

// Importar imágenes para el CategorySlider
import smartphoneImg from "@/img/categorias/Smartphones.png";
import tabletImg from "@/img/categorias/Tabletas.png";
import watchImg from "@/img/categorias/galaxy_watch.png";
import budsImg from "@/img/categorias/galaxy_buds.png";
import accesoriosImg from "@/img/categorias/accesorios.png";
import refrigeradorImg from "@/img/electrodomesticos/electrodomesticos1.png";
import lavadoraImg from "@/img/electrodomesticos/electrodomesticos5.png";
import tvImg from "@/img/categorias/Tv_Monitores.png";
import lavavajillasImg from "@/img/electrodomesticos/lavavajillas2.png";
import aspiradoraImg from "@/img/electrodomesticos/electrodomesticos3.png";
import microondasImg from "@/img/electrodomesticos/electrodomesticos4.png";
import aireImg from "@/img/electrodomesticos/aire2.png";
import hornosImg from "@/img/electrodomesticos/horno.png";

/**
 * Configuración de filtros para electrodomésticos - OPCIONES DISPONIBLES
 */
export const electrodomesticoFilters: FilterConfig = {
  rangoPrecio: [
    { label: "Menos de $1.000.000", min: 0, max: 1000000 },
    { label: "$1.000.000 - $2.000.000", min: 1000000, max: 2000000 },
    { label: "$2.000.000 - $3.000.000", min: 2000000, max: 3000000 },
    { label: "Más de $3.000.000", min: 3000000, max: Infinity },
  ],
  color: ["Negro", "Blanco", "Plata", "Gris", "Azul", "Rojo"],
  capacidad: ["300L", "400L", "500L", "600L", "700L+"],
  eficienciaEnergetica: ["A+++", "A++", "A+", "A"],
  tecnologia: ["Twin Cooling Plus", "Digital Inverter", "No Frost", "SpaceMax"],
  tamaño: ["Compacto", "Mediano", "Grande", "Extra Grande"],
};

/**
 * Configuración de filtros para dispositivos móviles - OPCIONES DISPONIBLES
 */
export const movilesFilters: FilterConfig = {
  rangoPrecio: [
    { label: "Menos de $500.000", min: 0, max: 500000 },
    { label: "$500.000 - $1.000.000", min: 500000, max: 1000000 },
    { label: "$1.000.000 - $2.000.000", min: 1000000, max: 2000000 },
    { label: "Más de $2.000.000", min: 2000000, max: Infinity },
  ],
  color: [
    "Negro",
    "Blanco",
    "Azul",
    "Rosa",
    "Verde",
    "Morado",
    "Dorado",
    "Plateado",
  ],
  almacenamiento: ["64GB", "128GB", "256GB", "512GB", "1TB"],
  ram: ["4GB", "6GB", "8GB", "12GB", "16GB"],
  serie: ["Galaxy A", "Galaxy S", "Galaxy Note", "Galaxy Z"],
  pantalla: ['5.5"', '6.1"', '6.5"', '6.7"', '6.8"'],
  camara: ["12MP", "50MP", "64MP", "108MP", "200MP"],
  caracteristicas: [
    "5G",
    "Resistente al agua",
    "Carga inalámbrica",
    "NFC",
    "Dual SIM",
  ],
};

/**
 * Configuración de filtros específicos por sección para dispositivos móviles
 */
export const movilesSectionFilters: Record<string, FilterConfig> = {
  smartphones: {
    almacenamiento: ["64GB", "128GB", "256GB", "512GB", "1TB"],
    caracteristicas: [
      "5G",
      // "Resistente al agua",
      // "Carga inalámbrica",
      // "NFC",
      // "Dual SIM",
    ],
    rangoPrecio: [
      { label: "Menos de $500.000", min: 0, max: 500000 },
      { label: "$500.000 - $1.000.000", min: 500000, max: 1000000 },
      { label: "$1.000.000 - $2.000.000", min: 1000000, max: 2000000 },
      { label: "Más de $2.000.000", min: 2000000, max: Infinity },
    ],
    serie: ["Galaxy A", "Galaxy S", "Galaxy Note", "Galaxy Z"],
    ram: ["4GB", "6GB", "8GB", "12GB", "16GB"],
    color: [
      "Negro",
      "Blanco",
      "Azul",
      "Rosa",
      "Verde",
      "Morado",
      "Dorado",
      "Plateado",
    ],
  },
  tabletas: {
    serie: ["Galaxy Tab S", "Galaxy Tab A", "Galaxy Tab Active"],
    almacenamiento: ["32GB", "64GB", "128GB", "256GB", "512GB"],
    conectividad: ["Wi-Fi", "LTE", "5G"],
    caracteristicas: [
      "S Pen",
      "Carga rápida",
      // "Resistente al agua",
      "Carga inalámbrica",
      // "Dual SIM",
    ],
    rangoPrecio: [
      { label: "Menos de $500.000", min: 0, max: 500000 },
      { label: "$500.000 - $1.000.000", min: 500000, max: 1000000 },
      { label: "$1.000.000 - $2.000.000", min: 1000000, max: 2000000 },
      { label: "Más de $2.000.000", min: 2000000, max: Infinity },
    ],
    color: [
      "Negro",
      "Blanco",
      "Azul",
      "Rosa",
      "Verde",
      "Morado",
      "Dorado",
      "Plateado",
    ],
  },
  relojes: {
    serie: ["Galaxy Watch", "Galaxy Watch Active", "Galaxy Watch Classic"],
    tamaño: ["40mm", "42mm", "43mm", "44mm", "45mm", "46mm", "47mm"],
    rangoPrecio: [
      { label: "Menos de $500.000", min: 0, max: 500000 },
      { label: "$500.000 - $1.000.000", min: 500000, max: 1000000 },
      { label: "$1.000.000 - $2.000.000", min: 1000000, max: 2000000 },
      { label: "Más de $2.000.000", min: 2000000, max: Infinity },
    ],
    color: ["Negro", "Plata", "Dorado", "Rosa", "Azul", "Morado"],
  },
  buds: {
    serie: [
      "Galaxy Buds Pro",
      "Galaxy Buds 2",
      "Galaxy Buds 2 Pro",
      "Galaxy Buds FE",
      "Galaxy Buds Live",
    ],
    rangoPrecio: [
      { label: "Menos de $200.000", min: 0, max: 200000 },
      { label: "$200.000 - $400.000", min: 200000, max: 400000 },
      { label: "$400.000 - $600.000", min: 400000, max: 600000 },
      { label: "Más de $600.000", min: 600000, max: Infinity },
    ],
    color: [
      "Negro",
      "Blanco",
      "Gris",
      "Azul",
      "Rosa",
      "Verde",
      "Morado",
      "Dorado",
      "Plateado",
      "Oro Rosa",
    ],
  },
  accesorios: {
    tipoAccesorio: [
      "Cargadores",
      "Cables",
      "Fundas",
      "Protectores de pantalla",
      "Correas",
      "Soportes",
      "PowerBank",
    ],
    compatibilidad: [
      "Galaxy S Series",
      "Galaxy A Series",
      "Galaxy Note",
      "Galaxy Tab",
      "Galaxy Watch",
      "Universal",
    ],
    material: [
      "Silicona",
      "Cuero",
      "Metal",
      "Plástico",
      "Cristal templado",
      "TPU",
    ],
    color: [
      "Negro",
      "Blanco",
      "Transparente",
      "Azul",
      "Rojo",
      "Rosa",
      "Morado",
      "Gris",
    ],
    caracteristicas: [
      "Carga rápida",
      "Inalámbrico",
      "Magnético",
      "Resistente al agua",
      "Anti-golpes",
      "Ultra delgado",
    ],
    rangoPrecio: [
      { label: "Menos de $50.000", min: 0, max: 50000 },
      { label: "$50.000 - $100.000", min: 50000, max: 100000 },
      { label: "$100.000 - $200.000", min: 100000, max: 200000 },
      { label: "Más de $200.000", min: 200000, max: Infinity },
    ],
    marca: ["Samsung", "Original", "Genérico"],
    tipoConector: ["USB-C", "USB-A", "Lightning", "Jack 3.5mm", "Micro USB"],
  },
};

/**
 * Configuración de filtros para TVs - OPCIONES DISPONIBLES
 */
export const tvsFilters: FilterConfig = {
  rangoPrecio: [
    { label: "Menos de $1.500.000", min: 0, max: 1500000 },
    { label: "$1.500.000 - $3.000.000", min: 1500000, max: 3000000 },
    { label: "$3.000.000 - $5.000.000", min: 3000000, max: 5000000 },
    { label: "Más de $5.000.000", min: 5000000, max: Infinity },
  ],
  color: ["Negro", "Plata", "Gris", "Blanco"],
  tamanoPantalla: ['32"', '43"', '50"', '55"', '65"', '75"', '85"'],
  resolucion: ["HD", "Full HD", "4K", "8K"],
  smartFeatures: ["Tizen", "Google TV", "Smart Hub", "Bixby"],
  conectividad: ["WiFi", "Bluetooth", "HDMI", "USB"],
};

/**
 * Configuración de filtros para Audio - OPCIONES DISPONIBLES
 */
export const audioFilters: FilterConfig = {
  rangoPrecio: [
    { label: "Menos de $200.000", min: 0, max: 200000 },
    { label: "$200.000 - $500.000", min: 200000, max: 500000 },
    { label: "$500.000 - $1.000.000", min: 500000, max: 1000000 },
    { label: "Más de $1.000.000", min: 1000000, max: Infinity },
  ],
  color: ["Negro", "Blanco", "Azul", "Rosa", "Verde"],
  conectividad: ["Bluetooth", "USB-C", "Jack 3.5mm", "Wireless"],
  potencia: ["Baja", "Media", "Alta", "Extra Alta"],
  compatibilidad: ["Android", "iOS", "Windows", "Universal"],
};

/**
 * Secciones disponibles por categoría
 */
export const CATEGORY_SECTIONS: Record<CategoriaParams, Seccion[]> = {
  electrodomesticos: [
    "microondas",
    "lavadoras",
    "refrigeradores",
    "lavavajillas",
    "aire-acondicionado",
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
  electrodomesticos: "microondas",
  "dispositivos-moviles": "smartphones",
  televisores: "crystal-uhd",
  monitores: "corporativo",
  audio: "barras-sonido",
  ofertas: "accesorios",
};

/**
 * Títulos legibles para las secciones
 */
export const SECTION_TITLES: Record<Seccion, string> = {
  // Electrodomésticos
  refrigeradores: "Refrigeradores",
  lavadoras: "Lavadoras",
  lavavajillas: "Lavavajillas",
  "aire-acondicionado": "Aire Acondicionado",
  microondas: "Microondas",
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
 * Configuración del CategorySlider para cada categoría
 */
export const CATEGORY_SLIDER_CONFIG: Record<CategoriaParams, Category[]> = {
  electrodomesticos: [
    {
      id: "microondas",
      name: "Hornos Microondas",
      subtitle: "",
      image: microondasImg,
      href: "/productos/electrodomesticos?seccion=microondas",
    },
    {
      id: "lavadoras",
      name: "Lavadoras y Secadoras",
      subtitle: "",
      image: lavadoraImg,
      href: "/productos/electrodomesticos?seccion=lavadoras",
    },
    {
      id: "refrigeradores",
      name: "Neveras",
      subtitle: "",
      image: refrigeradorImg,
      href: "/productos/electrodomesticos?seccion=refrigeradores",
    },
    {
      id: "lavavajillas",
      name: "Lavavajillas",
      subtitle: "",
      image: lavavajillasImg,
      href: "/productos/electrodomesticos?seccion=lavavajillas",
    },
    {
      id: "aire-acondicionado",
      name: "Aire Acondicionado",
      subtitle: "",
      image: aireImg,
      href: "/productos/electrodomesticos?seccion=aire-acondicionado",
    },
    {
      id: "aspiradoras",
      name: "Aspiradoras",
      subtitle: "",
      image: aspiradoraImg,
      href: "/productos/electrodomesticos?seccion=aspiradoras",
    },
    {
      id: "hornos",
      name: "Hornos",
      subtitle: "",
      image: hornosImg,
      href: "/productos/electrodomesticos?seccion=hornos",
    },
  ],
  "dispositivos-moviles": [
    {
      id: "smartphones",
      name: "Smartphones",
      subtitle: "Galaxy Series",
      image: smartphoneImg,
      href: "/productos/dispositivos-moviles?seccion=smartphones",
    },
    {
      id: "tabletas",
      name: "Tabletas",
      subtitle: "Galaxy Tab",
      image: tabletImg,
      href: "/productos/dispositivos-moviles?seccion=tabletas",
    },
    {
      id: "relojes",
      name: "Relojes",
      subtitle: "Galaxy Watch",
      image: watchImg,
      href: "/productos/dispositivos-moviles?seccion=relojes",
    },
    {
      id: "buds",
      name: "Galaxy Buds",
      subtitle: "Audio inalámbrico",
      image: budsImg,
      href: "/productos/dispositivos-moviles?seccion=buds",
    },
    {
      id: "accesorios",
      name: "Accesorios",
      subtitle: "Fundas y más",
      image: accesoriosImg,
      href: "/productos/dispositivos-moviles?seccion=accesorios",
    },
  ],
  televisores: [
    {
      id: "crystal-uhd",
      name: "Crystal UHD",
      subtitle: "TV",
      image: tvImg,
      href: "/productos/televisores?seccion=crystal-uhd",
    },
    {
      id: "neo-qled",
      name: "Neo QLED",
      subtitle: "TV",
      image: tvImg,
      href: "/productos/televisores?seccion=neo-qled",
    },
    {
      id: "oled",
      name: "OLED",
      subtitle: "TV",
      image: tvImg,
      href: "/productos/televisores?seccion=oled",
    },
    {
      id: "proyectores",
      name: "Proyectores",
      subtitle: "TV",
      image: tvImg,
      href: "/productos/televisores?seccion=proyectores",
    },
    {
      id: "qled",
      name: "QLED",
      subtitle: "TV",
      image: tvImg,
      href: "/productos/televisores?seccion=qled",
    },
    {
      id: "smart-tv",
      name: "Smart TV",
      subtitle: "TV",
      image: tvImg,
      href: "/productos/televisores?seccion=smart-tv",
    },
    {
      id: "the-frame",
      name: "The Frame",
      subtitle: "TV",
      image: tvImg,
      href: "/productos/televisores?seccion=the-frame",
    },
    {
      id: "dispositivo-audio",
      name: "Dispositivo de Audio",
      subtitle: "Audio",
      image: tvImg,
      href: "/productos/televisores?seccion=dispositivo-audio",
    },
  ],
  monitores: [
    {
      id: "corporativo",
      name: "Corporativo",
      subtitle: "Monitores",
      image: tvImg,
      href: "/productos/monitores?seccion=corporativo",
    },
    {
      id: "essential-monitor",
      name: "Essential",
      subtitle: "Monitor",
      image: tvImg,
      href: "/productos/monitores?seccion=essential-monitor",
    },
    {
      id: "odyssey-gaming",
      name: "Odyssey",
      subtitle: "Gaming",
      image: tvImg,
      href: "/productos/monitores?seccion=odyssey-gaming",
    },
    {
      id: "viewfinity-high-resolution",
      name: "ViewFinity",
      subtitle: "High Resolution",
      image: tvImg,
      href: "/productos/monitores?seccion=viewfinity-high-resolution",
    },
  ],
  audio: [
    {
      id: "barras-sonido",
      name: "Barras de Sonido",
      subtitle: "Audio premium",
      image: budsImg, // Usar la misma imagen por ahora
      href: "/productos/audio?seccion=barras-sonido",
    },
  ],
  ofertas: [
    {
      id: "accesorios",
      name: "Accesorios",
      subtitle: "Ofertas especiales",
      image: accesoriosImg,
      href: "/productos/ofertas?seccion=accesorios",
    },
    {
      id: "tv-monitores-audio",
      name: "TV, Monitores y Audio",
      subtitle: "Ofertas especiales",
      image: tvImg,
      href: "/productos/ofertas?seccion=tv-monitores-audio",
    },
    {
      id: "smartphones-tablets",
      name: "Smartphones y Tablets",
      subtitle: "Ofertas especiales",
      image: smartphoneImg,
      href: "/productos/ofertas?seccion=smartphones-tablets",
    },
    {
      id: "electrodomesticos",
      name: "Electrodomésticos",
      subtitle: "Ofertas especiales",
      image: refrigeradorImg,
      href: "/productos/ofertas?seccion=electrodomesticos",
    },
  ],
};

/**
 * Obtiene la configuración de filtros para una categoría y sección específica
 * Devuelve el estado inicial (arrays vacíos) para usar con useState
 */
export function getCategoryFilters(
  categoria: CategoriaParams,
  seccion?: Seccion
): FilterState {
  const filterConfig = getCategoryFilterConfig(categoria, seccion);
  const initialState: FilterState = {};

  // Convertir FilterConfig a FilterState inicial (arrays vacíos)
  Object.keys(filterConfig).forEach((key) => {
    initialState[key] = [];
  });

  return initialState;
}

/**
 * Obtiene el título legible para una sección
 */
export function getSectionTitle(seccion: Seccion): string {
  return SECTION_TITLES[seccion] || seccion;
}

/**
 * Valida si una sección es válida para una categoría específica
 */
export function isValidSectionForCategory(
  categoria: CategoriaParams,
  seccion: string
): boolean {
  const validSections = CATEGORY_SECTIONS[categoria];
  return validSections ? validSections.includes(seccion as Seccion) : false;
}

/**
 * Obtiene la configuración del CategorySlider para una categoría
 * @deprecated Use getSliderConfig from slider-configs.ts instead
 */
export function getCategorySliderConfig(
  categoria: CategoriaParams
): Category[] {
  return CATEGORY_SLIDER_CONFIG[categoria] || [];
}

/**
 * Obtiene la configuración de filtros disponibles para una categoría y sección específica
 */
export function getCategoryFilterConfig(
  categoria: CategoriaParams,
  seccion?: Seccion
): FilterConfig {
  // Para móviles, usar filtros específicos por sección si se proporciona
  if (
    categoria === "dispositivos-moviles" &&
    seccion &&
    movilesSectionFilters[seccion]
  ) {
    return movilesSectionFilters[seccion];
  }

  // Devolver configuración genérica por categoría
  switch (categoria) {
    case "electrodomesticos":
      return electrodomesticoFilters;
    case "dispositivos-moviles":
      return movilesFilters;
    case "televisores":
      return tvsFilters;
    case "monitores":
      return tvsFilters; // Usar los mismos filtros que TVs por ahora
    case "audio":
      return audioFilters;
    default:
      return {};
  }
}
