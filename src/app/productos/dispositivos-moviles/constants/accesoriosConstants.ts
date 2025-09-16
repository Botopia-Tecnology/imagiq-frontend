/**
 * 📦 ACCESORIOS CONSTANTS
 *
 * Configuraciones y constantes para la sección Accesorios
 */

import type { Category } from "../../components/CategorySlider";
import type { FilterConfig } from "../../components/FilterSidebar";
import smartphonesImg from "../../../../img/categorias/Smartphones.png";
import tabletasImg from "../../../../img/categorias/Tabletas.png";
import galaxyBudsImg from "../../../../img/categorias/galaxy_buds.png";
import galaxyWatchImg from "../../../../img/categorias/galaxy_watch.png";

// Categorías del slider (idénticas a la imagen)
export const accessoryCategories: Category[] = [
  {
    id: "galaxy-smartphone",
    name: "Galaxy",
    subtitle: "Smartphone",
    image: smartphonesImg,
    href: "/productos/dispositivos-moviles?section=smartphones",
  },
  {
    id: "galaxy-watch",
    name: "Galaxy",
    subtitle: "Watch",
    image: galaxyWatchImg,
    href: "/productos/dispositivos-moviles?section=relojes",
  },
  {
    id: "galaxy-tab",
    name: "Galaxy",
    subtitle: "Tab",
    image: tabletasImg,
    href: "/productos/dispositivos-moviles?section=tabletas",
  },
  {
    id: "galaxy-buds",
    name: "Galaxy",
    subtitle: "Buds",
    image: galaxyBudsImg,
    href: "/productos/dispositivos-moviles?section=buds",
  },
];

// Configuración de filtros específica para accesorios
export const accessoryFilters: FilterConfig = {
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
  color: ["Negro", "Blanco", "Transparente", "Azul", "Rojo", "Rosa", "Morado"],
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
  marca: ["Samsung", "Spigen", "OtterBox", "Belkin", "Anker", "UAG"],
  tipoConector: ["USB-C", "Lightning", "Micro USB", "Wireless", "Magnético"],
};

// Mapeo de tipos de accesorio a palabras clave para búsqueda
export const keywordMap: Record<string, string[]> = {
  Cargadores: ["charger", "cargador", "carga", "power", "adaptador"],
  Cables: ["cable", "usb", "c-type", "lightning", "conector"],
  Fundas: ["case", "funda", "cover", "protector", "silicone"],
  "Protectores de pantalla": [
    "protector",
    "screen",
    "pantalla",
    "vidrio",
    "tempered",
    "glass",
  ],
  Correas: ["strap", "correa", "band", "banda", "pulsera", "bracelet"],
};
