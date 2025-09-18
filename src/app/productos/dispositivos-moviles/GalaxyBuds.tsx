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
import {  useMemo } from "react";
import { useDeviceType } from "@/components/responsive"; // Importa el hook responsive
import { posthogUtils } from "@/lib/posthogClient";
import { cn } from "@/lib/utils";
import { Filter, Grid3X3, List } from "lucide-react";
import { useEffect, useState } from "react";
import CategorySlider, { type Category } from "../components/CategorySlider";
import FilterSidebar, {
  FilterConfig,
  MobileFilterModal,
  type FilterState,
} from "../components/FilterSidebar";
import ProductCard from "../components/ProductCard";
import { productsData } from "../data_product/products";

// Importar imágenes del slider
import smartphonesImg from "../../../img/categorias/Smartphones.png";
import tabletasImg from "../../../img/categorias/Tabletas.png";
import galaxyBudsImg from "../../../img/categorias/galaxy_buds.png";
import galaxyWatchImg from "../../../img/categorias/galaxy_watch.png";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import HeaderSection from "./components/HeaderSection";
import ProductGrid from "./components/ProductGrid";

// Categorías del slider (idénticas a la imagen)
const budsCategories: Category[] = [
  {
    id: "galaxy-smartphone",
    name: "Galaxy",
    subtitle: "Smartphone",
    image: smartphonesImg,
    href: "?section=smartphones",
  },
  {
    id: "galaxy-watch",
    name: "Galaxy",
    subtitle: "Watch",
    image: galaxyWatchImg,
    href: "?section=relojes",
  },
  {
    id: "galaxy-tab",
    name: "Galaxy",
    subtitle: "Tab",
    image: tabletasImg,
    href: "?section=tabletas",
  },
  {
    id: "galaxy-buds",
    name: "Galaxy",
    subtitle: "Buds",
    image: galaxyBudsImg,
    href: "#galaxy-buds",
  },
];

// Configuración de filtros específica para Galaxy Buds
const budsFilters: FilterConfig = {
  serie: [
    "Galaxy Buds Pro",
    "Galaxy Buds2 Pro",
    "Galaxy Buds FE",
    "Galaxy Buds Live",
  ],
  tipoAjuste: ["In-ear", "Semi abierto", "Abierto"],
  cancelacionRuido: ["ANC Activa", "ANC Pasiva", "Sin ANC"],
  resistenciaAgua: ["IPX4", "IPX5", "IPX7", "Sin resistencia"],
  conectividad: [
    "Bluetooth 5.0",
    "Bluetooth 5.1",
    "Bluetooth 5.2",
    "Bluetooth 5.3",
  ],
  caracteristicas: [
    "Carga inalámbrica",
    "Detección de uso",
    "Ecualización adaptable",
    "Audio 360",
    "Control táctil",
  ],
  rangoPrecio: [
    { label: "Menos de $200.000", min: 0, max: 200000 },
    { label: "$200.000 - $400.000", min: 200000, max: 400000 },
    { label: "$400.000 - $600.000", min: 400000, max: 600000 },
    { label: "Más de $600.000", min: 600000, max: Infinity },
  ],
  autonomiaBateria: ["4-6 horas", "6-8 horas", "8+ horas"],
  controlVoz: ["Bixby", "Google Assistant", "Alexa", "Múltiples"],
};

const budsProducts = productsData["accesorios"].filter(
  (product) => product.category === "buds"
);

export default function GalaxyBudsSection() {
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(["serie"])
  );
  const [filters, setFilters] = useState<FilterState>({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevancia");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [resultCount] = useState(9);

  // Usar el hook de productos con filtro por palabra "buds"
  const apiFilters = useMemo(
    () => ({
      name: "buds", // Filtrar productos que contengan "buds" en el nombre
    }),
    []
  );

  const { products, loading, error, totalItems, refreshProducts } =
    useProducts(apiFilters);
  const device = useDeviceType(); // Obtén el tipo de dispositivo

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

  const toggleFilter = (filterKey: string) => {
    const newExpanded = new Set(expandedFilters);
    if (newExpanded.has(filterKey)) {
      newExpanded.delete(filterKey);
    } else {
      newExpanded.add(filterKey);
    }
    setExpandedFilters(newExpanded);
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
          {/* Sidebar solo en desktop y large */}
          {(device === "desktop" || device === "large") && (
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
              products={products}
              viewMode={viewMode}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
            />
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
          resultCount={resultCount}
          expandedFilters={expandedFilters}
          onToggleFilter={toggleFilter}
          trackingPrefix="buds_filter"
        />
      )}
    </div>
  );
}
