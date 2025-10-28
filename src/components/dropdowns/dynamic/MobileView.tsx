import type { FC } from "react";
import Link from "next/link";
import type { MenuItem } from "./types";

type Props = {
  items: MenuItem[];
  categoryName: string;
  onItemClick: (label: string, href: string) => void;
  loading?: boolean;
};

export const MobileView: FC<Props> = ({ items, categoryName, onItemClick, loading = false }) => {
  // Si está cargando, mostrar skeleton
  if (loading) {
    return (
      <div className="p-4">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
              <div className="w-12 h-12 flex-shrink-0 bg-gray-200 rounded" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Filtrar solo items activos
  const activeItems = items.filter(item => item.activo);

  if (activeItems.length === 0) {
    return (
      <div className="p-4">
        <p className="text-center py-8 text-gray-500">
          No hay menús disponibles para esta categoría
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <nav aria-label={categoryName}>
        <ul className="space-y-2">
          {activeItems.map((item) => (
            <li key={item.uuid}>
              <Link
                href={item.href}
                onClick={() => onItemClick(item.name, item.href)}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {item.imageSrc && (
                  <div className="w-12 h-12 flex-shrink-0">
                    <img
                      src={item.imageSrc}
                      alt={item.imageAlt || item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <span className="text-base font-semibold text-gray-900">
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
