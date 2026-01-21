/**
 * Hook para gestionar el filtro de disponibilidad de stock
 *
 * Responsabilidad única (SRP): Solo maneja el estado del filtro de stock
 * Sincroniza el estado con los parámetros de URL para persistencia
 *
 * @example
 * ```tsx
 * const { isStockFilterEnabled, toggleStockFilter } = useStockFilter();
 *
 * <FilterToggle
 *   checked={isStockFilterEnabled}
 *   onChange={toggleStockFilter}
 * />
 * ```
 */
import { useCallback, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

/** Nombre del parámetro en la URL */
const STOCK_FILTER_PARAM = "stockMinimo";

/** Valor que indica "productos con stock >= 1" */
const STOCK_FILTER_VALUE = 1;

export interface UseStockFilterReturn {
  /** Indica si el filtro está activo */
  isStockFilterEnabled: boolean;
  /** Alterna el estado del filtro */
  toggleStockFilter: () => void;
  /** Establece el estado del filtro directamente */
  setStockFilter: (enabled: boolean) => void;
}

export function useStockFilter(): UseStockFilterReturn {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Deriva el estado desde la URL (source of truth)
  const isStockFilterEnabled = useMemo(
    () => searchParams.get(STOCK_FILTER_PARAM) === String(STOCK_FILTER_VALUE),
    [searchParams]
  );

  // Actualiza la URL cuando cambia el filtro
  const setStockFilter = useCallback(
    (enabled: boolean) => {
      const params = new URLSearchParams(searchParams.toString());

      if (enabled) {
        params.set(STOCK_FILTER_PARAM, String(STOCK_FILTER_VALUE));
      } else {
        params.delete(STOCK_FILTER_PARAM);
      }

      // Navegar sin scroll para mejor UX
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  // Toggle helper
  const toggleStockFilter = useCallback(() => {
    setStockFilter(!isStockFilterEnabled);
  }, [isStockFilterEnabled, setStockFilter]);

  return {
    isStockFilterEnabled,
    toggleStockFilter,
    setStockFilter,
  };
}
