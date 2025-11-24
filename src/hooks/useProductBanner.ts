/**
 * Hook para obtener banners de productos por categoría, menú y submenú
 *
 * Sistema de herencia de 3 niveles:
 * - Nivel 3 (más específico): banner-{categoria}-{menu}-{submenu}
 * - Nivel 2 (fallback): banner-{categoria}-{menu}
 * - Nivel 1 (fallback general): banner-{categoria}
 *
 * @example
 * // En página /productos/dispositivos-moviles?seccion=smartphones&submenu=galaxy-z
 * useProductBanner("Dispositivos móviles", "Smartphones", "Galaxy Z")
 * // Busca: ["banner-Dispositivos móviles-Smartphones-Galaxy Z",
 * //         "banner-Dispositivos móviles-Smartphones",
 * //         "banner-Dispositivos móviles"]
 */

import { useState, useEffect } from "react";
import { bannersService } from "@/services/banners.service";
import type { Banner } from "@/types/banner";
import { buildNormalizedPlacement } from "@/utils/normalizeText";

interface UseProductBannerResult {
  config: Banner | null; // Primer banner encontrado (legacy compatibility)
  configs: Banner[]; // Todos los banners encontrados
  loading: boolean;
  error: Error | null;
}

/**
 * Construye array de placements válidos ordenados por especificidad
 * Implementa sistema de herencia para mostrar banners de niveles superiores
 *
 * ✨ ACTUALIZACIÓN: Ahora usa normalización de texto para evitar problemas
 * con espacios múltiples, espacios al inicio/final, etc.
 *
 * @param categoria - Nombre visible de categoría (ej: "Dispositivos móviles")
 * @param menu - Nombre visible de menú/subcategoría (ej: "Smartphones")
 * @param submenu - Nombre visible de submenú/serie (ej: "Galaxy Z")
 * @returns Array de placements del más específico al más general (NORMALIZADOS)
 *
 * @example
 * buildProductPlacements("Dispositivos  móviles", "Smartphones", "Galaxy   Z")
 * // Returns: [
 * //   "banner-Dispositivos móviles-Smartphones-Galaxy Z",  // ← Normalizado
 * //   "banner-Dispositivos móviles-Smartphones",
 * //   "banner-Dispositivos móviles"
 * // ]
 */
function buildProductPlacements(
  categoria: string,
  menu?: string,
  submenu?: string
): string[] {
  const placements: string[] = [];

  // Nivel 3: Banner específico de submenú/serie (más específico)
  if (menu && submenu) {
    placements.push(buildNormalizedPlacement(categoria, menu, submenu));
  }

  // Nivel 2: Banner de menú/subcategoría (fallback medio)
  if (menu) {
    placements.push(buildNormalizedPlacement(categoria, menu));
  }

  // Nivel 1: Banner de categoría (fallback general)
  placements.push(buildNormalizedPlacement(categoria));

  return placements;
}

/**
 * Hook para obtener banners de producto con soporte completo de 3 niveles
 * Implementa sistema de caché y herencia de banners
 *
 * @param categoria - Nombre visible de categoría (null si no hay categoría)
 * @param menu - Nombre visible de menú/sección (null/undefined si no hay sección)
 * @param submenu - Nombre visible de submenú/serie (null/undefined si no hay serie)
 * @returns Banners encontrados, estado de carga y errores
 */
export function useProductBanner(
  categoria: string | null,
  menu?: string | null,
  submenu?: string | null
): UseProductBannerResult {
  const [config, setConfig] = useState<Banner | null>(null);
  const [configs, setConfigs] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Si no hay categoría, no hay nada que buscar
    if (!categoria) {
      setConfig(null);
      setConfigs([]);
      setLoading(false);
      return;
    }

    let isCancelled = false;

    async function fetchBanners() {
      try {
        setLoading(true);
        setError(null);

        // Normalizar parámetros (convertir null a undefined)
        // categoria ya fue validado arriba (early return si es null)
        const categoriaNonNull = categoria as string;
        const menuNonNull = menu || undefined;
        const submenuNonNull = submenu || undefined;

        // Construir array de placements con herencia
        const placements = buildProductPlacements(
          categoriaNonNull,
          menuNonNull,
          submenuNonNull
        );

        // Obtener todos los banners activos (usa caché interno del servicio)
        const allBanners = await bannersService.getActiveBanners();

        // Filtrar banners que coincidan con alguno de los placements válidos
        const matchedBanners = allBanners.filter((banner) =>
          placements.includes(banner.placement)
        );

        // Ordenar por especificidad (los más específicos primero)
        // Esto asegura que si hay varios banners, se prioricen los más específicos
        const sortedBanners = matchedBanners.sort((a, b) => {
          const aIndex = placements.indexOf(a.placement);
          const bIndex = placements.indexOf(b.placement);
          return aIndex - bIndex;
        });

        if (!isCancelled) {
          setConfigs(sortedBanners);
          setConfig(sortedBanners[0] || null); // Legacy: primer banner
        }
      } catch (err) {
        console.error("[useProductBanner] ❌ Error fetching banners:", err);
        if (!isCancelled) {
          setError(err instanceof Error ? err : new Error("Error desconocido"));
          setConfig(null);
          setConfigs([]);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    fetchBanners();

    return () => {
      isCancelled = true;
    };
  }, [categoria, menu, submenu]); // Dependencias: re-fetch cuando cambie cualquier nivel

  return { config, configs, loading, error };
}
