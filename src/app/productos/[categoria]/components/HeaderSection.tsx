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
    <div className="bg-white py-2">
      <div className="max-w-7xl">
        {/* Header principal - Ahora vacío porque los filtros están como píldoras */}
        <div className="flex items-center justify-between gap-4 mb-2">
          {/* Espacio reservado para futuro contenido */}
        </div>
      </div>
    </div>
  );
}
