/**
 * Grid de productos genérico para todas las categorías
 * con funcionalidades avanzadas y manejo de estados
 */

import { forwardRef, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProductCard, {
  type ProductCardProps,
} from "../../components/ProductCard";
import { useFavorites } from "@/features/products/useProducts";
import GuestDataModal from "../../components/GuestDataModal";
import { useCartContext } from "@/features/cart/CartContext";
import { posthogUtils } from "@/lib/posthogClient";

interface CategoryProductsGridProps {
  products: ProductCardProps[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => void;
  viewMode?: "grid" | "list";
  categoryName: string;
}


const CategoryProductsGrid = forwardRef<
  HTMLDivElement,
  CategoryProductsGridProps
>(
  (
    {
      products,
      loading,
      error,
      refreshProducts,
      viewMode = "grid",
      categoryName,
    },
    ref
  ) => {
    const [showGuestModal, setShowGuestModal] = useState(false);
    const [pendingFavorite, setPendingFavorite] = useState<string | null>(null);

    const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
    const { addProduct } = useCartContext();

    const handleAddToFavorites = (productId: string) => {
      const rawUser = localStorage.getItem("imagiq_user");
      const parsed = rawUser ? JSON.parse(rawUser) : null;

      if (parsed?.id) {
        addToFavorites(productId, parsed);
      } else {
        // Mostrar modal y guardar el producto pendiente
        setPendingFavorite(productId);
        setShowGuestModal(true);
      }
    };

    const handleRemoveToFavorites = (productId: string) => {
      const rawUser = localStorage.getItem("imagiq_user");
      const parsed = rawUser ? JSON.parse(rawUser) : null;

      if (parsed?.id) {
        removeFromFavorites(productId, parsed);
      }
    };

    const handleGuestSubmit = async (guestUserData: {
      nombre: string;
      apellido: string;
      email: string;
      telefono: string;
    }) => {
      setShowGuestModal(false);

      if (pendingFavorite) {
        await addToFavorites(pendingFavorite, guestUserData);
        setPendingFavorite(null);
      }
    };

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
      <div ref={ref} className="flex flex-wrap gap-6 ">
        {products.length === 0 ? (
          <div className="w-full text-center py-12 text-gray-500">
            No se encontraron {categoryName.toLowerCase()} con los filtros
            seleccionados.
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.sku}
              className={
                viewMode === "grid"
                  ? "w-full sm:w-1/3 lg:w-1/4 mx-auto"
                  : "w-full"
              }
            >
              <ProductCard
                {...product}
                isFavorite={isFavorite(product.id)}
                onAddToCart={() => {
                  posthogUtils.capture("add_to_cart", {
                    product_id: product.id,
                    product_name: product.name,
                    source: "category_grid",
                    category: categoryName
                  });
                  addProduct({
                    id: product.id,
                    name: product.name,
                    image: typeof product.image === "string" ? product.image : product.image.src ?? "",
                    price: typeof product.price === "string"
                      ? parseInt(product.price.replace(/[^\d]/g, ""))
                      : product.price || 0,
                    quantity: 1,
                    sku: product.sku || product.id,
                    puntos_q: product.puntos_q || 0,
                  });
                }}
                onToggleFavorite={(productId: string) => {
                  if (isFavorite(productId)) {
                    handleRemoveToFavorites(productId);
                  } else {
                    handleAddToFavorites(productId);
                  }
                }}
                className={viewMode === "list" ? "flex-row mx-auto" : "mx-auto"}
              />
            </div>
          ))
        )}

        {showGuestModal && (
          <GuestDataModal
            onSubmit={handleGuestSubmit}
            onCancel={() => {
              setShowGuestModal(false);
              setPendingFavorite(null);
            }}
          />
        )}
      </div>
    );
  }
);

CategoryProductsGrid.displayName = "CategoryProductsGrid";

export default CategoryProductsGrid;
