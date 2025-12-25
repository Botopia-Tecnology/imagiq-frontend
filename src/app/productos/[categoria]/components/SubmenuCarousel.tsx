/**
 * SUBMENU CAROUSEL - Componente específico para el carousel de submenús
 * Navega directamente a URLs con parámetro submenu en lugar de usar filtros
 */

"use client";

import { useMemo, useCallback, useRef, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useSubmenus } from "@/hooks/useSubmenus";
import type { Menu, ProductFilterParams } from "@/lib/api";
import SeriesSlider from "./SeriesSlider";
import type { SeriesItem } from "../config/series-configs";
import { submenuNameToFriendly } from "../utils/submenuUtils";
import { usePrefetchProducts } from "@/hooks/usePrefetchProducts";
import { executeBatchPrefetch } from "@/lib/batchPrefetch";
import { usePrefetchCoordinator } from "@/hooks/usePrefetchCoordinator";
import { productCache } from "@/lib/productCache";

interface Props {
  readonly menu: Menu;
  readonly categoria: string;
  readonly seccion?: string;
  readonly categoryCode?: string; // Código de API de la categoría (ej: "AV", "DA")
  readonly menuUuid?: string; // UUID del menú actual (para prefetch más preciso)
  readonly title?: string;
}

export default function SubmenuCarousel({
  menu,
  categoria,
  categoryCode,
  menuUuid,
  title,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { submenus, loading, error } = useSubmenus(menu.uuid);
  const { prefetchWithDebounce, cancelPrefetch, prefetchProducts } = usePrefetchProducts();
  const { shouldPrefetch } = usePrefetchCoordinator();
  
  // Ref para rastrear qué submenús se están precargando por hover
  const autoPrefetchingRef = useRef<Set<string>>(new Set());
  
  // Ref para rastrear qué submenús ya fueron precargados por hover
  const autoPrefetchedRef = useRef<Set<string>>(new Set());
  
  // Ref para rastrear si ya se precargaron productos de los primeros submenús
  const proactivePrefetchDoneRef = useRef<boolean>(false);
  
  // Precargar productos de los primeros 3-5 submenús visibles cuando se renderiza el carousel
  useEffect(() => {
    // Solo precargar si tenemos los datos necesarios y no se ha hecho ya
    if (!categoryCode || !menuUuid || loading || submenus.length === 0 || proactivePrefetchDoneRef.current) {
      return;
    }
    
    // Filtrar submenús activos y tomar los primeros 5
    const activeSubmenus = submenus
      .filter(submenu => submenu.activo && submenu.uuid)
      .slice(0, 5);
    
    if (activeSubmenus.length === 0) {
      return;
    }
    
    // Marcar como hecho para evitar múltiples ejecuciones
    proactivePrefetchDoneRef.current = true;
    
    // Construir parámetros para batch request
    const buildParams = (submenuUuid: string): ProductFilterParams => ({
      page: 1,
      limit: 50,
      precioMin: 1,
      lazyLimit: 6,
      lazyOffset: 0,
      sortBy: "precio",
      sortOrder: "desc",
      categoria: categoryCode,
      menuUuid: menuUuid,
      submenuUuid: submenuUuid,
    });
    
    // Filtrar solo los submenús que NO están en caché y deben precargarse
    const submenusToPrefetch: ProductFilterParams[] = [];
    
    for (const submenu of activeSubmenus) {
      if (!submenu.uuid) continue;
      
      const params = buildParams(submenu.uuid);
      
      // Verificar si ya está en caché
      const cached = productCache.get(params);
      if (cached) {
        continue;
      }
      
      // Verificar con el coordinador si debe precargarse
      if (shouldPrefetch(params)) {
        submenusToPrefetch.push(params);
      }
    }
    
    // Si hay submenús sin cargar, hacer batch de ellos en background
    if (submenusToPrefetch.length > 0) {
      // Ejecutar en background sin bloquear la UI
      executeBatchPrefetch(submenusToPrefetch, 'SubmenuCarousel-proactive')
        .catch(() => {
          // Silenciar errores - no afectar la UX
        });
    }
  }, [categoryCode, menuUuid, loading, submenus, shouldPrefetch]);

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
    
    // Usar el pathname actual para mantener el slug correcto
    const newUrl = `${pathname}?${currentParams.toString()}`;
    
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

  // NOTA: El batch automático de submenús fue eliminado.
  // Ahora se maneja por usePreloadMenuSubmenus en CategorySection cuando el usuario entra a un menú.
  // Esto evita duplicación y asegura que solo se carguen los submenús que no están en caché.

  // Prefetch productos cuando el usuario hace hover sobre un submenú
  // Al hacer hover, se PRIORIZA ese submenú específico (se acelera el prefetch)
  // Usar menuUuid prop si está disponible, sino usar menu.uuid
  const handleSubmenuHover = useCallback((submenuUuid: string) => {
    if (!categoryCode || !menuUuid) return;
    
    // Marcar que este submenú se está precargando por hover (priorizado)
    // Esto evita que el sistema automático lo procese si ya se está precargando
    autoPrefetchingRef.current.add(submenuUuid);
    
    // Prefetch priorizado - sin debounce, ejecutar inmediatamente
    prefetchProducts({
      categoryCode,
      menuUuid: menuUuid,
      submenuUuid,
    })
      .then(() => {
        // Marcar como precargado por hover
        autoPrefetchedRef.current.add(submenuUuid);
        autoPrefetchingRef.current.delete(submenuUuid);
      })
      .catch(() => {
        // Silenciar errores
        autoPrefetchingRef.current.delete(submenuUuid);
      });
  }, [categoryCode, menuUuid, prefetchProducts]);

  // Cancelar prefetch cuando el usuario deja de hacer hover
  const handleSubmenuLeave = useCallback((submenuUuid: string) => {
    if (!categoryCode || !menuUuid) return;
    
    cancelPrefetch({
      categoryCode,
      menuUuid: menuUuid, // Usar el prop que viene de CategorySection
      submenuUuid,
    });
  }, [categoryCode, menuUuid, cancelPrefetch]);

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
        <SeriesSlider
          series={series}
          activeFilters={activeFilters}
          onSerieClick={handleSubmenuClick}
          onSerieHover={handleSubmenuHover}
          onSerieLeave={handleSubmenuLeave}
        />
      </div>
    </section>
  );
}
