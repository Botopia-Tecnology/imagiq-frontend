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
  readonly title: string;
  readonly totalItems: number;
  readonly sortBy: string;
  readonly setSortBy: (value: string) => void;
  readonly viewMode: "grid" | "list";
  readonly setViewMode: (mode: "grid" | "list") => void;
  readonly onShowMobileFilters: () => void;
  readonly filters?: FilterState;
  readonly setFilters?: React.Dispatch<React.SetStateAction<FilterState>>;
  readonly clearAllFiltersText: string; // Texto completo para el botón de limpiar filtros
  readonly isSearchMode?: boolean; // Indica si estamos en modo búsqueda
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
  isSearchMode = false,
}: HeaderSectionProps) {
  const hasActiveFilters =
    filters &&
    Object.values(filters).some((filterArray) => filterArray.length > 0);

  const clearAllFilters = () => {
    if (setFilters && filters) {
      const clearedFilters: FilterState = {};
      for (const key of Object.keys(filters)) {
        clearedFilters[key] = [];
      }
      setFilters(clearedFilters);
    }
  };

  // Si estamos en modo búsqueda, mostrar header simplificado
  if (isSearchMode) {
    return (
      <div className="bg-white py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {title}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {totalItems} {totalItems === 1 ? 'producto encontrado' : 'productos encontrados'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Header completo para categorías normales
  return (
    <div className="bg-white py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header principal */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {title}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
            </p>
          </div>

          {/* Controles de vista y ordenamiento */}
          <div className="flex items-center gap-3">
            {/* Dropdown de ordenamiento */}
            <SortDropdown
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: "precio-mayor", label: "Precio: Mayor a Menor" },
                { value: "precio-menor", label: "Precio: Menor a Mayor" },
                { value: "nombre", label: "Nombre A-Z" },
              ]}
            />

            {/* Botones de vista */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  viewMode === "grid"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  viewMode === "list"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Botón de filtros móvil */}
            <button
              onClick={onShowMobileFilters}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 bg-white rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors duration-200 shadow-sm flex-shrink-0"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>
        </div>

        {/* Filtros activos */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-600">Filtros activos:</span>
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {clearAllFiltersText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
