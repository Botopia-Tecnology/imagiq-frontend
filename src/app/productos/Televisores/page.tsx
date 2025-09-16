/**
 * 📺 TELEVISORES PAGE - IMAGIQ ECOMMERCE
 *
 * Página de productos de televisores con:
 * - Categorías de acceso rápido
 * - Filtros avanzados específicos para TVs
 * - Grid de productos con ProductCard
 * - Diseño Samsung Store
 * - Responsive global implementado
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
import { posthogUtils } from "@/lib/posthogClient";
import { useDeviceType } from "@/components/responsive"; // <-- Importa el hook responsive

// Importar imagen de televisores
import televisoresImg from "../../../img/categorias/Tv_Monitores.png";

// Productos de ejemplo para televisores
const mockTelevisoresProducts = [
  {
    id: "samsung-qled-55",
    name: 'Samsung QLED 4K 55" Q80C',
    image: televisoresImg,
    colors: [
      { name: "black", hex: "#000000", label: "Negro" },
    ] as ProductColor[],
    rating: 4.8,
    reviewCount: 567,
    price: "$ 2.899.000",
    originalPrice: "$ 3.299.000",
    discount: "-12%",
    isNew: true,
  },
  {
    id: "samsung-crystal-43",
    name: 'Samsung Crystal UHD 4K 43" CU7000',
    image: televisoresImg,
    colors: [
      { name: "black", hex: "#000000", label: "Negro" },
    ] as ProductColor[],
    rating: 4.5,
    reviewCount: 234,
    price: "$ 1.599.000",
  },
];

// Opciones de filtros para televisores
const filterOptions: FilterConfig = {
  tamanoPantalla: ['32"', '43"', '50"', '55"', '65"', '75"', '85"'],
  tipoTV: ["QLED", "Crystal UHD", "Neo QLED", "OLED"],
  resolucion: ["Full HD", "4K UHD", "8K"],
  smartTV: ["Tizen OS", "Android TV", "WebOS"],
  caracteristicas: [
    "HDR10+",
    "Dolby Vision",
    "Gaming Hub",
    "Alexa Built-in",
    "Bixby",
    "AirPlay 2",
  ],
  rangoPrecio: [
    { label: "Menos de $1.000.000", min: 0, max: 1000000 },
    { label: "$1.000.000 - $2.000.000", min: 1000000, max: 2000000 },
    { label: "$2.000.000 - $4.000.000", min: 2000000, max: 4000000 },
    { label: "Más de $4.000.000", min: 4000000, max: Infinity },
  ],
  conectividad: ["WiFi", "Bluetooth", "HDMI 2.1", "USB"],
  audio: ["Dolby Atmos", "Object Tracking Sound", "Q-Symphony"],
};

export default function TelevisoresPage() {
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(["tamanoPantalla"])
  );
  const [filters, setFilters] = useState<FilterState>({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevancia");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [resultCount] = useState(18);
  const device = useDeviceType(); // <-- Usa el hook responsive global

  // Tracking de vista de página
  useEffect(() => {
    posthogUtils.capture("page_view", {
      page: "televisores",
      category: "productos",
      device, // <-- Tracking con tipo de dispositivo
    });
  }, [device]);

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
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Contenido principal */}
      <div className={cn(
        "container mx-auto px-6 py-8",
        device === "mobile" && "px-2 py-4",
        device === "tablet" && "px-4 py-6"
      )}>
        <div className={cn(
          "flex gap-8",
          device === "mobile" && "flex-col gap-4",
          device === "tablet" && "gap-6"
        )}>
          {/* Sidebar de filtros - Desktop */}
          {(device === "desktop" || device === "large") && (
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <FilterSidebar
                filterConfig={filterOptions}
                filters={filters}
                onFilterChange={handleFilterChange}
                resultCount={resultCount}
                expandedFilters={expandedFilters}
                onToggleFilter={toggleFilter}
                trackingPrefix="televisores_filter"
              />
            </aside>
          )}

          {/* Contenido principal */}
          <main className="flex-1">
            {/* Header con controles */}
            <div className={cn(
              "flex items-center justify-between mb-6",
              device === "mobile" && "flex-col items-start gap-2 mb-4"
            )}>
              <div className="flex items-center gap-4">
                <h1 className={cn(
                  "text-2xl font-bold text-gray-900",
                  device === "mobile" && "text-lg"
                )}>
                  Televisores y AV
                </h1>
                <span className={cn(
                  "text-sm text-gray-500",
                  device === "mobile" && "text-xs"
                )}>
                  {resultCount} resultados
                </span>
              </div>

              <div className={cn("flex items-center gap-4", device === "mobile" && "gap-2")}>
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

            {/* Grid de productos */}
            <div className={cn(
              "grid gap-6",
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1",
              device === "mobile" && "gap-3"
            )}>
              {mockTelevisoresProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  image={product.image}
                  colors={product.colors}
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

      {/* Modal de filtros móvil/tablet */}
      {(device === "mobile" || device === "tablet") && (
        <MobileFilterModal
          isOpen={showMobileFilters}
          onClose={() => setShowMobileFilters(false)}
          filterConfig={filterOptions}
          filters={filters}
          onFilterChange={handleFilterChange}
          resultCount={resultCount}
          expandedFilters={expandedFilters}
          onToggleFilter={toggleFilter}
          trackingPrefix="televisores_filter"
        />
      )}
    </div>
  );
}
