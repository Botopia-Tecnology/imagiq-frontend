/** *
 * Configuraciones y constantes para la sección Relojes
 */

import type { Category } from "../../components/CategorySlider";
import type { FilterConfig } from "../../components/FilterSidebar";
import smartphonesImg from "../../../../img/categorias/Smartphones.png";
import tabletasImg from "../../../../img/categorias/Tabletas.png";
import galaxyBudsImg from "../../../../img/categorias/galaxy_buds.png";
import galaxyWatchImg from "../../../../img/categorias/galaxy_watch.png";

// Categorías del slider
export const watchCategories: Category[] = [
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

// Configuración de filtros específica para relojes
export const watchFilters: FilterConfig = {
  serie: ["Galaxy Watch", "Galaxy Watch Active", "Galaxy Watch Classic"],
  tamaño: ["40mm", "42mm", "43mm", "44mm", "45mm","46mm", "47mm"],
  //resistenciaAgua: ["5ATM", "10ATM", "IP68", "MIL-STD-810G"],
  //conectividad: ["Bluetooth", "LTE", "Wi-Fi"],
  /*
  caracteristicas: [
    "GPS",
    "Monitor de frecuencia cardíaca",
    "Monitor de sueño",
    "Resistente al agua",
    "Carga inalámbrica",
  ],
  */
  rangoPrecio: [
    { label: "Menos de $500.000", min: 0, max: 500000 },
    { label: "$500.000 - $1.000.000", min: 500000, max: 1000000 },
    { label: "$1.000.000 - $2.000.000", min: 1000000, max: 2000000 },
    { label: "Más de $2.000.000", min: 2000000, max: Infinity },
  ],
  //material: ["Aluminio", "Acero inoxidable", "Titanio"],
    color: ["Negro", "Plata", "Dorado", "Rosa", "Azul", "Morado"],
};
