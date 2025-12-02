/**
 * 📱 MOBILE FILTER SIDEBAR - Sidebar móvil con filtros
 */

"use client";

import { X } from "lucide-react";
import FilterSidebar, { type FilterState, type FilterConfig } from "../../components/FilterSidebar";
import type { DynamicFilterConfig, DynamicFilterState } from "@/types/filters";

interface Props {
  readonly show: boolean;
  readonly onClose: () => void;
  // Filtros estáticos (legacy)
  readonly filterConfig?: FilterConfig;
  readonly filters?: FilterState;
  readonly onFilterChange?: (filterType: string, value: string, checked: boolean) => void;
  // Filtros dinámicos (nuevo)
  readonly dynamicFilters?: DynamicFilterConfig[];
  readonly dynamicFilterState?: DynamicFilterState;
  readonly onDynamicFilterChange?: (
    filterId: string,
    value: string | { min?: number; max?: number; ranges?: string[]; values?: string[] },
    checked?: boolean
  ) => void;
  // Props comunes
  readonly expandedFilters?: Set<string>;
  readonly onToggleFilter?: (filterKey: string) => void;
  readonly resultCount: number;
}

export default function MobileFilterSidebar({
  show,
  onClose,
  // Filtros estáticos
  filterConfig,
  filters,
  onFilterChange,
  // Filtros dinámicos
  dynamicFilters,
  dynamicFilterState,
  onDynamicFilterChange,
  // Props comunes
  expandedFilters,
  onToggleFilter,
  resultCount,
}: Props) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <button
        type="button"
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Cerrar filtros"
      />
      <div className="relative bg-white w-full max-w-sm h-full overflow-y-auto">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Filtros</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <FilterSidebar
            // Filtros estáticos
            filterConfig={filterConfig}
            filters={filters}
            onFilterChange={onFilterChange}
            // Filtros dinámicos
            dynamicFilters={dynamicFilters}
            dynamicFilterState={dynamicFilterState}
            onDynamicFilterChange={onDynamicFilterChange}
            // Props comunes
            expandedFilters={expandedFilters}
            onToggleFilter={onToggleFilter}
            resultCount={resultCount}
          />
        </div>
      </div>
    </div>
  );
}
