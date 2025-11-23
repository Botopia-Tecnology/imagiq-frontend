/**
 * Grid de productos genérico para todas las categorías
 * con funcionalidades avanzadas y manejo de estados
 */

'use client';

import { forwardRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
import SkeletonCard from "@/components/SkeletonCard";
import ProductCard, {
  type ProductCardProps,
} from "../../components/ProductCard";
import BundleCard from "../../components/BundleCard";
import { useFavorites } from "@/features/products/useProducts";
import GuestDataModal from "../../components/GuestDataModal";
import { ProductBannerCard } from "../../components/ProductBannerCard";
import { insertBannersInGrid } from "../../utils/insertBanners";
import type { Banner } from "@/types/banner";
import type { BundleCardProps, MixedProductItem } from "@/lib/productMapper";

// Tipos para items con flag interno de bundle
type ProductWithFlag = ProductCardProps & { __isBundle: false };
type BundleWithFlag = BundleCardProps & { __isBundle: true };
type ItemWithFlag = ProductWithFlag | BundleWithFlag;

interface CategoryProductsGridProps {
  products: ProductCardProps[];
  bundles: BundleCardProps[];
  orderedItems: MixedProductItem[]; // Items en orden original del API (intercalados)
  loading: boolean;
  isLoadingMore?: boolean;
  error: string | null;
  refreshProducts: () => void;
  viewMode?: "grid" | "list";
  categoryName: string;
  showLazySkeletons?: boolean;
  lazySkeletonCount?: number;
  hasLoadedOnce?: boolean;
  banner?: Banner | null; // Banner a mostrar en el grid (legacy)
  banners?: Banner[]; // Array de banners para carrusel
}


export const CategoryProductsGrid = forwardRef<
  HTMLDivElement,
  CategoryProductsGridProps
>(
    (
    {
      products,
      bundles,
      orderedItems,
      loading,
      isLoadingMore = false,
      error,
      refreshProducts,
      viewMode = "grid",
      categoryName,
      lazySkeletonCount = 3,
      hasLoadedOnce = false,
      banner = null,
      banners = [],
    },
    ref
  ) => {
    const [showGuestModal, setShowGuestModal] = useState(false);
    const [pendingFavorite, setPendingFavorite] = useState<string | null>(null);

    const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

    // Usar orderedItems directamente (ya viene del API en el orden correcto - intercalado)
    // Mezclar con banners
    const gridItems = useMemo(() => {
      console.log('[ProductsGrid] Banner recibido:', banner);
      console.log('[ProductsGrid] Total productos:', products.length);
      console.log('[ProductsGrid] Total bundles:', bundles.length);
      console.log('[ProductsGrid] Total orderedItems (orden API):', orderedItems.length);

      // Convertir orderedItems al formato que espera insertBannersInGrid
      // insertBannersInGrid espera ProductCardProps[], así que necesitamos adaptar
      const itemsForBannerInsertion = orderedItems.map((item): ItemWithFlag => {
        if (item.itemType === 'bundle') {
          // Para bundles, crear un objeto compatible con ProductCardProps
          // pero mantener una referencia al bundle original
          const { itemType, ...bundleData } = item;
          return {
            ...bundleData,
            __isBundle: true as const,
          };
        } else {
          const { itemType, ...productData } = item;
          return {
            ...productData,
            __isBundle: false as const,
          };
        }
      });

      // insertBannersInGrid trata los items como ProductCardProps, pero nosotros hemos añadido __isBundle
      // Esto es seguro porque insertBannersInGrid solo lee propiedades comunes (id, etc.) y no modifica el tipo
      // Priorizar banners array sobre banner individual
      const bannersToInsert = banners && banners.length > 0 ? banners : banner;
      const items = insertBannersInGrid(itemsForBannerInsertion as unknown as ProductCardProps[], bannersToInsert, 15);
      console.log('[ProductsGrid] Banners para insertar:', bannersToInsert);
      console.log('[ProductsGrid] Total items en grid (con banners):', items.length);
      console.log('[ProductsGrid] Items:', items.map(i => ({ type: i.type, key: i.key })));
      return items;
    }, [orderedItems, banner, products.length, bundles.length, banners]);

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
        className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 lg:gap-6 items-stretch" : "flex flex-wrap"}
      >
        {/* Mostrar skeletons cuando loading es true (incluyendo cambio de página) */}
        {loading ? (
          <>
            {Array.from({ length: 12 }, (_, i) => (
              <div key={`skeleton-${i}`} className="w-full">
                <SkeletonCard />
              </div>
            ))}
          </>
        ) : (
          <>
            {/* Mostrar mensaje solo cuando terminó de cargar, NO hay productos ni bundles Y ya se cargó al menos una vez */}
            {products.length === 0 && bundles.length === 0 && hasLoadedOnce && (
              <div className="col-span-full w-full text-center py-12 text-gray-500">
                No se encontraron {categoryName.toLowerCase()} con los filtros seleccionados.
              </div>
            )}

            {/* Renderizar productos, bundles y banners mezclados */}
            {gridItems.length > 0 && (
              <>
                {gridItems.map((item, index) => {
                  if (item.type === "banner") {
                    return (
                      <motion.div
                        key={item.key}
                        className="w-full"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: index * 0.08,
                          ease: [0.25, 0.1, 0.25, 1],
                        }}
                      >
                        <ProductBannerCard config={item.data as Banner | Banner[]} />
                      </motion.div>
                    );
                  }

                  // Verificar si es un bundle o un producto
                  const itemData = item.data as ItemWithFlag;
                  const isBundle = itemData.__isBundle === true;

                  if (isBundle) {
                    // Renderizar BundleCard
                    const { __isBundle, ...bundleProps } = itemData;
                    return (
                      <div
                        key={item.key}
                        className="w-full h-full"
                      >
                        <BundleCard
                          {...bundleProps}
                          className={viewMode === "list" ? "flex-row mx-auto" : "mx-auto"}
                        />
                      </div>
                    );
                  } else {
                    // Renderizar ProductCard
                    const { __isBundle, ...productProps } = itemData;
                    const product = productProps as ProductCardProps;
                    return (
                      <div
                        key={item.key}
                        className="w-full h-full"
                      >
                        <ProductCard
                          key={product.id}
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
                      </div>
                    );
                  }
                })}

                {/* Skeletons de lazy loading - solo cuando isLoadingMore es true */}
                {isLoadingMore && Array.from({ length: lazySkeletonCount }, (_, i) => (
                  <div key={`lazy-skeleton-${i}`} className="w-full">
                    <SkeletonCard />
                  </div>
                ))}
              </>
            )}
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
