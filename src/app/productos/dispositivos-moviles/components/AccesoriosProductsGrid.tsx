/**
 * 📦 ACCESORIOS PRODUCTS GRID
 *
 * Grid de productos específico para accesorios con funcionalidades avanzadas
 */

import LoadingSpinner from "@/components/LoadingSpinner";
import { cn } from "@/lib/utils";
import { Filter, Grid3X3, List } from "lucide-react";
import ProductCard, {
  type ProductCardProps,
} from "../../components/ProductCard";
import type { FilterState } from "../../components/FilterSidebar";

interface ProductsGridProps {
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
  refreshProducts: () => void;
}

export default function AccesoriosProductsGrid({
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
}: ProductsGridProps) {
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
              {...product}
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
