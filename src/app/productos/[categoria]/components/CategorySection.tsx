/**
 * 🏷️ CATEGORY SECTION - UNIVERSAL & DYNAMIC
 * Componente universal para CUALQUIER categoría (móviles, electrodomésticos, TVs, etc.)
 * Automáticamente detecta si usar SeriesFilter o modo normal
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useDeviceType } from "@/components/responsive";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Breadcrumbs } from "@/components/breadcrumbs";

import Pagination from "../../dispositivos-moviles/components/Pagination";
import ItemsPerPageSelector from "../../dispositivos-moviles/components/ItemsPerPageSelector";
import FilterSidebar from "../../components/FilterSidebar";
import CategoryProductsGrid from "./ProductsGrid";
import HeaderSection from "./HeaderSection";
import SubmenuCarousel from "./SubmenuCarousel";
import MenuCarousel from "./MenuCarousel";
import SeriesFilterSkeleton from "./SeriesFilterSkeleton";
import SkeletonCard from "@/components/SkeletonCard"; // Aún se usa para carga inicial
import MobileFilterSidebar from "./MobileFilterSidebar";

import type { CategoriaParams, Seccion } from "../types/index.d";
import { getCategoryFilterConfig } from "../constants/categoryConstants";
import { useCurrentMenu } from "@/hooks/useCurrentMenu";
import { useCategoryMenus } from "@/hooks/useCategoryMenus";
import { useSelectedHierarchy } from "@/hooks/useSelectedHierarchy";
import { useVisibleCategories } from "@/hooks/useVisibleCategories";
import { useProductBanner } from "@/hooks/useProductBanner";
import {
  useCategoryFilters,
  useCategoryPagination,
  useCategorySorting,
  useCategoryProducts,
  useCategoryAnalytics,
  useFilterManagement,
} from "../hooks/useCategorySection";

interface CategorySectionProps {
  readonly categoria: CategoriaParams;  // Slug de la URL para mapear filtros
  readonly categoriaApiCode: string;  // Código de API (AV, DA, IM, etc.)
  readonly seccion: Seccion;
  readonly sectionTitle: string;
}

export default function CategorySection({
  categoria,
  categoriaApiCode,
  seccion,
  sectionTitle,
}: CategorySectionProps) {
  const { filters, setFilters } = useCategoryFilters(categoria, seccion);
  const { categoryCode, categoryUuid, menuUuid, submenuUuid } = useSelectedHierarchy(categoriaApiCode, seccion);
  const { currentPage, itemsPerPage, setCurrentPage, handlePageChange, handleItemsPerPageChange } = useCategoryPagination(categoria, seccion, menuUuid, submenuUuid);
  const { sortBy, setSortBy } = useCategorySorting();
  const { expandedFilters, handleFilterChange, handleToggleFilter } = useFilterManagement(
    categoria,
    seccion,
    setFilters
  );

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const sidebarRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const device = useDeviceType();

  const filterConfig = getCategoryFilterConfig(categoria, seccion);
  const { currentMenu, loading: menuLoading } = useCurrentMenu(categoriaApiCode, seccion);
  const { menus: categoryMenus, loading: categoryMenusLoading } = useCategoryMenus(categoriaApiCode);
  const { visibleCategories, mapCategoryToNavbarName } = useVisibleCategories();

  // Determinar nombre visible de la categoría para título cuando no hay sección
  const categoryVisibleName = (() => {
    const cat = visibleCategories.find(c => c.nombre === categoriaApiCode);
    if (cat?.nombreVisible) return cat.nombreVisible;
    return mapCategoryToNavbarName ? mapCategoryToNavbarName(categoriaApiCode) : sectionTitle;
  })();

  const effectiveTitle = seccion ? sectionTitle : categoryVisibleName;

  const { products, loading, isLoadingMore, error, totalItems, totalPages, refreshProducts, loadMore, hasMore, hasMorePages, hasLoadedOnce } = useCategoryProducts(
    categoria,
    seccion,
    filters,
    currentPage,
    itemsPerPage,
    sortBy,
    categoryUuid,
    menuUuid,
    submenuUuid,
    categoryCode
  );

  // Obtener banner de producto para el grid
  const submenuName = currentMenu?.nombreVisible || currentMenu?.nombre;
  const { config: bannerConfig } = useProductBanner(categoryVisibleName, submenuName);

  // Mientras el menú/series o los productos estén cargando, debemos mostrar skeletons en el grid
  const compositeLoading = loading || menuLoading || (!seccion && categoryMenusLoading);

  // Configurar scroll infinito
  // Usar isLoadingMore en lugar de loading para evitar bloquear mientras se cargan productos adicionales
  const loadMoreRef = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore: hasMore,
    isLoading: loading || isLoadingMore,
    threshold: 800, // Disparar la carga cuando esté a 800px del final
  });

  useCategoryAnalytics(categoria, seccion, totalItems);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, setCurrentPage]);

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error al cargar productos</h2>
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
        filters={filters}
        setFilters={setFilters}
        clearAllFiltersText={`Ver todos los ${effectiveTitle.toLowerCase()}`}
      />

      <div className={cn("flex gap-6 items-start", device === "mobile" || device === "tablet" ? "flex-col" : "flex-row")}>
        {(device === "desktop" || device === "large") && (
          <aside
            ref={sidebarRef}
            className="shrink-0 w-80 sticky self-start"
            style={{
              top: '100px',
              maxHeight: 'calc(100vh - 120px)',
              overflowY: 'auto',
              position: 'sticky',
            }}
          >
            <FilterSidebar
              filterConfig={filterConfig}
              filters={filters}
              onFilterChange={handleFilterChange}
              expandedFilters={expandedFilters}
              onToggleFilter={handleToggleFilter}
              resultCount={totalItems || 0}
            />
          </aside>
        )}

        <MobileFilterSidebar
          show={showMobileFilters}
          onClose={() => setShowMobileFilters(false)}
          filterConfig={filterConfig}
          filters={filters}
          onFilterChange={handleFilterChange}
          expandedFilters={expandedFilters}
          onToggleFilter={handleToggleFilter}
          resultCount={totalItems || 0}
        />

        <div
          ref={productsRef}
          className={cn("flex-1 min-w-0", device === "mobile" ? "px-2" : device === "tablet" ? "px-4" : "px-0")}
        >
          {/* Mostrar grid de productos (incluye skeleton, mensaje de vacío o productos) */}
          <CategoryProductsGrid
            ref={productsRef}
            products={products}
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
