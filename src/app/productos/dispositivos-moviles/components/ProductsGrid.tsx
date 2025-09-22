/** 
 * Grid de productos genérico para todas las categorías de dispositivos móviles
 * con funcionalidades avanzadas y manejo de estados
 */

import { forwardRef } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProductCard, {
  type ProductCardProps,
} from "../../components/ProductCard";

interface CategoryProductsGridProps {
  products: ProductCardProps[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => void;
  viewMode?: "grid" | "list";
  categoryName: string; // Nombre de la categoría para mensajes personalizados
}

const CategoryProductsGrid = forwardRef<HTMLDivElement, CategoryProductsGridProps>(
  ({ products, loading, error, refreshProducts, viewMode = "grid", categoryName }, ref) => {
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
            Error al cargar {categoryName.toLowerCase()}
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
      <div 
        ref={ref} 
        className={`grid gap-6 ${
          viewMode === "grid" 
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" 
            : "grid-cols-1"
        }`}
      >
        {products.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No se encontraron {categoryName.toLowerCase()} con los filtros seleccionados.
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
              className={viewMode === "list" ? "flex-row" : ""}
            />
          ))
        )}
      </div>
    );
  }
);

CategoryProductsGrid.displayName = "CategoryProductsGrid";

export default CategoryProductsGrid;
