/**
 *
 * Header genérico con filtros, ordenamiento y vista para todas las categorías
 */

import { cn } from "@/lib/utils";
import { Filter, Grid3X3, List } from "lucide-react";
import SortDropdown from "@/components/ui/SortDropdown";

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
  clearAllFiltersText: string; // Texto completo para el botón de limpiar filtros
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
  clearAllFiltersText,
}: HeaderSectionProps) {
  const hasActiveFilters =
    filters &&
    Object.values(filters).some((filterArray) => filterArray.length > 0);

  const clearAllFilters = () => {
    if (setFilters && filters) {
      const clearedFilters: FilterState = {};
      Object.keys(filters).forEach((key) => {
        clearedFilters[key] = [];
      });
      setFilters(clearedFilters);
    }
  };

  return (
    <div className="bg-white py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header principal */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {title}
            </h1>
            <span className="text-sm text-gray-500 font-medium">
              {totalItems} resultados
            </span>
            {hasActiveFilters && setFilters && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2 hover:underline-offset-4 transition-all duration-200 self-start sm:self-auto"
              >
                {clearAllFiltersText}
              </button>
            )}
          </div>
        </div>

        {/* Controles de filtros y vista */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onShowMobileFilters}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 text-sm font-medium text-gray-700 transition-colors duration-200 shadow-sm"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>

          <div className="flex items-center gap-3">
            <SortDropdown
              value={sortBy}
              onChange={setSortBy}
            />

            <div className="flex border border-gray-300 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2.5 transition-all duration-200",
                  viewMode === "grid"
                    ? "bg-blue-600 text-white shadow-inner"
                    : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                )}
                title="Vista en cuadrícula"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2.5 border-l border-gray-300 transition-all duration-200",
                  viewMode === "list"
                    ? "bg-blue-600 text-white shadow-inner"
                    : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                )}
                title="Vista en lista"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
