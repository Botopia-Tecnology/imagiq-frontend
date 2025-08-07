/**
 * 📺 TELEVISORES PAGE - IMAGIQ ECOMMERCE
 *
 * Página de productos de televisores con:
 * - Categorías de acceso rápido (Smart TV, Gaming, etc.) - Slider
 * - Filtros avanzados por características
 * - Grid de productos con ProductCard mejorado
 * - Diseño idéntico a Samsung Store
 * - Navbar blanco para esta sección
 */

"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  Grid3X3,
  List,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ProductCard, { type ProductColor } from "../components/ProductCard";
import { posthogUtils } from "@/lib/posthogClient";

// Importar imágenes de productos con nombres correctos
import galaxyA16Img from "../../../img/DispositivosMobiles/galaxy-a16-blue.png";
import galaxyA25Img from "../../../img/DispositivosMobiles/galaxy-a25-white.png";
import galaxyA26Img from "../../../img/DispositivosMobiles/galaxy-a26-silver.png";
import galaxyA15_4gbImg from "../../../img/DispositivosMobiles/galaxy-a15-yellow.png";
import galaxyA15_128gbImg from "../../../img/DispositivosMobiles/galaxy-a15-white.png";

// Importar imágenes de categorías
import tvMonitoresImg from "../../../img/categorias/Tv_Monitores.png";
import tabletasImg from "../../../img/categorias/Tabletas.png";
import smartphonesImg from "../../../img/categorias/Smartphones.png";
import electrodomesticosImg from "../../../img/categorias/Electrodomesticos.png";

// Categorías de acceso rápido para televisores
const quickCategories = [
  {
    id: "smart-tv",
    name: "Smart",
    subtitle: "TV",
    image: tvMonitoresImg,
    href: "#smart-tv",
  },
  {
    id: "gaming-monitor",
    name: "Gaming",
    subtitle: "Monitor",
    image: tvMonitoresImg,
    href: "#gaming",
  },
  {
    id: "tablets",
    name: "Galaxy",
    subtitle: "Tab",
    image: tabletasImg,
    href: "#tablets",
  },
  {
    id: "accessories",
    name: "Audio &",
    subtitle: "Video",
    image: tvMonitoresImg,
    href: "#accessories",
  },
];

// Productos de ejemplo para televisores (usando imágenes disponibles)
const mockTVProducts = [
  {
    id: "monitor-gaming-27",
    name: 'Monitor Gaming Samsung Odyssey G3 27"',
    image: tvMonitoresImg,
    colors: [
      { name: "black", hex: "#000000", label: "Negro" },
    ] as ProductColor[],
    rating: 4.6,
    reviewCount: 245,
    price: "$ 890.000",
    originalPrice: "$ 1.100.000",
    discount: "-19%",
    characteristics: {
      screen: '27"',
      resolution: "1920x1080",
      refreshRate: "144Hz",
      panel: "VA",
      connectivity: "HDMI, DisplayPort",
      features: "FreeSync, Curved",
    },
  },
  {
    id: "galaxy-tab-s9",
    name: 'Samsung Galaxy Tab S9 11" WiFi',
    image: tabletasImg,
    colors: [
      { name: "gray", hex: "#808080", label: "Gris" },
      { name: "black", hex: "#000000", label: "Negro" },
    ] as ProductColor[],
    rating: 4.8,
    reviewCount: 189,
    price: "$ 2.450.000",
    isNew: true,
    characteristics: {
      screen: '11"',
      storage: "256GB",
      ram: "8GB",
      processor: "Snapdragon",
      connectivity: "WiFi 6E",
      features: "S Pen incluido",
    },
  },
  {
    id: "electrodomestico-premium",
    name: "Samsung Refrigerador Premium",
    image: electrodomesticosImg,
    colors: [
      { name: "steel", hex: "#71717A", label: "Acero Inoxidable" },
      { name: "black", hex: "#000000", label: "Negro" },
    ] as ProductColor[],
    rating: 4.7,
    reviewCount: 324,
    price: "$ 3.890.000",
    originalPrice: "$ 4.200.000",
    discount: "-7%",
    characteristics: {
      capacity: "500L",
      type: "Side by Side",
      features: "No Frost, Dispensador",
      energy: "A++",
      warranty: "5 años",
      dimensions: "178x91x74 cm",
    },
  },
];

// Definir tipos para las opciones de filtros
interface PriceRange {
  label: string;
  min: number;
  max: number;
}

// Opciones de filtros completas
const filterOptions = {
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
    { label: "Menos de $200.000", min: 0, max: 200000 },
    { label: "$200.000 - $500.000", min: 200000, max: 500000 },
    { label: "$500.000 - $1.000.000", min: 500000, max: 1000000 },
    { label: "Más de $1.000.000", min: 1000000, max: Infinity },
  ] as PriceRange[],
  marca: [
    "Samsung Galaxy A",
    "Samsung Galaxy S",
    "Samsung Galaxy Note",
    "Samsung Galaxy Z",
  ],
  pantalla: ['5.5"', '6.1"', '6.5"', '6.7"', '6.8"'],
  procesador: ["Exynos", "Snapdragon", "MediaTek"],
  ram: ["4GB", "6GB", "8GB", "12GB", "16GB"],
  conectividad: ["3G", "4G", "5G"],
};

interface FilterState {
  almacenamiento: string[];
  caracteristicas: string[];
  camara: string[];
  rangoPrecio: string[];
  marca: string[];
  pantalla: string[];
  procesador: string[];
  ram: string[];
  conectividad: string[];
}

export default function TelevisoresPage() {
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(["almacenamiento"])
  );
  const [filters, setFilters] = useState<FilterState>({
    almacenamiento: [],
    caracteristicas: [],
    camara: [],
    rangoPrecio: [],
    marca: [],
    pantalla: [],
    procesador: [],
    ram: [],
    conectividad: [],
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevancia");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [resultCount] = useState(53); // Simulado, vendrá de la API
  const [categorySlideIndex, setCategorySlideIndex] = useState(0);
  const categoriesRef = useRef<HTMLDivElement>(null);

  // Tracking de vista de página
  useEffect(() => {
    posthogUtils.capture("page_view", {
      page: "televisores",
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
    filterType: keyof FilterState,
    value: string,
    checked: boolean
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: checked
        ? [...prev[filterType], value]
        : prev[filterType].filter((item) => item !== value),
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
    const maxIndex = quickCategories.length - 4; // Mostrar 4 a la vez
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
                      className="group w-full bg-[#D9D9D9] rounded-2xl p-6 transition-all duration-300 hover:bg-gray-300 hover:shadow-lg hover:-translate-y-1"
                    >
                      <div className="aspect-square relative mb-3">
                        <Image
                          src={category.image}
                          alt={`${category.name} ${category.subtitle}`}
                          fill
                          className="object-contain transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-gray-900 text-sm">
                          {category.name}
                        </div>
                        <div className="font-bold text-gray-900 text-sm">
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
            <div className="bg-[#D9D9D9] rounded-lg shadow-sm border border-gray-300 p-6">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-5 h-5 text-gray-700" />
                <h2 className="font-bold text-gray-900">Filtros</h2>
                <span className="text-sm text-gray-600">
                  ({resultCount} resultados)
                </span>
              </div>

              {/* Filtros */}
              <div className="space-y-4">
                {Object.entries(filterOptions).map(([filterKey, options]) => (
                  <div
                    key={filterKey}
                    className="border-b border-gray-100 pb-4"
                  >
                    <button
                      onClick={() => toggleFilter(filterKey)}
                      className="w-full flex items-center justify-between py-2 text-left"
                    >
                      <span className="font-medium text-gray-900 capitalize">
                        {filterKey.replace(/([A-Z])/g, " $1").toLowerCase()}
                      </span>
                      {expandedFilters.has(filterKey) ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </button>

                    {expandedFilters.has(filterKey) && (
                      <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                        {filterKey === "rangoPrecio"
                          ? // Manejo específico para rangos de precio
                            (options as PriceRange[]).map((range, index) => (
                              <label
                                key={`${filterKey}-${index}`}
                                className="flex items-center"
                              >
                                <input
                                  type="checkbox"
                                  checked={filters[
                                    filterKey as keyof FilterState
                                  ].includes(range.label)}
                                  onChange={(e) =>
                                    handleFilterChange(
                                      filterKey as keyof FilterState,
                                      range.label,
                                      e.target.checked
                                    )
                                  }
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                  {range.label}
                                </span>
                              </label>
                            ))
                          : // Manejo para opciones simples de string
                            (options as string[]).map((option) => (
                              <label
                                key={`${filterKey}-${option}`}
                                className="flex items-center"
                              >
                                <input
                                  type="checkbox"
                                  checked={filters[
                                    filterKey as keyof FilterState
                                  ].includes(option)}
                                  onChange={(e) =>
                                    handleFilterChange(
                                      filterKey as keyof FilterState,
                                      option,
                                      e.target.checked
                                    )
                                  }
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                  {option}
                                </span>
                              </label>
                            ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Contenido principal */}
          <main className="flex-1">
            {/* Header con controles */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Televisores y Monitores
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
              {mockTVProducts.map((product) => (
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
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50">
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Filtros</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ✕
                </button>
              </div>

              {/* Mismo contenido de filtros que desktop */}
              <div className="space-y-4">
                {Object.entries(filterOptions).map(([filterKey, options]) => (
                  <div
                    key={filterKey}
                    className="border-b border-gray-100 pb-4"
                  >
                    <button
                      onClick={() => toggleFilter(filterKey)}
                      className="w-full flex items-center justify-between py-2 text-left"
                    >
                      <span className="font-medium text-gray-900 capitalize">
                        {filterKey.replace(/([A-Z])/g, " $1").toLowerCase()}
                      </span>
                      {expandedFilters.has(filterKey) ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </button>

                    {expandedFilters.has(filterKey) && (
                      <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                        {filterKey === "rangoPrecio"
                          ? // Manejo específico para rangos de precio
                            (options as PriceRange[]).map((range, index) => (
                              <label
                                key={`mobile-${filterKey}-${index}`}
                                className="flex items-center"
                              >
                                <input
                                  type="checkbox"
                                  checked={filters[
                                    filterKey as keyof FilterState
                                  ].includes(range.label)}
                                  onChange={(e) =>
                                    handleFilterChange(
                                      filterKey as keyof FilterState,
                                      range.label,
                                      e.target.checked
                                    )
                                  }
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                  {range.label}
                                </span>
                              </label>
                            ))
                          : // Manejo para opciones simples de string
                            (options as string[]).map((option) => (
                              <label
                                key={`mobile-${filterKey}-${option}`}
                                className="flex items-center"
                              >
                                <input
                                  type="checkbox"
                                  checked={filters[
                                    filterKey as keyof FilterState
                                  ].includes(option)}
                                  onChange={(e) =>
                                    handleFilterChange(
                                      filterKey as keyof FilterState,
                                      option,
                                      e.target.checked
                                    )
                                  }
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                  {option}
                                </span>
                              </label>
                            ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
