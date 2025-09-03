/**
 * 📱 SMARTPHONES SECTION - IMAGIQ ECOMMERCE
 *
 * Sección de smartphones con:
 * - Grid de productos específicos para smartphones
 * - Filtros especializados para celulares
 * - Categorías de acceso rápido
 * - Tracking específico para smartphones
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

// Categorías específicas para smartphones (coincidiendo con la imagen del slider)
const smartphoneCategories: Category[] = [
  {
    id: "galaxy-smartphone",
    name: "Galaxy",
    subtitle: "Smartphone",
    image: smartphonesImg,
    href: "#galaxy-smartphone",
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
    href: "/productos/DispositivosMoviles?section=buds",
  },
];

// Configuración de filtros específica para smartphones
const smartphoneFilters: FilterConfig = {
  almacenamiento: ["64GB", "128GB", "256GB", "512GB", "1TB"],
  caracteristicas: [
    "5G",
    "Carga rápida",
    "Resistente al agua",
    "Carga inalámbrica",
    "NFC",
    "Dual SIM",
  ],
  camara: ["12MP", "50MP", "64MP", "108MP", "200MP"],
  rangoPrecio: [
    { label: "Menos de $500.000", min: 0, max: 500000 },
    { label: "$500.000 - $1.000.000", min: 500000, max: 1000000 },
    { label: "$1.000.000 - $2.000.000", min: 1000000, max: 2000000 },
    { label: "Más de $2.000.000", min: 2000000, max: Infinity },
  ],
  serie: ["Galaxy A", "Galaxy S", "Galaxy Note", "Galaxy Z"],
  pantalla: ['5.5"', '6.1"', '6.5"', '6.7"', '6.8"'],
  procesador: ["Exynos", "Snapdragon", "MediaTek"],
  ram: ["4GB", "6GB", "8GB", "12GB", "16GB"],
  conectividad: ["4G", "5G"],
};

// Productos específicos de smartphones
export const smartphoneProducts = [
  {
    id: "galaxy-a16",
    name: "Samsung Galaxy A16",
    image: smartphonesImg,
    colors: [
      { name: "navy", hex: "#1E3A8A", label: "Azul Marino" },
      { name: "black", hex: "#000000", label: "Negro" },
      { name: "white", hex: "#FFFFFF", label: "Blanco" },
    ] as ProductColor[],
    rating: 4.5,
    reviewCount: 128,
    price: "$ 812.900",
    originalPrice: "$ 999.000",
    discount: "-19%",
  },
  {
    id: "galaxy-a25",
    name: "Samsung Galaxy A25",
    image: smartphonesImg,
    colors: [
      { name: "navy", hex: "#1E3A8A", label: "Azul Marino" },
      { name: "black", hex: "#000000", label: "Negro" },
      { name: "silver", hex: "#C0C0C0", label: "Plateado" },
    ] as ProductColor[],
    rating: 4.3,
    reviewCount: 89,
    price: "$ 1.250.000",
  },
  {
    id: "galaxy-a26",
    name: "Samsung Galaxy A26",
    image: smartphonesImg,
    colors: [
      { name: "white", hex: "#FFFFFF", label: "Blanco" },
      { name: "black", hex: "#000000", label: "Negro" },
      { name: "mint", hex: "#10B981", label: "Menta" },
    ] as ProductColor[],
    rating: 4.4,
    reviewCount: 156,
    price: "$ 1.450.000",
    originalPrice: "$ 1.600.000",
    discount: "-9%",
  },
  {
    id: "galaxy-a15-256gb",
    name: "Samsung Galaxy A15 256 GB",
    image: smartphonesImg,
    colors: [
      { name: "white", hex: "#FFFFFF", label: "Blanco" },
      { name: "black", hex: "#000000", label: "Negro" },
    ] as ProductColor[],
    rating: 4.2,
    reviewCount: 203,
    price: "$ 999.000",
  },
  {
    id: "galaxy-a15-4gb",
    name: "Samsung Galaxy A15 4GB 128GB",
    image: smartphonesImg,
    colors: [
      { name: "yellow", hex: "#FCD34D", label: "Amarillo" },
      { name: "black", hex: "#000000", label: "Negro" },
    ] as ProductColor[],
    rating: 4.1,
    reviewCount: 94,
    price: "$ 750.000",
    isNew: true,
  },
  {
    id: "galaxy-a15-128gb",
    name: "Samsung Galaxy A15 4GB 128GB",
    image: smartphonesImg,
    colors: [
      { name: "white", hex: "#FFFFFF", label: "Blanco" },
      { name: "blue", hex: "#1E40AF", label: "Azul" },
    ] as ProductColor[],
    rating: 4.0,
    reviewCount: 67,
    price: "$ 850.000",
  },
];

// ...existing code...
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
  const [resultCount] = useState(24);

  useEffect(() => {
    posthogUtils.capture("section_view", {
      section: "smartphones",
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
      {/* Categorías de smartphones */}
      <CategorySlider
        categories={smartphoneCategories}
        trackingPrefix="smartphone_category"
      />

      {/* Contenido principal */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar de filtros - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar
              filterConfig={smartphoneFilters}
              filters={filters}
              onFilterChange={handleFilterChange}
              resultCount={resultCount}
              expandedFilters={expandedFilters}
              onToggleFilter={toggleFilter}
              trackingPrefix="smartphone_filter"
            />
          </aside>

          {/* Contenido principal */}
          <main className="flex-1">
            {/* Header con controles */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Smartphones
                </h1>
                <span className="text-sm text-gray-500">
                  {resultCount} resultados
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Botón filtros móvil */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4" />
                  Filtros
                </button>

                {/* Selector de ordenamiento */}
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

                {/* Toggle vista */}
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

            {/* Grid de productos */}
            <div
              className={cn(
                "grid gap-6",
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              )}
            >
              {smartphoneProducts.map((product) => (
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
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Modal de filtros móvil */}
      <MobileFilterModal
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        filterConfig={smartphoneFilters}
        filters={filters}
        onFilterChange={handleFilterChange}
        resultCount={resultCount}
        expandedFilters={expandedFilters}
        onToggleFilter={toggleFilter}
        trackingPrefix="smartphone_filter"
      />
    </div>
  );
}
