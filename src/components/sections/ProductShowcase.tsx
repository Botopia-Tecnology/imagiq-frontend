/**
 * 📱 PRODUCT SHOWCASE - 4 Product Cards
 *
 * Muestra 2 celulares y 2 relojes premium
 * Ahora con productos reales del backend
 */

"use client";

import { useMemo } from "react";
import { useProducts } from "@/features/products/useProducts";
import ProductCard from "@/app/productos/components/ProductCard";
import SkeletonCard from "@/components/SkeletonCard";

export default function ProductShowcase() {
  // Memoizar filtros para evitar re-renders infinitos
  // Top productos de mayor precio con stock disponible
  const filters = useMemo(() => ({
    limit: 30, // Traer más productos para filtrar manualmente
    page: 1,
    minStock: 1, // Solo productos con stock
    sortBy: "precio",
    sortOrder: "desc", // Mayor a menor precio
  }), []);

  // Obtener productos
  const { products: allProducts, loading } = useProducts(filters);

  // Filtrar y combinar 2 celulares + hasta 2 relojes (completar con celulares si faltan)
  const products = useMemo(() => {
    if (!allProducts) return [];

    // Filtrar celulares/smartphones
    const todosLosCelulares = allProducts
      .filter(p =>
        p.subcategory?.toLowerCase().includes('movil') ||
        p.subcategory?.toLowerCase().includes('dispositivo') ||
        p.subcategory?.toLowerCase().includes('celular') ||
        p.subcategory?.toLowerCase().includes('smartphone')
      );

    // Filtrar relojes
    const relojes = allProducts
      .filter(p =>
        p.subcategory?.toLowerCase().includes('reloj') ||
        p.subcategory?.toLowerCase().includes('watch') ||
        p.subcategory?.toLowerCase().includes('wearable') ||
        p.name?.toLowerCase().includes('watch') ||
        p.name?.toLowerCase().includes('galaxy watch')
      )
      .slice(0, 2); // Intentar tomar hasta 2 relojes

    // Tomar 2 celulares iniciales
    const celularesIniciales = todosLosCelulares.slice(0, 2);

    // Si faltan relojes para completar 4 productos, agregar más celulares
    const relojesDisponibles = relojes.length;
    const celularesAdicionales = 4 - 2 - relojesDisponibles; // Total necesario para llegar a 4

    // Tomar celulares adicionales (empezar desde el índice 2, después de los 2 iniciales)
    const celularesExtra = celularesAdicionales > 0
      ? todosLosCelulares.slice(2, 2 + celularesAdicionales)
      : [];

    // Combinar: 2 celulares + relojes disponibles + celulares extra si es necesario
    const combined = [...celularesIniciales, ...relojes, ...celularesExtra];

    return combined.slice(0, 4); // Asegurar máximo 4 productos
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

  // Asegurar que tengamos exactamente 4 productos (o los que haya)
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
