"use client";

import { useState, useEffect , useMemo} from "react";
import { cn } from "@/lib/utils";
import ProductCard from "../components/ProductCard";
import FilterSidebar, {
  type FilterConfig,
  type FilterState,
  MobileFilterModal,
} from "../components/FilterSidebar";
import CategorySlider, { type Category } from "../components/CategorySlider";
import { posthogUtils } from "@/lib/posthogClient";
import lavadoraImg from "../../../img/electrodomesticos/electrodomesticos2.png";
import refrigeradorImg from "../../../img/electrodomesticos/electrodomesticos1.png";
import microondasImg from "../../../img/electrodomesticos/electrodomesticos4.png";
import aspiradoraImg from "../../../img/electrodomesticos/electrodomesticos3.png";
import { useProducts } from "@/features/products/useProducts";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Filter, Grid3X3, List } from "lucide-react";


const applianceCategories: Category[] = [
  {
    id: "refrigeradores",
    name: "Refrigeradores",
    subtitle: "",
    image: refrigeradorImg,
    href: "/productos/electrodomesticos?section=refrigeradores",
  },
  {
    id: "lavadoras",
    name: "Lavadoras",
    subtitle: "",
    image: lavadoraImg,
    href: "/productos/electrodomesticos?section=lavadoras",
  },
  {
    id: "microondas",
    name: "Microondas",
    subtitle: "",
    image: microondasImg,
    href: "/productos/electrodomesticos?section=microondas",
  },
  {
    id: "aspiradoras",
    name: "Aspiradoras",
    subtitle: "",
    image: aspiradoraImg,
    href: "/productos/electrodomesticos?section=aspiradoras",
  },
];

const lavadorasFilters: FilterConfig = {
  tipo: [
    "Carga Frontal",
    "Carga Superior",
    "Lavasecadora",
    "Mini",
    "Industrial",
  ],
  capacidad: ["<8kg", "8-12kg", "12-18kg", ">18kg"],
  color: ["Blanco", "Negro", "Gris", "Inox"],
  eficienciaEnergetica: ["A++", "A+", "A", "B"],
  caracteristicas: [
    "Digital Inverter",
    "EcoBubble",
    "Auto Dosificación",
    "WiFi",
    "Vapor",
    "Panel Touch",
  ],
  rangoPrecio: [
    { label: "Menos de $1.000.000", min: 0, max: 1000000 },
    { label: "$1.000.000 - $2.000.000", min: 1000000, max: 2000000 },
    { label: "$2.000.000 - $3.000.000", min: 2000000, max: 3000000 },
    { label: "Más de $3.000.000", min: 3000000, max: Infinity },
  ],
};

export default function LavadorasSection() {
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(["tipo"])
  );
  const [filters, setFilters] = useState<FilterState>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [resultCount] = useState(8);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevancia");

    const apiFilters = useMemo(
      () => ({
        subcategory: "Lavadora,Secadora",
      }),
      []
    );
  
    const { products, loading, error, totalItems, refreshProducts } =
      useProducts(apiFilters);


  useEffect(() => {
    posthogUtils.capture("section_view", {
      section: "lavadoras",
      category: "electrodomesticos",
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
            categories={applianceCategories}
            trackingPrefix="smartphone_category"
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
              categories={applianceCategories}
              trackingPrefix="smartphone_category"
            />
            <div className="container mx-auto px-6 py-8">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-red-600 mb-4">
                  Error al cargar lavadoras
                </h2>
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
        categories={applianceCategories}
        trackingPrefix="lavadoras_category"
      />
      <div className="container mx-auto px-6 py-8 flex gap-8">
        <aside className="hidden lg:block w-80 flex-shrink-0">
          <FilterSidebar
            filterConfig={lavadorasFilters}
            filters={filters}
            onFilterChange={handleFilterChange}
            resultCount={resultCount}
            expandedFilters={expandedFilters}
            onToggleFilter={toggleFilter}
            trackingPrefix="lavadora_filter"
          />
        </aside>
         {/* Contenido principal */}
        <main className="flex-1">
          {/* Header con controles */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Lavadoras
              </h1>
              <span className="text-sm text-gray-500">
                {totalItems} resultados
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
            {products.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                No se encontraron lavadoras con los filtros seleccionados.
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
                  className={viewMode === "list" ? "flex-row" : ""}
                />
              ))
            )}
          </div>
        </main>
      </div>
      <MobileFilterModal
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        filterConfig={lavadorasFilters}
        filters={filters}
        onFilterChange={handleFilterChange}
        resultCount={resultCount}
        expandedFilters={expandedFilters}
        onToggleFilter={toggleFilter}
        trackingPrefix="lavadora_filter"
      />
    </div>
  );
}
