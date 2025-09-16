/**
 * 📦 ACCESORIOS SECTION - IMAGIQ ECOMMERCE
 *
 * Sección de accesorios para dispositivos móviles con:
 * - Filtros específicos para accesorios
 * - Diversos tipos de accesorios
 * - Características específicas de accesorios
 */

"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import { useProducts } from "@/features/products/useProducts";
import { posthogUtils } from "@/lib/posthogClient";
import { cn } from "@/lib/utils";
import { Filter, Grid3X3, List } from "lucide-react";
import { useEffect, useMemo, useState, useCallback } from "react";
import CategorySlider, { type Category } from "../components/CategorySlider";
import FilterSidebar, {
  MobileFilterModal,
  type FilterConfig,
  type FilterState,
} from "../components/FilterSidebar";

// Interfaces de tipos necesarias
interface ApiFilters {
  category?: string;
  subcategory?: string;
  priceRange?: { min: number; max: number };
  color?: string;
  capacity?: string;
  name?: string;
  withDiscount?: boolean;
  minStock?: number;
  descriptionKeyword?: string;
}

import ProductCard from "../components/ProductCard";
import { ProductCardProps } from "../components/ProductCard";

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

  // Función memoizada para convertir filtros de tipo de accesorio a filtros de API
  const getApiFilters = useMemo(() => {
    return () => {
      const apiFilters: ApiFilters = {
        subcategory: "Accesorios",
      };

      // Si hay filtros de tipo de accesorio seleccionados, buscar por descripción
      if (filters.tipoAccesorio && filters.tipoAccesorio.length > 0) {
        // Mapear tipos de accesorio a palabras clave más flexibles
        const keywordMap: Record<string, string[]> = {
          Cargadores: ["charger", "cargador", "carga", "power", "adaptador"],
          Cables: ["cable", "usb", "c-type", "lightning", "conector"],
          Fundas: ["case", "funda", "cover", "protector", "silicone"],
          "Protectores de pantalla": [
            "protector",
            "screen",
            "pantalla",
            "vidrio",
            "tempered",
            "glass",
          ],
          Correas: ["strap", "correa", "band", "banda", "pulsera", "bracelet"],
        };

        // Usar el primer filtro seleccionado para buscar
        const selectedType = filters.tipoAccesorio[0];
        const keywords = keywordMap[selectedType];
        if (keywords && keywords.length > 0) {
          // Usar la primera palabra clave como filtro principal
          apiFilters.descriptionKeyword = keywords[0];
          console.log(
            `🔍 Buscando accesorios tipo "${selectedType}" con palabra clave: "${keywords[0]}"`
          );
          console.log(`📋 Palabras clave disponibles: ${keywords.join(", ")}`);
          console.log(`🔧 Filtros API generados:`, apiFilters);
        }
      }

      return apiFilters;
    };
  }, [filters.tipoAccesorio]);

  // Usar el hook de productos con filtros dinámicos
  const { products, loading, error, totalItems, refreshProducts } =
    useProducts(getApiFilters);

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

  const toggleFilter = useCallback((filterKey: string) => {
    const newExpanded = new Set(expandedFilters);
    if (newExpanded.has(filterKey)) {
      newExpanded.delete(filterKey);
    } else {
      newExpanded.add(filterKey);
    }
    setExpandedFilters(newExpanded);
  }, [expandedFilters]);

  // Componente separado para la sección de productos que solo se actualiza cuando cambian los datos relevantes
  const ProductsSection = useMemo(() => {
    return (
      <ProductsGrid
        products={products}
        loading={loading}
        error={error}
        totalItems={totalItems}
        viewMode={viewMode}
        setViewMode={setViewMode}
        sortBy={sortBy}
        setSortBy={setSortBy}
        showMobileFilters={showMobileFilters}
        setShowMobileFilters={setShowMobileFilters}
        filters={filters}
        setFilters={setFilters}
        expandedFilters={expandedFilters}
        toggleFilter={toggleFilter}
        accessoryFilters={accessoryFilters}
        refreshProducts={refreshProducts}
      />
    );
  }, [
    products,
    loading,
    error,
    totalItems,
    viewMode,
    sortBy,
    filters,
    expandedFilters,
    refreshProducts,
    showMobileFilters,
    toggleFilter,
  ]); // Solo dependencias que realmente afectan la visualización

  // Memoizar el sidebar de filtros para evitar re-renders innecesarios
  const FilterSidebarMemo = useMemo(
    () => (
      <FilterSidebar
        filterConfig={accessoryFilters}
        filters={filters}
        onFilterChange={handleFilterChange}
        resultCount={totalItems}
        expandedFilters={expandedFilters}
        onToggleFilter={toggleFilter}
        trackingPrefix="accessory_filter"
      />
    ),
    [filters, totalItems, expandedFilters, toggleFilter]
  );

  // Memoizar el modal de filtros móviles
  const MobileFilterModalMemo = useMemo(
    () => (
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
    ),
    [showMobileFilters, filters, totalItems, expandedFilters, toggleFilter]
  );

  return (
    <div className="min-h-screen bg-white">
      <CategorySlider
        categories={accessoryCategories}
        trackingPrefix="accessory_category"
      />

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-80 flex-shrink-0">
            {FilterSidebarMemo}
          </aside>

          <main className="flex-1">{ProductsSection}</main>
        </div>
      </div>

      {MobileFilterModalMemo}
    </div>
  );
}

// Componente separado para la grilla de productos
function ProductsGrid({
  products,
  loading,
  error,
  totalItems,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  setShowMobileFilters,
  filters,
  setFilters,
  refreshProducts,
}: {
  products: ProductCardProps[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  showMobileFilters: boolean;
  setShowMobileFilters: (show: boolean) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  expandedFilters: Set<string>;
  toggleFilter: (key: string) => void;
  accessoryFilters: FilterConfig;
  refreshProducts: () => void;
}) {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Error al cargar accesorios
        </h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={refreshProducts}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Accesorios</h1>
          <span className="text-sm text-gray-500">{totalItems} resultados</span>
          {filters.tipoAccesorio && filters.tipoAccesorio.length > 0 && (
            <button
              onClick={() => setFilters({ ...filters, tipoAccesorio: [] })}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Ver todos los accesorios
            </button>
          )}
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
    </>
  );
}
