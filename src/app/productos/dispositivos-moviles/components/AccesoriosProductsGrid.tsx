/**
 * 📦 ACCESORIOS PRODUCTS GRID
 *
 * Grid de productos específico para accesorios con funcionalidades avanzadas
 */

import LoadingSpinner from "@/components/LoadingSpinner";
import ProductCard, {
  type ProductCardProps,
} from "../../components/ProductCard";
import type { FilterState } from "../../components/FilterSidebar";

interface ProductsGridProps {
  products: ProductCardProps[];
  loading: boolean;
  error: string | null;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  refreshProducts: () => void;
}

export default function AccesoriosProductsGrid({
  products,
  loading,
  error,
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
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
  );
}
