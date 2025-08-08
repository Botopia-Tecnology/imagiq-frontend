/**
 * 🏠 ELECTRODOMÉSTICOS PAGE - IMAGIQ ECOMMERCE
 *
 * Página de productos de electrodomésticos con:
 * - Categorías de acceso rápido (Refrigeradores, Lavadoras, etc.)
 * - Filtros avanzados por características
 * - Grid de productos con ProductCard mejorado
 * - Diseño idéntico a Samsung Store
 * - Navbar blanco para esta sección
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { Filter, Grid3X3, List, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import ProductCard, { type ProductColor } from "../components/ProductCard";
import FilterSidebar, {
  MobileFilterModal,
  type FilterConfig,
  type FilterState,
} from "../components/FilterSidebar";
import { posthogUtils } from "@/lib/posthogClient";

// Importar imágenes de productos
import electrodomesticosImg from "../../../img/categorias/Electrodomesticos.png";

// Categorías de acceso rápido para electrodomésticos
const quickCategories = [
  {
    id: "refrigeradores",
    name: "Refrigera",
    subtitle: "dores",
    image: electrodomesticosImg,
    href: "#refrigeradores",
  },
  {
    id: "lavadoras",
    name: "Lavado",
    subtitle: "ras",
    image: electrodomesticosImg,
    href: "#lavadoras",
  },
  {
    id: "lavavajillas",
    name: "Lava",
    subtitle: "vajillas",
    image: electrodomesticosImg,
    href: "#lavavajillas",
  },
  {
    id: "aire-acondicionado",
    name: "Aire",
    subtitle: "Acondicionado",
    image: electrodomesticosImg,
    href: "#aire-acondicionado",
  },
];

// Productos de ejemplo para electrodomésticos
const mockElectrodomesticosProducts = [
  {
    id: "refrigerador-samsung-rt53",
    name: "Samsung Refrigerador RT53K6540SL/AX",
    image: electrodomesticosImg,
    colors: [
      { name: "steel", hex: "#71717A", label: "Acero Inoxidable" },
    ] as ProductColor[],
    rating: 4.7,
    reviewCount: 324,
    price: "$ 3.890.000",
    originalPrice: "$ 4.200.000",
    discount: "-7%",
  },
  {
    id: "lavadora-samsung-wa20",
    name: "Samsung Lavadora WA20R7200GV/AX",
    image: electrodomesticosImg,
    colors: [
      { name: "white", hex: "#FFFFFF", label: "Blanco" },
      { name: "gray", hex: "#9CA3AF", label: "Gris" },
    ] as ProductColor[],
    rating: 4.5,
    reviewCount: 256,
    price: "$ 1.850.000",
    originalPrice: "$ 2.100.000",
    discount: "-12%",
    isNew: true,
  },
  {
    id: "lavavajillas-samsung-dw60",
    name: "Samsung Lavavajillas DW60M6040SS/AX",
    image: electrodomesticosImg,
    colors: [
      { name: "steel", hex: "#71717A", label: "Acero Inoxidable" },
    ] as ProductColor[],
    rating: 4.4,
    reviewCount: 189,
    price: "$ 2.299.000",
  },
];

// Opciones de filtros para electrodomésticos
const filterOptions: FilterConfig = {
  categoria: [
    "Refrigeradores",
    "Lavadoras",
    "Lavavajillas",
    "Aire Acondicionado",
    "Microondas",
    "Aspiradoras",
  ],
  marca: ["Samsung", "LG", "Whirlpool", "Electrolux"],
  capacidad: ["< 200L", "200-400L", "400-600L", "> 600L"],
  eficienciaEnergetica: ["A+++", "A++", "A+", "A"],
  caracteristicas: [
    "No Frost",
    "Inverter",
    "Smart Control",
    "WiFi",
    "Dispensador",
    "Pantalla Digital",
  ],
  rangoPrecio: [
    { label: "Menos de $1.000.000", min: 0, max: 1000000 },
    { label: "$1.000.000 - $2.000.000", min: 1000000, max: 2000000 },
    { label: "$2.000.000 - $4.000.000", min: 2000000, max: 4000000 },
    { label: "Más de $4.000.000", min: 4000000, max: Infinity },
  ],
  color: ["Blanco", "Acero Inoxidable", "Negro", "Gris"],
  instalacion: ["Libre", "Empotrable"],
};

export default function ElectrodomesticosPage() {
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(["categoria"])
  );
  const [filters, setFilters] = useState<FilterState>({
    categoria: [],
    marca: [],
    capacidad: [],
    eficienciaEnergetica: [],
    caracteristicas: [],
    rangoPrecio: [],
    color: [],
    instalacion: [],
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevancia");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [resultCount] = useState(28);
  const [categorySlideIndex, setCategorySlideIndex] = useState(0);
  const categoriesRef = useRef<HTMLDivElement>(null);

  // Tracking de vista de página
  useEffect(() => {
    posthogUtils.capture("page_view", {
      page: "electrodomesticos",
      category: "productos",
    });
  }, []);

  // Toggle filtro expandido/contraído
  const toggleFilter = (filterKey: string) => {
    const newExpanded = new Set(expandedFilters);
    if (newExpanded.has(filterKey)) {
      newExpanded.delete(filterKey);
    } else {
      newExpanded.add(filterKey);
    }
    setExpandedFilters(newExpanded);
  };

  // Manejar cambios de filtro
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

    posthogUtils.capture("filter_applied", {
      filter_type: filterType,
      filter_value: value,
      action: checked ? "add" : "remove",
    });
  };

  // Manejar clicks en categorías rápidas
  const handleQuickCategoryClick = (category: (typeof quickCategories)[0]) => {
    posthogUtils.capture("quick_category_click", {
      category_id: category.id,
      category_name: category.name,
      category_subtitle: category.subtitle,
    });
  };

  // Slider de categorías
  const slideCategoriesLeft = () => {
    setCategorySlideIndex((prev) => Math.max(0, prev - 1));
  };

  const slideCategoriesRight = () => {
    const maxIndex = quickCategories.length - 4;
    setCategorySlideIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Categorías de acceso rápido - Slider */}
      <section className="bg-white border-b border-gray-200 py-8">
        <div className="container mx-auto px-6">
          <div className="relative max-w-6xl mx-auto">
            {/* Botón anterior */}
            <button
              onClick={slideCategoriesLeft}
              disabled={categorySlideIndex === 0}
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-200",
                categorySlideIndex === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50 hover:shadow-xl"
              )}
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            {/* Botón siguiente */}
            <button
              onClick={slideCategoriesRight}
              disabled={categorySlideIndex >= quickCategories.length - 4}
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-200",
                categorySlideIndex >= quickCategories.length - 4
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50 hover:shadow-xl"
              )}
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>

            {/* Contenedor de categorías */}
            <div className="overflow-hidden mx-12">
              <div
                ref={categoriesRef}
                className="flex transition-transform duration-300 ease-in-out"
                style={{
                  transform: `translateX(-${categorySlideIndex * 25}%)`,
                }}
              >
                {quickCategories.map((category, index) => (
                  <div
                    key={`${category.id}-${index}`}
                    className="w-1/4 flex-shrink-0 px-3"
                  >
                    <button
                      onClick={() => handleQuickCategoryClick(category)}
                      className="group w-full bg-[#D9D9D9] rounded-2xl p-8 transition-all duration-300 hover:bg-gray-300 hover:shadow-lg hover:-translate-y-1 min-h-[120px] flex items-center justify-center"
                    >
                      <div className="text-center">
                        <div className="font-bold text-gray-900 text-lg mb-1">
                          {category.name}
                        </div>
                        <div className="font-bold text-gray-900 text-lg">
                          {category.subtitle}
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido principal */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar de filtros - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar
              filterConfig={filterOptions}
              filters={filters}
              onFilterChange={handleFilterChange}
              resultCount={resultCount}
              expandedFilters={expandedFilters}
              onToggleFilter={toggleFilter}
              trackingPrefix="electrodomesticos_filter"
            />
          </aside>

          {/* Contenido principal */}
          <main className="flex-1">
            {/* Header con controles */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Electrodomésticos
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
              {mockElectrodomesticosProducts.map((product) => (
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
        filterConfig={filterOptions}
        filters={filters}
        onFilterChange={handleFilterChange}
        resultCount={resultCount}
        expandedFilters={expandedFilters}
        onToggleFilter={toggleFilter}
        trackingPrefix="electrodomesticos_filter"
      />
    </div>
  );
}
