/**
 * 🎧 GALAXY BUDS SECTION - IMAGIQ ECOMMERCE
 *
 * Sección de audífonos Galaxy Buds con:
 * - Filtros específicos para audio
 * - Productos Galaxy Buds
 * - Características específicas de audífonos
 * - Responsive global implementado
 */

"use client";

import { useProducts } from "@/features/products/useProducts";
import { posthogUtils } from "@/lib/posthogClient";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import CategorySlider from "../components/CategorySlider";
import FilterSidebar, {
  MobileFilterModal,
  type FilterState,
} from "../components/FilterSidebar";
import { useDeviceType } from "@/components/responsive";
import Pagination from "./components/Pagination";
import ItemsPerPageSelector from "./components/ItemsPerPageSelector";
import { useSticky, useStickyClasses } from "@/hooks/useSticky";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import { cn } from "@/lib/utils";
import HeaderSection from "./components/HeaderSection";
import ProductGrid from "./components/ProductGrid";
import { budsCategories, budsFilters } from "./constants/galaxyBudsConstants";
import { getApiFilters } from "./utils/budsUtils";



export default function GalaxyBudsSection() {
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(["serie"])
  );
  const [filters, setFilters] = useState<FilterState>({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevancia");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  // Refs para sticky behavior
  const sidebarRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  // Usar el hook de productos con filtro por palabra "buds"
  const apiFilters = useMemo(() => getApiFilters(filters), [filters]);

  // Crear filtros iniciales con paginación
  const initialFilters = useMemo(() => {
    const filters = {
      ...apiFilters,
      page: currentPage,
      limit: itemsPerPage,
    };
    return filters;
  }, [apiFilters, currentPage, itemsPerPage]);

  const { products, loading, error, totalItems, totalPages, filterProducts, refreshProducts } =
    useProducts(initialFilters);

  // Ref para evitar bucles infinitos
  const lastFiltersRef = useRef<string>("");
  const device = useDeviceType(); // Obtén el tipo de dispositivo

  // Sticky behavior (solo en desktop/large)
  const stickyEnabled = device === "desktop" || device === "large";
  const stickyState = useSticky({
    sidebarRef,
    productsRef,
    topOffset: 120,
    enabled: stickyEnabled,
  });

  const { containerClasses, wrapperClasses, style } = useStickyClasses(stickyState);

  // Resetear a la página 1 cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Actualizar filtros cuando cambien los parámetros de paginación
  useEffect(() => {
    const filtersWithPagination = {
      ...apiFilters,
      page: currentPage,
      limit: itemsPerPage,
    };
    
    // Crear una clave única para evitar bucles infinitos
    const filtersKey = JSON.stringify(filtersWithPagination);
    
    if (lastFiltersRef.current !== filtersKey) {
      lastFiltersRef.current = filtersKey;
      filterProducts(filtersWithPagination);
    }
  }, [currentPage, itemsPerPage, apiFilters, filterProducts]);

  useEffect(() => {
    posthogUtils.capture("section_view", {
      section: "galaxy_buds",
      category: "dispositivos_moviles",
      device, // Analytics con tipo de dispositivo
    });
  }, [device]);

  const handleFilterChange = (
    filterType: string,
    value: string,
    checked: boolean
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: checked
        ? [...(prev[filterType] || []), value]
        : (prev[filterType] || []).filter((item) => item !== value),
    }));
  };

  const toggleFilter = useCallback(
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

  // Funciones para manejar la paginación
  const handlePageChange = useCallback(async (page: number) => {
    setCurrentPage(page);
    // Scroll suave hacia arriba cuando cambie de página
    window.scrollTo({ top: 200, behavior: "smooth" });
  }, []);

  const handleItemsPerPageChange = useCallback(async (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
    // Scroll suave hacia arriba cuando cambie la cantidad de productos por página
    window.scrollTo({ top: 200, behavior: "smooth" });
  }, []);
  if (loading) {
    return (
      <LoadingState
        categories={budsCategories}
        trackingPrefix="buds_category"
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        categories={budsCategories}
        trackingPrefix="buds_category"
        error={error}
        onRetry={refreshProducts}
      />
    );
  }

  const handleAddToCart = (productId: string, color: string) => {
    console.log(`Añadir al carrito: ${productId} - ${color}`);
  };

  const handleToggleFavorite = (productId: string) => {
    console.log(`Toggle favorito: ${productId}`);
  };

  if (loading) {
    return (
      <LoadingState
        categories={budsCategories}
        trackingPrefix="buds_category"
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        categories={budsCategories}
        trackingPrefix="buds_category"
        error={error}
        onRetry={refreshProducts}
      />
    );
  }

  // Ejemplo de renderizado responsive
  return (
    <div className="min-h-screen bg-white">
      <CategorySlider
        categories={budsCategories}
        trackingPrefix="buds_category"
      />

      <div
        className={cn(
          "container mx-auto px-6 py-8",
          device === "mobile" && "px-2 py-4",
          device === "tablet" && "px-4 py-6"
        )}
      >
        <div
          className={cn(
            "flex gap-8",
            device === "mobile" && "flex-col gap-4",
            device === "tablet" && "gap-6"
          )}
        >
          {/* Sidebar solo en desktop y large */}
          {(device === "desktop" || device === "large") && (
            <aside ref={sidebarRef} className="hidden lg:block w-80 flex-shrink-0">
              <FilterSidebar
                filterConfig={budsFilters}
                filters={filters}
                onFilterChange={handleFilterChange}
                resultCount={totalItems}
                expandedFilters={expandedFilters}
                onToggleFilter={toggleFilter}
                trackingPrefix="buds_filter"
                stickyContainerClasses={containerClasses}
                stickyWrapperClasses={wrapperClasses}
                stickyStyle={style}
              />
            </aside>
          )}

          <main className="flex-1">
            <HeaderSection
              title="Galaxy Buds"
              totalItems={totalItems}
              sortBy={sortBy}
              setSortBy={setSortBy}
              viewMode={viewMode}
              setViewMode={setViewMode}
              onShowMobileFilters={() => setShowMobileFilters(true)}
            />

            <ProductGrid
              ref={productsRef}
              products={products}
              viewMode={viewMode}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
            />
            
            {/* Paginación */}
            {!loading && !error && totalItems > 0 && (
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
          </main>
        </div>
      </div>

      {/* Modal de filtros solo en mobile/tablet */}
      {(device === "mobile" || device === "tablet") && (
        <MobileFilterModal
          isOpen={showMobileFilters}
          onClose={() => setShowMobileFilters(false)}
          filterConfig={budsFilters}
          filters={filters}
          onFilterChange={handleFilterChange}
          resultCount={totalItems}
          expandedFilters={expandedFilters}
          onToggleFilter={toggleFilter}
          trackingPrefix="buds_filter"
        />
      )}
    </div>
  );
}
