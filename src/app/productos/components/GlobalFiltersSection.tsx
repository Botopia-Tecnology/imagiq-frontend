/**
 * Sección de filtros globales que aparecen en todas las categorías
 *
 * Principio Open/Closed (OCP): Esta sección es extensible para agregar más
 * filtros globales sin modificar los filtros dinámicos existentes.
 *
 * Principio de segregación de interfaces (ISP): Props mínimas y específicas
 * para cada filtro global.
 *
 * @example
 * ```tsx
 * <GlobalFiltersSection
 *   isStockFilterEnabled={isStockFilterEnabled}
 *   onStockFilterChange={toggleStockFilter}
 * />
 * ```
 */
"use client";

import FilterToggle from "./filters/FilterToggle";

export interface GlobalFiltersSectionProps {
  /** Estado del filtro de stock */
  isStockFilterEnabled: boolean;
  /** Callback cuando cambia el filtro de stock */
  onStockFilterChange: (enabled: boolean) => void;
}

export default function GlobalFiltersSection({
  isStockFilterEnabled,
  onStockFilterChange,
}: GlobalFiltersSectionProps) {
  return (
    <div className="px-4 py-3 border-b border-gray-300 bg-gray-50/50">
      <FilterToggle
        id="stock-availability-filter"
        label="Solo con disponibilidad"
        description="Ocultar productos sin stock"
        checked={isStockFilterEnabled}
        onChange={onStockFilterChange}
      />
    </div>
  );
}
