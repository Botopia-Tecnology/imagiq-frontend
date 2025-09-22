/**
 * 🎧 GALAXY BUDS HEADER SECTION
 *
 * Header con filtros, ordenamiento y vista para Galaxy Buds
 */

import { cn } from "@/lib/utils";
import { Filter, Grid3X3, List } from "lucide-react";

interface FilterState {
  [key: string]: string[];
}

interface HeaderSectionProps {
  title: string;
  totalItems: number;
  sortBy: string;
  setSortBy: (value: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  onShowMobileFilters: () => void;
  filters?: FilterState;
  setFilters?: React.Dispatch<React.SetStateAction<FilterState>>;
}

export default function HeaderSection({
  title,
  totalItems,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  onShowMobileFilters,
  filters,
  setFilters,
}: HeaderSectionProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <span className="text-sm text-gray-500">{totalItems} resultados</span>
        {filters?.tipoAccesorio && filters.tipoAccesorio.length > 0 && setFilters && (
          <button
            onClick={() => setFilters({ ...filters, tipoAccesorio: [] })}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Ver todos los accesorios
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onShowMobileFilters}
          className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Filter className="w-4 h-4" />
          Filtros
        </button>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="relevancia">Relevancia</option>
          <option value="precio-menor">Precio: menor a mayor</option>
          <option value="precio-mayor">Precio: mayor a menor</option>
          <option value="nombre">Nombre A-Z</option>
          <option value="calificacion">Mejor calificados</option>
        </select>

        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-2",
              viewMode === "grid"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            )}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "p-2",
              viewMode === "list"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
