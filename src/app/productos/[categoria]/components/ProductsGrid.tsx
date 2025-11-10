/**
 * Grid de productos genérico para todas las categorías
 * con funcionalidades avanzadas y manejo de estados
 */

'use client';

import { forwardRef, useState } from "react";
import { motion } from "framer-motion";
import SkeletonCard from "@/components/SkeletonCard";
import ProductCard, {
  type ProductCardProps,
} from "../../components/ProductCard";
import { useFavorites } from "@/features/products/useProducts";
import GuestDataModal from "../../components/GuestDataModal";

interface CategoryProductsGridProps {
  products: ProductCardProps[];
  loading: boolean;
  isLoadingMore?: boolean; // Estado de carga para lazy loading (append)
  error: string | null;
  refreshProducts: () => void;
  viewMode?: "grid" | "list";
  categoryName: string;
  showLazySkeletons?: boolean; // Mostrar skeletons de lazy loading
  lazySkeletonCount?: number; // Cantidad de skeletons
  hasLoadedOnce?: boolean; // Indica si ya se completó al menos una carga
}


export const CategoryProductsGrid = forwardRef<
  HTMLDivElement,
  CategoryProductsGridProps
>(
    (
    {
      products,
      loading,
      isLoadingMore = false,
      error,
      refreshProducts,
      viewMode = "grid",
      categoryName,
      showLazySkeletons = false,
      lazySkeletonCount = 3,
      hasLoadedOnce = false,
    },
    ref
  ) => {
    const [showGuestModal, setShowGuestModal] = useState(false);
    const [pendingFavorite, setPendingFavorite] = useState<string | null>(null);

    const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

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
        className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 lg:gap-6" : "flex flex-wrap"}
      >
        {/* Mostrar skeletons cuando loading es true (incluyendo cambio de página) */}
        {loading && (
          <>
            {Array.from({ length: 12 }, (_, i) => (
              <div key={`skeleton-${i}`} className="w-full">
                <SkeletonCard />
              </div>
            ))}
          </>
        )}

        {/* Mostrar mensaje solo cuando terminó de cargar, NO hay productos Y ya se cargó al menos una vez */}
        {/* Esto evita mostrar el mensaje durante la carga inicial, incluso cuando se carga desde caché */}
        {products.length === 0 && !loading && hasLoadedOnce && (
          <div className="col-span-full w-full text-center py-12 text-gray-500">
            No se encontraron {categoryName.toLowerCase()} con los filtros
            seleccionados.
          </div>
        )}

        {/* Ocultar productos antiguos durante carga de nueva página */}
        {products.length > 0 && !loading && (
          <>
            {products.map((product, index) => {
              return (
                <motion.div
                  key={product.id}
                  className="w-full"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.08,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <ProductCard
                    {...product}
                    isFavorite={isFavorite(product.id)}
                    onToggleFavorite={(productId: string) => {
                      if (isFavorite(productId)) {
                        handleRemoveToFavorites(productId);
                      } else {
                        handleAddToFavorites(productId);
                      }
                    }}
                    className={viewMode === "list" ? "flex-row mx-auto" : "mx-auto"}
                  />
                </motion.div>
              );
            })}

            {/* Skeletons de lazy loading - solo cuando isLoadingMore es true */}
            {isLoadingMore && Array.from({ length: lazySkeletonCount }, (_, i) => (
              <div key={`lazy-skeleton-${i}`} className="w-full">
                <SkeletonCard />
              </div>
            ))}
          </>
        )}

        <GuestDataModal
          isOpen={showGuestModal}
          onSubmit={handleGuestSubmit}
          onClose={() => {
            setShowGuestModal(false);
            setPendingFavorite(null);
          }}
        />
      </div>
    );
  }
);

CategoryProductsGrid.displayName = "CategoryProductsGrid";

export default CategoryProductsGrid;
