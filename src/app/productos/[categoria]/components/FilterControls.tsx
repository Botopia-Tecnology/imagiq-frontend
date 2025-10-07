/**
 * 🎨 FILTER CONTROLS - Controles de filtrado y visualización
 */

"use client";

import { X } from "lucide-react";
import type { FilterState } from "../../components/FilterSidebar";

interface Props {
  readonly filters: FilterState;
  readonly onClearFilters: () => void;
  readonly clearAllFiltersText: string;
}

export default function FilterControls({ filters, onClearFilters, clearAllFiltersText }: Props) {
  const hasActiveFilters = Object.values(filters).some((arr) => arr && arr.length > 0);

  if (!hasActiveFilters) return null;

  return (
    <button
      onClick={onClearFilters}
      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      type="button"
    >
      <X className="w-4 h-4" />
      {clearAllFiltersText}
    </button>
  );
}
