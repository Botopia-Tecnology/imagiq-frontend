/** *
 * Categorías centralizadas del CategorySlider para todas las secciones
 * de dispositivos móviles. Único punto de verdad para mantener
 * consistencia en todas las pantallas.
 */

import type { Category } from "../../components/CategorySlider";
import smartphonesImg from "../../../../img/categorias/Smartphones.png";
import tabletasImg from "../../../../img/categorias/Tabletas.png";
import galaxyBudsImg from "../../../../img/categorias/galaxy_buds.png";
import galaxyWatchImg from "../../../../img/categorias/galaxy_watch.png";
import accesoriosImg from "../../../../img/categorias/accesorios.png";

// Categorías centralizadas del slider para dispositivos móviles
export const deviceCategories: Category[] = [
  {
    id: "galaxy-smartphone",
    name: "Galaxy",
    subtitle: "Smartphone",
    image: smartphonesImg,
    href: "/productos/dispositivos-moviles?seccion=smartphones",
  },
  {
    id: "galaxy-watch",
    name: "Galaxy",
    subtitle: "Watch",
    image: galaxyWatchImg,
    href: "/productos/dispositivos-moviles?seccion=relojes",
  },
  {
    id: "galaxy-tab",
    name: "Galaxy",
    subtitle: "Tab",
    image: tabletasImg,
    href: "/productos/dispositivos-moviles?seccion=tabletas",
  },
  {
    id: "galaxy-buds",
    name: "Galaxy",
    subtitle: "Buds",
    image: galaxyBudsImg,
    href: "/productos/dispositivos-moviles?seccion=buds",
  },
  {
    id: "accesorios",
    name: "Accesorios",
    subtitle: "",
    image: accesoriosImg,
    href: "/productos/dispositivos-moviles?seccion=accesorios",
  },
];
