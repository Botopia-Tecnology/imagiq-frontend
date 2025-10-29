import { Category } from "../../components/CategorySlider";
import { FilterState } from "../../components/FilterSidebar";
import { accessoryFilters } from "../../dispositivos-moviles/constants/accesoriosConstants";
import { budsCategories } from "../../dispositivos-moviles/constants/galaxyBudsConstants";
import { deviceCategories } from "../../dispositivos-moviles/constants/sharedCategories";
import { smartphoneFilters } from "../../dispositivos-moviles/constants/smartphonesConstants";
import { tabletFilters } from "../../dispositivos-moviles/constants/tabletsConstants";
import { watchFilters } from "../../dispositivos-moviles/constants/watchesConstants";
import { smartTvCategories } from "../../televisores/constants";

// Ahora es dinámico: cualquier string es válido
export type CategoriaParams = string;

// Ahora es dinámico: cualquier string es válido
export type Seccion = string;

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
