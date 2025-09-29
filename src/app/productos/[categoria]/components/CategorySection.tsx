/**
 * 🏷️ CATEGORY SECTION COMPONENT
 *
 * Componente genérico que maneja la visualización de productos por categoría
 * - Utiliza el hook useProducts estandarizado
 * - Sistema de filtros dinámico
 * - CategorySlider para navegación entre secciones
 * - Paginación y ordenamiento
 * - Responsive design
 */

"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { Filter, X } from "lucide-react";
import { useProducts } from "@/features/products/useProducts";
import Pagination from "../../dispositivos-moviles/components/Pagination";
import { posthogUtils } from "@/lib/posthogClient";
import FilterSidebar, {
  type FilterState,
} from "../../components/FilterSidebar";
import CategorySlider from "../../components/CategorySlider";
import ProductCard from "../../components/ProductCard";
import SkeletonCard from "@/components/SkeletonCard";
import { useDeviceType } from "@/components/responsive";
import { useSticky, useStickyClasses } from "@/hooks/useSticky";

import { CategoriaParams, Seccion } from "../types";
import {
  getCategoryBaseFilters,
  convertFiltersToApi,
} from "../utils/categoryUtils";
import {
  getCategoryFilters,
  getCategorySliderConfig,
  getCategoryFilterConfig,
} from "../constants/categoryConstants";

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
  // Estados básicos
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  // Estados para filtros
  const initialFilters = getCategoryFilters(categoria);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(Object.keys(initialFilters).slice(0, 2))
  );
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Refs para sticky
  const sidebarRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  const device = useDeviceType();

  // Sticky sidebar (desktop)
  const stickyEnabled = device === "desktop" || device === "large";
  const stickyState = useSticky({
    enabled: stickyEnabled,
    topOffset: 100,
    bottomOffset: 50,
    sidebarRef,
    productsRef,
  });
  const stickyClasses = useStickyClasses(stickyState);

  // Convertir filtros aplicados a formato API
  const apiFilters = useMemo(() => {
    const baseFilters = getCategoryBaseFilters(categoria, seccion);
    const appliedFilters = convertFiltersToApi(categoria, filters, seccion);
    const result = { ...baseFilters, ...appliedFilters };

    return result;
  }, [categoria, seccion, filters]);

  const initialFiltersForProducts = useMemo(
    () => ({
      ...apiFilters,
      page: currentPage,
      limit: itemsPerPage,
    }),
    [apiFilters, currentPage, itemsPerPage]
  );

  const { products, loading, error, totalItems, totalPages, refreshProducts } =
    useProducts(initialFiltersForProducts);

  // Configuraciones para los componentes
  const sliderCategories = getCategorySliderConfig(categoria);
  const filterConfig = getCategoryFilterConfig(categoria);

  // Tracking de vista de página
  useEffect(() => {
    posthogUtils.capture("page_view_category", {
      categoria,
      seccion,
      totalResults: totalItems,
    });
  }, [categoria, seccion, totalItems]);

  // Resetear página y filtros cuando cambie la sección
  useEffect(() => {
    setCurrentPage(1);
    setFilters(getCategoryFilters(categoria));
  }, [categoria, seccion]);

  // Handlers
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleItemsPerPageChange = useCallback((items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  }, []);

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
    [categoria, seccion]
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

  // Layout classes dinámicas
  const containerClasses = cn(
    "flex gap-6",
    device === "mobile" || device === "tablet" ? "flex-col" : "flex-row"
  );

  const sidebarClasses = cn(
    "shrink-0",
    device === "mobile" || device === "tablet" ? "w-full" : "w-80",
    stickyClasses
  );

  let contentPadding = "px-0";
  if (device === "mobile") {
    contentPadding = "px-2";
  } else if (device === "tablet") {
    contentPadding = "px-4";
  }
  const contentClasses = cn("flex-1 min-w-0", contentPadding);

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Error al cargar productos
        </h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={refreshProducts}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Intentar nuevamente
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* CategorySlider */}
      <div className="mb-6">
        <CategorySlider categories={sliderCategories} />
      </div>

      {/* Main content */}
      <div className={containerClasses}>
        {/* Sidebar para desktop/tablet */}
        {(device === "desktop" || device === "large") && (
          <div ref={sidebarRef} className={sidebarClasses}>
            <FilterSidebar
              filterConfig={filterConfig}
              filters={filters}
              onFilterChange={handleFilterChange}
              expandedFilters={expandedFilters}
              onToggleFilter={handleToggleFilter}
              resultCount={totalItems || 0}
              stickyContainerClasses={stickyClasses.containerClasses}
              stickyWrapperClasses={stickyClasses.wrapperClasses}
              stickyStyle={stickyClasses.style}
            />
          </div>
        )}

        {/* Overlay para mobile filters */}
        {showMobileFilters && (device === "mobile" || device === "tablet") && (
          <div className="fixed inset-0 z-50 flex">
            <button
              type="button"
              className="fixed inset-0 bg-black/50"
              onClick={() => setShowMobileFilters(false)}
              onKeyDown={(e) =>
                e.key === "Escape" && setShowMobileFilters(false)
              }
              aria-label="Cerrar filtros"
            />
            <div className="relative bg-white w-full max-w-sm h-full overflow-y-auto">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Filtros</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <FilterSidebar
                  filterConfig={filterConfig}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  expandedFilters={expandedFilters}
                  onToggleFilter={handleToggleFilter}
                  resultCount={totalItems || 0}
                />
              </div>
            </div>
          </div>
        )}

        {/* Contenido principal */}
        <div ref={productsRef} className={contentClasses}>
          {/* Header con título y controles mobile */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {sectionTitle}
              </h1>
              <p className="text-gray-600">
                {totalItems} productos disponibles
              </p>
            </div>

            {(device === "mobile" || device === "tablet") && (
              <button
                onClick={() => setShowMobileFilters(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filtros
              </button>
            )}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: itemsPerPage }, (_, index) => (
                <SkeletonCard
                  key={`skeleton-${categoria}-${seccion}-${index}`}
                />
              ))}
            </div>
          )}

          {/* Products Grid */}
          {!loading && products.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {products.map((product) => (
                  <ProductCard
                    key={product.sku || product.id}
                    id={product.id}
                    name={product.name}
                    image={product.image || "/img/empty.jpeg"}
                    colors={product.colors || []}
                    price={product.price?.toString()}
                    originalPrice={product.originalPrice?.toString()}
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                    brand={product.brand}
                    category={product.category}
                    subcategory={product.subcategory}
                    sku={product.sku}
                    puntos_q={100}
                  />
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="items-per-page"
                    className="text-sm text-gray-700"
                  >
                    Productos por página:
                  </label>
                  <select
                    id="items-per-page"
                    value={itemsPerPage}
                    onChange={(e) =>
                      handleItemsPerPageChange(Number(e.target.value))
                    }
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value={15}>15</option>
                    <option value={30}>30</option>
                    <option value={45}>45</option>
                  </select>
                </div>
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="mt-8">
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

          {/* Empty state */}
          {!loading && products.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-600">
                Intenta con diferentes filtros o revisa más tarde
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
