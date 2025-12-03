/**
 * Componente principal que renderiza una sección de filtro dinámico
 * Detecta el displayType y renderiza el componente apropiado
 */

"use client";

import FilterCheckbox from "./filters/FilterCheckbox";
import FilterRadio from "./filters/FilterRadio";
import FilterRange from "./filters/FilterRange";
import FilterSlider from "./filters/FilterSlider";
import type { DynamicFilterConfig, DynamicFilterState } from "@/types/filters";

interface DynamicFilterSectionProps {
  filter: DynamicFilterConfig;
  filterState: DynamicFilterState;
  onFilterChange: (
    filterId: string,
    value: string | { min?: number; max?: number; ranges?: string[]; values?: string[] },
    checked?: boolean
  ) => void;
}

export default function DynamicFilterSection({
  filter,
  filterState,
  onFilterChange,
}: DynamicFilterSectionProps) {
  const state = filterState[filter.id] || {};

  const handleCheckboxChange = (value: string, checked: boolean) => {
    const currentValues = state.values || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);

    onFilterChange(filter.id, { values: newValues }, checked);
  };

  const handleRadioChange = (value: string) => {
    onFilterChange(filter.id, { values: [value] }, true);
  };

  const handleRangeChange = (rangeLabel: string, checked: boolean) => {
    const currentRanges = state.ranges || [];
    const newRanges = checked
      ? [...currentRanges, rangeLabel]
      : currentRanges.filter((r) => r !== rangeLabel);

    onFilterChange(filter.id, { ranges: newRanges }, checked);
  };

  const handleSliderChange = (min: number | null, max: number | null) => {
    onFilterChange(filter.id, {
      min: min ?? undefined,
      max: max ?? undefined,
    }, true);
  };

  // Renderizar según el displayType
  switch (filter.displayType) {
    case "checkbox":
      return (
        <FilterCheckbox
          filter={filter}
          selectedValues={state.values || []}
          onValueChange={handleCheckboxChange}
        />
      );

    case "radio":
      return (
        <FilterRadio
          filter={filter}
          selectedValue={state.values?.[0] || null}
          onValueChange={handleRadioChange}
        />
      );

    case "range":
      // Range puede ser rangos predefinidos o slider
      // Si hay rangos en valueConfig, usar FilterRange
      // Si no, usar FilterSlider
      if (
        (filter.valueConfig.type === "manual" &&
          filter.valueConfig.ranges &&
          filter.valueConfig.ranges.length > 0) ||
        (filter.valueConfig.type === "mixed" &&
          filter.valueConfig.ranges &&
          filter.valueConfig.ranges.length > 0)
      ) {
        return (
          <FilterRange
            filter={filter}
            selectedRanges={state.ranges || []}
            onRangeChange={handleRangeChange}
          />
        );
      } else {
        // Fallback a slider si no hay rangos predefinidos
        return (
          <FilterSlider
            filter={filter}
            minValue={state.min ?? null}
            maxValue={state.max ?? null}
            onRangeChange={handleSliderChange}
          />
        );
      }

    case "slider":
      return (
        <FilterSlider
          filter={filter}
          minValue={state.min ?? null}
          maxValue={state.max ?? null}
          onRangeChange={handleSliderChange}
        />
      );

    case "list":
      // List se comporta como checkbox
      return (
        <FilterCheckbox
          filter={filter}
          selectedValues={state.values || []}
          onValueChange={handleCheckboxChange}
        />
      );

    default:
      console.warn(`Unknown displayType: ${filter.displayType} for filter ${filter.id}`);
      return null;
  }
}

