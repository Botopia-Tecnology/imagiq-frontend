import type { FC } from "react";
import { MenuItemCard } from "./MenuItemCard";
import { CloseButton } from "@/components/navbar/components/CloseButton";
import type { MenuItem } from "./types";

// Importar PROMOS de cada categoría
import { PROMOS as ofertasPromos } from "@/components/dropdowns/ofertas/constants";
import { PROMOS as movilesPromos } from "@/components/dropdowns/dispositivos_moviles/constants";
import { PROMOS as electrodomesticosPromos } from "@/components/dropdowns/electrodomesticos/constants";
import { PROMOS as televisoresPromos } from "@/components/dropdowns/televisores/constants";
import { PROMOS as monitoresPromos } from "@/components/dropdowns/monitores/constants";

type Props = {
  items: MenuItem[];
  categoryName: string;
  categoryCode?: string;
  onItemClick: (label: string, href: string) => void;
};

export const DesktopView: FC<Props> = ({ items, categoryName, categoryCode, onItemClick }) => {
  // Filtrar solo items activos
  const activeItems = items.filter(item => item.activo);

  // Obtener los PROMOS según el código de categoría
  const getPromosForCategory = (categoryCode?: string) => {
    switch (categoryCode) {
      case "IM":
        return movilesPromos;
      case "AV":
        return televisoresPromos;
      case "DA":
        return electrodomesticosPromos;
      case "IT":
        return monitoresPromos;
      case "ofertas":
        return ofertasPromos;
      default:
        return [];
    }
  };

  const promos = getPromosForCategory(categoryCode);

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
      className="w-full max-w-[1600px] mx-auto p-8 pl-24 pr-12 flex gap-16 relative"
      role="menu"
      aria-label={categoryName}
    >
      <CloseButton onClick={() => onItemClick("close", "")} />

      <div className="flex-1">
        <ul className={`grid gap-4 ${activeItems.length <= 4 ? 'grid-cols-4' : 'grid-cols-5'} w-3/4`}>
          {activeItems.map((item) => (
            <MenuItemCard key={item.uuid} item={item} onClick={onItemClick} />
          ))}
        </ul>
      </div>

      {/* Sección de PROMOS - Solo mostrar si hay promos disponibles */}
      {promos.length > 0 && (
        <div className="flex-shrink-0 flex gap-6 items-start">
          <div className="w-px bg-gray-200 h-full" aria-hidden />
          <div className="w-[370px]">
            <div className="grid grid-cols-2 gap-2.5">
              {promos.map((promo) => (
                <a
                  key={promo.title}
                  href={promo.href}
                  onClick={() => onItemClick(promo.title, promo.href)}
                  className="flex items-center gap-2.5 rounded-xl bg-gray-100 p-2.5 hover:bg-gray-200 active:bg-gray-300 transition min-h-[70px]"
                >
                  <div
                    className="flex-shrink-0 flex items-center justify-center"
                    style={{ width: 48, height: 48 }}
                  >
                    <img
                      src={promo.imageSrc}
                      alt={promo.imageAlt}
                      className="object-contain"
                      style={{ width: 32, height: 32 }}
                    />
                  </div>
                  <p className="text-[12px] font-extrabold text-gray-900 leading-tight break-words">
                    {promo.title}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
