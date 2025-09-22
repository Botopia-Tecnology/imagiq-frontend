/**
 * TABLETS CONSTANTS
 *
 * Configuraciones y constantes para la sección Tablets
 */

import type { Category } from "../../components/CategorySlider";
import type { FilterConfig } from "../../components/FilterSidebar";
import smartphonesImg from "../../../../img/categorias/Smartphones.png";
import tabletasImg from "../../../../img/categorias/Tabletas.png";
import galaxyBudsImg from "../../../../img/categorias/galaxy_buds.png";
import galaxyWatchImg from "../../../../img/categorias/galaxy_watch.png";

// Categorías del slider
export const tabletCategories: Category[] = [
  {
    id: "galaxy-smartphone",
    name: "Galaxy",
    subtitle: "Smartphone",
    image: smartphonesImg,
    href: "?section=smartphones",
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

// Configuración de filtros específica para tabletas
export const tabletFilters: FilterConfig = {
  serie: ["Galaxy Tab S", "Galaxy Tab A", "Galaxy Tab Active"],
  pantalla: ['8"', '10.1"', '10.4"', '11"', '12.4"'],
  almacenamiento: ["32GB", "64GB", "128GB", "256GB", "512GB"],
  conectividad: ["Wi-Fi", "LTE", "5G"],
  caracteristicas: [
    "S Pen",
    "Carga rápida",
    "Resistente al agua",
    "Carga inalámbrica",
    "Dual SIM",
  ],
  rangoPrecio: [
    { label: "Menos de $500.000", min: 0, max: 500000 },
    { label: "$500.000 - $1.000.000", min: 500000, max: 1000000 },
    { label: "$1.000.000 - $2.000.000", min: 1000000, max: 2000000 },
    { label: "Más de $2.000.000", min: 2000000, max: Infinity },
  ],
  uso: ["Productividad", "Gaming", "Educación", "Entretenimiento"],
};
