/**
 * 🏷️ CATEGORY SECTION - UNIVERSAL & DYNAMIC
 * Componente universal para CUALQUIER categoría (móviles, electrodomésticos, TVs, etc.)
 * Automáticamente detecta si usar SeriesFilter o modo normal
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useDeviceType } from "@/components/responsive";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Breadcrumbs } from "@/components/breadcrumbs";

import Pagination from "../../dispositivos-moviles/components/Pagination";
import ItemsPerPageSelector from "../../dispositivos-moviles/components/ItemsPerPageSelector";
import FilterSidebar from "../../components/FilterSidebar";
import FilterSidebarSkeleton from "../../components/FilterSidebarSkeleton";
import CategoryProductsGrid from "./ProductsGrid";
import HeaderSection from "./HeaderSection";
import SubmenuCarousel from "./SubmenuCarousel";
import MenuCarousel from "./MenuCarousel";
import SeriesFilterSkeleton from "./SeriesFilterSkeleton";
import SkeletonCard from "@/components/SkeletonCard"; // Aún se usa para carga inicial
import MobileFilterSidebar from "./MobileFilterSidebar";

import type { CategoriaParams, Seccion } from "../types/index.d";
import { useCurrentMenu } from "@/hooks/useCurrentMenu";
import { useCategoryMenus } from "@/hooks/useCategoryMenus";
import { useSelectedHierarchy } from "@/hooks/useSelectedHierarchy";
import { useVisibleCategories } from "@/hooks/useVisibleCategories";
import { useProductBanner } from "@/hooks/useProductBanner";
import { useSubmenus } from "@/hooks/useSubmenus";
import { usePreloadMenuSubmenus } from "@/hooks/usePreloadMenuSubmenus";
import {
  useCategoryPagination,
  useCategorySorting,
  useCategoryProducts,
  useCategoryAnalytics,
} from "../hooks/useCategorySection";
import { useDynamicFilters } from "@/hooks/useDynamicFilters";
import type { DynamicFilterState } from "@/types/filters";

interface CategorySectionProps {
  readonly categoria: CategoriaParams; // Slug de la URL para mapear filtros
  readonly categoriaApiCode: string; // Código de API (AV, DA, IM, etc.)
  readonly seccion: Seccion;
  readonly sectionTitle: string;
}

export default function CategorySection({
  categoria,
  categoriaApiCode,
  seccion,
  sectionTitle,
}: CategorySectionProps) {
  // Eliminados filtros estáticos - solo usar dinámicos
  const filters = {};
  const setFilters = () => {};
  const { categoryCode, categoryUuid, menuUuid, submenuUuid } =
    useSelectedHierarchy(categoriaApiCode, seccion);
  
  // Verificar y cargar submenús bajo demanda cuando el usuario entra a un menú
  usePreloadMenuSubmenus(categoryCode, menuUuid);
  
  // Obtener filtros dinámicos según el contexto
  const {
    filters: dynamicFilters,
    loading: dynamicFiltersLoading,
    error: dynamicFiltersError,
  } = useDynamicFilters({
    categoriaUuid: categoryUuid,
    menuUuid,
    submenuUuid,
  });

  // Estado para filtros dinámicos seleccionados
  const [dynamicFilterState, setDynamicFilterState] = useState<DynamicFilterState>({});

  const {
    currentPage,
    itemsPerPage,
    setCurrentPage,
    handlePageChange,
    handleItemsPerPageChange,
  } = useCategoryPagination(
    categoria,
    seccion,
    menuUuid,
    submenuUuid,
    categoriaApiCode
  );

  // Handler para limpiar todos los filtros
  const handleClearAllFilters = useCallback(() => {
    // Limpiar todos los filtros dinámicos
    setDynamicFilterState({});
    // Resetear a página 1 para cargar productos sin filtros
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    // El cambio de estado disparará automáticamente la recarga de productos
    // a través de useCategoryProducts que detecta cambios en dynamicFilterState
  }, [currentPage, setCurrentPage]);

  // Handler para cambios en filtros dinámicos
  const handleDynamicFilterChange = useCallback(
    (
      filterId: string,
      value: string | { min?: number; max?: number; ranges?: string[]; values?: string[] },
      checked?: boolean
    ) => {
      setDynamicFilterState((prev) => {
        // Crear un nuevo objeto para asegurar que React detecte el cambio
        const newState = { ...prev };
        
        if (typeof value === "string") {
          // Valor simple (para compatibilidad)
          const currentValues = newState[filterId]?.values || [];
          if (checked) {
            newState[filterId] = {
              ...(newState[filterId] || {}),
              values: [...currentValues, value],
            };
          } else {
            const filteredValues = currentValues.filter((v) => v !== value);
            if (filteredValues.length === 0 && !newState[filterId]?.min && !newState[filterId]?.max && !newState[filterId]?.ranges?.length) {
              // Si no hay valores, eliminar el filtro del estado
              const { [filterId]: _, ...rest } = newState;
              return rest;
            } else {
              newState[filterId] = {
                ...(newState[filterId] || {}),
                values: filteredValues,
              };
            }
          }
        } else {
          // Objeto con min/max/ranges/values
          // Si todos los valores están vacíos, eliminar el filtro
          const isEmpty = 
            (!value.min && !value.max && 
             (!value.ranges || value.ranges.length === 0) && 
             (!value.values || value.values.length === 0));
          
          if (isEmpty && !newState[filterId]?.min && !newState[filterId]?.max && !newState[filterId]?.ranges?.length && !newState[filterId]?.values?.length) {
            const { [filterId]: _, ...rest } = newState;
            return rest;
          } else {
            newState[filterId] = {
              ...(newState[filterId] || {}),
              ...value,
            };
          }
        }
        
        // Debug: Log para verificar cambios
        console.log('[CategorySection] dynamicFilterState actualizado:', newState);
        
        return newState;
      });
      
      // Resetear a página 1 cuando cambian los filtros
      if (currentPage !== 1) {
        setCurrentPage(1);
      }
    },
    [currentPage, setCurrentPage]
  );
  const { sortBy, setSortBy } = useCategorySorting();
  
  // Estado para filtros expandidos (reemplaza useFilterManagement)
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(new Set());

  // Actualizar expandedFilters cuando cambian los filtros dinámicos (solo si está vacío)
  useEffect(() => {
    if (dynamicFilters.length > 0 && expandedFilters.size === 0) {
      // Expandir los primeros 2 filtros por defecto
      setExpandedFilters(new Set(dynamicFilters.slice(0, 2).map((f) => f.id)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dynamicFilters]);

  const handleToggleFilter = useCallback((filterKey: string) => {
    setExpandedFilters((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(filterKey)) {
        newExpanded.delete(filterKey);
      } else {
        newExpanded.add(filterKey);
      }
      return newExpanded;
    });
  }, []);

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const sidebarRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const device = useDeviceType();

  // Siempre usar filtros dinámicos (eliminados filtros estáticos)
  const filterConfig = undefined;
  const { currentMenu, loading: menuLoading } = useCurrentMenu(
    categoriaApiCode,
    seccion
  );
  const { menus: categoryMenus, loading: categoryMenusLoading } =
    useCategoryMenus(categoriaApiCode);
  const { visibleCategories, mapCategoryToNavbarName } = useVisibleCategories();

  // Determinar nombre visible de la categoría para título cuando no hay sección
  const categoryVisibleName = (() => {
    const cat = visibleCategories.find((c) => c.nombre === categoriaApiCode);
    if (cat?.nombreVisible) return cat.nombreVisible;
    return mapCategoryToNavbarName
      ? mapCategoryToNavbarName(categoriaApiCode)
      : sectionTitle;
  })();

  const effectiveTitle = seccion ? sectionTitle : categoryVisibleName;

  const {
    products,
    bundles,
    orderedItems,
    loading,
    isLoadingMore,
    error,
    totalItems,
    totalPages,
    refreshProducts,
    loadMore,
    hasMore,
    hasMorePages,
    hasLoadedOnce,
    forceKey,
  } = useCategoryProducts(
    categoria,
    seccion,
    filters,
    currentPage,
    itemsPerPage,
    sortBy,
    categoryUuid,
    menuUuid,
    submenuUuid,
    categoryCode,
    // Pasar filtros dinámicos
    dynamicFilters,
    dynamicFilterState
  );

  // ✅ NUEVO: Obtener submenús del menú actual
  // Solo cargar submenús si hay un menú seleccionado (seccion existe)
  const { submenus } = useSubmenus(currentMenu?.uuid || null);

  // ✅ NUEVO: Encontrar el submenú seleccionado basado en submenuUuid
  const selectedSubmenu = submenuUuid
    ? submenus.find((sm) => sm.uuid === submenuUuid)
    : null;

  // Obtener banner de producto para el grid con soporte de 3 niveles
  // Construir nombres para cada nivel de la jerarquía
  const menuName = seccion
    ? currentMenu?.nombreVisible || currentMenu?.nombre || null
    : null;

  const submenuName = selectedSubmenu
    ? selectedSubmenu.nombreVisible || selectedSubmenu.nombre || null
    : null;

  const { config: bannerConfig, configs: bannerConfigs } = useProductBanner(
    categoryVisibleName,
    menuName,
    submenuName // ← NUEVO: Ahora pasa el submenú seleccionado
  );

  // Mientras el menú/series o los productos estén cargando, debemos mostrar skeletons en el grid
  const compositeLoading =
    loading || menuLoading || (!seccion && categoryMenusLoading);

  // Configurar scroll infinito
  // Usar isLoadingMore en lugar de loading para evitar bloquear mientras se cargan productos adicionales
  const loadMoreRef = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore: hasMore,
    isLoading: loading || isLoadingMore,
    threshold: 800, // Disparar la carga cuando esté a 800px del final
  });

  useCategoryAnalytics(categoria, seccion, totalItems);

  // useEffect(() => {
  //   console.log('sospechoso 7')
  //   setCurrentPage(1);
  // }, [sortBy, setCurrentPage]);

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Error al cargar productos
        </h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={refreshProducts}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          type="button"
        >
          Intentar nuevamente
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-10">
      {/* Breadcrumbs */}
      <div className="mb-4 mt-2">
        <Breadcrumbs />
      </div>

      {/* Mostrar skeleton mientras cargan menús/series */}
      {menuLoading || (!seccion && categoryMenusLoading) ? (
        <SeriesFilterSkeleton />
      ) : seccion && currentMenu ? (
        /* Usar SubmenuCarousel solo si hay sección específica */
        <SubmenuCarousel
          menu={currentMenu}
          categoria={categoria}
          seccion={seccion}
          categoryCode={categoryCode}
          menuUuid={menuUuid}
          title={sectionTitle}
        />
      ) : !seccion && categoryMenus.length > 0 ? (
        /* Mostrar carrusel de MENÚS cuando no hay sección seleccionada */
        <MenuCarousel
          menus={categoryMenus}
          categoria={categoria}
          categoryCode={categoryCode}
          title={effectiveTitle}
        />
      ) : null}

      <HeaderSection
        title={effectiveTitle}
        totalItems={totalItems}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onShowMobileFilters={() => setShowMobileFilters(true)}
        dynamicFilterState={dynamicFilterState}
        onClearDynamicFilters={handleClearAllFilters}
        clearAllFiltersText={`Ver todos los ${effectiveTitle.toLowerCase()}`}
      />

      <div
        className={cn(
          "flex gap-6 items-start",
          device === "mobile" || device === "tablet" ? "flex-col" : "flex-row"
        )}
      >
        {(device === "desktop" || device === "large") && (
          <aside
            ref={sidebarRef}
            className="shrink-0 w-80 sticky self-start"
            style={{
              top: "100px",
              maxHeight: "calc(100vh - 120px)",
              overflowY: "auto",
              position: "sticky",
            }}
          >
            {dynamicFiltersLoading ? (
              <FilterSidebarSkeleton />
            ) : (
              <FilterSidebar
                // Solo filtros dinámicos
                dynamicFilters={dynamicFilters}
                dynamicFilterState={dynamicFilterState}
                onDynamicFilterChange={handleDynamicFilterChange}
                // Props comunes
                expandedFilters={expandedFilters}
                onToggleFilter={handleToggleFilter}
                resultCount={totalItems || 0}
              />
            )}
          </aside>
        )}

        <MobileFilterSidebar
          show={showMobileFilters}
          onClose={() => setShowMobileFilters(false)}
          // Solo filtros dinámicos
          dynamicFilters={dynamicFilters}
          dynamicFilterState={dynamicFilterState}
          onDynamicFilterChange={handleDynamicFilterChange}
          // Props comunes
          expandedFilters={expandedFilters}
          onToggleFilter={handleToggleFilter}
          resultCount={totalItems || 0}
          loading={dynamicFiltersLoading}
        />

        <div
          ref={productsRef}
          className={cn(
            "flex-1 min-w-0",
            device === "mobile" ? "px-2" : device === "tablet" ? "px-4" : "px-0"
          )}
        >
          {/* Mostrar grid de productos (incluye skeleton, mensaje de vacío o productos) */}
          <CategoryProductsGrid
            key={`grid-${forceKey}`}
            ref={productsRef}
            products={products}
            bundles={bundles}
            orderedItems={orderedItems}
            loading={compositeLoading}
            isLoadingMore={isLoadingMore}
            error={error}
            refreshProducts={refreshProducts}
            viewMode={viewMode}
            categoryName={effectiveTitle}
            showLazySkeletons={hasMore}
            lazySkeletonCount={3}
            hasLoadedOnce={hasLoadedOnce}
            banner={bannerConfig}
            banners={bannerConfigs}
          />

          {/* Elemento invisible para detectar scroll */}
          {!error && hasMore && products.length > 0 && (
            <div ref={loadMoreRef} className="h-4" />
          )}

          {/* Paginación tradicional */}
          {!error && products.length > 0 && (
            <div className="mt-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                <ItemsPerPageSelector
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
                {!hasMore && !hasMorePages && (
                  <p className="text-gray-500 text-sm">
                    Has visto todos los productos de esta página
                  </p>
                )}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
