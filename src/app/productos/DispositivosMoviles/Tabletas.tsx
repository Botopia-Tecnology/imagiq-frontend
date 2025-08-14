/**
 * 📱 TABLETAS SECTION - IMAGIQ ECOMMERCE
 *
 * Sección de tabletas con:
 * - Filtros específicos para tablets
 * - Productos Galaxy Tab
 * - Características específicas de tabletas
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
const tabletCategories: Category[] = [
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
    href: "#galaxy-tab",
  },
  {
    id: "galaxy-buds",
    name: "Galaxy",
    subtitle: "Buds",
    image: galaxyBudsImg,
    href: "/productos/DispositivosMoviles?section=buds",
  },
];

// Configuración de filtros específica para tabletas
const tabletFilters: FilterConfig = {
  serie: ["Galaxy Tab S", "Galaxy Tab A", "Galaxy Tab FE", "Galaxy Tab Active"],
  tamanoPantalla: ['8"', '10.4"', '11"', '12.4"', '14.6"'],
  almacenamiento: ["64GB", "128GB", "256GB", "512GB", "1TB"],
  ram: ["4GB", "6GB", "8GB", "12GB", "16GB"],
  conectividad: ["WiFi", "WiFi + 5G", "WiFi + LTE"],
  caracteristicas: [
    "S Pen incluido",
    "Teclado compatible",
    "DeX",
    "Resistente al agua",
    "Carga rápida",
  ],
  rangoPrecio: [
    { label: "Menos de $800.000", min: 0, max: 800000 },
    { label: "$800.000 - $1.500.000", min: 800000, max: 1500000 },
    { label: "$1.500.000 - $2.500.000", min: 1500000, max: 2500000 },
    { label: "Más de $2.500.000", min: 2500000, max: Infinity },
  ],
  procesador: ["Snapdragon", "Exynos", "MediaTek"],
  sistemaOperativo: ["Android", "One UI"],
  uso: ["Productividad", "Gaming", "Educación", "Entretenimiento"],
};

const tabletProducts = [
  {
    id: "galaxy-tab-s9-11",
    name: 'Samsung Galaxy Tab S9 11" WiFi',
    image: tabletasImg,
    colors: [
      { name: "gray", hex: "#808080", label: "Gris" },
      { name: "beige", hex: "#F5F5DC", label: "Beige" },
      { name: "mint", hex: "#98FB98", label: "Menta" },
    ] as ProductColor[],
    rating: 4.8,
    reviewCount: 245,
    price: "$ 2.299.000",
    originalPrice: "$ 2.699.000",
    discount: "-15%",
    isNew: true,
  },
  {
    id: "galaxy-tab-a9-10",
    name: 'Samsung Galaxy Tab A9+ 10.4" WiFi',
    image: tabletasImg,
    colors: [
      { name: "gray", hex: "#696969", label: "Gris Grafito" },
      { name: "silver", hex: "#C0C0C0", label: "Plateado" },
    ] as ProductColor[],
    rating: 4.4,
    reviewCount: 189,
    price: "$ 899.000",
  },
  {
    id: "galaxy-tab-s9-fe",
    name: 'Samsung Galaxy Tab S9 FE 10.9" WiFi',
    image: tabletasImg,
    colors: [
      { name: "mint", hex: "#98FB98", label: "Menta" },
      { name: "gray", hex: "#708090", label: "Gris" },
      { name: "lavender", hex: "#E6E6FA", label: "Lavanda" },
    ] as ProductColor[],
    rating: 4.6,
    reviewCount: 156,
    price: "$ 1.599.000",
    originalPrice: "$ 1.899.000",
    discount: "-16%",
  },
];

export default function TabletasSection() {
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(["serie"])
  );
  const [filters, setFilters] = useState<FilterState>({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevancia");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [resultCount] = useState(15);

  useEffect(() => {
    posthogUtils.capture("section_view", {
      section: "tabletas",
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
        categories={tabletCategories}
        trackingPrefix="tablet_category"
      />

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar
              filterConfig={tabletFilters}
              filters={filters}
              onFilterChange={handleFilterChange}
              resultCount={resultCount}
              expandedFilters={expandedFilters}
              onToggleFilter={toggleFilter}
              trackingPrefix="tablet_filter"
            />
          </aside>

          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Galaxy Tab</h1>
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
              {tabletProducts.map((product) => (
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
                />
              ))}
            </div>
          </main>
        </div>
      </div>

      <MobileFilterModal
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        filterConfig={tabletFilters}
        filters={filters}
        onFilterChange={handleFilterChange}
        resultCount={resultCount}
        expandedFilters={expandedFilters}
        onToggleFilter={toggleFilter}
        trackingPrefix="tablet_filter"
      />
    </div>
  );
}
