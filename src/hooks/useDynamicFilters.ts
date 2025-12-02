/**
 * Hook para obtener filtros dinámicos según el contexto actual
 * Maneja estados de carga, error y cacheo de resultados
 */

import { useState, useEffect, useMemo } from "react";
import { getFiltersByContext } from "@/services/filters.service";
import type { DynamicFilterConfig, FiltersByContextParams } from "@/types/filters";

interface UseDynamicFiltersResult {
  filters: DynamicFilterConfig[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Filtra los filtros según el scope y contexto actual
 * 
 * Lógica simplificada:
 * - Si solo hay categoriaUuid: mostrar filtros cuyo scope incluya esa categoría
 * - Si hay categoriaUuid + menuUuid: mostrar filtros cuyo scope incluya ese menú (y la categoría)
 * - Si hay categoriaUuid + menuUuid + submenuUuid: mostrar filtros cuyo scope incluya ese submenú (y el menú y la categoría)
 */
function filterByScope(
  filters: DynamicFilterConfig[],
  context: FiltersByContextParams
): DynamicFilterConfig[] {
  return filters.filter((filter) => {
    // Solo mostrar filtros activos
    if (!filter.isActive) return false;

    const { scope } = filter;
    const { categoriaUuid, menuUuid, submenuUuid } = context;

    // Si el scope está vacío en todos los niveles, no mostrar el filtro
    const hasScope =
      scope.categories.length > 0 ||
      scope.menus.length > 0 ||
      scope.submenus.length > 0;

    if (!hasScope) return false;

    // Determinar el nivel de contexto actual
    const isInSubmenu = !!submenuUuid;
    const isInMenu = !!menuUuid && !isInSubmenu;
    const isInCategory = !!categoriaUuid && !isInMenu && !isInSubmenu;

    // 1. Si estamos en nivel de SUBMENÚ (categoriaUuid + menuUuid + submenuUuid)
    if (isInSubmenu) {
      // El filtro debe tener el submenú en su scope
      if (scope.submenus.length > 0) {
        if (!scope.submenus.includes(submenuUuid!)) return false;
      }
      // También debe tener el menú en su scope (si tiene menús definidos)
      if (scope.menus.length > 0) {
        if (!scope.menus.includes(menuUuid!)) return false;
      }
      // También debe tener la categoría en su scope (si tiene categorías definidas)
      if (scope.categories.length > 0) {
        if (!scope.categories.includes(categoriaUuid!)) return false;
      }
      return true;
    }

    // 2. Si estamos en nivel de MENÚ (categoriaUuid + menuUuid)
    if (isInMenu) {
      // El filtro debe tener el menú en su scope
      if (scope.menus.length > 0) {
        if (!scope.menus.includes(menuUuid!)) return false;
      }
      // También debe tener la categoría en su scope (si tiene categorías definidas)
      if (scope.categories.length > 0) {
        if (!scope.categories.includes(categoriaUuid!)) return false;
      }
      // Si el scope tiene submenús específicos, no mostrar en nivel de menú
      // (solo mostrar en nivel de submenú)
      if (scope.submenus.length > 0) return false;
      return true;
    }

    // 3. Si estamos en nivel de CATEGORÍA (solo categoriaUuid)
    if (isInCategory) {
      // El filtro debe tener la categoría en su scope
      if (scope.categories.length > 0) {
        if (!scope.categories.includes(categoriaUuid!)) return false;
      } else {
        // Si no tiene categorías en el scope, no mostrar en nivel de categoría
        return false;
      }
      // Si el filtro tiene la categoría en su scope, mostrarlo
      // (incluso si también tiene menús/submenús, porque puede aplicarse a toda la categoría)
      return true;
    }

    // Fallback: si no hay contexto claro, no mostrar el filtro
    return false;
  });
}

/**
 * Ordena los filtros según el orden definido en order
 */
function sortFiltersByOrder(
  filters: DynamicFilterConfig[],
  context: FiltersByContextParams
): DynamicFilterConfig[] {
  const { categoriaUuid, menuUuid, submenuUuid } = context;

  return [...filters].sort((a, b) => {
    // Obtener el orden de cada filtro según el contexto
    let orderA = Infinity;
    let orderB = Infinity;

    // Intentar obtener el orden desde el contexto más específico al más general
    if (submenuUuid && a.order.submenus[submenuUuid] !== undefined) {
      orderA = a.order.submenus[submenuUuid];
    } else if (menuUuid && a.order.menus[menuUuid] !== undefined) {
      orderA = a.order.menus[menuUuid];
    } else if (categoriaUuid && a.order.categories[categoriaUuid] !== undefined) {
      orderA = a.order.categories[categoriaUuid];
    }

    if (submenuUuid && b.order.submenus[submenuUuid] !== undefined) {
      orderB = b.order.submenus[submenuUuid];
    } else if (menuUuid && b.order.menus[menuUuid] !== undefined) {
      orderB = b.order.menus[menuUuid];
    } else if (categoriaUuid && b.order.categories[categoriaUuid] !== undefined) {
      orderB = b.order.categories[categoriaUuid];
    }

    // Si ambos tienen orden, ordenar por orden
    if (orderA !== Infinity && orderB !== Infinity) {
      return orderA - orderB;
    }

    // Si solo uno tiene orden, ese va primero
    if (orderA !== Infinity) return -1;
    if (orderB !== Infinity) return 1;

    // Si ninguno tiene orden, mantener el orden original
    return 0;
  });
}

/**
 * Hook para obtener filtros dinámicos según el contexto
 * 
 * @param context - Contexto actual (categoriaUuid, menuUuid, submenuUuid)
 * @returns Objeto con filters (filtrados y ordenados), loading, error y refetch
 * 
 * @example
 * const { filters, loading, error } = useDynamicFilters({
 *   categoriaUuid: "2119a685-3a03-437f-8dd6-a8eb1ce7836d",
 *   menuUuid: "1ab46627-719d-4318-b6e4-5692ea46c4ee",
 * });
 */
export function useDynamicFilters(
  context: FiltersByContextParams
): UseDynamicFiltersResult {
  const [filters, setFilters] = useState<DynamicFilterConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Crear una clave de cache basada en el contexto
  const contextKey = useMemo(
    () =>
      JSON.stringify({
        categoriaUuid: context.categoriaUuid || null,
        menuUuid: context.menuUuid || null,
        submenuUuid: context.submenuUuid || null,
      }),
    [context.categoriaUuid, context.menuUuid, context.submenuUuid]
  );

  const fetchFilters = async () => {
    // Solo hacer fetch si tenemos al menos categoriaUuid
    if (!context.categoriaUuid) {
      setFilters([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await getFiltersByContext(context);

      if (response.success) {
        // Filtrar por scope y ordenar
        const filtered = filterByScope(response.data, context);
        const sorted = sortFiltersByOrder(filtered, context);
        setFilters(sorted);
      } else {
        setError(response.message || "Error al cargar filtros");
        setFilters([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido al cargar filtros";
      setError(errorMessage);
      setFilters([]);
      console.error("Error in useDynamicFilters:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextKey]);

  // Filtros procesados (ya filtrados y ordenados en fetchFilters)
  const processedFilters = useMemo(() => filters, [filters]);

  return {
    filters: processedFilters,
    loading,
    error,
    refetch: fetchFilters,
  };
}

