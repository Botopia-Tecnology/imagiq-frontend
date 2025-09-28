///Smartphones section carpeta dispositivos-moviles
"use client";

import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
import { cn } from "@/lib/utils";
import FilterSidebar, {
  MobileFilterModal,
  type FilterState,
} from "../components/FilterSidebar";

import CategorySlider from "../components/CategorySlider";

import { posthogUtils } from "@/lib/posthogClient";
import { useProducts } from "@/features/products/useProducts";
import { useDeviceType } from "@/components/responsive";
import Pagination from "./components/Pagination";
import ItemsPerPageSelector from "./components/ItemsPerPageSelector";
import { useSticky, useStickyClasses } from "@/hooks/useSticky";

import { deviceCategories } from "./constants/sharedCategories";
import { smartphoneFilters } from "./constants/smartphonesConstants";
import { getApiFilters } from "./utils/smartphonesUtils";
import HeaderSection from "./components/HeaderSection";
import CategoryProductsGrid from "./components/ProductsGrid";

export default function SmartphonesSection() {
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(["almacenamiento"])
  );
  const [filters, setFilters] = useState<FilterState>({
    almacenamiento: [],
    caracteristicas: [],
    camara: [],
    rangoPrecio: [],
    serie: [],
    pantalla: [],
    procesador: [],
    ram: [],
    conectividad: [],
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevancia");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  // Refs para sticky sidebar
  const sidebarRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  // Filtros API
  const apiFilters = useMemo(() => getApiFilters(filters), [filters]);
  const initialFilters = useMemo(
    () => ({ ...apiFilters, page: currentPage, limit: itemsPerPage }),
    [apiFilters, currentPage, itemsPerPage]
  );

  const {
    products,
    loading,
    error,
    totalItems,
    totalPages,
    refreshProducts,
  } = useProducts(initialFilters);

  const device = useDeviceType();

  // Sidebar sticky (tu hook)
  const stickyEnabled = device === "desktop" || device === "large";
  const stickyState = useSticky({
    sidebarRef,
    productsRef,
    topOffset: 200,
    enabled: stickyEnabled,
  });
  const { containerClasses, wrapperClasses, style } =
    useStickyClasses(stickyState);

  // Reset a página 1 cuando cambian filtros o breakpoint
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, stickyEnabled]);

  useEffect(() => {
    posthogUtils.capture("section_view", {
      section: "smartphones",
      category: "dispositivos_moviles",
      device,
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
        : (prev[filterType] || []).filter((i) => i !== value),
    }));
  };

  const toggleFilter = useCallback(
    (filterKey: string) => {
      const next = new Set(expandedFilters);
      next.has(filterKey) ? next.delete(filterKey) : next.add(filterKey);
      setExpandedFilters(next);
    },
    [expandedFilters]
  );

  const handlePageChange = useCallback(async (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 200, behavior: "smooth" });
  }, []);

  const handleItemsPerPageChange = useCallback(async (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
    window.scrollTo({ top: 200, behavior: "smooth" });
  }, []);

  // Modal filtros móvil
  const MobileFilterModalMemo = useMemo(
    () => (
      <MobileFilterModal
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        filterConfig={smartphoneFilters}
        filters={filters}
        onFilterChange={handleFilterChange}
        resultCount={totalItems}
        expandedFilters={expandedFilters}
        onToggleFilter={toggleFilter}
        trackingPrefix="smartphone_filter"
      />
    ),
    [showMobileFilters, filters, totalItems, expandedFilters, toggleFilter]
  );

  // Header (NO sticky): va en el flujo normal
  const HeaderSectionMemo = useMemo(
    () => (
      <HeaderSection
        title="Smartphones"
        totalItems={totalItems}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onShowMobileFilters={() => setShowMobileFilters(true)}
        filters={filters}
        setFilters={setFilters}
        clearAllFiltersText="Ver todos los Smartphones"
      />
    ),
    [totalItems, sortBy, viewMode, filters]
  );

  /**
   * Altura automática del header global (navbar) — para posicionar la barra fija
   */
  const [globalTop, setGlobalTop] = useState(0);
  useLayoutEffect(() => {
    const candidates = [
      "[data-global-header]",
      "header[role='banner']",
      "header.site-header",
      "header",
      "nav[role='navigation']",
      ".navbar",
    ] as const;

    let el: HTMLElement | null = null;
    for (const sel of candidates) {
      const found = document.querySelector<HTMLElement>(sel);
      if (found) {
        el = found;
        break;
      }
    }

    const measure = () => setGlobalTop(el?.offsetHeight ?? 0);
    measure();

    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  /**
   * Barra fija de categorías:
   * - Medimos su alto para poner un "spacer" y que no tape el contenido
   * - Modo "condensed" al hacer scroll: logos más chicos y sin textos
   */
  const catBarRef = useRef<HTMLDivElement>(null);
  const [catBarH, setCatBarH] = useState(0);
  useLayoutEffect(() => {
    const measure = () => setCatBarH(catBarRef.current?.offsetHeight ?? 0);
    measure();
    const ro = new ResizeObserver(measure);
    if (catBarRef.current) ro.observe(catBarRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const [condensed, setCondensed] = useState(false);
  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* ✅ SOLO las categorías: barra FIJA que acompaña hasta el footer */}
      <div
        ref={catBarRef}
        className="fixed inset-x-0 z-[60] bg-white"
        style={{ top: globalTop }}
      >
        <CategorySlider
          categories={deviceCategories}
          className="py-3 sm:py-4"
          condensed={condensed} // logos más pequeños + sin textos al scrollear
        />
      </div>
      {/* Spacer para no tapar contenido */}
      <div style={{ height: catBarH }} />

      {/* Header de la lista (no sticky) */}
      {HeaderSectionMemo}

      {/* Contenido */}
      <div
        className={cn(
          "container mx-auto px-6 py-8",
          device === "mobile" && "px-5 py-4",
          device === "tablet" && "px-4 py-6"
        )}
      >
        <div
          className={cn(
            "flex",
            (device === "desktop" || device === "large") && "gap-6",
            device === "mobile" && "flex-col gap-4",
            device === "tablet" && "gap-6"
          )}
        >
          {(device === "desktop" || device === "large") && (
            <aside ref={sidebarRef} className="hidden lg:block w-80 flex-shrink-0">
              <FilterSidebar
                filterConfig={smartphoneFilters}
                filters={filters}
                onFilterChange={handleFilterChange}
                resultCount={totalItems}
                expandedFilters={expandedFilters}
                onToggleFilter={toggleFilter}
                trackingPrefix="smartphone_filter"
                stickyContainerClasses={containerClasses}
                stickyWrapperClasses={wrapperClasses}
                stickyStyle={style}
              />
            </aside>
          )}

          <main className="flex-1">
            <CategoryProductsGrid
              ref={productsRef}
              products={products}
              loading={loading}
              error={error}
              refreshProducts={refreshProducts}
              viewMode={viewMode}
              categoryName="smartphones"
            />

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
