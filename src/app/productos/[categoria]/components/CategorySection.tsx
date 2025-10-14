/**
 * 🏷️ CATEGORY SECTION - UNIVERSAL & DYNAMIC
 * Componente universal para CUALQUIER categoría (móviles, electrodomésticos, TVs, etc.)
 * Automáticamente detecta si usar SeriesFilter o modo normal
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useDeviceType } from "@/components/responsive";

import Pagination from "../../dispositivos-moviles/components/Pagination";
import FilterSidebar from "../../components/FilterSidebar";
import CategoryProductsGrid from "./ProductsGrid";
import HeaderSection from "./HeaderSection";
import UniversalSeriesFilter from "./UniversalSeriesFilter";
import ItemsPerPageSelector from "../../dispositivos-moviles/components/ItemsPerPageSelector";
import SkeletonCard from "@/components/SkeletonCard";
import MobileFilterSidebar from "./MobileFilterSidebar";

import type { CategoriaParams, Seccion } from "../types/index.d";
import { getCategoryFilterConfig } from "../constants/categoryConstants";
import { getSeriesConfig } from "../config/series-configs";
import {
  useCategoryFilters,
  useCategoryPagination,
  useCategorySorting,
  useCategoryProducts,
  useCategoryAnalytics,
  useFilterManagement,
} from "../hooks/useCategorySection";

interface CategorySectionProps {
  readonly categoria: CategoriaParams;
  readonly seccion: Seccion;
  readonly sectionTitle: string;
}

export default function CategorySection({
  categoria,
  seccion,
  sectionTitle,
}: CategorySectionProps) {
  const { filters, setFilters } = useCategoryFilters(categoria, seccion);
  const { currentPage, itemsPerPage, setCurrentPage, handlePageChange, handleItemsPerPageChange } =
    useCategoryPagination();
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

  const { products, loading, error, totalItems, totalPages, refreshProducts } = useCategoryProducts(
    categoria,
    seccion,
    filters,
    currentPage,
    itemsPerPage,
    sortBy
  );

  useCategoryAnalytics(categoria, seccion, totalItems);

  const filterConfig = getCategoryFilterConfig(categoria, seccion);
  const seriesConfig = getSeriesConfig(seccion);

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
      {seriesConfig && (
        <UniversalSeriesFilter
          config={seriesConfig}
          activeFilters={filters}
          onFilterChange={handleFilterChange}
          categoria={categoria}
          seccion={seccion}
        />
      )}

      <HeaderSection
        title={sectionTitle}
        totalItems={totalItems}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onShowMobileFilters={() => setShowMobileFilters(true)}
        filters={filters}
        setFilters={setFilters}
        clearAllFiltersText={`Ver todos los ${sectionTitle.toLowerCase()}`}
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
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: itemsPerPage }, (_, i) => (
                <SkeletonCard key={`sk-${i}`} />
              ))}
            </div>
          )}

          {!loading && (
            <>
              <CategoryProductsGrid
                ref={productsRef}
                products={products}
                loading={loading}
                error={error}
                refreshProducts={refreshProducts}
                viewMode={viewMode}
                categoryName={sectionTitle}
                showBanner={(device === "desktop" || device === "large") && products.length >= 4}
              />

              {!error && products.length > 0 && (
                <div className="mt-8">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                    <ItemsPerPageSelector
                      itemsPerPage={itemsPerPage}
                      onItemsPerPageChange={handleItemsPerPageChange}
                    />
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
