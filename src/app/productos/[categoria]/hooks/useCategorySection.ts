/**
 * 🎛️ CATEGORY HOOKS - Hooks personalizados para CategorySection
 */

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { posthogUtils } from "@/lib/posthogClient";
import { useProducts } from "@/features/products/useProducts";
import { applySortToFilters } from "@/lib/sortUtils";
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

export function useCategoryPagination(
  categoria?: CategoriaParams,
  seccion?: Seccion,
  menuUuid?: string,
  submenuUuid?: string,
  categoriaApiCode?:string,
) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  // Refs para rastrear si ya se inicializó y los valores previos
  const isInitializedRef = useRef(false);
  const previousCategoriaRef = useRef<CategoriaParams | undefined>(undefined);
  const previousSeccionRef = useRef<Seccion | undefined>(undefined);
  const previousMenuUuidRef = useRef<string | undefined>(undefined);
  const previousSubmenuUuidRef = useRef<string | undefined>(undefined);

  // Efecto para manejar cambios de ubicación y restauración de página
  useEffect(() => {
    // Solo esperar a que tengamos categoriaApiCode, que es el único valor realmente crítico
    // menuUuid y submenuUuid pueden ser undefined legítimamente (categoría base)
    if (!categoriaApiCode) {
      // Sin categoría no podemos proceder
      return;
    }

    // Verificar si la ubicación cambió comparando con valores previos
    const locationChanged =
      (previousCategoriaRef.current != undefined && previousCategoriaRef.current != categoria) ||
      (previousSeccionRef.current != undefined && previousSeccionRef.current != seccion) ||
      (previousMenuUuidRef.current != undefined && previousMenuUuidRef.current != menuUuid) ||
      (previousSubmenuUuidRef.current != undefined && previousSubmenuUuidRef.current != submenuUuid);

    if (!isInitializedRef.current) {
      // Primera inicialización: intentar restaurar página guardada
      try {
        const saved = localStorage.getItem("imagiq_last_location");
        if (saved) {
          const parsed = JSON.parse(saved);
          // Verificar si la ubicación guardada coincide con la actual (comparando undefined también)
          console.log(parsed, categoriaApiCode, menuUuid, submenuUuid, 'sii')
          if(submenuUuid){
            console.log('nivel sub')
            if(parsed.submenuUuid == submenuUuid){
              setCurrentPage(parsed.page || 1);
            }else{
              setCurrentPage(1);
            }
          }else if(menuUuid){
            console.log('nivel menu')
            if(parsed.menuUuid== menuUuid){
              setCurrentPage(parsed.page || 1);
            }else{
              setCurrentPage(1);
            }
          }else if(categoriaApiCode){
            console.log('nivel categoria')
            if(parsed.categoria == categoriaApiCode){
              console.log('misma categoria', parsed.page)
              setCurrentPage(parsed.page || 1);
            }else{
              setCurrentPage(1);
            }
          }
          // if (
            
          //   parsed.categoria == categoriaApiCode &&
          //   parsed.menuUuid == menuUuid &&
          //   parsed.submenuUuid == submenuUuid
          // ) {
          //   setCurrentPage(parsed.page || 1);
          // } else {
          //   // Ubicación diferente, empezar en página 1
          //   setCurrentPage(1);
          // }
        } else {
          // No hay ubicación guardada, empezar en página 1
          setCurrentPage(1);
          console.log('sospechoso 1')
        }
      } catch (error) {
        console.error("Error reading saved location:", error);
        setCurrentPage(1);
      }
      isInitializedRef.current = true;
      // Guardar valores iniciales
      previousCategoriaRef.current = categoria;
      previousSeccionRef.current = seccion;
      previousMenuUuidRef.current = menuUuid;
      previousSubmenuUuidRef.current = submenuUuid;
    } else if (locationChanged) {
      // Cambio de ubicación después de inicializar: resetear a página 1
      setCurrentPage(1);
      console.log('sospechoso 2')
      // Actualizar valores previos
      previousCategoriaRef.current = categoria;
      previousSeccionRef.current = seccion;
      previousMenuUuidRef.current = menuUuid;
      previousSubmenuUuidRef.current = submenuUuid;
    }
  }, [categoria, seccion, menuUuid, submenuUuid, categoriaApiCode]);

  const handlePageChange = useCallback((page: number) => {
    console.log('sospechoso 4')
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleItemsPerPageChange = useCallback((items: number) => {
    console.log('sospechoso 3')
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
  // Inicializar con el estado de sección actual
  const [previousSeccion, setPreviousSeccion] = useState(seccion);
  // Estado para rastrear transiciones de sección - inicializar en true para la primera carga
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Detectar cambio de sección o menú
  const [previousMenuUuid, setPreviousMenuUuid] = useState(menuUuid);
  
  useEffect(() => {
    if (previousSeccion != seccion || previousMenuUuid != menuUuid) {
      setIsTransitioning(true);
      setHasLoadedOnce(false); // Resetear cuando cambia la categoría/sección
      setPreviousSeccion(seccion);
      setPreviousMenuUuid(menuUuid);
    }
  }, [seccion, previousSeccion, menuUuid, previousMenuUuid]);

  // Memoizar los filtros de jerarquía por separado para evitar re-cálculos innecesarios
  const hierarchyFilters = useMemo(() => {
    const result: Record<string, string> = {};

    if (categoryCode) {
      result.category = categoryCode; // FrontendApiFilters espera 'category', no 'categoria'
    }

    if (menuUuid) {
      result.menuUuid = menuUuid;
    }

    if (submenuUuid) {
      result.submenuUuid = submenuUuid;
    }

    return result;
  }, [categoryCode, menuUuid, submenuUuid]);

  // Memoizar los filtros base y aplicados por separado
  const baseFilters = useMemo(() => getCategoryBaseFilters(categoria, seccion), [categoria, seccion]);

  const appliedFilters = useMemo(() =>
    convertFiltersToApi(categoria, filters, seccion, submenuUuid),
    [categoria, filters, seccion, submenuUuid]
  );

  // Combinar todos los filtros solo cuando sea necesario
  const apiFilters = useMemo(() => {
    return { ...baseFilters, ...appliedFilters, ...hierarchyFilters };
  }, [baseFilters, appliedFilters, hierarchyFilters]);

  // Evitar llamadas API hasta que tengamos los datos críticos
  const shouldMakeApiCall = useMemo(() => {
    // Si no tenemos categoryCode, no podemos hacer la llamada
    if (!categoryCode) {
      return false;
    }

    // Si estamos en una sección específica (no vacía), necesitamos menuUuid
    // Si seccion es "" (cadena vacía), significa que estamos en la categoría base, así que no necesitamos menuUuid
    if (seccion && seccion.trim() != "" && !menuUuid) {
      return false;
    }

    // Si hay un parámetro submenu en la URL pero no tenemos submenuUuid resuelto:
    // - Si tenemos menuUuid, proceder (el submenu no pertenece al menú actual, se ignorará)
    // - Si no tenemos menuUuid y estamos en categoría base (seccion vacía), proceder (ignorar submenu)
    // - Si no tenemos menuUuid y hay seccion, esperar (aún estamos cargando el menú)
    const searchParams = new URLSearchParams(globalThis.location.search);
    const submenuParam = searchParams.get('submenu');
    if (submenuParam && !submenuUuid && !menuUuid && seccion && seccion.trim() != "") {
      // Solo bloquear si hay seccion y no tenemos menuUuid
      return false;
    }

    // Si llegamos aquí, tenemos todos los datos necesarios
    return true;
  }, [seccion, menuUuid, categoryCode, submenuUuid]);

  const initialFiltersForProducts = useMemo(
    () => {
      // Solo calcular filtros si debemos hacer la llamada API
      if (!shouldMakeApiCall) {
        return null; // No hacer llamada API
      }

      // Crear objeto de filtros asegurándose de que no incluya menuUuid/submenuUuid cuando son undefined
      const filtersWithoutUndefined = { ...apiFilters };
      
      // Eliminar explícitamente menuUuid y submenuUuid si son undefined
      // Esto asegura que los filtros cambien cuando pasan de tener valor a undefined
      if (!menuUuid) {
        delete filtersWithoutUndefined.menuUuid;
      }
      if (!submenuUuid) {
        delete filtersWithoutUndefined.submenuUuid;
      }

      return applySortToFilters({
        ...filtersWithoutUndefined,
        page: currentPage,
        limit: itemsPerPage,
        lazyLimit: 6, // Cargar 6 productos por scroll
        lazyOffset: 0
      }, sortBy);
    },
    // Incluir menuUuid y submenuUuid explícitamente para detectar cambios
    [shouldMakeApiCall, apiFilters, currentPage, itemsPerPage, sortBy, menuUuid, submenuUuid]
  );

  const productsResult = useProducts(initialFiltersForProducts);

  // Finalizar transición cuando los productos se carguen (con o sin resultados)
  useEffect(() => {
    // Si hay productos, finalizar transición inmediatamente (incluso si está cargando)
    // Esto permite que el caché muestre productos sin esperar la transición
    if (productsResult.products && productsResult.products.length > 0) {
      setIsTransitioning(false);
      setHasLoadedOnce(true);
    } else if (!productsResult.loading && isTransitioning) {
      // Si no hay productos pero terminó de cargar, también finalizar transición
      setIsTransitioning(false);
      // Marcar que ya se cargó al menos una vez, incluso si no hay productos
      setHasLoadedOnce(true);
    }
  }, [productsResult.loading, isTransitioning, productsResult.products]);

  // Retornar loading como true durante la transición SOLO si no hay productos cargados
  // Si hay productos (del caché), no mostrar loading aunque esté en transición
  const finalLoading = productsResult.loading || (isTransitioning && productsResult.products.length === 0);

  return {
    ...productsResult,
    loading: finalLoading,
    // isLoadingMore se mantiene separado, no se afecta por la transición
    isLoadingMore: productsResult.isLoadingMore,
    // hasLoadedOnce indica si ya se completó al menos una carga
    hasLoadedOnce
  };
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
          : (prev[filterType] || []).filter((item) => item != value),
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
