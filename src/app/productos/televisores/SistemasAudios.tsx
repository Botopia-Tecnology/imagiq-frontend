/**
 * 🎵 SISTEMAS DE AUDIO SECTION - IMAGIQ ECOMMERCE
 *
 * Sección de sistemas de audio con:
 * - Grid de productos específicos para sistemas de audio
 * - Filtros especializados para equipos de sonido
 * - Categorías de acceso rápido
 * - Tracking específico para sistemas de audio
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
import sistemasAudioImg from "../../../img/categorias/Tv_Monitores.png";

// Categorías específicas para sistemas de audio
const sistemasAudioCategories: Category[] = [
  {
    id: "sistemas-audio",
    name: "Sistemas",
    subtitle: "Audio",
    image: sistemasAudioImg,
    href: "#sistemas-audio",
  },
  {
    id: "barras-sonido",
    name: "Barras",
    subtitle: "Sonido",
    image: barrasSonidoImg,
    href: "/productos/televisores?section=barras-sonido",
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

// Configuración de filtros específica para sistemas de audio
const sistemasAudioFilters: FilterConfig = {
  tipoSistema: [
    "Home Theater",
    "Torre de Sonido",
    "Minicomponente",
    "Altavoces",
  ],
  potencia: ["50W", "100W", "200W", "300W", "500W", "1000W+"],
  caracteristicas: [
    "Dolby Atmos",
    "DTS:X",
    "Bluetooth",
    "WiFi",
    "Karaoke",
    "Luces LED",
    "Control por App",
    "Multi-Room",
  ],
  conectividad: [
    "Bluetooth",
    "WiFi",
    "USB",
    "CD/DVD",
    "Radio FM",
    "AUX",
    "NFC",
    "Chromecast",
  ],
  rangoPrecio: [
    { label: "Menos de $300.000", min: 0, max: 300000 },
    { label: "$300.000 - $800.000", min: 300000, max: 800000 },
    { label: "$800.000 - $1.500.000", min: 800000, max: 1500000 },
    { label: "Más de $1.500.000", min: 1500000, max: Infinity },
  ],
  formatos: ["MP3", "WAV", "FLAC", "AAC", "CD", "DVD"],
  efectos: ["Bass Boost", "Ecualizador", "Surround", "3D Sound"],
  marca: ["Samsung", "Sony", "LG", "JBL", "Bose"],
};

// Productos específicos de sistemas de audio
export const sistemasAudioProducts = [
  {
    id: "samsung-mx-t40",
    name: "Samsung MX-T40 Torre de Sonido",
    image: sistemasAudioImg,
    colors: [
      { name: "black", hex: "#000000", label: "Negro" },
    ] as ProductColor[],
    rating: 4.5,
    reviewCount: 167,
    price: "$ 549.000",
    originalPrice: "$ 649.000",
    discount: "-15%",
    isNew: false,
  },
  {
    id: "samsung-mx-t55",
    name: "Samsung MX-T55 Torre de Sonido",
    image: sistemasAudioImg,
    colors: [
      { name: "black", hex: "#000000", label: "Negro" },
    ] as ProductColor[],
    rating: 4.6,
    reviewCount: 213,
    price: "$ 799.000",
    originalPrice: "$ 899.000",
    discount: "-11%",
    isNew: false,
  },
  {
    id: "samsung-mx-t70",
    name: "Samsung MX-T70 Torre de Sonido",
    image: sistemasAudioImg,
    colors: [
      { name: "black", hex: "#000000", label: "Negro" },
    ] as ProductColor[],
    rating: 4.7,
    reviewCount: 298,
    price: "$ 1.199.000",
    originalPrice: "$ 1.399.000",
    discount: "-14%",
    isNew: true,
  },
  {
    id: "samsung-ht-j4500",
    name: "Samsung HT-J4500 Home Theater",
    image: sistemasAudioImg,
    colors: [
      { name: "black", hex: "#000000", label: "Negro" },
    ] as ProductColor[],
    rating: 4.8,
    reviewCount: 156,
    price: "$ 1.599.000",
    originalPrice: "$ 1.899.000",
    discount: "-16%",
    isNew: true,
  },
];

export default function SistemasAudiosSection() {
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(["tipoSistema"])
  );
  const [filters, setFilters] = useState<FilterState>({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevancia");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [resultCount] = useState(sistemasAudioProducts.length);

  // Tracking de vista de sección
  useEffect(() => {
    posthogUtils.capture("section_view", {
      section: "sistemas_audio",
      page: "televisores_av",
      products_count: sistemasAudioProducts.length,
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
      section: "sistemas_audio",
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
            categories={sistemasAudioCategories}
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
                filterConfig={sistemasAudioFilters}
                filters={filters}
                onFilterChange={handleFilterChange}
                resultCount={resultCount}
                expandedFilters={expandedFilters}
                onToggleFilter={toggleFilter}
                trackingPrefix="sistemas_audio_filter"
              />
            </aside>

            {/* Contenido principal */}
            <main className="flex-1">
              {/* Header con controles */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Sistemas de Audio
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
                {sistemasAudioProducts.map((product) => (
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
                        section: "sistemas_audio",
                      });
                    }}
                    onToggleFavorite={(productId: string) => {
                      console.log(`Toggle favorito: ${productId}`);
                      posthogUtils.capture("toggle_favorite", {
                        product_id: productId,
                        product_name: product.name,
                        section: "sistemas_audio",
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
          filterConfig={sistemasAudioFilters}
          filters={filters}
          onFilterChange={handleFilterChange}
          resultCount={resultCount}
          expandedFilters={expandedFilters}
          onToggleFilter={toggleFilter}
          trackingPrefix="sistemas_audio_filter"
        />
      </div>
    </>
  );
}
