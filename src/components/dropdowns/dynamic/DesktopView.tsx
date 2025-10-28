import type { FC } from "react";
import { MenuItemCard } from "./MenuItemCard";
import { CloseButton } from "@/components/navbar/components/CloseButton";
import type { MenuItem } from "./types";


type Props = {
  items: MenuItem[];
  categoryName: string;
  categoryCode?: string;
  onItemClick: (label: string, href: string) => void;
  loading?: boolean;
};

export const DesktopView: FC<Props> = ({ items, categoryName, categoryCode, onItemClick, loading = false }) => {
  // Si está cargando, mostrar skeleton
  if (loading) {
    return (
      <div
        className="w-full max-w-[1600px] mx-auto p-8 pl-24 pr-12 relative"
        role="status"
        aria-label="Cargando menús"
      >
        <CloseButton onClick={() => onItemClick("close", "")} />
        <div className="w-full">
          <div className="grid gap-4 grid-cols-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="w-full h-32 bg-gray-200 rounded-lg" />
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
