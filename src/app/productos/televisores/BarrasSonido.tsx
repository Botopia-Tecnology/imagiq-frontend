/**
 * 🔊 BARRAS DE SONIDO SECTION - IMAGIQ ECOMMERCE
 *
 * Sección de barras de sonido con:
 * - Grid de productos específicos para barras de sonido
 * - Filtros especializados para audio
 * - Categorías de acceso rápido
 * - Tracking específico para barras de sonido
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
import qledImg from "../../../img/categorias/Tv_Monitores.png";
import smartTvImg from "../../../img/categorias/Tv_Monitores.png";
import barrasSonidoImg from "../../../img/categorias/Tv_Monitores.png";

// Categorías específicas para barras de sonido
const barrasSonidoCategories: Category[] = [
  {
    id: "barras-sonido",
    name: "Barras",
    subtitle: "Sonido",
    image: barrasSonidoImg,
    href: "#barras-sonido",
  },
  {
    id: "sistemas-audio",
    name: "Sistemas",
    subtitle: "Audio",
    image: barrasSonidoImg,
    href: "/productos/televisores?section=sistemas-audio",
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
];

// Configuración de filtros específica para barras de sonido
const barrasSonidoFilters: FilterConfig = {
  canales: ["2.0", "2.1", "3.1", "5.1", "7.1", "11.1.4"],
  potencia: ["100W", "200W", "300W", "400W", "500W+"],
  caracteristicas: [
    "Dolby Atmos",
    "DTS:X",
    "Q-Symphony",
    "Adaptive Sound",
    "Game Mode Pro",
    "SpaceFit Sound",
    "Wireless Surround Ready",
  ],
  conectividad: [
    "Bluetooth",
    "WiFi",
    "HDMI eARC",
    "USB",
    "Optical",
    "AUX",
    "Chromecast",
    "AirPlay 2",
  ],
  rangoPrecio: [
    { label: "Menos de $500.000", min: 0, max: 500000 },
    { label: "$500.000 - $1.000.000", min: 500000, max: 1000000 },
    { label: "$1.000.000 - $2.000.000", min: 1000000, max: 2000000 },
    { label: "Más de $2.000.000", min: 2000000, max: Infinity },
  ],
  subwoofer: ["Con Subwoofer", "Sin Subwoofer", "Subwoofer Inalámbrico"],
  asistentes: ["Alexa", "Bixby", "Google Assistant"],
  diseno: ["Minimalista", "Compacta", "Premium", "Ultra Delgada"],
};

// Productos específicos de barras de sonido
export const barrasSonidoProducts = [
  {
    id: "samsung-soundbar-hw-b450",
    name: "Samsung Soundbar HW-B450 2.1ch",
    image: barrasSonidoImg,
    colors: [
      { name: "black", hex: "#000000", label: "Negro" },
    ] as ProductColor[],
    rating: 4.4,
    reviewCount: 156,
    price: "$ 399.000",
    originalPrice: "$ 449.000",
    discount: "-11%",
    isNew: false,
  },
  {
    id: "samsung-soundbar-hw-b650",
    name: "Samsung Soundbar HW-B650 3.1ch",
    image: barrasSonidoImg,
    colors: [
      { name: "black", hex: "#000000", label: "Negro" },
    ] as ProductColor[],
    rating: 4.6,
    reviewCount: 234,
    price: "$ 699.000",
    originalPrice: "$ 799.000",
    discount: "-13%",
    isNew: false,
  },
  {
    id: "samsung-soundbar-hw-q600b",
    name: "Samsung Soundbar HW-Q600B 3.1.2ch",
    image: barrasSonidoImg,
    colors: [
      { name: "black", hex: "#000000", label: "Negro" },
    ] as ProductColor[],
    rating: 4.7,
    reviewCount: 312,
    price: "$ 1.199.000",
    originalPrice: "$ 1.399.000",
    discount: "-14%",
    isNew: true,
  },
  {
    id: "samsung-soundbar-hw-q800c",
    name: "Samsung Soundbar HW-Q800C 5.1.2ch",
    image: barrasSonidoImg,
    colors: [
      { name: "black", hex: "#000000", label: "Negro" },
    ] as ProductColor[],
    rating: 4.8,
    reviewCount: 189,
    price: "$ 1.899.000",
    originalPrice: "$ 2.199.000",
    discount: "-14%",
    isNew: true,
  },
];

export default function BarrasSonidoSection() {
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(["canales"])
  );
  const [filters, setFilters] = useState<FilterState>({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevancia");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [resultCount] = useState(barrasSonidoProducts.length);

  // Tracking de vista de sección
  useEffect(() => {
    posthogUtils.capture("section_view", {
      section: "barras_sonido",
      page: "televisores_av",
      products_count: barrasSonidoProducts.length,
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
      section: "barras_sonido",
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
          <CategorySlider
            categories={barrasSonidoCategories}
            className="mb-0"
          />
        </div>
      </div>

      <div className="min-h-screen bg-white">
        {/* Contenido principal */}
        <div className="container mx-auto px-6 py-8">
          <div className="flex gap-8">
            {/* Sidebar de filtros - Desktop */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <FilterSidebar
                filterConfig={barrasSonidoFilters}
                filters={filters}
                onFilterChange={handleFilterChange}
                resultCount={resultCount}
                expandedFilters={expandedFilters}
                onToggleFilter={toggleFilter}
                trackingPrefix="barras_sonido_filter"
              />
            </aside>

            {/* Contenido principal */}
            <main className="flex-1">
              {/* Header con controles */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Barras de Sonido
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
                {barrasSonidoProducts.map((product) => (
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
                        section: "barras_sonido",
                      });
                    }}
                    onToggleFavorite={(productId: string) => {
                      console.log(`Toggle favorito: ${productId}`);
                      posthogUtils.capture("toggle_favorite", {
                        product_id: productId,
                        product_name: product.name,
                        section: "barras_sonido",
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
          filterConfig={barrasSonidoFilters}
          filters={filters}
          onFilterChange={handleFilterChange}
          resultCount={resultCount}
          expandedFilters={expandedFilters}
          onToggleFilter={toggleFilter}
          trackingPrefix="barras_sonido_filter"
        />
      </div>
    </>
  );
}
