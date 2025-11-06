/**
 * 📱 PRODUCT SHOWCASE - 4 Product Cards
 *
 * Muestra Z Fold 7, Z Flip 7, S25 Ultra y Watch 8
 * Productos específicos con búsqueda por SKU
 */

"use client";

import { useMemo } from "react";
import { useProducts } from "@/features/products/useProducts";
import ProductCard, { ProductCardProps } from "@/app/productos/components/ProductCard";
import SkeletonCard from "@/components/SkeletonCard";

export default function ProductShowcase() {
  // Obtener productos con límite amplio que incluya diferentes categorías
  const filters = useMemo(() => ({
    limit: 300, // Límite muy alto para asegurar que incluya todos los productos
    page: 1,
    minStock: 1,
  }), []);

  const { products: allProducts, loading } = useProducts(filters);

  // Filtrar productos específicos: Z Fold 7, Z Flip 7, S25 Ultra, Watch 8
  const products = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];

    // Función auxiliar: verifica si un producto tiene un SKU que coincide
    const hasMatchingSKU = (product: ProductCardProps, skuPrefix: string): boolean => {
      const skuArray = product.apiProduct?.sku;
      if (!Array.isArray(skuArray)) return false;
      return skuArray.some(sku => sku?.includes(skuPrefix));
    };

    // Buscar cada producto por su SKU específico
    const zFold7 = allProducts.find(p => hasMatchingSKU(p, 'SM-F966B'));
    const zFlip7 = allProducts.find(p => hasMatchingSKU(p, 'SM-F766B'));
    const s25Ultra = allProducts.find(p => hasMatchingSKU(p, 'SM-S938B'));
    const watch8 = allProducts.find(p =>
      hasMatchingSKU(p, 'SM-L500') ||
      hasMatchingSKU(p, 'SM-L500N')
    );

    // Combinar productos encontrados en orden
    const foundProducts: ProductCardProps[] = [];
    if (zFold7) foundProducts.push(zFold7);
    if (zFlip7) foundProducts.push(zFlip7);
    if (s25Ultra) foundProducts.push(s25Ultra);
    if (watch8) foundProducts.push(watch8);

    return foundProducts;
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
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="w-full flex justify-center bg-white pt-[25px] pb-0">
      <div className="w-full" style={{ maxWidth: "1440px" }}>
        {/* Desktop: Grid 4 columnas */}
        <div className="hidden md:grid md:grid-cols-4 gap-[25px]">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
            />
          ))}
        </div>

        {/* Mobile: Scroll horizontal */}
        <div className="md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-[25px] px-4">
            {products.map((product) => (
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
