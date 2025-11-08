/**
 * DYNAMIC SERIES FILTER - Componente dinámico que usa datos de la API
 * Obtiene submenús desde la API y los muestra en el SeriesSlider
 */

"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { posthogUtils } from "@/lib/posthogClient";
import type { FilterState } from "../../components/FilterSidebar";
import type { SeriesItem } from "../config/series-configs";
import SeriesSlider from "./SeriesSlider";
import { useSubmenus } from "@/hooks/useSubmenus";
import type { Menu } from "@/lib/api";

interface Props {
  readonly menu: Menu;
  readonly activeFilters: FilterState;
  readonly onFilterChange: (filterType: string, value: string, checked: boolean) => void;
  readonly categoria?: string;
  readonly seccion?: string;
  readonly title?: string;
}

export default function DynamicSeriesFilter({
  menu,
  activeFilters,
  onFilterChange,
  categoria = "",
  seccion = "",
  title,
}: Props) {
  const { submenus, loading, error } = useSubmenus(menu.uuid);

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

  // Transformar submenús de la API al formato SeriesItem
  const series: SeriesItem[] = useMemo(() => {
    return submenus.map(submenu => ({
      id: submenu.uuid,
      name: submenu.nombreVisible || submenu.nombre,
      image: submenu.imagen || undefined,
    }));
  }, [submenus]);

  // Si está cargando, mostrar skeleton
  if (loading) {
    return (
      <section>
        <div className="animate-pulse">
          <h1
            className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-300 py-4 sm:mb-6 md:mb-8 lg:mb-10"
            style={{ fontFamily: "'Samsung Sharp Sans', sans-serif" }}
          >
            Cargando...
          </h1>
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 bg-gray-200 rounded-xl h-32 min-w-[220px]"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Si hay error o no hay series, no mostrar nada
  if (error || series.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="">
        <h1
          className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black py-4 sm:mb-6 md:mb-8 lg:mb-10"
          style={{ fontFamily: "'Samsung Sharp Sans', sans-serif" }}
        >
          {title || menu.nombreVisible || menu.nombre}
        </h1>

        <SeriesSlider
          series={series}
          activeFilters={activeFilters}
          onSerieClick={handleSerieClick}
        />
      </div>
    </section>
  );
}
