"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useProducts } from "@/features/products/useProducts";
import FilterSidebar, {
  FilterConfig,
  FilterState,
} from "./components/FilterSidebar";
import { ProductCardProps } from "./components/ProductCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useDeviceType } from "@/components/responsive";
import { useSticky, useStickyClasses } from "@/hooks/useSticky";
import { cn } from "@/lib/utils";
import CategoryProductsGrid from "./dispositivos-moviles/components/ProductsGrid";
import HeaderSection from "./dispositivos-moviles/components/HeaderSection";

// Configuración de filtros (puedes personalizar según la categoría)
const filterConfig: FilterConfig = {
  color: [
    "Negro",
    "Blanco",
    "Azul",
    "Rojo",
    "Verde",
    "Gris",
    "Dorado",
    "Plateado",
    "Rosa",
    "Morado",
    "Amarillo",
    "Naranja",
  ],
  // Puedes agregar más filtros aquí
};

function filterProducts(products: ProductCardProps[], filters: FilterState) {
  return products.filter((product) => {
    return Object.entries(filters).every(([filterKey, values]) => {
      if (!values.length) return true;
      // Filtrado por color
      if (filterKey === "color") {
        return (
          Array.isArray(product.colors) &&
          values.some((v) =>
            product.colors!.some(
              (c: { label: string }) =>
                c.label.trim().toLowerCase() === v.trim().toLowerCase()
            )
          )
        );
      }
      // Filtrado por nombre
      if (filterKey === "nombre" || filterKey === "name") {
        return values.some((v) =>
          product.name.toLowerCase().includes(v.toLowerCase())
        );
      }
      // Filtrado genérico por cualquier campo string o array de strings
      if (Object.hasOwn(product, filterKey)) {
        const value = (product as unknown as Record<string, unknown>)[
          filterKey
        ];
        if (typeof value === "string") {
          return values.some((v) =>
            value.toLowerCase().includes(v.toLowerCase())
          );
        }
        if (Array.isArray(value)) {
          // Array de strings
          return values.some((v) =>
            (value as string[]).some(
              (item) =>
                typeof item === "string" &&
                item.toLowerCase() === v.toLowerCase()
            )
          );
        }
      }
      return true;
    });
  });
}

function ProductosContent() {
  const [filters, setFilters] = useState<FilterState>({});
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(["color"])
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevancia");

  // Refs para sticky sidebar
  const sidebarRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  // Usar el hook de productos con API real
  const { products, loading, error, totalItems, refreshProducts } =
    useProducts();

  // Filtrado funcional y robusto (combinando API filters con UI filters)
  const filteredProducts = useMemo(
    () => filterProducts(products, filters),
    [products, filters]
  );

  // UX: contador de resultados
  const resultCount = filteredProducts.length;

  const device = useDeviceType();

  // Sidebar sticky (tu hook)
  const stickyEnabled = device === "desktop" || device === "large";
  const stickyState = useSticky({
    sidebarRef,
    productsRef,
    topOffset: 120,
    enabled: stickyEnabled,
  });
  const { containerClasses, wrapperClasses, style } =
    useStickyClasses(stickyState);

  // Reset cuando cambian filtros o breakpoint
  useEffect(() => {
    // Reset logic if needed
  }, [filters, stickyEnabled]);

  // UX: animación de scroll al filtrar
  const handleFilterChange = useCallback((
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const toggleFilter = useCallback(
    (filterKey: string) => {
      const next = new Set(expandedFilters);
      next.has(filterKey) ? next.delete(filterKey) : next.add(filterKey);
      setExpandedFilters(next);
    },
    [expandedFilters]
  );


  // Header (NO sticky): va en el flujo normal
  const HeaderSectionMemo = useMemo(
    () => (
      <HeaderSection
        title="Productos Samsung"
        totalItems={totalItems}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onShowMobileFilters={() => {}}
        filters={filters}
        setFilters={setFilters}
        clearAllFiltersText="Ver todos los productos"
      />
    ),
    [totalItems, sortBy, viewMode, filters]
  );

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        {HeaderSectionMemo}
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
        {HeaderSectionMemo}
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Error al cargar productos
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
                filterConfig={filterConfig}
                filters={filters}
                onFilterChange={handleFilterChange}
                resultCount={resultCount}
                expandedFilters={expandedFilters}
                onToggleFilter={toggleFilter}
                stickyContainerClasses={containerClasses}
                stickyWrapperClasses={wrapperClasses}
                stickyStyle={style}
              />
            </aside>
          )}

          <main className="flex-1">
            <CategoryProductsGrid
              ref={productsRef}
              products={filteredProducts}
              loading={loading}
              error={error}
              refreshProducts={refreshProducts}
              viewMode={viewMode}
              categoryName="productos"
            />
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ProductosPage() {
  return (
    <ProductosContent />
  );
}
