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

  const handleCheckboxChange = (label: string, checked: boolean) => {
    // Para modo per-value, almacenamos labels en lugar de values para identificar opciones únicas
    // Para modo column, almacenamos values directamente
    const isPerValueMode = filter.operatorMode === "per-value";
    
    if (isPerValueMode) {
      // En modo per-value, almacenar labels para identificar opciones únicas
      const currentLabels = state.values || []; // Reutilizamos values para almacenar labels
      const newLabels = checked
        ? [...currentLabels, label]
        : currentLabels.filter((l) => l !== label);
      
      onFilterChange(filter.id, { values: newLabels }, checked);
    } else {
      // En modo column, encontrar el value correspondiente al label y almacenarlo
      const { valueConfig } = filter;
      let valueToStore: string | null = null;
      
      if (valueConfig.type === "manual" && valueConfig.values) {
        const option = valueConfig.values.find(item => (item.label || item.value) === label);
        valueToStore = option?.value || null;
      } else if (valueConfig.type === "mixed" && valueConfig.manualValues) {
        const option = valueConfig.manualValues.find(item => (item.label || item.value) === label);
        valueToStore = option?.value || null;
      } else if (valueConfig.type === "dynamic" && valueConfig.selectedValues) {
        // Para dinámicos, el label es igual al value
        const option = valueConfig.selectedValues.find(item => item.value === label);
        valueToStore = option?.value || null;
      }
      
      if (!valueToStore) {
        // Si no encontramos el value, usar el label como fallback (para compatibilidad)
        valueToStore = label;
      }
      
      const currentValues = state.values || [];
      const newValues = checked
        ? [...currentValues, valueToStore]
        : currentValues.filter((v) => v !== valueToStore);

      onFilterChange(filter.id, { values: newValues }, checked);
    }
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
      // Para modo per-value, state.values contiene labels; para modo column, contiene values
      // FilterCheckbox espera labels, así que pasamos state.values directamente
      // (ya que en per-value son labels, y en column los values coinciden con labels para dinámicos)
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

