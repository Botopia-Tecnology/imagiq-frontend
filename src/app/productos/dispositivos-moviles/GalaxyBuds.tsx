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
import { cn } from "@/lib/utils";
import HeaderSection from "./components/HeaderSection";
import CategoryProductsGrid from "./components/ProductsGrid";
import { deviceCategories } from "./constants/sharedCategories";
import { budsFilters } from "./constants/galaxyBudsConstants";
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

  const { products, loading, error, totalItems, totalPages, refreshProducts } =
    useProducts(initialFilters);

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

  // Memoizar el modal de filtros móviles
  const MobileFilterModalMemo = useMemo(
    () => (
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
    ),
    [showMobileFilters, filters, totalItems, expandedFilters, toggleFilter]
  );

  // Memoizar el HeaderSection para evitar re-renders innecesarios
  const HeaderSectionMemo = useMemo(
    () => (
      <HeaderSection
        title="Galaxy Buds"
        totalItems={totalItems}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onShowMobileFilters={() => setShowMobileFilters(true)}
        filters={filters}
        setFilters={setFilters}
        clearAllFiltersText="Ver todos los Galaxy Buds"
      />
    ),
    [totalItems, sortBy, setSortBy, viewMode, setViewMode, setShowMobileFilters, filters, setFilters]
  );


  // Ejemplo de renderizado responsive
  return (
    <div className="min-h-screen bg-white">
      <CategorySlider
        categories={deviceCategories}
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
            {HeaderSectionMemo}
            <CategoryProductsGrid
              ref={productsRef}
              products={products}
              loading={loading}
              error={error}
              refreshProducts={refreshProducts}
              viewMode={viewMode}
              categoryName="Galaxy Buds"
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

      {MobileFilterModalMemo}
    </div>
  );
}
