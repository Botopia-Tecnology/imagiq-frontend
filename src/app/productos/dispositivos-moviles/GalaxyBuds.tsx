/**
 * 🎧 GALAXY BUDS SECTION - IMAGIQ ECOMMERCE
 *
 * Sección de audífonos Galaxy Buds con:
 * - Filtros específicos para audio
 * - Productos Galaxy Buds
 * - Características específicas de audífonos
 */

"use client";

import { useProducts } from "@/features/products/useProducts";
import { posthogUtils } from "@/lib/posthogClient";
import { useEffect, useMemo, useState } from "react";
import CategorySlider from "../components/CategorySlider";
import FilterSidebar, {
  MobileFilterModal,
  type FilterState,
} from "../components/FilterSidebar";
import { budsCategories, budsFilters } from "./constants/galaxyBudsConstants";
import HeaderSection from "./components/HeaderSection";
import ProductGrid from "./components/ProductGrid";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";

export default function GalaxyBudsSection() {
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(["serie"])
  );
  const [filters, setFilters] = useState<FilterState>({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevancia");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Usar el hook de productos con filtro por palabra "buds"
  const apiFilters = useMemo(
    () => ({
      name: "buds", // Filtrar productos que contengan "buds" en el nombre
    }),
    []
  );

  const { products, loading, error, totalItems, refreshProducts } =
    useProducts(apiFilters);

  useEffect(() => {
    posthogUtils.capture("section_view", {
      section: "galaxy_buds",
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

  const toggleFilter = (filterKey: string) => {
    const newExpanded = new Set(expandedFilters);
    if (newExpanded.has(filterKey)) {
      newExpanded.delete(filterKey);
    } else {
      newExpanded.add(filterKey);
    }
    setExpandedFilters(newExpanded);
  };

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

  return (
    <div className="min-h-screen bg-white">
      <CategorySlider
        categories={budsCategories}
        trackingPrefix="buds_category"
      />

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar
              filterConfig={budsFilters}
              filters={filters}
              onFilterChange={handleFilterChange}
              resultCount={totalItems}
              expandedFilters={expandedFilters}
              onToggleFilter={toggleFilter}
              trackingPrefix="buds_filter"
            />
          </aside>

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
              products={products}
              viewMode={viewMode}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
            />
          </main>
        </div>
      </div>

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
    </div>
  );
}
