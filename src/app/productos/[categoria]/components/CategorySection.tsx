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
import { X } from "lucide-react";
import { useProducts } from "@/features/products/useProducts";
import Pagination from "../../dispositivos-moviles/components/Pagination";
import { posthogUtils } from "@/lib/posthogClient";
import FilterSidebar, {
  type FilterState,
} from "../../components/FilterSidebar";
import CategorySlider, {
  type Category,
} from "./CategorySlider";
import CategoryProductsGrid from "./ProductsGrid";
import HeaderSection from "./HeaderSection";
import ItemsPerPageSelector from "../../dispositivos-moviles/components/ItemsPerPageSelector";
import SkeletonCard from "@/components/SkeletonCard";
import { applySortToFilters } from "@/lib/sortUtils";
import { useRouter, useSearchParams } from "next/navigation";
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
  const [isScrolled, setIsScrolled] = useState(false);

  // Estados para filtros
  const initialFilters = getCategoryFilters(categoria, seccion);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(Object.keys(initialFilters).slice(0, 2))
  );
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Estados para vista y ordenamiento
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("");

  // Refs para sticky
  const sidebarRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  const device = useDeviceType();
  const router = useRouter();

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
    () => {
      const baseFilters = {
        ...apiFilters,
        page: currentPage,
        limit: itemsPerPage,
      };
      return applySortToFilters(baseFilters, sortBy);
    },
    [apiFilters, currentPage, itemsPerPage, sortBy]
  );

  const { products, loading, error, totalItems, totalPages, refreshProducts } =
    useProducts(initialFiltersForProducts);

  // Configuraciones para los componentes
  const sliderCategories = getCategorySliderConfig(categoria);
  const filterConfig = getCategoryFilterConfig(categoria, seccion);

  // Determinar categoría activa
  const searchParams = useSearchParams();
  const sectionParam = searchParams?.get("seccion");
  const activeCategoryId = useMemo(() => {
    if (sectionParam) {
      // Buscar por ID directamente primero
      const directMatch = sliderCategories.find(
        (cat) => cat.id === sectionParam
      );
      if (directMatch) {
        return directMatch.id;
      }
      // Si no hay match directo, buscar en el href
      const foundCategory = sliderCategories.find((cat) =>
        cat.href.includes(`seccion=${sectionParam}`)
      );
      if (foundCategory) {
        return foundCategory.id;
      }
    }
    // Default: primera categoría
    return sliderCategories[0]?.id || "";
  }, [sectionParam, sliderCategories]);

  // Tracking de vista de página
  useEffect(() => {
    posthogUtils.capture("page_view_category", {
      categoria,
      seccion,
      totalResults: totalItems,
    });
  }, [categoria, seccion, totalItems]);

  // Detectar scroll para modo condensado
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Resetear página y filtros cuando cambie la sección
  useEffect(() => {
    setCurrentPage(1);
    setFilters(getCategoryFilters(categoria, seccion));
  }, [categoria, seccion]);

  // Resetear página cuando cambie el ordenamiento
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy]);

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

  // Header Section
  const HeaderSectionMemo = useMemo(
    () => (
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
    ),
    [sectionTitle, totalItems, sortBy, viewMode, filters]
  );

  // Category click handler
  const handleCategoryClick = useCallback(
    (category: Category) => {
      router.replace(category.href);
    },
    [router]
  );

  // Layout classes dinámicas
  const containerClasses = cn(
    "flex gap-6",
    device === "mobile" || device === "tablet" ? "flex-col" : "flex-row"
  );

  const sidebarClasses = cn(
    "shrink-0",
    device === "mobile" || device === "tablet" ? "w-full" : "w-80"
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
      {/* CategorySlider - Siempre fijo */}
      <div
        className={cn(
          "fixed z-40 bg-white border-b border-gray-200 left-0 right-0 transition-all duration-300",
          isScrolled ? "py-3" : "py-4 lg:py-6",
          "top-[52px] sm:top-[60px] lg:top-[104px]"
        )}
      >
        <CategorySlider
          categories={sliderCategories}
          onCategoryClick={handleCategoryClick}
          activeCategoryId={activeCategoryId}
          condensed={isScrolled}
        />
      </div>

      {/* Spacer para compensar el espacio de la franja fija */}
      <div className={cn(isScrolled ? "h-[80px]" : "h-[120px] sm:h-[140px] lg:h-[160px]")} />

      {/* Header Section */}
      {HeaderSectionMemo}

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
