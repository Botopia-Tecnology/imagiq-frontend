import { Category } from "../../components/CategorySlider";
import { FilterState } from "../../components/FilterSidebar";
import { accessoryFilters } from "../../dispositivos-moviles/constants/accesoriosConstants";
import { budsCategories } from "../../dispositivos-moviles/constants/galaxyBudsConstants";
import { deviceCategories } from "../../dispositivos-moviles/constants/sharedCategories";
import { smartphoneFilters } from "../../dispositivos-moviles/constants/smartphonesConstants";
import { tabletFilters } from "../../dispositivos-moviles/constants/tabletsConstants";
import { watchFilters } from "../../dispositivos-moviles/constants/watchesConstants";
import { smartTvCategories } from "../../televisores/constants";

export type CategoriaParams = "dispositivos-moviles" | "televisores" | "electrodomesticos" | "monitores" | "audio" | "ofertas";

export type Seccion =
  // Dispositivos moviles
  | "smartphones"
  | "tabletas"
  | "relojes"
  | "buds"
  | "accesorios"
  // TV
  | "crystal-uhd"
  | "neo-qled"
  | "oled"
  | "proyectores"
  | "qled"
  | "smart-tv"
  | "the-frame"
  | "dispositivo-audio"
  // Audio
  | "barras-sonido"
  | "sistemas"
  // Electrodomesticos
  | "neveras"
  | "refrigeradores"
  | "lavadoras"
  | "lavadoras-secadoras"
  | "lavadoras-y-secadoras"
  | "lavavajillas"
  | "aire-acondicionado"
  | "aires-acondicionados"
  | "microondas"
  | "hornos-microondas"
  | "aspiradoras"
  | "hornos"
  // Monitores
  | "corporativo"
  | "essential-monitor"
  | "odyssey-gaming"
  | "viewfinity-high-resolution"
  // Ofertas
  | "tv-monitores-audio"
  | "smartphones-tablets"
  | "electrodomesticos";

interface Config {
  secciones: Seccion[];
  filtros: Record<string, FilterState>;
  subcategorias: Category[];
  default: Seccion;
}


export const CATEGORIA_CONFIG: Record<CategoriaParams, Config> = {
  moviles: {
    secciones: ["smartphones", "tabletas", "relojes", "buds", "accesorios"],
    filtros: {
      smarthphones:smartphoneFilters,
      tabletas: tabletFilters,
      relojes: watchFilters,
      buds: budsCategories,
      accesorios: accessoryFilters,
    },
    subcategorias: deviceCategories,
    default: "smartphones",
  },
  tvs: {
    secciones: ["smart-tv", "qled", "crystal-uhd"],
    filtros: {
      "smart-tv": {},
      qled: {},
      "crystal-uhd": {},
    },
    subcategorias: smartTvCategories,
    default: "smart-tv",
  },
};
