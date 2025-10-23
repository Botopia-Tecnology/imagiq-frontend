/**
 * 🎛️ CATEGORY HOOKS - Hooks personalizados para CategorySection
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { posthogUtils } from "@/lib/posthogClient";
import { useProducts } from "@/features/products/useProducts";
import { applySortToFilters } from "@/lib/sortUtils";
import { useDebouncedObject } from "@/hooks/useDebounce";
import type { FilterState } from "../../components/FilterSidebar";
import type { CategoriaParams, Seccion } from "../types/index.d";
import {
  getCategoryBaseFilters,
  convertFiltersToApi,
} from "../utils/categoryUtils";
import { getCategoryFilters } from "../constants/categoryConstants";

export function useCategoryFilters(categoria: CategoriaParams, seccion: Seccion) {
  const [filters, setFilters] = useState<FilterState>(getCategoryFilters(categoria, seccion));

  useEffect(() => {
    setFilters(getCategoryFilters(categoria, seccion));
  }, [categoria, seccion]);

  return { filters, setFilters };
}

export function useCategoryPagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleItemsPerPageChange = useCallback((items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    itemsPerPage,
    setCurrentPage,
    handlePageChange,
    handleItemsPerPageChange,
  };
}

export function useCategorySorting() {
  const [sortBy, setSortBy] = useState("precio-mayor");

  return { sortBy, setSortBy };
}

export function useCategoryProducts(
  categoria: CategoriaParams,
  seccion: Seccion,
  filters: FilterState,
  currentPage: number,
  itemsPerPage: number,
  sortBy: string,
  categoryUuid?: string,
  menuUuid?: string,
  submenuUuid?: string,
  categoryCode?: string
) {
  // Evitar llamadas API hasta que tengamos los datos críticos
  const shouldMakeApiCall = useMemo(() => {
    // Si estamos en una sección específica, necesitamos menuUuid
    if (seccion && !menuUuid) {
      return false;
    }
    
    // Si hay un parámetro submenu en la URL pero no tenemos submenuUuid resuelto, esperar
    const searchParams = new URLSearchParams(globalThis.location.search);
    const submenuParam = searchParams.get('submenu');
    if (submenuParam && !submenuUuid) {
      return false;
    }
    
    // Si tenemos categoryCode, podemos hacer la llamada
    return !!categoryCode;
  }, [seccion, menuUuid, categoryCode, submenuUuid]);
  // Memoizar los filtros de jerarquía por separado para evitar re-cálculos innecesarios
  const hierarchyFilters = useMemo(() => {
    const result: Record<string, string> = {};

    if (categoryCode) {
      result.categoria = categoryCode;
    }

    if (menuUuid) {
      result.menuUuid = menuUuid;
    }

    if (submenuUuid) {
      result.submenuUuid = submenuUuid;
    }

    return result;
  }, [categoryCode, menuUuid, submenuUuid]);

  // Aplicar debounce a los filtros de jerarquía para evitar llamadas múltiples
  const debouncedHierarchyFilters = useDebouncedObject(hierarchyFilters, 300);

  // Memoizar los filtros base y aplicados por separado
  const baseFilters = useMemo(() => getCategoryBaseFilters(categoria, seccion), [categoria, seccion]);
  
  const appliedFilters = useMemo(() => 
    convertFiltersToApi(categoria, filters, seccion, submenuUuid), 
    [categoria, filters, seccion, submenuUuid]
  );

  // Combinar todos los filtros solo cuando sea necesario
  const apiFilters = useMemo(() => {
    const combined = { ...baseFilters, ...appliedFilters, ...debouncedHierarchyFilters };
    
    // Debug: log para verificar que el categoryCode y menuUuid se están pasando
    console.log('🔍 Debug useCategoryProducts:', {
      categoria,
      seccion,
      categoryCode,
      menuUuid,
      submenuUuid,
      hierarchyFilters: debouncedHierarchyFilters,
      finalFilters: combined
    });

    return combined;
  }, [baseFilters, appliedFilters, debouncedHierarchyFilters, categoria, seccion, categoryCode, menuUuid, submenuUuid]);

  const initialFiltersForProducts = useMemo(
    () => {
      // Solo calcular filtros si debemos hacer la llamada API
      if (!shouldMakeApiCall) {
        const searchParams = new URLSearchParams(globalThis.location.search);
        const submenuParam = searchParams.get('submenu');
        
        let reason = 'Waiting for critical data';
        if (seccion && !menuUuid) {
          reason = 'Waiting for menuUuid';
        } else if (submenuParam && !submenuUuid) {
          reason = 'Waiting for submenuUuid resolution';
        } else if (!categoryCode) {
          reason = 'Waiting for categoryCode';
        }
        
        console.log('⏳ Debug API Call Skipped:', {
          reason,
          categoria,
          seccion,
          menuUuid,
          submenuUuid,
          submenuParam,
          categoryCode,
          shouldMakeApiCall
        });
        return null; // No hacer llamada API
      }

      const result = applySortToFilters({ ...apiFilters, page: currentPage, limit: itemsPerPage }, sortBy);
      
      // Debug: log para rastrear cuándo se cambian los filtros finales
      const searchParams = new URLSearchParams(globalThis.location.search);
      const submenuParam = searchParams.get('submenu');
      
      console.log('🚀 Debug API Call Trigger:', {
        timestamp: new Date().toISOString(),
        categoria,
        seccion,
        submenuUuid,
        submenuParam,
        page: currentPage,
        limit: itemsPerPage,
        sortBy,
        filtersChanged: true,
        shouldMakeApiCall,
        hasSubmenuFilter: !!submenuUuid
      });
      
      return result;
    },
    [shouldMakeApiCall, apiFilters, currentPage, itemsPerPage, sortBy, categoria, seccion, submenuUuid]
  );

  return useProducts(initialFiltersForProducts);
}

export function useCategoryAnalytics(
  categoria: CategoriaParams,
  seccion: Seccion,
  totalItems: number
) {
  useEffect(() => {
    posthogUtils.capture("page_view_category", {
      categoria,
      seccion,
      totalResults: totalItems,
    });
  }, [categoria, seccion, totalItems]);
}

export function useFilterManagement(
  categoria: CategoriaParams,
  seccion: Seccion,
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>
) {
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(Object.keys(getCategoryFilters(categoria, seccion)).slice(0, 2))
  );

  const handleFilterChange = useCallback(
    (filterType: string, value: string, checked: boolean) => {
      setFilters((prev) => ({
        ...prev,
        [filterType]: checked
          ? [...(prev[filterType] || []), value]
          : (prev[filterType] || []).filter((item) => item !== value),
      }));

      posthogUtils.capture("filter_applied", {
        categoria,
        seccion,
        filter_type: filterType,
        filter_value: value,
        is_checked: checked,
      });
    },
    [categoria, seccion, setFilters]
  );

  const handleToggleFilter = useCallback(
    (filterKey: string) => {
      const newExpanded = new Set(expandedFilters);
      if (newExpanded.has(filterKey)) {
        newExpanded.delete(filterKey);
      } else {
        newExpanded.add(filterKey);
      }
      setExpandedFilters(newExpanded);
    },
    [expandedFilters]
  );

  return {
    expandedFilters,
    handleFilterChange,
    handleToggleFilter,
  };
}
