/**
 * 🔍 HORIZONTAL FILTERS COMPONENT - IMAGIQ ECOMMERCE
 *
 * Filtros horizontales estilo píldoras con dropdowns
 * - Diseño horizontal optimizado para espacio
 * - Dropdowns flotantes con opciones
 * - Indicador de filtros activos
 * - Animaciones suaves
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
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

interface HorizontalFiltersProps {
  filterConfig: FilterConfig;
  filters: FilterState;
  onFilterChange: (filterType: string, value: string, checked: boolean) => void;
  resultCount: number;
  className?: string;
  trackingPrefix?: string;
}

export default function HorizontalFilters({
  filterConfig,
  filters,
  onFilterChange,
  resultCount,
  className,
  trackingPrefix = "horizontal_filter",
}: HorizontalFiltersProps) {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const formatFilterKey = (key: string) => {
    const translations: { [key: string]: string } = {
      almacenamiento: "Almacenamiento",
      caracteristicas: "Características",
      camara: "Cámara",
      rangoPrecio: "Precio",
      serie: "Serie",
      pantalla: "Pantalla",
      procesador: "Procesador",
      ram: "RAM",
      conectividad: "Conectividad",
      tamanoCaja: "Tamaño",
      material: "Material",
      correa: "Correa",
      duracionBateria: "Batería",
      resistenciaAgua: "Resistencia",
      tipoAccesorio: "Tipo",
      compatibilidad: "Compatibilidad",
      color: "Color",
      marca: "Marca",
      tipoConector: "Conector",
    };
    return translations[key] || key.charAt(0).toUpperCase() + key.slice(1);
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

  const handleToggleDropdown = (filterKey: string) => {
    setOpenFilter(openFilter === filterKey ? null : filterKey);

    posthogUtils.capture(`${trackingPrefix}_toggle`, {
      filter_type: filterKey,
      action: openFilter === filterKey ? "close" : "open",
    });
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

  const getActiveFilterCount = (filterKey: string) => {
    return filters[filterKey]?.length || 0;
  };

  const getTotalActiveFilters = () => {
    return Object.values(filters).reduce(
      (total, filterArray) => total + filterArray.length,
      0
    );
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openFilter) {
        const isClickInside = Object.values(dropdownRefs.current).some(
          (ref) => ref?.contains(event.target as Node)
        );
        if (!isClickInside) {
          setOpenFilter(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openFilter]);

  const filterConfigWithColor = {
    ...filterConfig,
    color: filterConfig.color || [
      "Negro",
      "Blanco",
      "Azul",
      "Rojo",
      "Verde",
      "Gris",
      "Dorado",
      "Plateado",
      "Rosa",
      "Morado",
      "Amarillo",
      "Naranja",
    ],
  };

  return (
    <div className={cn("bg-white py-2", className)}>
      {/* Contador de resultados */}
      <div className="mb-2 flex items-center gap-2">
        <span className="text-sm text-gray-600">
          {resultCount} {resultCount === 1 ? "resultado" : "resultados"}
        </span>
        {getTotalActiveFilters() > 0 && (
          <span className="text-sm text-black font-medium">
            ({getTotalActiveFilters()} {getTotalActiveFilters() === 1 ? "filtro aplicado" : "filtros aplicados"})
          </span>
        )}
      </div>

      {/* Filtros horizontales - Scrolleables en mobile, wrapeables en desktop */}
      <div className="relative">
        {/* Scroll horizontal en mobile/tablet */}
        <div className="lg:hidden overflow-x-auto scrollbar-hide -mx-2 px-2">
          <div className="flex gap-2 pb-2 min-w-max">
            {Object.entries(filterConfigWithColor).map(([filterKey, options]) => {
              const activeCount = getActiveFilterCount(filterKey);
              const isOpen = openFilter === filterKey;

              return (
                <div
                  key={filterKey}
                  ref={(el) => {
                    dropdownRefs.current[filterKey] = el;
                  }}
                  className="relative flex-shrink-0"
                >
                  {/* Botón píldora */}
                  <button
                    onClick={() => handleToggleDropdown(filterKey)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-200 whitespace-nowrap",
                      "hover:border-gray-400 hover:bg-gray-50",
                      isOpen || activeCount > 0
                        ? "border-black bg-gray-100 text-black font-semibold"
                        : "border-gray-300 bg-white text-gray-700"
                    )}
                  >
                    <span className="text-sm">
                      {formatFilterKey(filterKey)}
                      {activeCount > 0 && ` (${activeCount})`}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {/* Dropdown */}
                  {isOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[240px] max-w-[320px] max-h-[400px] overflow-y-auto">
                      <div className="p-2">
                        {isRangeFilter(options)
                          ? options.map((range, index) => (
                              <label
                                key={`${filterKey}-${index}`}
                                className={cn(
                                  "flex items-center py-2 px-3 cursor-pointer rounded-md transition-all duration-200",
                                  "hover:bg-gray-100",
                                  filters[filterKey]?.includes(range.label) &&
                                    "bg-gray-100 font-semibold text-black"
                                )}
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    filters[filterKey]?.includes(range.label) ||
                                    false
                                  }
                                  onChange={(e) => {
                                    handleFilterChange(
                                      filterKey,
                                      range.label,
                                      e.target.checked
                                    );
                                    setOpenFilter(null);
                                  }}
                                  className="w-4 h-4 rounded border-gray-400 text-black focus:ring-gray-500 focus:ring-2"
                                />
                                <span className="ml-3 text-sm">
                                  {range.label}
                                </span>
                              </label>
                            ))
                          : (options as string[]).map((option) => (
                              <label
                                key={`${filterKey}-${option}`}
                                className={cn(
                                  "flex items-center py-2 px-3 cursor-pointer rounded-md transition-all duration-200",
                                  "hover:bg-gray-100",
                                  filters[filterKey]?.includes(option) &&
                                    "bg-gray-100 font-semibold text-black"
                                )}
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    filters[filterKey]?.includes(option) || false
                                  }
                                  onChange={(e) => {
                                    handleFilterChange(
                                      filterKey,
                                      option,
                                      e.target.checked
                                    );
                                    setOpenFilter(null);
                                  }}
                                  className="w-4 h-4 rounded border-gray-400 text-black focus:ring-gray-500 focus:ring-2"
                                />
                                <span className="ml-3 text-sm">
                                  {option}
                                </span>
                              </label>
                            ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Flex wrap en desktop */}
        <div className="hidden lg:flex flex-wrap gap-2">
        {Object.entries(filterConfigWithColor).map(([filterKey, options]) => {
          const activeCount = getActiveFilterCount(filterKey);
          const isOpen = openFilter === filterKey;

          return (
            <div
              key={filterKey}
              ref={(el) => {
                dropdownRefs.current[filterKey] = el;
              }}
              className="relative"
            >
              {/* Botón píldora */}
              <button
                onClick={() => handleToggleDropdown(filterKey)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-200",
                  "hover:border-gray-400 hover:bg-gray-50",
                  isOpen || activeCount > 0
                    ? "border-black bg-gray-100 text-black font-semibold"
                    : "border-gray-300 bg-white text-gray-700"
                )}
              >
                <span className="text-sm">
                  {formatFilterKey(filterKey)}
                  {activeCount > 0 && ` (${activeCount})`}
                </span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </button>

              {/* Dropdown */}
              {isOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[240px] max-w-[320px] max-h-[400px] overflow-y-auto">
                  <div className="p-2">
                    {isRangeFilter(options)
                      ? options.map((range, index) => (
                          <label
                            key={`${filterKey}-${index}`}
                            className={cn(
                              "flex items-center py-2 px-3 cursor-pointer rounded-md transition-all duration-200",
                              "hover:bg-gray-100",
                              filters[filterKey]?.includes(range.label) &&
                                "bg-gray-100 font-semibold text-black"
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={
                                filters[filterKey]?.includes(range.label) ||
                                false
                              }
                              onChange={(e) => {
                                handleFilterChange(
                                  filterKey,
                                  range.label,
                                  e.target.checked
                                );
                                setOpenFilter(null);
                              }}
                              className="w-4 h-4 rounded border-gray-400 text-black focus:ring-gray-500 focus:ring-2"
                            />
                            <span className="ml-3 text-sm">
                              {range.label}
                            </span>
                          </label>
                        ))
                      : (options as string[]).map((option) => (
                          <label
                            key={`${filterKey}-${option}`}
                            className={cn(
                              "flex items-center py-2 px-3 cursor-pointer rounded-md transition-all duration-200",
                              "hover:bg-gray-100",
                              filters[filterKey]?.includes(option) &&
                                "bg-gray-100 font-semibold text-black"
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={
                                filters[filterKey]?.includes(option) || false
                              }
                              onChange={(e) => {
                                handleFilterChange(
                                  filterKey,
                                  option,
                                  e.target.checked
                                );
                                setOpenFilter(null);
                              }}
                              className="w-4 h-4 rounded border-gray-400 text-black focus:ring-gray-500 focus:ring-2"
                            />
                            <span className="ml-3 text-sm">
                              {option}
                            </span>
                          </label>
                        ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        </div>
      </div>

      {/* Estilos para ocultar scrollbar */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export type { FilterConfig, FilterState, HorizontalFiltersProps };
