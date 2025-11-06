/**
 * 📺 TV PRODUCTS GRID - 4 Televisores
 *
 * Muestra 4 televisores destacados después del banner de AI TVs
 */

"use client";

import { useMemo } from "react";
import { useProducts } from "@/features/products/useProducts";
import ProductCard from "@/app/productos/components/ProductCard";
import SkeletonCard from "@/components/SkeletonCard";

export default function TVProductsGrid() {
  // Obtener productos de la categoría Televisores
  const filters = useMemo(() => ({
    limit: 50,
    page: 1,
    minStock: 1,
  }), []);

  const { products: allProducts, loading } = useProducts(filters);

  // Filtrar televisores
  const tvProducts = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];

    const tvs = allProducts.filter(p =>
      p.apiProduct?.subcategoria === 'Televisores' ||
      p.apiProduct?.categoria === 'Televisores'
    );

    return tvs.slice(0, 4);
  }, [allProducts]);

  // Mostrar skeletons mientras carga
  if (loading) {
    return (
      <section className="w-full flex justify-center bg-white pt-[25px] pb-0">
        <div className="w-full" style={{ maxWidth: "1440px" }}>
          <div className="hidden md:grid md:grid-cols-4 gap-[25px]">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={`skeleton-${i}`} className="w-full">
                <SkeletonCard />
              </div>
            ))}
          </div>
          <div className="md:hidden overflow-x-auto scrollbar-hide">
            <div className="flex gap-[25px] px-4">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={`skeleton-mobile-${i}`} className="shrink-0 w-[280px]">
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
  if (!tvProducts || tvProducts.length === 0) {
    return null;
  }

  return (
    <section className="w-full flex justify-center bg-white pt-[25px] pb-0">
      <div className="w-full" style={{ maxWidth: "1440px" }}>
        <div className="hidden md:grid md:grid-cols-4 gap-[25px]">
          {tvProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
            />
          ))}
        </div>
        <div className="md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-[25px] px-4">
            {tvProducts.map((product) => (
              <div
                key={product.id}
                className="shrink-0 w-[280px]"
              >
                <ProductCard
                  {...product}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
