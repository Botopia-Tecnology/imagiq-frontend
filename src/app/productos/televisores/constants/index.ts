// Importar imágenes del slider
import crystalUhdImg from "../../../img/categorias/Tv_Monitores.png";
import qledImg from "../../../img/categorias/Tv_Monitores.png";
import smartTvImg from "../../../img/categorias/Tv_Monitores.png";
import barrasSonidoImg from "../../../img/categorias/Tv_Monitores.png";
import { Category } from "../../components/CategorySlider";
export const smartTvCategories: Category[] = [
  {
    id: "smart-tv",
    name: "Smart",
    subtitle: "TV",
    image: smartTvImg,
    href: "#smart-tv",
  },
  {
    id: "qled-tv",
    name: "QLED",
    subtitle: "TV",
    image: qledImg,
    href: "/productos/televisores?section=qled-tv",
  },
  {
    id: "crystal-uhd-tv",
    name: "Crystal",
    subtitle: "UHD TV",
    image: crystalUhdImg,
    href: "/productos/televisores?section=crystal-uhd",
  },
];

export const audioCategories: Category[] = [
  {
    id: "barras-sonido",
    name: "Barras",
    subtitle: "Sonido",
    image: barrasSonidoImg,
    href: "/productos/televisores?section=barras-sonido",
  },
];
