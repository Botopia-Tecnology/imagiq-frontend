/**
 * 📦 ACCESORIOS SECTION - IMAGIQ ECOMMERCE
 *
 * Sección de accesorios para dispositivos móviles con:
 * - Filtros específicos para accesorios
 * - Diversos tipos de accesorios
 * - Características específicas de accesorios
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
import { useProducts } from "@/features/products/useProducts";
import LoadingSpinner from "@/components/LoadingSpinner";

// Importar imágenes del slider
import smartphonesImg from "../../../img/categorias/Smartphones.png";
import tabletasImg from "../../../img/categorias/Tabletas.png";
import galaxyBudsImg from "../../../img/categorias/galaxy_buds.png";
import galaxyWatchImg from "../../../img/categorias/galaxy_watch.png";

// Categorías del slider (idénticas a la imagen)
const accessoryCategories: Category[] = [
  {
    id: "galaxy-smartphone",
    name: "Galaxy",
    subtitle: "Smartphone",
    image: smartphonesImg,
    href: "/productos/dispositivos-moviles?section=smartphones",
  },
  {
    id: "galaxy-watch",
    name: "Galaxy",
    subtitle: "Watch",
    image: galaxyWatchImg,
    href: "/productos/dispositivos-moviles?section=relojes",
  },
  {
    id: "galaxy-tab",
    name: "Galaxy",
    subtitle: "Tab",
    image: tabletasImg,
    href: "/productos/dispositivos-moviles?section=tabletas",
  },
  {
    id: "galaxy-buds",
    name: "Galaxy",
    subtitle: "Buds",
    image: galaxyBudsImg,
    href: "/productos/dispositivos-moviles?section=buds",
  },
];

// Configuración de filtros específica para accesorios
const accessoryFilters: FilterConfig = {
  tipoAccesorio: [
    "Cargadores",
    "Cables",
    "Fundas",
    "Protectores de pantalla",
    "Correas",
    "Soportes",
    "PowerBank",
  ],
  compatibilidad: [
    "Galaxy S Series",
    "Galaxy A Series",
    "Galaxy Note",
    "Galaxy Tab",
    "Galaxy Watch",
    "Universal",
  ],
  material: [
    "Silicona",
    "Cuero",
    "Metal",
    "Plástico",
    "Cristal templado",
    "TPU",
  ],
  color: ["Negro", "Blanco", "Transparente", "Azul", "Rojo", "Rosa", "Morado"],
  caracteristicas: [
    "Carga rápida",
    "Inalámbrico",
    "Magnético",
    "Resistente al agua",
    "Anti-golpes",
    "Ultra delgado",
  ],
  rangoPrecio: [
    { label: "Menos de $50.000", min: 0, max: 50000 },
    { label: "$50.000 - $100.000", min: 50000, max: 100000 },
    { label: "$100.000 - $200.000", min: 100000, max: 200000 },
    { label: "Más de $200.000", min: 200000, max: Infinity },
  ],
  marca: ["Samsung", "Spigen", "OtterBox", "Belkin", "Anker", "UAG"],
  tipoConector: ["USB-C", "Lightning", "Micro USB", "Wireless", "Magnético"],
};

export default function AccesoriosSection() {
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(["tipoAccesorio"])
  );
  const [filters, setFilters] = useState<FilterState>({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevancia");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);

  // Usar el hook de productos con filtro de subcategoría "Accesorios"
  const { 
    products, 
    loading, 
    error, 
    totalItems,
    refreshProducts 
  } = useProducts({
    subcategory: "Accesorios"
  });

  useEffect(() => {
    posthogUtils.capture("section_view", {
      section: "accesorios",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <CategorySlider
          categories={accessoryCategories}
          trackingPrefix="accessory_category"
        />
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <CategorySlider
          categories={accessoryCategories}
          trackingPrefix="accessory_category"
        />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error al cargar accesorios</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={refreshProducts}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <CategorySlider
        categories={accessoryCategories}
        trackingPrefix="accessory_category"
      />

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar
              filterConfig={accessoryFilters}
              filters={filters}
              onFilterChange={handleFilterChange}
              resultCount={totalItems}
              expandedFilters={expandedFilters}
              onToggleFilter={toggleFilter}
              trackingPrefix="accessory_filter"
            />
          </aside>

          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Accesorios</h1>
                <span className="text-sm text-gray-500">
                  {totalItems} resultados
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
              {products.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No se encontraron accesorios con los filtros seleccionados.
                </div>
              ) : (
                products.map((product) => (
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
                ))
              )}
            </div>
          </main>
        </div>
      </div>

      <MobileFilterModal
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        filterConfig={accessoryFilters}
        filters={filters}
        onFilterChange={handleFilterChange}
        resultCount={totalItems}
        expandedFilters={expandedFilters}
        onToggleFilter={toggleFilter}
        trackingPrefix="accessory_filter"
      />
    </div>
  );
}
