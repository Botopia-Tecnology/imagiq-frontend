/**
 * 🔍 FILTER SIDEBAR COMPONENT - IMAGIQ ECOMMERCE
 *
 * Componente reutilizable de filtros con:
 * - Configuración dinámica de filtros
 * - Estado de filtros personalizable
 * - Diseño responsive
 * - Tracking de interacciones
 */

"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { posthogUtils } from "@/lib/posthogClient";

interface FilterOption {
  label: string;
  min?: number;
  max?: number;
}

interface FilterConfig {
  [key: string]: string[] | FilterOption[];
}

interface FilterState {
  [key: string]: string[];
}

interface FilterSidebarProps {
  filterConfig: FilterConfig;
  filters: FilterState;
  onFilterChange: (filterType: string, value: string, checked: boolean) => void;
  resultCount: number;
  expandedFilters?: Set<string>;
  onToggleFilter?: (filterKey: string) => void;
  className?: string;
  trackingPrefix?: string;
}

export default function FilterSidebar({
  filterConfig,
  filters,
  onFilterChange,
  resultCount,
  expandedFilters = new Set(["almacenamiento"]),
  onToggleFilter,
  className,
  trackingPrefix = "filter",
}: FilterSidebarProps) {
  const [internalExpandedFilters, setInternalExpandedFilters] =
    useState<Set<string>>(expandedFilters);

  const handleToggleFilter = (filterKey: string) => {
    if (onToggleFilter) {
      onToggleFilter(filterKey);
    } else {
      const newExpanded = new Set(internalExpandedFilters);
      if (newExpanded.has(filterKey)) {
        newExpanded.delete(filterKey);
      } else {
        newExpanded.add(filterKey);
      }
      setInternalExpandedFilters(newExpanded);
    }
  };

  const handleFilterChange = (
    filterType: string,
    value: string,
    checked: boolean
  ) => {
    onFilterChange(filterType, value, checked);

    posthogUtils.capture(`${trackingPrefix}_applied`, {
      filter_type: filterType,
      filter_value: value,
      action: checked ? "add" : "remove",
    });
  };

  const currentExpandedFilters = onToggleFilter
    ? expandedFilters
    : internalExpandedFilters;

  const formatFilterKey = (key: string) => {
    return key.replace(/([A-Z])/g, " $1").toLowerCase();
  };

  const isRangeFilter = (
    options: string[] | FilterOption[]
  ): options is FilterOption[] => {
    return (
      options.length > 0 &&
      typeof options[0] === "object" &&
      "label" in options[0]
    );
  };

  return (
    <div
      className={cn(
        "bg-[#D9D9D9] rounded-lg shadow-sm border border-gray-300 p-6",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-6">
        <SlidersHorizontal className="w-5 h-5 text-gray-700" />
        <h2 className="font-bold text-gray-900">Filtros</h2>
        <span className="text-sm text-gray-600">
          ({resultCount} resultados)
        </span>
      </div>

      {/* Filtros */}
      <div className="space-y-4">
        {Object.entries(filterConfig).map(([filterKey, options]) => (
          <div key={filterKey} className="border-b border-gray-100 pb-4">
            <button
              onClick={() => handleToggleFilter(filterKey)}
              className="w-full flex items-center justify-between py-2 text-left hover:bg-gray-200 rounded-md px-2 -mx-2 transition-colors duration-200"
            >
              <span className="font-medium text-gray-900 capitalize">
                {formatFilterKey(filterKey)}
              </span>
              {currentExpandedFilters.has(filterKey) ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>

            {currentExpandedFilters.has(filterKey) && (
              <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                {isRangeFilter(options)
                  ? // Manejo para filtros de rango (precio, etc.)
                    options.map((range, index) => (
                      <label
                        key={`${filterKey}-${index}`}
                        className="flex items-center hover:bg-gray-200 rounded-md px-2 py-1 transition-colors duration-200"
                      >
                        <input
                          type="checkbox"
                          checked={
                            filters[filterKey]?.includes(range.label) || false
                          }
                          onChange={(e) =>
                            handleFilterChange(
                              filterKey,
                              range.label,
                              e.target.checked
                            )
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {range.label}
                        </span>
                      </label>
                    ))
                  : // Manejo para filtros simples de string
                    (options as string[]).map((option) => (
                      <label
                        key={`${filterKey}-${option}`}
                        className="flex items-center hover:bg-gray-200 rounded-md px-2 py-1 transition-colors duration-200"
                      >
                        <input
                          type="checkbox"
                          checked={
                            filters[filterKey]?.includes(option) || false
                          }
                          onChange={(e) =>
                            handleFilterChange(
                              filterKey,
                              option,
                              e.target.checked
                            )
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {option}
                        </span>
                      </label>
                    ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Mobile Filter Modal Component
interface MobileFilterModalProps extends FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileFilterModal({
  isOpen,
  onClose,
  ...filterProps
}: MobileFilterModalProps) {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50 bg-black/50">
      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Filtros</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <FilterSidebar
            {...filterProps}
            className="bg-white border-0 p-0 shadow-none"
          />
        </div>
      </div>
    </div>
  );
}

export type { FilterConfig, FilterState, FilterSidebarProps };
