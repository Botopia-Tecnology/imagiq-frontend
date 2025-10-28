/**
 * 🏠 APPLIANCES PRODUCTS GRID - Main Component
 *
 * Grid de productos de electrodomésticos destacados
 * Ahora con productos reales del backend
 * - Scroll horizontal en móvil, Grid 4 columnas en desktop
 */

"use client";

import { useMemo } from "react";
import { useProducts } from "@/features/products/useProducts";
import ProductCard from "@/app/productos/components/ProductCard";
import SkeletonCard from "@/components/SkeletonCard";

export default function AppliancesProductsGrid() {
  // Memoizar filtros para evitar re-renders infinitos
  // Top 4 electrodomésticos de mayor precio con stock
  const filters = useMemo(() => ({
    limit: 4,
    page: 1,
    minStock: 1, // Solo productos con stock
    sortBy: "precio",
    sortOrder: "desc", // Mayor a menor precio
    // Filtrar por palabras clave relacionadas a electrodomésticos
    descriptionKeyword: "Nevera Lavadora Aire",
  }), []);

  // Obtener 4 electrodomésticos
  const { products, loading } = useProducts(filters);

  // Mostrar skeletons mientras carga
  if (loading) {
    return (
      <div className="w-full bg-white py-[25px]">
        <div className="w-full mx-auto" style={{ maxWidth: "1440px" }}>
          {/* Desktop: Grid 4 columnas */}
          <div className="hidden md:grid md:grid-cols-4 gap-[25px]">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={`skeleton-${i}`} className="w-full">
                <SkeletonCard />
              </div>
            ))}
          </div>

          {/* Mobile: Scroll horizontal */}
          <div className="md:hidden overflow-x-auto scrollbar-hide">
            <div className="flex gap-[25px] px-4">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={`skeleton-mobile-${i}`} className="flex-shrink-0 w-[280px]">
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
    <div className="w-full bg-white py-[25px]">
      <div className="w-full mx-auto" style={{ maxWidth: "1440px" }}>
        {/* Desktop: Grid 4 columnas */}
        <div className="hidden md:grid md:grid-cols-4 gap-[25px]">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
            />
          ))}
        </div>

        {/* Mobile: Scroll horizontal */}
        <div className="md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-[25px] px-4">
            {displayProducts.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[280px]">
                <ProductCard
                  {...product}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
