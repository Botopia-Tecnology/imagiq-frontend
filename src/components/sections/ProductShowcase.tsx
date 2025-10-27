/**
 * 📱 PRODUCT SHOWCASE - 4 Product Cards
 *
 * Muestra 4 productos destacados en formato de grid
 * Ahora con productos reales del backend
 */

"use client";

import { useMemo } from "react";
import { useProducts } from "@/features/products/useProducts";
import ProductCard from "@/app/productos/components/ProductCard";
import SkeletonCard from "@/components/SkeletonCard";

export default function ProductShowcase() {
  // Memoizar filtros para evitar re-renders infinitos
  // Top 4 productos de mayor precio con stock disponible
  const filters = useMemo(() => ({
    limit: 20, // Traer más productos para filtrar manualmente
    page: 1,
    minStock: 1, // Solo productos con stock
    sortBy: "precio",
    sortOrder: "desc", // Mayor a menor precio
  }), []);

  // Obtener productos
  const { products: allProducts, loading } = useProducts(filters);

  // Filtrar manualmente solo dispositivos móviles por subcategoría
  const products = useMemo(() => {
    if (!allProducts) return [];

    // Filtrar por subcategoría que contenga "Movil" o "Dispositivos"
    return allProducts
      .filter(p =>
        p.subcategory?.toLowerCase().includes('movil') ||
        p.subcategory?.toLowerCase().includes('dispositivo') ||
        p.subcategory?.toLowerCase().includes('celular') ||
        p.subcategory?.toLowerCase().includes('smartphone')
      )
      .slice(0, 4); // Solo tomar los primeros 4
  }, [allProducts]);

  // Mostrar skeletons mientras carga
  if (loading) {
    return (
      <section className="w-full flex justify-center bg-white pt-[25px] pb-0">
        <div className="w-full" style={{ maxWidth: "1440px" }}>
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
      </section>
    );
  }

  // Si no hay productos, no mostrar nada
  if (!products || products.length === 0) {
    return null;
  }

  // Tomar solo los primeros 4 productos
  const displayProducts = products.slice(0, 4);

  return (
    <section className="w-full flex justify-center bg-white pt-[25px] pb-0">
      <div className="w-full" style={{ maxWidth: "1440px" }}>
        {/* Desktop: Grid 4 columnas */}
        <div className="hidden md:grid md:grid-cols-4 gap-[25px]">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              viewMode="grid"
            />
          ))}
        </div>

        {/* Mobile: Scroll horizontal */}
        <div className="md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-[25px] px-4">
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-[280px]"
              >
                <ProductCard
                  {...product}
                  viewMode="grid"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
