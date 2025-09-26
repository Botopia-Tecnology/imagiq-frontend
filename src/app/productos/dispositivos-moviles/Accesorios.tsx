/**
 * 📦 ACCESORIOS SECTION - IMAGIQ ECOMMERCE
 *
 * - Barra de categorías fija (pega al navbar y acompaña hasta el footer)
 * - Logos más pequeños + sin textos al hacer scroll (condensed)
 * - Sidebar sticky en desktop/large
 */

"use client";

import {
  useProducts
} from "@/features/products/useProducts";
import { posthogUtils } from "@/lib/posthogClient";
import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
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
import { cn } from "@/lib/utils";

export default function AccesoriosSection() {
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(["tipoAccesorio"])
  );
  const [filters, setFilters] = useState<FilterState>({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevancia");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // ===== Paginación / data =====
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  const device = useDeviceType();

  const apiFilters = useMemo(() => getApiFilters(filters), [filters]);
  const initialFilters = useMemo(
    () => ({ ...apiFilters, page: currentPage, limit: itemsPerPage }),
    [apiFilters, currentPage, itemsPerPage]
  );

  const { products, loading, error, totalItems, totalPages, refreshProducts } =
    useProducts(initialFilters);

  // ===== Sidebar sticky =====
  const stickyEnabled = device === "desktop" || device === "large";
  const stickyState = useSticky({
    sidebarRef,
    productsRef,
    topOffset: 120,
    enabled: stickyEnabled,
  });
  const { containerClasses, wrapperClasses, style } =
    useStickyClasses(stickyState);

  // Reset a página 1 cuando cambien filtros
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

  // ===== Barra fija de categorías (mismo patrón que el resto) =====
  // Medimos la altura del navbar global para colocar la barra justo debajo
  const [globalTop, setGlobalTop] = useState(0);
  useLayoutEffect(() => {
    const candidates = [
      "[data-global-header]",
      "#main-navbar",
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

  // Medimos la altura de la barra para insertar un spacer y no tapar el contenido
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

  // Condensed: al scrollear, logos más pequeños y sin textos
  const [condensed, setCondensed] = useState(false);
  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ===== Render =====
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
          trackingPrefix="accessory_category"
          className="py-3 sm:py-4"
          condensed={condensed}
        />
      </div>

      {/* Spacer para no tapar contenido */}
      <div style={{ height: catBarH }} />

      {/* Header de la lista (no sticky) */}
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

      {/* Contenido */}
      <div
        className={cn(
          "container mx-auto px-6 py-8",
          device === "mobile" && "px-2 py-4",
          device === "tablet" && "px-4 py-6"
        )}
      >
        <div className="flex gap-8">
          {/* Sidebar solo en desktop/large */}
          {(device === "desktop" || device === "large") && (
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
          )}

          <main className="flex-1">
            <CategoryProductsGrid
              ref={productsRef}
              products={products}
              loading={loading}
              error={error}
              refreshProducts={refreshProducts}
              viewMode={viewMode}
              categoryName="accesorios"
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

      <MobileFilterModalMemoized
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        filters={filters}
        resultCount={totalItems}
      />
    </div>
  );
}

/* ===== Pequeño wrapper para mantener el memo igual que en otras secciones ===== */
function MobileFilterModalMemoized(props: {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  resultCount: number;
}) {
  const { isOpen, onClose, filters, resultCount } = props;
  const memo = useMemo(
    () => (
      <MobileFilterModal
        isOpen={isOpen}
        onClose={onClose}
        filterConfig={accessoryFilters}
        filters={filters}
        onFilterChange={() => {}}
        resultCount={resultCount}
        expandedFilters={new Set<string>()}
        onToggleFilter={() => {}}
        trackingPrefix="accessory_filter"
      />
    ),
    [isOpen, onClose, filters, resultCount]
  );
  return memo;
}
