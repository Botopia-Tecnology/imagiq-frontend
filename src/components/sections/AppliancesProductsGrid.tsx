/**
 * 🧺 APPLIANCES PRODUCTS GRID - 4 Lavadoras
 *
 * Muestra 4 lavadoras/electrodomésticos después del banner Bespoke AI
 */

"use client";

import { useMemo } from "react";
import { useProducts } from "@/features/products/useProducts";
import ProductCard from "@/app/productos/components/ProductCard";
import SkeletonCard from "@/components/SkeletonCard";

export default function AppliancesProductsGrid() {
  // Obtener productos de electrodomésticos
  const filters = useMemo(() => ({
    limit: 50,
    page: 1,
    minStock: 1,
  }), []);

  const { products: allProducts, loading } = useProducts(filters);

  // Filtrar lavadoras y electrodomésticos de lavado
  const applianceProducts = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];

    const appliances = allProducts.filter(p =>
      p.apiProduct?.subcategoria === 'Lavado y Secado' ||
      p.apiProduct?.subcategoria === 'Lavadoras' ||
      p.apiProduct?.categoria === 'Electrodomésticos'
    );

    return appliances.slice(0, 4);
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
  if (!applianceProducts || applianceProducts.length === 0) {
    return null;
  }

  return (
    <section className="w-full flex justify-center bg-white pt-[25px] pb-0">
      <div className="w-full" style={{ maxWidth: "1440px" }}>
        <div className="hidden md:grid md:grid-cols-4 gap-[25px]">
          {applianceProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
            />
          ))}
        </div>
        <div className="md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-[25px] px-4">
            {applianceProducts.map((product) => (
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
