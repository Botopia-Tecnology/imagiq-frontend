/**
 * 🎧 GALAXY BUDS SECTION - IMAGIQ ECOMMERCE
 *
 * Sección de audífonos Galaxy Buds con:
 * - Filtros específicos para audio
 * - Productos Galaxy Buds
 * - Características específicas de audífonos
 */

"use client";

import { useState, useEffect } from "react";
import { Filter, Grid3X3, List } from "lucide-react";
import { cn } from "@/lib/utils";
import ProductCard, { type ProductColor } from "../components/ProductCard";
import FilterSidebar, {
  MobileFilterModal,
  type FilterConfig,
  type FilterState,
} from "../components/FilterSidebar";
import CategorySlider, { type Category } from "../components/CategorySlider";
import { posthogUtils } from "@/lib/posthogClient";

// Importar imágenes del slider
import smartphonesImg from "../../../img/categorias/Smartphones.png";
import tabletasImg from "../../../img/categorias/Tabletas.png";
import galaxyBudsImg from "../../../img/categorias/galaxy_buds.png";
import galaxyWatchImg from "../../../img/categorias/galaxy_watch.png";

// Categorías del slider (idénticas a la imagen)
const budsCategories: Category[] = [
  {
    id: "galaxy-smartphone",
    name: "Galaxy",
    subtitle: "Smartphone",
    image: smartphonesImg,
    href: "/productos/DispositivosMoviles?section=smartphones",
  },
  {
    id: "galaxy-watch",
    name: "Galaxy",
    subtitle: "Watch",
    image: galaxyWatchImg,
    href: "/productos/DispositivosMoviles?section=relojes",
  },
  {
    id: "galaxy-tab",
    name: "Galaxy",
    subtitle: "Tab",
    image: tabletasImg,
    href: "/productos/DispositivosMoviles?section=tabletas",
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

const budsProducts = [
  {
    id: "galaxy-buds2-pro",
    name: "Samsung Galaxy Buds2 Pro",
    image: galaxyBudsImg,
    colors: [
      { name: "purple", hex: "#800080", label: "Púrpura" },
      { name: "white", hex: "#FFFFFF", label: "Blanco" },
      { name: "graphite", hex: "#2F4F4F", label: "Grafito" },
    ] as ProductColor[],
    rating: 4.7,
    reviewCount: 892,
    price: "$ 549.000",
    originalPrice: "$ 649.000",
    discount: "-15%",
    isNew: true,
  },
  {
    id: "galaxy-buds-pro",
    name: "Samsung Galaxy Buds Pro",
    image: galaxyBudsImg,
    colors: [
      { name: "black", hex: "#000000", label: "Negro" },
      { name: "silver", hex: "#C0C0C0", label: "Plateado" },
      { name: "violet", hex: "#8A2BE2", label: "Violeta" },
    ] as ProductColor[],
    rating: 4.5,
    reviewCount: 634,
    price: "$ 399.000",
    originalPrice: "$ 499.000",
    discount: "-20%",
  },
  {
    id: "galaxy-buds-fe",
    name: "Samsung Galaxy Buds FE",
    image: galaxyBudsImg,
    colors: [
      { name: "white", hex: "#FFFFFF", label: "Blanco" },
      { name: "graphite", hex: "#2F4F4F", label: "Grafito" },
    ] as ProductColor[],
    rating: 4.3,
    reviewCount: 421,
    price: "$ 249.000",
  },
];

export default function GalaxyBudsSection() {
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(["serie"])
  );
  const [filters, setFilters] = useState<FilterState>({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevancia");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [resultCount] = useState(9);

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
              resultCount={resultCount}
              expandedFilters={expandedFilters}
              onToggleFilter={toggleFilter}
              trackingPrefix="buds_filter"
            />
          </aside>

          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Galaxy Buds
                </h1>
                <span className="text-sm text-gray-500">
                  {resultCount} resultados
                </span>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4" />
                  Filtros
                </button>

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
              </div>
            </div>

            <div
              className={cn(
                "grid gap-6",
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              )}
            >
              {budsProducts.map((product) => (
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
                  onMoreInfo={(productId: string) => {
                    console.log(`Más información: ${productId}`);
                  }}
                  onToggleFavorite={(productId: string) => {
                    console.log(`Toggle favorito: ${productId}`);
                  }}
                />
              ))}
            </div>
          </main>
        </div>
      </div>

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
    </div>
  );
}
