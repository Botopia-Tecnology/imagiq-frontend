/**
 * 🧭 SECCIÓN DE HORNO - IMAGIQ ECOMMERCE
 */

"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import ProductCard from "../components/ProductCard";
import FilterSidebar, {
  type FilterConfig,
  type FilterState,
  MobileFilterModal,
} from "../components/FilterSidebar";
import { useSticky, useStickyClasses } from "@/hooks/useSticky";
import CategorySlider, { type Category } from "../components/CategorySlider";
import { posthogUtils } from "@/lib/posthogClient";
import refrigeradorImg from "../../../img/electrodomesticos/electrodomesticos1.png";
import lavadoraImg from "../../../img/electrodomesticos/electrodomesticos2.png";
import microondasImg from "../../../img/electrodomesticos/electrodomesticos4.png";
import lavavajillasImg from "@/img/electrodomesticos/electrodomesticos4.png";
import aireImg from "../../../img/electrodomesticos/electrodomesticos4.png";
import hornosImg from "../../../img/electrodomesticos/electrodomesticos4.png";
import aspiradoraImg from "../../../img/electrodomesticos/electrodomesticos3.png";
import { useProducts } from "@/features/products/useProducts";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Filter, Grid3X3, List } from "lucide-react";
import { useDeviceType } from "@/components/responsive";
import ItemsPerPageSelector from "./components/ItemsPerPageSelector";
import Pagination from "./components/Pagination";

const applianceCategories: Category[] = [
  {
    id: "hornos",
    name: "Hornos",
    image: hornosImg,
    subtitle: "",
    href: "/productos/electrodomesticos?section=hornos",
  },
  {
    id: "refrigeradores",
    name: "Refrigeradores",
    subtitle: "",
    image: refrigeradorImg,
    href: "/productos/electrodomesticos?section=refrigeradores",
  },
  {
    id: "lavadoras",
    name: "Lavadoras",
    subtitle: "",
    image: lavadoraImg,
    href: "/productos/electrodomesticos?section=lavadoras",
  },

  {
    id: "microondas",
    name: "Microondas",
    subtitle: "",
    image: microondasImg,
    href: "/productos/electrodomesticos?section=microondas",
  },
  {
    id: "aspiradoras",
    name: "Aspiradoras",
    subtitle: "",
    image: aspiradoraImg,
    href: "/productos/electrodomesticos?section=aspiradoras",
  },
  {
    id: "aire-acondicionado",
    name: "Aire Acondicionado",
    subtitle: "",
    image: aireImg,
    href: "/productos/electrodomesticos?section=aire-acondicionado",
  },
  {
    id: "lavavajillas",
    name: "Lavavajillas",
    subtitle: "",
    image: lavavajillasImg,
    href: "/productos/electrodomesticos?section=lavavajillas",
  },
];

const hornosFilters: FilterConfig = {
  tipo: ["Convencional", "Digital", "Microondas"],
  marca: ["Samsung", "LG", "Whirlpool"],
  rangoPrecio: [
    { label: "Menos de $100.000", min: 0, max: 100000 },
    { label: "$100.000 - $300.000", min: 100000, max: 300000 },
    { label: "$300.000 - $500.000", min: 300000, max: 500000 },
    { label: "Más de $500.000", min: 500000, max: Infinity },
  ],
};

export default function HornosSection() {
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(["tipo"])
  );
  const [filters, setFilters] = useState<FilterState>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [resultCount] = useState(16);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevancia");

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  // Refs para sticky behavior
  const sidebarRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  const apiFilters = useMemo(
    () => ({
      subcategory: "Hornos Microondas",
    }),
    []
  );

  // Crear filtros iniciales con paginación
  const initialFilters = useMemo(() => {
    const filters = {
      ...apiFilters,
      page: currentPage,
      limit: itemsPerPage,
    };
    return filters;
  }, [apiFilters, currentPage, itemsPerPage]);

  const {
    products,
    loading,
    error,
    totalItems,
    totalPages,
    refreshProducts,
    filterProducts,
  } = useProducts(initialFilters);

  // Ref para evitar bucles infinitos
  const lastFiltersRef = useRef<string>("");
  const device = useDeviceType(); // Responsive global

  // Sticky behavior (solo en desktop/large)
  const stickyEnabled = device === "desktop" || device === "large";
  const stickyState = useSticky({
    sidebarRef,
    productsRef,
    topOffset: 120,
    enabled: stickyEnabled,
  });

  const { containerClasses, wrapperClasses, style } =
    useStickyClasses(stickyState);

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
      section: "hornos",
      category: "electrodomesticos",
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
      <div className="min-h-screen bg-white">
        <CategorySlider
          categories={applianceCategories}
          trackingPrefix="hornos_category"
        />
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <CategorySlider
          categories={applianceCategories}
          trackingPrefix="hornos_category"
        />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Error al cargar hornos
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={refreshProducts}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <CategorySlider
        categories={applianceCategories}
        trackingPrefix="hornos_category"
      />
      <div
        className={cn(
          "container mx-auto px-6 py-8",
          device === "mobile" && "px-5 py-4",
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
          {(device === "desktop" || device === "large") && (
            <aside
              ref={sidebarRef}
              className="hidden lg:block w-80 flex-shrink-0"
            >
              <FilterSidebar
                filterConfig={hornosFilters}
                filters={filters}
                onFilterChange={handleFilterChange}
                resultCount={resultCount}
                expandedFilters={expandedFilters}
                onToggleFilter={toggleFilter}
                trackingPrefix="hornos_filter"
                stickyContainerClasses={containerClasses}
                stickyWrapperClasses={wrapperClasses}
                stickyStyle={style}
              />
            </aside>
          )}
          {/* Contenido principal */}
          <main className="flex-1">
            {/* Header con controles */}
            <div
              className={cn(
                "flex items-center justify-between mb-6",
                device === "mobile" && "flex-col items-start gap-2 mb-4"
              )}
            >
              <div className="flex items-center gap-4">
                <h1
                  className={cn(
                    "text-2xl font-bold text-gray-900",
                    device === "mobile" && "text-lg"
                  )}
                >
                  Hornos
                </h1>
                <span className="text-sm text-gray-500">
                  {totalItems} resultados
                </span>
              </div>

              <div
                className={cn(
                  "flex items-center gap-4",
                  device === "mobile" && "gap-2"
                )}
              >
                {(device === "mobile" || device === "tablet") && (
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Filter className="w-4 h-4" />
                    Filtros
                  </button>
                )}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="relevancia">Relevancia</option>
                  <option value="precio-menor">Precio: menor a mayor</option>
                  <option value="precio-mayor">Precio: mayor a menor</option>
                  <option value="nombre">Nombre A-Z</option>
                  <option value="calificacion">Mejor calificados</option>
                </select>

                {(device === "desktop" || device === "large") && (
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={cn(
                        "p-2",
                        viewMode === "grid"
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={cn(
                        "p-2",
                        viewMode === "list"
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* Grid de productos */}
            <div
              ref={productsRef}
              className={cn(
                "grid gap-6",
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                  : "grid-cols-1",
                device === "mobile" && "gap-3"
              )}
            >
              {products.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No se encontraron hornos con los filtros seleccionados.
                </div>
              ) : (
                products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    image={product.image}
                    colors={product.colors}
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    discount={product.discount}
                    isNew={product.isNew}
                    onAddToCart={(productId: string, color: string) => {
                      console.log(`Añadir al carrito: ${productId} - ${color}`);
                    }}
                    onToggleFavorite={(productId: string) => {
                      console.log(`Toggle favorito: ${productId}`);
                    }}
                    className={viewMode === "list" ? "flex-row" : ""}
                  />
                ))
              )}
            </div>
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
      {(device === "mobile" || device === "tablet") && (
        <MobileFilterModal
          isOpen={showMobileFilters}
          onClose={() => setShowMobileFilters(false)}
          filterConfig={hornosFilters}
          filters={filters}
          onFilterChange={handleFilterChange}
          resultCount={totalItems}
          expandedFilters={expandedFilters}
          onToggleFilter={toggleFilter}
          trackingPrefix="hornos_filter"
        />
      )}
    </div>
  );
}
