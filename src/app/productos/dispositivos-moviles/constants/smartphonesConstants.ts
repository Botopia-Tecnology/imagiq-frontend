/**
 * SMARTPHONES CONSTANTS
 *
 * Configuraciones y constantes para la sección Smartphones
 */

import type { Category } from "../../components/CategorySlider";
import type { FilterConfig } from "../../components/FilterSidebar";
import smartphonesImg from "../../../../img/categorias/Smartphones.png";
import tabletasImg from "../../../../img/categorias/Tabletas.png";
import galaxyBudsImg from "../../../../img/categorias/galaxy_buds.png";
import galaxyWatchImg from "../../../../img/categorias/galaxy_watch.png";

// Categorías del slider
export const smartphoneCategories: Category[] = [
  {
    id: "galaxy-smartphone",
    name: "Galaxy",
    subtitle: "Smartphone",
    image: smartphonesImg,
    href: "#galaxy-smartphone",
  },
  {
    id: "galaxy-watch",
    name: "Galaxy",
    subtitle: "Watch",
    image: galaxyWatchImg,
    href: "?section=relojes",
  },
  {
    id: "galaxy-tab",
    name: "Galaxy",
    subtitle: "Tab",
    image: tabletasImg,
    href: "?section=tabletas",
  },
  {
    id: "galaxy-buds",
    name: "Galaxy",
    subtitle: "Buds",
    image: galaxyBudsImg,
    href: "?section=buds",
  },
];

// Configuración de filtros específica para smartphones
export const smartphoneFilters: FilterConfig = {
  almacenamiento: ["64GB", "128GB", "256GB", "512GB", "1TB"],
  caracteristicas: [
    "5G",
    "Carga rápida",
    "Resistente al agua",
    "Carga inalámbrica",
    "NFC",
    "Dual SIM",
  ],
  camara: ["12MP", "50MP", "64MP", "108MP", "200MP"],
  rangoPrecio: [
    { label: "Menos de $500.000", min: 0, max: 500000 },
    { label: "$500.000 - $1.000.000", min: 500000, max: 1000000 },
    { label: "$1.000.000 - $2.000.000", min: 1000000, max: 2000000 },
    { label: "Más de $2.000.000", min: 2000000, max: Infinity },
  ],
  serie: ["Galaxy A", "Galaxy S", "Galaxy Note", "Galaxy Z"],
  pantalla: ['5.5"', '6.1"', '6.5"', '6.7"', '6.8"'],
  procesador: ["Exynos", "Snapdragon", "MediaTek"],
  ram: ["4GB", "6GB", "8GB", "12GB", "16GB"],
  conectividad: ["4G", "5G"],
};
