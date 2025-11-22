/**
 * MIXED PRODUCT LIST - Componente para mostrar productos y bundles mezclados
 *
 * Muestra productos regulares y bundles en el mismo grid
 * Los bundles aparecen primero por defecto (destacados)
 */

"use client";

import { useMemo } from "react";
import ProductCard from "./ProductCard";
import BundleCard from "../components/BundleCard";
import { combineProductsAndBundles, type MixedProductItem } from "@/lib/productMapper";
import type { ProductCardProps } from "./ProductCard";
import type { BundleCardProps } from "@/lib/productMapper";

interface MixedProductListProps {
  products: ProductCardProps[];
  bundles: BundleCardProps[];
  bundlesFirst?: boolean; // Si true, bundles van primero (default: true)
  onToggleFavorite?: (productId: string) => void;
  className?: string;
}

export default function MixedProductList({
  products,
  bundles,
  bundlesFirst = true,
  onToggleFavorite,
  className = "",
}: MixedProductListProps) {
  // Combinar productos y bundles en una sola lista
  const mixedItems = useMemo(
    () => combineProductsAndBundles(products, bundles, bundlesFirst),
    [products, bundles, bundlesFirst]
  );

  // Si no hay items, mostrar mensaje
  if (mixedItems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {mixedItems.map((item) => {
        if (item.itemType === 'bundle') {
          // Renderizar BundleCard
          const { itemType, ...bundleProps } = item;
          return (
            <BundleCard
              key={`bundle-${item.id}`}
              {...bundleProps}
            />
          );
        } else {
          // Renderizar ProductCard
          const { itemType, ...productProps } = item;
          return (
            <ProductCard
              key={`product-${item.id}`}
              {...productProps}
              onToggleFavorite={onToggleFavorite}
            />
          );
        }
      })}
    </div>
  );
}
