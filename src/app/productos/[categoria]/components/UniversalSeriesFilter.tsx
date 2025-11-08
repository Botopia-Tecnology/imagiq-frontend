/**
 * 🎯 UNIVERSAL SERIES FILTER - Componente dinámico para filtros de series
 * Funciona con cualquier categoría: smartphones, refrigeradores, lavadoras, etc.
 * Solo necesita un objeto de configuración para funcionar
 */

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { posthogUtils } from "@/lib/posthogClient";
import type { FilterState } from "../../components/FilterSidebar";
import type { SeriesFilterConfig } from "../config/series-configs";
import SeriesFilterBreadcrumb from "./SeriesFilterBreadcrumb";
import SeriesSlider from "./SeriesSlider";

interface Props {
  readonly config: SeriesFilterConfig;
  readonly activeFilters: FilterState;
  readonly onFilterChange: (filterType: string, value: string, checked: boolean) => void;
  readonly categoria?: string;
  readonly seccion?: string;
}

export default function UniversalSeriesFilter({
  config,
  activeFilters,
  onFilterChange,
  categoria = "",
  seccion = "",
}: Props) {
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);
  const [showSeriesDropdown, setShowSeriesDropdown] = useState(false);
  const sectionDropdownRef = useRef<HTMLDivElement>(null);
  const seriesDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sectionDropdownRef.current && !sectionDropdownRef.current.contains(event.target as Node)) {
        setShowSectionDropdown(false);
      }
      if (seriesDropdownRef.current && !seriesDropdownRef.current.contains(event.target as Node)) {
        setShowSeriesDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSerieClick = useCallback((serieId: string) => {
    const isActive = activeFilters.serie?.includes(serieId) || false;
    
    // Si ya está activo, no hacer nada (selección obligatoria)
    if (isActive) {
      return;
    }

    // Desactivar todos los demás filtros primero (solo una selección)
    if (activeFilters.serie && activeFilters.serie.length > 0) {
      activeFilters.serie.forEach((activeSerieId) => {
        if (activeSerieId !== serieId) {
          onFilterChange("serie", activeSerieId, false);
        }
      });
    }

    // Activar el nuevo filtro
    onFilterChange("serie", serieId, true);

    posthogUtils.capture("series_filter_click", {
      categoria,
      seccion,
      serie: serieId,
      action: "select",
    });
  }, [activeFilters.serie, categoria, onFilterChange, seccion]);

  const clearAllSeries = useCallback(() => {
    config.series.forEach((serie) => {
      if (activeFilters.serie?.includes(serie.id)) {
        onFilterChange("serie", serie.id, false);
      }
    });
  }, [activeFilters.serie, config.series, onFilterChange]);

  const hasSeries = config.series && config.series.length > 0;

  return (
    <section className="overflow-visible">
      <div className="overflow-visible">
        <SeriesFilterBreadcrumb
          config={config}
          activeFilters={activeFilters}
          seccion={seccion}
          showSectionDropdown={showSectionDropdown}
          showSeriesDropdown={showSeriesDropdown}
          onToggleSectionDropdown={() => setShowSectionDropdown(!showSectionDropdown)}
          onToggleSeriesDropdown={() => setShowSeriesDropdown(!showSeriesDropdown)}
          onClearAllSeries={clearAllSeries}
          onSerieClick={handleSerieClick}
          sectionDropdownRef={sectionDropdownRef}
          seriesDropdownRef={seriesDropdownRef}
        />

        <h1
          className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black py-4 sm:mb-6 md:mb-8 lg:mb-10"
          style={{ fontFamily: "'Samsung Sharp Sans', sans-serif" }}
        >
          {config.title}
        </h1>

        {hasSeries && (
          <SeriesSlider
            series={config.series}
            activeFilters={activeFilters}
            onSerieClick={handleSerieClick}
          />
        )}
      </div>
    </section>
  );
}
