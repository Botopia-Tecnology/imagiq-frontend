/**
 * Grid de productos genérico para todas las categorías
 * con funcionalidades avanzadas y manejo de estados
 */

import { forwardRef, useState } from "react";
import Image from "next/image";
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
  showBanner?: boolean;
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
      showBanner = false,
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
      <div ref={ref} className={viewMode === "grid" && showBanner ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 lg:gap-6" : viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6" : "flex flex-wrap"}>
        {products.length === 0 ? (
          <div className="col-span-full w-full text-center py-12 text-gray-500">
            No se encontraron {categoryName.toLowerCase()} con los filtros
            seleccionados.
          </div>
        ) : (
          <>
            {/* Banner promocional 1 - Grid position: fila 2, columna 1 - Solo en desktop */}
            {showBanner && viewMode === "grid" && products.length >= 4 && (
              <div
                className="hidden lg:block"
                style={{ gridRow: "2", gridColumn: "1" }}
              >
                <div className="relative h-full bg-sky-50 rounded-xl">
                  <Image
                    src="https://images.samsung.com/is/image/samsung/assets/co/pf/20250929/24038_PC_MX_Offer-deals_s25fe-launch_PD19_Content-Card-1_312x1012_OP02.jpg?$ORIGIN_JPG$"
                    alt="Promoción especial"
                    fill
                    className="object-contain rounded-xl"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                  />
                  <div className="absolute top-0 left-0 right-0 bg-sky-50 p-5 z-10">
                    <h3 className="text-black text-xl font-bold mb-2">¿Aún lo estás pensando?</h3>
                    <p className="text-balck text-sm">Usa cupones especiales y termina tu compra con descuento</p>
                  </div>
                </div>
              </div>
            )}

            {/* Banner promocional 2 - Grid position: fila 4, columna 2 - Solo en desktop */}
            {showBanner && viewMode === "grid" && products.length >= 7 && (
              <div
                className="hidden lg:block"
                style={{ gridRow: "4", gridColumn: "2" }}
              >
                <div className="relative rounded-xl overflow-hidden h-full bg-gray-300">
                  <Image
                    src="https://images.samsung.com/is/image/samsung/assets/co/smartphones/23086_01_VD_BANNER_PF_VISA_330x1012.jpg?$ORIGIN_JPG$"
                    alt="10% descuento Visa"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 z-10">
                    <h3 className="text-white text-base font-bold mb-1">10% de Dto. adicional pagando con tarjetas Visa</h3>
                    <p className="text-white text-xs leading-tight">Sábados, Domingos y Festivos. Ahora los multiplicamos X10: Redime 25.000 puntos y recibe $250.000 Dto. Úsalos todos y ahorra.</p>
                  </div>
                </div>
              </div>
            )}

            {products.map((product, index) => {
              // Calcular posición en el grid cuando hay banner
              let gridPosition = {};

              if (showBanner && viewMode === "grid") {
                if (index < 3) {
                  // Fila 1: productos 0, 1, 2 (columnas 1, 2, 3)
                  gridPosition = { gridRow: "1", gridColumn: `${index + 1}` };
                } else if (index === 3) {
                  // Fila 2: producto 3 (columna 2, porque columna 1 la ocupa el banner 1)
                  gridPosition = { gridRow: "2", gridColumn: "2" };
                } else if (index === 4) {
                  // Fila 2: producto 4 (columna 3)
                  gridPosition = { gridRow: "2", gridColumn: "3" };
                } else if (index >= 5 && index <= 7) {
                  // Fila 3: productos 5, 6, 7 (columnas 1, 2, 3)
                  gridPosition = { gridRow: "3", gridColumn: `${(index - 5) + 1}` };
                } else if (index === 8) {
                  // Fila 4: producto 8 (columna 1)
                  gridPosition = { gridRow: "4", gridColumn: "1" };
                } else if (index === 9) {
                  // Fila 4: producto 9 (columna 3, porque columna 2 la ocupa el banner 2)
                  gridPosition = { gridRow: "4", gridColumn: "3" };
                } else {
                  // Fila 5 en adelante: flujo normal (auto)
                  const rowAfterBanner2 = Math.floor((index - 10) / 3) + 5;
                  const colAfterBanner2 = ((index - 10) % 3) + 1;
                  gridPosition = { gridRow: `${rowAfterBanner2}`, gridColumn: `${colAfterBanner2}` };
                }
              }

              return (
                <div
                  key={product.sku}
                  className={
                    viewMode === "grid"
                      ? showBanner
                        ? "" // En grid con banner usamos style para posicionar
                        : "w-full"
                      : "w-full"
                  }
                  style={showBanner && viewMode === "grid" ? gridPosition : undefined}
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
              );
            })}
          </>
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
