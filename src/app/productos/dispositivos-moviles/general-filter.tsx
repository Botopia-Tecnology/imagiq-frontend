import React, { useState } from "react";

// Tipos para mayor claridad y autocompletado
type FilterConfig = {
  [filterType: string]: {
    label: string;
    options: string[];
    default?: string[];
  };
};

type GeneralFilterSidebarProps = {
  config: FilterConfig;
  filters: { [filterType: string]: string[] };
  onFilterChange: (filterType: string, value: string, checked: boolean) => void;
};

export function useGeneralFilters(config: FilterConfig) {
  const initialFilters = Object.fromEntries(
    Object.entries(config).map(([type, { default: def }]) => [type, def || []])
  );
  const [filters, setFilters] = useState<{ [filterType: string]: string[] }>(initialFilters);

  const handleFilterChange = (filterType: string, value: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: checked
        ? [...(prev[filterType] || []), value]
        : (prev[filterType] || []).filter((item) => item !== value),
    }));
  };

  const resetFilters = () => setFilters(initialFilters);

  return { filters, handleFilterChange, resetFilters, setFilters };
}

export default function GeneralFilterSidebar({
  config,
  filters,
  onFilterChange,
}: GeneralFilterSidebarProps) {
  return (
    <aside className="filter-sidebar">
      {Object.entries(config).map(([filterType, { label, options }]) => (
        <div key={filterType} className="filter-group">
          <h4>{label}</h4>
          {options.map((option) => (
            <label key={option} style={{ display: "block" }}>
              <input
                type="checkbox"
                checked={filters[filterType]?.includes(option) || false}
                onChange={(e) =>
                  onFilterChange(filterType, option, e.target.checked)
                }
              />
              {option}
            </label>
          ))}
        </div>
      ))}
    </aside>
  );
}