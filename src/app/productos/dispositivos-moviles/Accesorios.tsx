/**
 * 📦 ACCESORIOS SECTION - IMAGIQ ECOMMERCE
 *
 * Sección de accesorios para dispositivos móviles con:
 * - Filtros específicos para accesorios
 * - Diversos tipos de accesorios
 * - Características específicas de accesorios
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
import { deviceCategories } from "./constants/sharedCategories";
import { accessoryFilters } from "./constants/accesoriosConstants";
import { getApiFilters } from "./utils/accesoriosUtils";
import CategoryProductsGrid from "./components/ProductsGrid";
import HeaderSection from "./components/HeaderSection";
import Pagination from "./components/Pagination";
import ItemsPerPageSelector from "./components/ItemsPerPageSelector";
import { useSticky, useStickyClasses } from "@/hooks/useSticky";
import { useDeviceType } from "@/components/responsive";

export default function AccesoriosSection() {
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(["tipoAccesorio"])
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

  // Device type para responsive
  const device = useDeviceType();

  // Función memoizada para convertir filtros de tipo de accesorio a filtros de API
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

  // Usar el hook de productos con filtros dinámicos y paginación
  const { products, loading, error, totalItems, totalPages, refreshProducts } =
    useProducts(initialFilters);


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
      section: "accesorios",
      category: "dispositivos_moviles",
    });
  }, []);

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
        filterConfig={accessoryFilters}
        filters={filters}
        onFilterChange={handleFilterChange}
        resultCount={totalItems}
        expandedFilters={expandedFilters}
        onToggleFilter={toggleFilter}
        trackingPrefix="accessory_filter"
      />
    ),
    [showMobileFilters, filters, totalItems, expandedFilters, toggleFilter]
  );

  // Memoizar el HeaderSection para evitar re-renders innecesarios
  const HeaderSectionMemo = useMemo(
    () => (
      <HeaderSection
        title="Accesorios"
        totalItems={totalItems}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onShowMobileFilters={() => setShowMobileFilters(true)}
        filters={filters}
        setFilters={setFilters}
        clearAllFiltersText="Ver todos los accesorios"
      />
    ),
    [totalItems, sortBy, setSortBy, viewMode, setViewMode, setShowMobileFilters, filters, setFilters]
  );

  return (
    <div className="min-h-screen bg-white">
      <CategorySlider
        categories={deviceCategories}
        trackingPrefix="accessory_category"
      />

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          <aside ref={sidebarRef} className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar
              filterConfig={accessoryFilters}
              filters={filters}
              onFilterChange={handleFilterChange}
              resultCount={totalItems}
              expandedFilters={expandedFilters}
              onToggleFilter={toggleFilter}
              trackingPrefix="accessory_filter"
              stickyContainerClasses={containerClasses}
              stickyWrapperClasses={wrapperClasses}
              stickyStyle={style}
            />
          </aside>

          <main className="flex-1">
            {HeaderSectionMemo}
            <CategoryProductsGrid
              ref={productsRef}
              products={products}
              loading={loading}
              error={error}
              refreshProducts={refreshProducts}
              viewMode={viewMode}
              categoryName="accesorios"
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
