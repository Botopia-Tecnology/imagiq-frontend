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
  // Obtener productos con límite amplio para incluir electrodomésticos
  const filters = useMemo(
    () => ({
      limit: 300,
      page: 1,
      minStock: 1,
    }),
    []
  );

  const { products: allProducts, loading } = useProducts(filters);

  // Filtrar electrodomésticos específicos: Lavadora Bespoke AI, Nevera, Microondas, Aspiradora
  const applianceProducts = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];

    // Función auxiliar para verificar SKU
    const hasMatchingSKU = (
      product: { apiProduct?: { sku?: string[] } },
      skuPrefix: string
    ): boolean => {
      const skuArray = product.apiProduct?.sku;
      if (!Array.isArray(skuArray)) return false;
      return skuArray.some((sku: string) => sku?.includes(skuPrefix));
    };

    const foundProducts = [];

    // 1. Lavadora con SKU WD26FB8690BECO
    const lavadora1 = allProducts.find(
      (p) => p.id === "WD26FB8690BECO" || hasMatchingSKU(p, "WD26FB8690")
    );
    if (lavadora1) foundProducts.push(lavadora1);

    // 2. Lavadora con SKU WF90F26ADSCO
    const lavadora2 = allProducts.find(
      (p) => p.id === "WF90F26ADSCO" || hasMatchingSKU(p, "WF90F26ADS")
    );
    if (lavadora2) foundProducts.push(lavadora2);

    // 3. Aire acondicionado con SKU AC024MN4PKH/CB
    const aireAcondicionado = allProducts.find(
      (p) => p.id === "AC024MN4PKH/CB" || hasMatchingSKU(p, "AC024MN4PKH")
    );
    if (aireAcondicionado) foundProducts.push(aireAcondicionado);

    // 4. Aspiradora más cara
    const aspiradoras = allProducts.filter(
      (p) =>
        p.apiProduct?.subcategoria === "Aspiradoras" ||
        p.apiProduct?.subcategoria === "Limpieza" ||
        p.apiProduct?.nombreMarket?.toLowerCase().includes("aspiradora")
    );
    const aspiradorasOrdenadas = aspiradoras.toSorted((a, b) => {
      const precioA =
        a.apiProduct?.precioeccommerce?.[0] ||
        a.apiProduct?.precioNormal?.[0] ||
        0;
      const precioB =
        b.apiProduct?.precioeccommerce?.[0] ||
        b.apiProduct?.precioNormal?.[0] ||
        0;
      return precioB - precioA;
    });
    const aspiradoraMasCara = aspiradorasOrdenadas[0];
    if (aspiradoraMasCara) foundProducts.push(aspiradoraMasCara);

    return foundProducts;
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
                <div
                  key={`skeleton-mobile-${i}`}
                  className="shrink-0 w-[280px]"
                >
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
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
        <div className="md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-[25px] px-4">
            {applianceProducts.map((product) => (
              <div key={product.id} className="shrink-0 w-[280px]">
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
