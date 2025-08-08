/**
 * 🔍 FILTER SIDEBAR COMPONENT - IMAGIQ ECOMMERCE
 *
 * Componente reutilizable de filtros con:
 * - Configuración dinámica de filtros
 * - Estado de filtros personalizable
 * - Diseño idéntico a la imagen (gris claro, minimalista)
 * - Animaciones suaves y fluidas
 * - Sin barras de scroll visibles
 * - Tracking de interacciones
 */

"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
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

    posthogUtils.capture(`${trackingPrefix}_toggle`, {
      filter_type: filterKey,
      action: (onToggleFilter ? expandedFilters : internalExpandedFilters).has(
        filterKey
      )
        ? "collapse"
        : "expand",
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
      total_active_filters: getTotalActiveFilters(),
    });
  };

  const currentExpandedFilters = onToggleFilter
    ? expandedFilters
    : internalExpandedFilters;

  const formatFilterKey = (key: string) => {
    const translations: { [key: string]: string } = {
      almacenamiento: "ALMACENAMIENTO",
      caracteristicas: "CARACTERÍSTICAS",
      camara: "CÁMARA",
      rangoPrecio: "RANGO DE PRECIOS",
      serie: "SERIE",
      pantalla: "PANTALLA",
      procesador: "PROCESADOR",
      ram: "MEMORIA RAM",
      conectividad: "CONECTIVIDAD",
      tamanoCaja: "TAMAÑO DE CAJA",
      material: "MATERIAL",
      correa: "CORREA",
      duracionBateria: "DURACIÓN DE BATERÍA",
      resistenciaAgua: "RESISTENCIA AL AGUA",
      tipoAccesorio: "TIPO DE ACCESORIO",
      compatibilidad: "COMPATIBILIDAD",
      color: "COLOR",
      marca: "MARCA",
      tipoConector: "TIPO DE CONECTOR",
    };
    return translations[key] || key.replace(/([A-Z])/g, " $1").toUpperCase();
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

  const getTotalActiveFilters = () => {
    return Object.values(filters).reduce(
      (total, filterArray) => total + filterArray.length,
      0
    );
  };

  return (
    <div
      className={cn(
        "bg-[#F5F5F5] rounded-none border-0 shadow-none",
        className
      )}
    >
      {/* Header simple como en la imagen */}
      <div className="p-4 border-b border-gray-300">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-black">Filtros</h2>
          <span className="text-sm text-gray-600">
            {resultCount} resultados
          </span>
        </div>
      </div>

      {/* Contenedor principal con scroll oculto */}
      <div className="overflow-hidden">
        {Object.entries(filterConfig).map(([filterKey, options]) => (
          <div key={filterKey} className="border-b border-gray-300">
            <button
              onClick={() => handleToggleFilter(filterKey)}
              className="w-full flex items-center justify-between py-4 px-4 text-left hover:bg-gray-100 transition-colors duration-200"
            >
              <span className="font-semibold text-black text-sm tracking-wide">
                {formatFilterKey(filterKey)}
              </span>
              <div className="transform transition-transform duration-300 ease-in-out">
                {currentExpandedFilters.has(filterKey) ? (
                  <ChevronUp className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                )}
              </div>
            </button>

            {/* Contenedor animado con altura dinámica */}
            <div
              className={cn(
                "overflow-hidden transition-all duration-500 ease-in-out",
                currentExpandedFilters.has(filterKey)
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0"
              )}
            >
              <div className="px-4 pb-4">
                {/* Contenedor con scroll personalizado oculto */}
                <div
                  className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {isRangeFilter(options)
                    ? // Manejo para filtros de rango (precio, etc.)
                      options.map((range, index) => (
                        <label
                          key={`${filterKey}-${index}`}
                          className={cn(
                            "flex items-center py-2 cursor-pointer rounded-md px-2 -mx-2 transition-all duration-300 ease-in-out",
                            "hover:bg-gray-100 hover:translate-x-1 transform",
                            "opacity-0 animate-fadeInUp"
                          )}
                          style={{
                            animationDelay: `${index * 50}ms`,
                            animationFillMode: "forwards",
                          }}
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
                            className="w-4 h-4 rounded border-gray-400 text-blue-600 focus:ring-blue-500 focus:ring-1 transition-all duration-200"
                          />
                          <span className="ml-3 text-sm text-gray-800 transition-colors duration-200">
                            {range.label}
                          </span>
                        </label>
                      ))
                    : // Manejo para filtros simples de string
                      (options as string[]).map((option, index) => (
                        <label
                          key={`${filterKey}-${option}`}
                          className={cn(
                            "flex items-center py-2 cursor-pointer rounded-md px-2 -mx-2 transition-all duration-300 ease-in-out",
                            "hover:bg-gray-100 hover:translate-x-1 transform",
                            "opacity-0 animate-fadeInUp"
                          )}
                          style={{
                            animationDelay: `${index * 50}ms`,
                            animationFillMode: "forwards",
                          }}
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
                            className="w-4 h-4 rounded border-gray-400 text-blue-600 focus:ring-blue-500 focus:ring-1 transition-all duration-200"
                          />
                          <span className="ml-3 text-sm text-gray-800 transition-colors duration-200">
                            {option}
                          </span>
                        </label>
                      ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Estilos CSS personalizados para ocultar scrollbars */}
      <style jsx>{`
        .scrollbar-hide {
          -webkit-overflow-scrolling: touch;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.4s ease-out;
        }
      `}</style>
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
    <>
      {/* Backdrop animado */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-50 transition-all duration-300 ease-in-out",
          isOpen ? "bg-black/50 backdrop-blur-sm" : "bg-transparent"
        )}
        onClick={onClose}
      />

      {/* Modal con animación mejorada */}
      <div
        className={cn(
          "lg:hidden fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-[#F5F5F5]">
            <h2 className="text-lg font-bold text-black">Filtros</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <FilterSidebar
              {...filterProps}
              className="border-0 shadow-none rounded-none h-full bg-[#F5F5F5]"
            />
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-300 bg-white">
            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Aplicar Filtros ({filterProps.resultCount} productos)
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export type { FilterConfig, FilterState, FilterSidebarProps };
