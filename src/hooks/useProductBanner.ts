/**
 * Hook para obtener banners de productos por categoría y submenu
 * Placement pattern: "banner-{categoria}-{submenu}"
 */

import { useState, useEffect } from "react";
import { bannersService } from "@/services/banners.service";
import type { Banner } from "@/types/banner";

interface UseProductBannerResult {
  config: Banner | null; // Legacy: primer banner
  configs: Banner[]; // Nuevo: todos los banners para carrusel
  loading: boolean;
  error: Error | null;
}

/**
 * Construye el placement string para el banner de producto
 * @param categoria - Nombre de la categoría (ej: "Dispositivos móviles")
 * @param submenu - Nombre del submenu (ej: "Galaxy Tab")
 * @returns Placement string (ej: "banner-Dispositivos móviles-Galaxy Tab")
 */
function buildProductPlacement(categoria: string, submenu?: string): string {
  if (!submenu) {
    return `banner-${categoria}`;
  }
  return `banner-${categoria}-${submenu}`;
}

/**
 * Hook para obtener banner de producto
 */
export function useProductBanner(
  categoria: string | null,
  submenu?: string | null
): UseProductBannerResult {
  const [config, setConfig] = useState<Banner | null>(null);
  const [configs, setConfigs] = useState<Banner[]>([]); // Nuevo: array de banners
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!categoria) {
      setConfig(null);
      setLoading(false);
      return;
    }

    let isCancelled = false;

    async function fetchBanner() {
      try {
        setLoading(true);
        setError(null);

        // `categoria` was already checked above (early return), capture a
        // local const to make its non-null type explicit for the async
        // function (prevents TypeScript from complaining about string | null).
        const categoriaNonNull: string = categoria as string;

        const placement = buildProductPlacement(
          categoriaNonNull,
          submenu ?? undefined
        );

        console.log('[useProductBanner] Buscando banner con placement:', placement);
        console.log('[useProductBanner] Categoría:', categoria, 'Submenu:', submenu);

        // Obtener TODOS los banners del placement
        const banners = await bannersService.getBannersByPlacement(placement);

        console.log('[useProductBanner] Banners encontrados:', banners);

        if (!isCancelled) {
          setConfigs(banners);
          setConfig(banners[0] || null); // Legacy: primer banner
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err : new Error("Error desconocido"));
          setConfig(null);
          setConfigs([]); // Limpiar array también
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    fetchBanner();

    return () => {
      isCancelled = true;
    };
  }, [categoria, submenu]);

  return { config, configs, loading, error };
}
