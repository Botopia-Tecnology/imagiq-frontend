/**
 * Constantes centralizadas para configuración de categorías
 * Define las secciones, filtros y configuración específica para cada categoría
 */

import type { CategoriaParams, Seccion } from "../types";
import type { FilterConfig, FilterState } from "../../components/FilterSidebar";

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

// NOTA: Las funciones getSectionTitle e isValidSectionForCategory ahora son dinámicas en slugUtils.ts

/**
 * Mapeo de slugs dinámicos a configuraciones de filtros estáticos
 * Esto permite que filtros dinámicos (por API) funcionen con filtros estáticos
 */
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
 * Obtiene la configuración de filtros disponibles para una categoría y sección específica
 * Soporta tanto slugs estáticos como dinámicos (generados desde la API)
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

  // Normalizar el slug a la configuración de filtros conocida
  const normalizedCategoria = FILTER_CONFIG_MAP[categoria] || categoria;

  // Devolver configuración genérica por categoría
  switch (normalizedCategoria) {
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
