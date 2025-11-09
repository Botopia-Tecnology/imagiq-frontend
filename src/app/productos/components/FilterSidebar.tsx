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
 * - Accesibilidad mejorada con ARIA
 */

"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { posthogUtils } from "@/lib/posthogClient";
import { useReducedMotion } from "@/hooks/useReducedMotion";

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
  // Props para sticky behavior
  stickyContainerClasses?: string;
  stickyWrapperClasses?: string;
  stickyStyle?: React.CSSProperties;
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
  stickyContainerClasses = "",
  stickyWrapperClasses = "",
  stickyStyle = {},
}: FilterSidebarProps) {
  const [internalExpandedFilters, setInternalExpandedFilters] =
    useState<Set<string>>(expandedFilters);
  const prefersReducedMotion = useReducedMotion();

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

  // Agrega el filtro de color si no está presente
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
    <motion.div
      className={cn(
        "bg-white rounded-none border-0 shadow-none",
        stickyContainerClasses,
        className
      )}
      style={stickyStyle}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0.01 : 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <div className={cn(stickyWrapperClasses)}>
        {/* Header igual a la imagen */}
        <div className="p-4 border-b border-gray-300">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 font-bold text-black text-lg">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-black"
                aria-hidden="true"
              >
                <path
                  d="M3.75 6.75H14.25"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M6.75 11.25H11.25"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="6.75" cy="6.75" r="1.125" fill="currentColor" />
                <circle cx="11.25" cy="11.25" r="1.125" fill="currentColor" />
              </svg>
              Filtros
            </span>
            <span
              className="text-base text-black font-medium border-l border-gray-300 pl-4"
              aria-live="polite"
              aria-atomic="true"
            >
              {resultCount} resultados
            </span>
          </div>
        </div>

        {/* Contenedor principal con scroll oculto */}
        <div className="overflow-hidden">
          {Object.entries(filterConfigWithColor).map(([filterKey, options]) => (
            <div key={filterKey} className="border-b border-gray-300">
              <button
                onClick={() => handleToggleFilter(filterKey)}
                className="w-full flex items-center justify-between py-4 px-4 text-left hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                aria-expanded={currentExpandedFilters.has(filterKey)}
                aria-controls={`filter-panel-${filterKey}`}
                aria-label={`${currentExpandedFilters.has(filterKey) ? 'Contraer' : 'Expandir'} filtro de ${formatFilterKey(filterKey)}`}
              >
                <span className="font-semibold text-black text-sm tracking-wide">
                  {formatFilterKey(filterKey)}
                </span>
                <motion.div
                  animate={{ rotate: currentExpandedFilters.has(filterKey) ? 180 : 0 }}
                  transition={{ duration: prefersReducedMotion ? 0.01 : 0.3 }}
                >
                  <ChevronDown className="w-4 h-4 text-gray-600" aria-hidden="true" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {currentExpandedFilters.has(filterKey) && (
                  <motion.div
                    id={`filter-panel-${filterKey}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: prefersReducedMotion ? 0.01 : 0.3,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    className="overflow-hidden"
                    role="region"
                    aria-labelledby={`filter-header-${filterKey}`}
                  >
                    <div className="px-4 pb-4">
                      <div
                        className="space-y-2 max-h-[500px] overflow-y-auto scrollbar-hide"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                      >
                        {isRangeFilter(options)
                          ? options.map((range, index) => (
                              <motion.label
                                key={`${filterKey}-${index}`}
                                className={cn(
                                  "flex items-center py-2 cursor-pointer rounded-md px-2 -mx-2 transition-all duration-200",
                                  "hover:bg-blue-50",
                                  filters[filterKey]?.includes(range.label) &&
                                    "bg-blue-50 font-semibold text-blue-700"
                                )}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: prefersReducedMotion ? 0.01 : 0.3,
                                  delay: prefersReducedMotion ? 0 : index * 0.05,
                                  ease: [0.25, 0.1, 0.25, 1],
                                }}
                                whileHover={
                                  prefersReducedMotion
                                    ? {}
                                    : { scale: 1.02, transition: { duration: 0.2 } }
                                }
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    filters[filterKey]?.includes(range.label) ||
                                    false
                                  }
                                  onChange={(e) =>
                                    handleFilterChange(
                                      filterKey,
                                      range.label,
                                      e.target.checked
                                    )
                                  }
                                  className="w-4 h-4 rounded border-gray-400 text-blue-600 focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                                  aria-label={range.label}
                                />
                                <span className="ml-3 text-sm transition-colors duration-200">
                                  {range.label}
                                </span>
                              </motion.label>
                            ))
                          : (options as string[]).map((option, index) => (
                              <motion.label
                                key={`${filterKey}-${option}`}
                                className={cn(
                                  "flex items-center py-2 cursor-pointer rounded-md px-2 -mx-2 transition-all duration-200",
                                  "hover:bg-blue-50",
                                  filters[filterKey]?.includes(option) &&
                                    "bg-blue-50 font-semibold text-blue-700"
                                )}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: prefersReducedMotion ? 0.01 : 0.3,
                                  delay: prefersReducedMotion ? 0 : index * 0.05,
                                  ease: [0.25, 0.1, 0.25, 1],
                                }}
                                whileHover={
                                  prefersReducedMotion
                                    ? {}
                                    : { scale: 1.02, transition: { duration: 0.2 } }
                                }
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
                                  className="w-4 h-4 rounded border-gray-400 text-blue-600 focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                                  aria-label={option}
                                />
                                <span className="ml-3 text-sm transition-colors duration-200">
                                  {option}
                                </span>
                              </motion.label>
                            ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
        `}</style>
      </div>
    </motion.div>
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
          // en mobile dejamos un pequeño gap a la izquierda con left-4
          "lg:hidden fixed inset-y-0 right-0 left-4 z-50 w-full max-w-sm bg-white shadow-2xl",
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
