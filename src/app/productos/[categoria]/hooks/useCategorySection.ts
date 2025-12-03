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
import { convertDynamicFiltersToApi } from "../utils/dynamicFilterUtils";
import type { DynamicFilterConfig, DynamicFilterState } from "@/types/filters";

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
  const [itemsPerPage, setItemsPerPage] = useState(50);

  // Refs para rastrear si ya se inicializó y los valores previos
  const isInitializedRef = useRef(false);
  const previousCategoriaRef = useRef<CategoriaParams | undefined>(undefined);
  const previousMenuUuidRef = useRef<string | undefined>(undefined);
  const previousSubmenuUuidRef = useRef<string | undefined>(undefined);

  // Efecto para manejar cambios de ubicación y restauración de página
  useEffect(() => {
    // Solo esperar a que tengamos categoriaApiCode, que es el único valor realmente crítico
    if (!categoriaApiCode) {
      // Sin categoría no podemos proceder
      return;
    }

    // IMPORTANTE: Si estamos en una sección (seccion no vacía) pero menuUuid aún es undefined, ESPERAR
    // Esto evita inicializar con valores incorrectos cuando menuUuid llega con delay
    if (seccion && seccion.trim() !== "" && !menuUuid) {
     
      return;
    }

    // IMPORTANTE: Si hay un parámetro submenu en la URL pero submenuUuid aún es undefined, ESPERAR
    // Esto evita inicializar con valores incorrectos cuando submenuUuid llega con delay
    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const hasSubmenuParam = urlParams.has('submenu');
    if (hasSubmenuParam && !submenuUuid && menuUuid) {
    
      return;
    }

    // Verificar si la ubicación cambió comparando con valores previos
    // Normalizar valores para comparación consistente
    const currentMenuUuidNorm = menuUuid ?? undefined;
    const currentSubmenuUuidNorm = submenuUuid ?? undefined;
    const prevMenuUuidNorm = previousMenuUuidRef.current ?? undefined;
    const prevSubmenuUuidNorm = previousSubmenuUuidRef.current ?? undefined;

    // Detectar cambio de ubicación
    // IMPORTANTE: Comparar siempre si ya se inicializó, no solo cuando el valor previo !== undefined
    // Esto permite detectar cambios de undefined a valor (ej: categoría base → sección)
    const categoriaChanged = isInitializedRef.current && previousCategoriaRef.current !== categoria;
    const menuUuidChanged = isInitializedRef.current && prevMenuUuidNorm !== currentMenuUuidNorm;
    const submenuUuidChanged = isInitializedRef.current && prevSubmenuUuidNorm !== currentSubmenuUuidNorm;

    const locationChanged = categoriaChanged || menuUuidChanged || submenuUuidChanged;


    if (!isInitializedRef.current) {
      // Primera inicialización: intentar restaurar página guardada
      try {
        const saved = localStorage.getItem("imagiq_last_location");
        if (saved) {
          const parsed = JSON.parse(saved);

          // Normalizar undefined/null a undefined para comparación consistente
          const savedCategoria = parsed.categoria;
          const savedMenuUuid = parsed.menuUuid ?? undefined;
          const savedSubmenuUuid = parsed.submenuUuid ?? undefined;
          const currentMenuUuid = menuUuid ?? undefined;
          const currentSubmenuUuid = submenuUuid ?? undefined;



          // IMPORTANTE: Comparar TODA la ruta completa, no solo el nivel actual
          const categoriaMatches = savedCategoria === categoriaApiCode;
          const menuUuidMatches = savedMenuUuid === currentMenuUuid;
          const submenuUuidMatches = savedSubmenuUuid === currentSubmenuUuid;

          if (categoriaMatches && menuUuidMatches && submenuUuidMatches) {
            setCurrentPage(parsed.page || 1);
          } else {
            setCurrentPage(1);
          }
        } else {
  
          setCurrentPage(1);
        }
      } catch (error) {
        setCurrentPage(1);
      }
      isInitializedRef.current = true;
      // Guardar valores iniciales
      previousCategoriaRef.current = categoria;
      //previousSeccionRef.current = seccion;
      previousMenuUuidRef.current = menuUuid;
      previousSubmenuUuidRef.current = submenuUuid;
    }else if (locationChanged) {
      // Cambio de ubicación después de inicializar: resetear a página 1
      setCurrentPage(1);
      // Actualizar valores previos
      previousCategoriaRef.current = categoria;
      previousMenuUuidRef.current = menuUuid;
      previousSubmenuUuidRef.current = submenuUuid;
    }
  }, [categoria, seccion, menuUuid, submenuUuid, categoriaApiCode]);

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
  categoryCode?: string,
  // Filtros dinámicos (nuevo)
  dynamicFilters?: DynamicFilterConfig[],
  dynamicFilterState?: DynamicFilterState
) {
  // Inicializar con el estado de sección actual
  const [previousSeccion, setPreviousSeccion] = useState(seccion);
  // Estado para rastrear transiciones de sección - inicializar en true para la primera carga
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Detectar cambio de sección o menú
  const [previousMenuUuid, setPreviousMenuUuid] = useState(menuUuid);
  const [forceKey, setForceKey] = useState(0); // Key para forzar re-render completo

  useEffect(() => {
    if (previousSeccion != seccion || previousMenuUuid != menuUuid) {
      setIsTransitioning(true);
      setHasLoadedOnce(false); // Resetear cuando cambia la categoría/sección
      setPreviousSeccion(seccion);
      setPreviousMenuUuid(menuUuid);
      setForceKey(prev => prev + 1); // Incrementar key para forzar re-mount
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

  // Siempre usar filtros dinámicos (eliminados filtros estáticos)
  // Serializar dynamicFilterState para forzar detección de cambios
  const dynamicFilterStateSerialized = useMemo(() => {
    return JSON.stringify(dynamicFilterState || {});
  }, [dynamicFilterState]);

  // Rastrear cambios en filtros para forzar mostrar skeletons
  const [previousFilterState, setPreviousFilterState] = useState<string>(dynamicFilterStateSerialized);
  const [filtersChanged, setFiltersChanged] = useState(false);

  useEffect(() => {
    if (previousFilterState !== dynamicFilterStateSerialized) {
      // Los filtros cambiaron
      setFiltersChanged(true);
      setPreviousFilterState(dynamicFilterStateSerialized);
    }
  }, [dynamicFilterStateSerialized, previousFilterState]);

  const appliedFilters = useMemo(() => {
    // Si hay filtros dinámicos y estado de filtros (aunque esté vacío), convertir
    if (dynamicFilters && dynamicFilters.length > 0 && dynamicFilterState) {
      // Usar conversión de filtros dinámicos (puede retornar {} si no hay selecciones)
      const converted = convertDynamicFiltersToApi(dynamicFilterState, dynamicFilters);
      // Debug: Log para verificar que se están convirtiendo los filtros
      console.log('[useCategoryProducts] Filtros convertidos:', {
        dynamicFilterState: JSON.parse(JSON.stringify(dynamicFilterState)),
        converted: JSON.parse(JSON.stringify(converted)),
        hasFilters: Object.keys(converted).length > 0,
        convertedKeys: Object.keys(converted)
      });
      return converted;
    } else {
      // Si no hay filtros dinámicos, retornar objeto vacío
      return {};
    }
  }, [dynamicFilters, dynamicFilterStateSerialized, dynamicFilterState]);

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

      const finalFilters = applySortToFilters({
        ...filtersWithoutUndefined,
        page: currentPage,
        limit: itemsPerPage,
        lazyLimit: 6, // Cargar 6 productos por scroll
        lazyOffset: 0
      }, sortBy);

      // Debug: Log para verificar que los filtros finales se están creando correctamente
      console.log('[useCategoryProducts] initialFiltersForProducts:', {
        apiFilters: JSON.parse(JSON.stringify(apiFilters)),
        filtersWithoutUndefined: JSON.parse(JSON.stringify(filtersWithoutUndefined)),
        finalFilters: JSON.parse(JSON.stringify(finalFilters)),
        currentPage,
        itemsPerPage
      });

      return finalFilters;
    },
    // Incluir menuUuid y submenuUuid explícitamente para detectar cambios
    [shouldMakeApiCall, apiFilters, currentPage, itemsPerPage, sortBy, menuUuid, submenuUuid]
  );

  const productsResult = useProducts(initialFiltersForProducts);

  // Resetear el flag de filtros cambiados cuando los productos se carguen
  useEffect(() => {
    if (filtersChanged && (!productsResult.loading || productsResult.products.length > 0)) {
      // Si los filtros cambiaron y:
      // - Ya terminó de cargar, O
      // - Hay productos cargados (aunque siga cargando)
      // Resetear el flag
      setFiltersChanged(false);
    }
  }, [filtersChanged, productsResult.loading, productsResult.products.length]);

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
  // CRÍTICO: Si los filtros cambiaron, siempre mostrar loading hasta que termine de cargar o haya productos nuevos
  // Esto asegura que se muestren skeletons cuando cambian los filtros
  const finalLoading = 
    productsResult.loading || 
    (isTransitioning && productsResult.products.length === 0) ||
    (filtersChanged && (productsResult.loading || productsResult.products.length === 0));

  return {
    ...productsResult,
    loading: finalLoading,
    // isLoadingMore se mantiene separado, no se afecta por la transición
    isLoadingMore: productsResult.isLoadingMore,
    // hasLoadedOnce indica si ya se completó al menos una carga
    hasLoadedOnce,
    // forceKey para forzar re-mount del grid cuando cambia la sección
    forceKey,
    // bundles ya viene en productsResult, así que se incluye automáticamente con el spread
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
