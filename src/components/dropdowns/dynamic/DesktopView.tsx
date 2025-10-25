import type { FC } from "react";
import { MenuItemCard } from "./MenuItemCard";
import { CloseButton } from "@/components/navbar/components/CloseButton";
import type { MenuItem } from "./types";


type Props = {
  items: MenuItem[];
  categoryName: string;
  categoryCode?: string;
  onItemClick: (label: string, href: string) => void;
};

export const DesktopView: FC<Props> = ({ items, categoryName, categoryCode, onItemClick }) => {
  // Filtrar solo items activos
  const activeItems = items.filter(item => item.activo);


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
