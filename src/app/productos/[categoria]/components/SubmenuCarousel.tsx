/**
 * SUBMENU CAROUSEL - Componente específico para el carousel de submenús
 * Navega directamente a URLs con parámetro submenu en lugar de usar filtros
 */

"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSubmenus } from "@/hooks/useSubmenus";
import type { Menu } from "@/lib/api";
import SeriesSlider from "./SeriesSlider";
import type { SeriesItem } from "../config/series-configs";
import { submenuNameToFriendly } from "../utils/submenuUtils";

interface Props {
  readonly menu: Menu;
  readonly categoria: string;
  readonly seccion?: string;
  readonly title?: string;
}

export default function SubmenuCarousel({
  menu,
  categoria,
  seccion,
  title,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { submenus, loading, error } = useSubmenus(menu.uuid);

  const handleSubmenuClick = (submenuId: string) => {
    // Encontrar el submenú por UUID para obtener su nombre
    const submenu = submenus.find(s => s.uuid === submenuId);
    if (!submenu) {
      return;
    }

    // Convertir el nombre del submenú a una URL amigable
    const submenuName = submenu.nombreVisible || submenu.nombre;
    const friendlyName = submenuNameToFriendly(submenuName);

    // Construir la nueva URL manteniendo los parámetros existentes y añadiendo submenu
    const currentParams = new URLSearchParams(searchParams?.toString());
    currentParams.set('submenu', friendlyName);
    
    // Construir la nueva URL
    const newUrl = `/productos/${categoria}?${currentParams.toString()}`;
    
    // Navegar a la nueva URL
    router.push(newUrl);
  };

  // Transformar submenús de la API al formato SeriesItem
  const series: SeriesItem[] = useMemo(() => {
    return submenus.map(submenu => ({
      id: submenu.uuid,
      name: submenu.nombreVisible || submenu.nombre,
      image: submenu.imagen || undefined,
    }));
  }, [submenus]);

  // Detectar qué submenú está actualmente seleccionado basándose en la URL
  const activeSubmenu = useMemo(() => {
    const submenuParam = searchParams?.get('submenu');
    if (!submenuParam) return null;
    
    // Buscar el submenú que coincida con el parámetro de la URL
    return submenus.find(submenu => {
      const submenuName = submenu.nombreVisible || submenu.nombre;
      const friendlyName = submenuNameToFriendly(submenuName);
      return friendlyName === submenuParam;
    });
  }, [searchParams, submenus]);

  // Crear filtros para el SeriesSlider con el submenú activo
  const activeFilters = useMemo(() => {
    if (!activeSubmenu) return { serie: [] };
    
    return {
      serie: [activeSubmenu.uuid]
    };
  }, [activeSubmenu]);

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
          onSerieClick={handleSubmenuClick}
        />
      </div>
    </section>
  );
}
