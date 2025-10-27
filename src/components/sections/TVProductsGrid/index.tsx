/**
 * 📺 TV PRODUCTS GRID - Main Component
 *
 * Grid de productos de TV y Audio destacados
 * Ahora con productos reales del backend
 * - Grid 2x2 en móvil, 4 columnas en desktop
 * - Animación hover en tarjetas
 */

"use client";

import { useProducts } from "@/features/products/useProducts";
import { ProductCard } from "./ProductCard";
import SkeletonCard from "@/components/SkeletonCard";

export default function TVProductsGrid() {
  // Obtener 4 productos de la categoría TVS (televisores)
  const { products, loading } = useProducts({
    category: "TVS",
    limit: 4,
    page: 1,
  });

  // Mostrar skeletons mientras carga
  if (loading) {
    return (
      <div className="w-full bg-white pt-8 pb-0">
        <div className="w-full mx-auto" style={{ maxWidth: "1440px" }}>
          {/* Desktop: Grid 4 columnas */}
          <div className="hidden md:grid md:grid-cols-4 gap-[25px]">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={`skeleton-${i}`} className="w-full h-[420px]">
                <SkeletonCard />
              </div>
            ))}
          </div>

          {/* Mobile: Scroll horizontal */}
          <div className="md:hidden overflow-x-auto scrollbar-hide">
            <div className="flex gap-[25px] px-4">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={`skeleton-mobile-${i}`} className="flex-shrink-0 w-[280px] h-[420px]">
                  <SkeletonCard />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si no hay productos, no mostrar nada
  if (!products || products.length === 0) {
    return null;
  }

  // Tomar solo los primeros 4 productos
  const displayProducts = products.slice(0, 4);

  return (
    <div className="w-full bg-white pt-8 pb-0">
      <div className="w-full mx-auto" style={{ maxWidth: "1440px" }}>
        {/* Desktop: Grid 4 columnas */}
        <div className="hidden md:grid md:grid-cols-4 gap-[25px]">
          {displayProducts.map((product) => (
            <div key={product.id} className="w-full h-[420px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile: Scroll horizontal */}
        <div className="md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-[25px] px-4">
            {displayProducts.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[280px] h-[420px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
