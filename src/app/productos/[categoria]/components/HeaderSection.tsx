/**
 *
 * Header genérico con filtros, ordenamiento y vista para todas las categorías
 */

import { cn } from "@/lib/utils";
import { Filter, Grid3X3, List } from "lucide-react";
import SortDropdown from "@/components/ui/SortDropdown";

import type { DynamicFilterState } from "@/types/filters";

interface HeaderSectionProps {
  title: string;
  totalItems: number;
  sortBy: string;
  setSortBy: (value: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  onShowMobileFilters: () => void;
  dynamicFilterState?: DynamicFilterState;
  onClearDynamicFilters?: () => void;
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
  dynamicFilterState,
  onClearDynamicFilters,
  clearAllFiltersText,
}: HeaderSectionProps) {
  const hasActiveFilters =
    dynamicFilterState &&
    Object.values(dynamicFilterState).some((state) => {
      if (state.values && state.values.length > 0) return true;
      if (state.ranges && state.ranges.length > 0) return true;
      if (state.min !== undefined || state.max !== undefined) return true;
      return false;
    });

  const clearAllFilters = () => {
    if (onClearDynamicFilters) {
      onClearDynamicFilters();
    }
  };

  return (
    <div className="bg-white py-4 sm:py-6">
      <div className="max-w-7xl">
        {/* Header principal */}
        <div className="flex items-center justify-between gap-4 mb-6">
          {/* Botón de filtros móvil - ahora a la derecha del título */}
          <button
            onClick={onShowMobileFilters}
            className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 bg-white rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors duration-200 shadow-sm flex-shrink-0"
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </div>
      </div>
    </div>
  );
}
