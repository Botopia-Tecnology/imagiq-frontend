/**
 * 📺 CRYSTAL UHD SECTION - IMAGIQ ECOMMERCE
 *
 * Sección de televisores Crystal UHD con:
 * - Grid de productos específicos para Crystal UHD
 * - Filtros especializados para televisores UHD
 * - Categorías de acceso rápido
 * - Tracking específico para Crystal UHD
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
import crystalUhdImg from "../../../img/categorias/Tv_Monitores.png";
import qledImg from "../../../img/categorias/Tv_Monitores.png";
import smartTvImg from "../../../img/categorias/Tv_Monitores.png";
import barrasSonidoImg from "../../../img/categorias/Tv_Monitores.png";

// Categorías específicas para Crystal UHD
const crystalUhdCategories: Category[] = [
  {
    id: "crystal-uhd-tv",
    name: "Crystal",
    subtitle: "UHD TV",
    image: crystalUhdImg,
    href: "#crystal-uhd-tv",
  },
  {
    id: "qled-tv",
    name: "QLED",
    subtitle: "TV",
    image: qledImg,
    href: "/productos/televisores?section=qled-tv",
  },
  {
    id: "smart-tv",
    name: "Smart",
    subtitle: "TV",
    image: smartTvImg,
    href: "/productos/televisores?section=smart-tv",
  },
  {
    id: "barras-sonido",
    name: "Barras",
    subtitle: "Sonido",
    image: barrasSonidoImg,
    href: "/productos/televisores?section=barras-sonido",
  },
];

// Configuración de filtros específica para Crystal UHD
const crystalUhdFilters: FilterConfig = {
  tamanoPantalla: ['32"', '43"', '50"', '55"', '65"', '75"', '85"'],
  resolucion: ["Full HD", "4K UHD", "8K"],
  caracteristicas: [
    "HDR10+",
    "Crystal Processor 4K",
    "PurColor",
    "Motion Xcelerator",
    "Mega Contrast",
    "Object Tracking Sound Lite",
  ],
  smartTV: ["Tizen OS", "Samsung TV Plus", "Multi View"],
  rangoPrecio: [
    { label: "Menos de $1.000.000", min: 0, max: 1000000 },
    { label: "$1.000.000 - $2.000.000", min: 1000000, max: 2000000 },
    { label: "$2.000.000 - $3.000.000", min: 2000000, max: 3000000 },
    { label: "Más de $3.000.000", min: 3000000, max: Infinity },
  ],
  conectividad: ["WiFi", "Bluetooth", "HDMI", "USB"],
  audio: ["Dolby Digital Plus", "Adaptive Sound"],
  gaming: ["Game Mode", "Auto Low Latency Mode"],
};

// Productos específicos de Crystal UHD
export const crystalUhdProducts = [
  {
    id: "samsung-crystal-uhd-43-cu7000",
    name: 'Samsung Crystal UHD 4K 43" CU7000',
    image: crystalUhdImg,
    colors: [
      { name: "black", hex: "#000000", label: "Negro" },
    ] as ProductColor[],
    rating: 4.5,
    reviewCount: 234,
    price: "$ 1.599.000",
    originalPrice: "$ 1.899.000",
    discount: "-16%",
    isNew: false,
  },
  {
    id: "samsung-crystal-uhd-50-cu7000",
    name: 'Samsung Crystal UHD 4K 50" CU7000',
    image: crystalUhdImg,
    colors: [
      { name: "black", hex: "#000000", label: "Negro" },
    ] as ProductColor[],
    rating: 4.6,
    reviewCount: 189,
    price: "$ 1.899.000",
    originalPrice: "$ 2.199.000",
    discount: "-14%",
    isNew: false,
  },
  {
    id: "samsung-crystal-uhd-55-cu7000",
    name: 'Samsung Crystal UHD 4K 55" CU7000',
    image: crystalUhdImg,
    colors: [
      { name: "black", hex: "#000000", label: "Negro" },
    ] as ProductColor[],
    rating: 4.7,
    reviewCount: 312,
    price: "$ 2.299.000",
    originalPrice: "$ 2.599.000",
    discount: "-12%",
    isNew: true,
  },
  {
    id: "samsung-crystal-uhd-65-cu8000",
    name: 'Samsung Crystal UHD 4K 65" CU8000',
    image: crystalUhdImg,
    colors: [
      { name: "black", hex: "#000000", label: "Negro" },
    ] as ProductColor[],
    rating: 4.8,
    reviewCount: 156,
    price: "$ 3.299.000",
    originalPrice: "$ 3.799.000",
    discount: "-13%",
    isNew: true,
  },
];

export default function CrystalUhdSection() {
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(["tamanoPantalla"])
  );
  const [filters, setFilters] = useState<FilterState>({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevancia");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [resultCount] = useState(crystalUhdProducts.length);

  // Tracking de vista de sección
  useEffect(() => {
    posthogUtils.capture("section_view", {
      section: "crystal_uhd",
      page: "televisores_av",
      products_count: crystalUhdProducts.length,
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
      section: "crystal_uhd",
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
          <CategorySlider categories={crystalUhdCategories} className="mb-0" />
        </div>
      </div>

      <div className="min-h-screen bg-white">
        {/* Contenido principal */}
        <div className="container mx-auto px-6 py-8">
          <div className="flex gap-8">
            {/* Sidebar de filtros - Desktop */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <FilterSidebar
                filterConfig={crystalUhdFilters}
                filters={filters}
                onFilterChange={handleFilterChange}
                resultCount={resultCount}
                expandedFilters={expandedFilters}
                onToggleFilter={toggleFilter}
                trackingPrefix="crystal_uhd_filter"
              />
            </aside>

            {/* Contenido principal */}
            <main className="flex-1">
              {/* Header con controles */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Crystal UHD
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
                  "transition-all duration-200",
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                )}
              >
                {crystalUhdProducts.map((product) => (
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
                        section: "crystal_uhd",
                      });
                    }}
                    onToggleFavorite={(productId: string) => {
                      console.log(`Toggle favorito: ${productId}`);
                      posthogUtils.capture("toggle_favorite", {
                        product_id: productId,
                        product_name: product.name,
                        section: "crystal_uhd",
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
          filterConfig={crystalUhdFilters}
          filters={filters}
          onFilterChange={handleFilterChange}
          resultCount={resultCount}
          expandedFilters={expandedFilters}
          onToggleFilter={toggleFilter}
          trackingPrefix="crystal_uhd_filter"
        />
      </div>
    </>
  );
}
