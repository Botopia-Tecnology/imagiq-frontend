/** *
 * Configuraciones y constantes para la sección Galaxy Buds
 */

import type { Category } from "../../components/CategorySlider";
import type { FilterConfig } from "../../components/FilterSidebar";
import smartphonesImg from "../../../../img/categorias/Smartphones.png";
import tabletasImg from "../../../../img/categorias/Tabletas.png";
import galaxyBudsImg from "../../../../img/categorias/galaxy_buds.png";
import galaxyWatchImg from "../../../../img/categorias/galaxy_watch.png";

// Categorías del slider (idénticas a la imagen)
export const budsCategories: Category[] = [
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
    href: "#galaxy-buds",
  },
];

// Configuración de filtros específica para Galaxy Buds
export const budsFilters: FilterConfig = {
  serie: [
    "Galaxy Buds Pro",
    "Galaxy Buds2 Pro",
    "Galaxy Buds FE",
    "Galaxy Buds Live",
  ],
  tipoAjuste: ["In-ear", "Semi abierto", "Abierto"],
  cancelacionRuido: ["ANC Activa", "ANC Pasiva", "Sin ANC"],
  resistenciaAgua: ["IPX4", "IPX5", "IPX7", "Sin resistencia"],
  conectividad: [
    "Bluetooth 5.0",
    "Bluetooth 5.1",
    "Bluetooth 5.2",
    "Bluetooth 5.3",
  ],
  caracteristicas: [
    "Carga inalámbrica",
    "Detección de uso",
    "Ecualización adaptable",
    "Audio 360",
    "Control táctil",
  ],
  rangoPrecio: [
    { label: "Menos de $200.000", min: 0, max: 200000 },
    { label: "$200.000 - $400.000", min: 200000, max: 400000 },
    { label: "$400.000 - $600.000", min: 400000, max: 600000 },
    { label: "Más de $600.000", min: 600000, max: Infinity },
  ],
  autonomiaBateria: ["4-6 horas", "6-8 horas", "8+ horas"],
  controlVoz: ["Bixby", "Google Assistant", "Alexa", "Múltiples"],
};
