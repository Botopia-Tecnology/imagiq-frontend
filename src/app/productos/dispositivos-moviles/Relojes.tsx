/**
 * ⌚ RELOJES SECTION - IMAGIQ ECOMMERCE
 *
 * Sección de relojes inteligentes con:
 * - Filtros específicos para wearables
 * - Productos Galaxy Watch
 * - Características específicas de relojes
 * - Responsive global implementado
 */

"use client";

import { useState, useEffect } from "react";
import { Filter, Grid3X3, List } from "lucide-react";
import { cn } from "@/lib/utils";
import ProductCard from "../components/ProductCard";
import FilterSidebar, {
  MobileFilterModal,
  type FilterConfig,
  type FilterState,
} from "../components/FilterSidebar";
import CategorySlider, { type Category } from "../components/CategorySlider";
import { posthogUtils } from "@/lib/posthogClient";
import { productsData } from "../data_product/products";
import { useDeviceType } from "@/components/responsive"; // Importa el hook responsive

// Importar imágenes del slider
import smartphonesImg from "../../../img/categorias/Smartphones.png";
import tabletasImg from "../../../img/categorias/Tabletas.png";
import galaxyBudsImg from "../../../img/categorias/galaxy_buds.png";
import galaxyWatchImg from "../../../img/categorias/galaxy_watch.png";

// Categorías del slider
const watchCategories: Category[] = [
  {
    id: "galaxy-smartphone",
    name: "Galaxy",
    subtitle: "Smartphone",
    image: smartphonesImg,
    href: "/productos/dispositivos-moviles?section=smartphones",
  },
  {
    id: "galaxy-watch",
    name: "Galaxy",
    subtitle: "Watch",
    image: galaxyWatchImg,
    href: "/productos/dispositivos-moviles?section=relojes",
  },
  {
    id: "galaxy-tab",
    name: "Galaxy",
    subtitle: "Tab",
    image: tabletasImg,
    href: "/productos/dispositivos-moviles?section=tabletas",
  },
  {
    id: "galaxy-buds",
    name: "Galaxy",
    subtitle: "Buds",
    image: galaxyBudsImg,
    href: "/productos/dispositivos-moviles?section=buds",
  },
];

// Filtros específicos para relojes
const watchFilters: FilterConfig = {
  serie: [
    "Galaxy Watch 6",
    "Galaxy Watch Classic",
    "Galaxy Watch Active",
    "Galaxy Watch FE",
  ],
  tamanoCaja: ["40mm", "44mm", "46mm", "47mm"],
  material: ["Aluminio", "Acero Inoxidable", "Titanio"],
  correa: ["Deportiva", "Piel", "Eslabones", "Nylon"],
  conectividad: ["Bluetooth", "WiFi", "LTE"],
  caracteristicas: [
    "GPS",
    "Monitor Cardíaco",
    "SpO2",
    "Resistente al Agua",
    "ECG",
    "Detección de Caídas",
  ],
  rangoPrecio: [
    { label: "Menos de $300.000", min: 0, max: 300000 },
    { label: "$300.000 - $600.000", min: 300000, max: 600000 },
    { label: "$600.000 - $900.000", min: 600000, max: 900000 },
    { label: "Más de $900.000", min: 900000, max: Infinity },
  ],
  duracionBateria: ["1 día", "2 días", "3+ días"],
  resistenciaAgua: ["5ATM", "10ATM", "IP68"],
};

const watchProducts = productsData["accesorios"].filter(
  (product) => product.category === "watch"
);

export default function RelojesSection() {
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(["serie"])
  );
  const [filters, setFilters] = useState<FilterState>({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevancia");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [resultCount] = useState(12);
  const device = useDeviceType(); // Responsive global

  useEffect(() => {
    posthogUtils.capture("section_view", {
      section: "relojes",
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

  return (
    <div className="min-h-screen bg-white">
      
      <CategorySlider categories={watchCategories} trackingPrefix="watch_category" />

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
          {(device === "desktop" || device === "large") && (
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <FilterSidebar
                filterConfig={watchFilters}
                filters={filters}
                onFilterChange={handleFilterChange}
                resultCount={resultCount}
                expandedFilters={expandedFilters}
                onToggleFilter={toggleFilter}
                trackingPrefix="watch_filter"
              />
            </aside>
          )}

          <main className="flex-1">
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
                  Galaxy Watch
                </h1>
                <span
                  className={cn(
                    "text-sm text-gray-500",
                    device === "mobile" && "text-xs"
                  )}
                >
                  {resultCount} resultados
                </span>
              </div>

              <div
                className={cn("flex items-center gap-4", device === "mobile" && "gap-2")}
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
                  className={cn(
                    "bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    device === "mobile" && "px-2 py-1 text-xs"
                  )}
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

            <div
              className={cn(
                "grid gap-6",
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1",
                device === "mobile" && "gap-3"
              )}
            >
              {watchProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </main>
        </div>
      </div>

      {(device === "mobile" || device === "tablet") && (
        <MobileFilterModal
          isOpen={showMobileFilters}
          onClose={() => setShowMobileFilters(false)}
          filterConfig={watchFilters}
          filters={filters}
          onFilterChange={handleFilterChange}
          resultCount={resultCount}
          expandedFilters={expandedFilters}
          onToggleFilter={toggleFilter}
          trackingPrefix="watch_filter"
        />
      )}
    </div>
  );
}
