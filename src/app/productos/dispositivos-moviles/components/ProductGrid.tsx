/**
 * 🎧 PRODUCT GRID COMPONENT
 *
 * Grid de productos con estado vacío para Galaxy Buds
 */

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import ProductCard, {
  type ProductCardProps,
} from "../../components/ProductCard";

interface ProductGridProps {
  products: ProductCardProps[];
  viewMode: "grid" | "list";
  onAddToCart: (productId: string, color: string) => void;
  onToggleFavorite: (productId: string) => void;
}

const ProductGrid = forwardRef<HTMLDivElement, ProductGridProps>(
  ({ products, viewMode, onAddToCart, onToggleFavorite }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid gap-6",
          viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            : "grid-cols-1"
        )}
      >
      {products.length === 0 ? (
        <div className="col-span-full text-center py-12 text-gray-500">
          No se encontraron Galaxy Buds con los filtros seleccionados.
        </div>
      ) : (
        products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            onAddToCart={onAddToCart}
            onToggleFavorite={onToggleFavorite}
          />
        ))
      )}
      </div>
    );
  }
);

ProductGrid.displayName = "ProductGrid";

export default ProductGrid;
