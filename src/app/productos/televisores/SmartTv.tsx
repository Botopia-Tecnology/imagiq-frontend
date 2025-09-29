/**
 * 📺 SMART TV SECTION - IMAGIQ ECOMMERCE
 *
 * Sección de Smart TV con:
 * - Grid de productos específicos para Smart TV
 * - Filtros especializados para funcionalidades inteligentes
 * - Categorías de acceso rápido
 * - Tracking específico para Smart TV
 */

"use client";

import { posthogUtils } from "@/lib/posthogClient";
import { cn } from "@/lib/utils";
import { Filter, Grid3X3, List } from "lucide-react";
import { useEffect, useState } from "react";
import CategorySlider from "../components/CategorySlider";
import FilterSidebar, {
  MobileFilterModal,
  type FilterConfig,
  type FilterState,
} from "../components/FilterSidebar";
import ProductCard, { type ProductColor } from "../components/ProductCard";
import smartTvImg from "../../../img/categorias/Tv_Monitores.png";
import { smartTvCategories } from "./constants";

// Configuración de filtros específica para Smart TV
const smartTvFilters: FilterConfig = {
  tamanoPantalla: ['32"', '43"', '50"', '55"', '65"', '75"'],
  sistemaOperativo: ["Tizen OS", "Android TV", "WebOS", "Roku TV"],
  caracteristicas: [
    "Samsung TV Plus",
    "Bixby",
    "Alexa Built-in",
    "Google Assistant",
    "AirPlay 2",
    "SmartThings",
    "Gaming Hub",
    "Multi View",
    "Tap View",
  ],
  streaming: [
    "Netflix",
    "Prime Video",
    "Disney+",
    "YouTube",
    "Spotify",
    "Apple TV+",
    "HBO Max",
  ],
  rangoPrecio: [
    { label: "Menos de $800.000", min: 0, max: 800000 },
    { label: "$800.000 - $1.500.000", min: 800000, max: 1500000 },
    { label: "$1.500.000 - $3.000.000", min: 1500000, max: 3000000 },
    { label: "Más de $3.000.000", min: 3000000, max: Infinity },
  ],
  conectividad: ["WiFi", "Bluetooth", "HDMI", "USB", "Ethernet"],
  resolucion: ["HD", "Full HD", "4K UHD"],
  control: ["Control por Voz", "Control Remoto Solar", "SmartThings App"],
};

// Productos específicos de Smart TV
export const smartTvProducts = [
  {
    id: "samsung-smart-tv-32-t4300",
    name: 'Samsung Smart TV 32" HD T4300',
    image: smartTvImg,
    colors: [
      { name: "black", hex: "#000000", label: "Negro" },
    ] as ProductColor[],
    rating: 4.3,
    reviewCount: 189,
    price: "$ 799.000",
    originalPrice: "$ 899.000",
    discount: "-11%",
    isNew: false,
  },
  {
    id: "samsung-smart-tv-43-au7000",
    name: 'Samsung Smart TV 43" 4K AU7000',
    image: smartTvImg,
    colors: [
      { name: "black", hex: "#000000", label: "Negro" },
    ] as ProductColor[],
    rating: 4.5,
    reviewCount: 267,
    price: "$ 1.299.000",
    originalPrice: "$ 1.499.000",
    discount: "-13%",
    isNew: false,
  },
  {
    id: "samsung-smart-tv-50-au7000",
    name: 'Samsung Smart TV 50" 4K AU7000',
    image: smartTvImg,
    colors: [
      { name: "black", hex: "#000000", label: "Negro" },
    ] as ProductColor[],
    rating: 4.6,
    reviewCount: 345,
    price: "$ 1.699.000",
    originalPrice: "$ 1.899.000",
    discount: "-11%",
    isNew: true,
  },
  {
    id: "samsung-smart-tv-55-bu8000",
    name: 'Samsung Smart TV 55" 4K BU8000',
    image: smartTvImg,
    colors: [
      { name: "black", hex: "#000000", label: "Negro" },
    ] as ProductColor[],
    rating: 4.7,
    reviewCount: 423,
    price: "$ 2.199.000",
    originalPrice: "$ 2.499.000",
    discount: "-12%",
    isNew: true,
  },
];

export default function SmartTvSection() {
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(["sistemaOperativo"])
  );
  const [filters, setFilters] = useState<FilterState>({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevancia");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [resultCount] = useState(smartTvProducts.length);

  // Tracking de vista de sección
  useEffect(() => {
    posthogUtils.capture("section_view", {
      section: "smart_tv",
      page: "televisores_av",
      products_count: smartTvProducts.length,
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
      section: "smart_tv",
      filter_type: filterType,
      filter_value: value,
      is_checked: checked,
    });
  };

  return (
    <>
      {/* Slider de categorías */}
      <div className=" py-8">
        <div className="container mx-auto px-6">
          <CategorySlider categories={smartTvCategories} className="mb-0" />
        </div>
      </div>

      <div className="min-h-screen bg-white">
        {/* Contenido principal */}
        <div className="container mx-auto px-6 py-8">
          <div className="flex gap-8">
            {/* Sidebar de filtros - Desktop */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <FilterSidebar
                filterConfig={smartTvFilters}
                filters={filters}
                onFilterChange={handleFilterChange}
                resultCount={resultCount}
                expandedFilters={expandedFilters}
                onToggleFilter={toggleFilter}
                trackingPrefix="smart_tv_filter"
              />
            </aside>

            {/* Contenido principal */}
            <main className="flex-1">
              {/* Header con controles */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-bold text-gray-900">Smart TV</h1>
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
                  "transition-all duration-200",
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                )}
              >
                {smartTvProducts.map((product) => (
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
                      posthogUtils.capture("add_to_cart_click", {
                        product_id: productId,
                        product_name: product.name,
                        color: color,
                        section: "smart_tv",
                      });
                    }}
                    onToggleFavorite={(productId: string) => {
                      console.log(`Toggle favorito: ${productId}`);
                      posthogUtils.capture("toggle_favorite", {
                        product_id: productId,
                        product_name: product.name,
                        section: "smart_tv",
                      });
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
          filterConfig={smartTvFilters}
          filters={filters}
          onFilterChange={handleFilterChange}
          resultCount={resultCount}
          expandedFilters={expandedFilters}
          onToggleFilter={toggleFilter}
          trackingPrefix="smart_tv_filter"
        />
      </div>
    </>
  );
}
