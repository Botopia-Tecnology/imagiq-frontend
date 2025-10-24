import type { FC } from "react";
import { MenuItemCard } from "./MenuItemCard";
import { CloseButton } from "@/components/navbar/components/CloseButton";
import type { MenuItem } from "./types";

// Importar PROMOS de cada categoría
// import { PROMOS as ofertasPromos } from "@/components/dropdowns/ofertas/constants";
// import { PROMOS as movilesPromos } from "@/components/dropdowns/dispositivos_moviles/constants";
// import { PROMOS as electrodomesticosPromos } from "@/components/dropdowns/electrodomesticos/constants";
// import { PROMOS as televisoresPromos } from "@/components/dropdowns/televisores/constants";
// import { PROMOS as monitoresPromos } from "@/components/dropdowns/monitores/constants";

type Props = {
  items: MenuItem[];
  categoryName: string;
  categoryCode?: string;
  onItemClick: (label: string, href: string) => void;
};

export const DesktopView: FC<Props> = ({ items, categoryName, categoryCode, onItemClick }) => {
  // Filtrar solo items activos
  const activeItems = items.filter(item => item.activo);

  // // Obtener los PROMOS según el código de categoría
  // const getPromosForCategory = (categoryCode?: string) => {
  //   switch (categoryCode) {
  //     case "IM":
  //       return movilesPromos;
  //     case "AV":
  //       return televisoresPromos;
  //     case "DA":
  //       return electrodomesticosPromos;
  //     case "IT":
  //       return monitoresPromos;
  //     case "ofertas":
  //       return ofertasPromos;
  //     default:
  //       return [];
  //   }
  // };

  // const promos = getPromosForCategory(categoryCode);

  if (activeItems.length === 0) {
    return (
      <div
        className="w-full max-w-[1600px] mx-auto p-8 pl-24 pr-12 relative"
        role="menu"
        aria-label={categoryName}
      >
        <CloseButton onClick={() => onItemClick("close", "")} />
        <div className="text-center py-8 text-gray-500">
          No hay menús disponibles para esta categoría
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-[1600px] mx-auto p-8 pl-24 pr-12 relative"
      role="menu"
      aria-label={categoryName}
    >
      <CloseButton onClick={() => onItemClick("close", "")} />

      <div className="w-full">
        <ul className={`grid gap-4 ${activeItems.length <= 4 ? 'grid-cols-4' : 'grid-cols-5'}`}>
          {activeItems.map((item) => (
            <MenuItemCard key={item.uuid} item={item} onClick={onItemClick} />
          ))}
        </ul>
      </div>

    </div>
  );
};
