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
    console.log('🎯 SubmenuCarousel: handleSubmenuClick called with:', submenuId);
    
    // Encontrar el submenú por UUID para obtener su nombre
    const submenu = submenus.find(s => s.uuid === submenuId);
    if (!submenu) {
      console.log('❌ SubmenuCarousel: submenu not found for UUID:', submenuId);
      return;
    }

    // Convertir el nombre del submenú a una URL amigable
    const submenuName = submenu.nombreVisible || submenu.nombre;
    const friendlyName = submenuNameToFriendly(submenuName);

    console.log('🔄 SubmenuCarousel: Converting to friendly name:', {
      originalName: submenuName,
      friendlyName,
      submenuId
    });

    // Construir la nueva URL manteniendo los parámetros existentes y añadiendo submenu
    const currentParams = new URLSearchParams(searchParams?.toString());
    currentParams.set('submenu', friendlyName);
    
    // Construir la nueva URL
    const newUrl = `/productos/${categoria}?${currentParams.toString()}`;
    
    console.log('🚀 SubmenuCarousel: Navigating to:', newUrl);
    
    // Navegar a la nueva URL
    router.push(newUrl);
  };

  // Transformar submenús de la API al formato SeriesItem
  const series: SeriesItem[] = useMemo(() => {
    console.log('📋 SubmenuCarousel: Available submenus:', submenus.map(s => ({
      uuid: s.uuid,
      nombre: s.nombre,
      nombreVisible: s.nombreVisible
    })));
    
    return submenus.map(submenu => ({
      id: submenu.uuid,
      name: submenu.nombreVisible || submenu.nombre,
      image: submenu.imagen || undefined,
    }));
  }, [submenus]);

  // Crear filtros vacíos para el SeriesSlider (no se usan para navegación)
  const emptyFilters = {};

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
          activeFilters={emptyFilters}
          onSerieClick={handleSubmenuClick}
        />
      </div>
    </section>
  );
}
