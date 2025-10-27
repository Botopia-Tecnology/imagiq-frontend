/**
 * 📱 PRODUCT SHOWCASE - 4 Product Cards
 *
 * Muestra 4 productos destacados en formato de grid
 * Ahora con productos reales del backend (dispositivos móviles)
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { posthogUtils } from "@/lib/posthogClient";
import { useProducts } from "@/features/products/useProducts";
import type { ProductCardProps as ProductData } from "@/app/productos/components/ProductCard";
import emptyImg from "@/img/empty.jpeg";
import SkeletonCard from "@/components/SkeletonCard";

interface ProductCardProps {
  product: ProductData;
}

function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    posthogUtils.capture("product_showcase_card_click", {
      product_id: product.id,
      product_title: product.name,
      source: "product_showcase",
    });
  };

  // Determinar la URL del producto
  const productUrl = `/productos/viewpremium/${product.sku || product.id}`;

  // Usar la imagen de preview o empty como fallback
  const imageUrl = product.imagePreviewUrl || emptyImg;

  return (
    <Link
      href={productUrl}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group block h-full"
    >
      <div className="relative bg-gray-50 h-full flex flex-col items-center justify-between p-6 hover:bg-gray-100 transition-colors duration-300">
        {/* Título */}
        <h3
          className="text-base font-semibold text-gray-900 text-center leading-tight h-[48px] flex items-center justify-center w-full"
          style={{ fontFamily: "'Samsung Sharp Sans', sans-serif" }}
        >
          {product.name}
        </h3>

        {/* Imagen del producto */}
        <div className="relative w-full flex-1 flex items-center justify-center">
          <div className="relative w-[200px] h-[200px]">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className={`object-contain transition-transform duration-500 ease-out ${
                isHovered ? "scale-110" : "scale-100"
              }`}
              sizes="200px"
            />
          </div>
        </div>

        {/* Botón Comprar - Visible siempre en mobile, aparece en hover en desktop */}
        <div
          className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 transition-all duration-300 md:opacity-0 md:translate-y-4 ${
            isHovered ? "md:opacity-100 md:translate-y-0" : ""
          } opacity-100 translate-y-0`}
        >
          <button
            className="bg-black text-white px-10 py-3 rounded-full font-semibold text-base transition-transform duration-300 transform hover:scale-105 shadow-xl whitespace-nowrap"
            style={{
              fontFamily: "'Samsung Sharp Sans', sans-serif",
            }}
          >
            Comprar
          </button>
        </div>

        {/* Espacio para mantener consistencia */}
        <div className="h-[48px]"></div>
      </div>
    </Link>
  );
}

export default function ProductShowcase() {
  // Obtener 4 productos de dispositivos móviles
  const { products, loading } = useProducts({
    category: "MOV",
    limit: 4,
    page: 1,
  });

  // Mostrar skeletons mientras carga
  if (loading) {
    return (
      <section className="w-full flex justify-center bg-white pt-[25px] pb-0">
        <div className="w-full" style={{ maxWidth: "1440px" }}>
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
            <div key={product.id} className="w-full h-[420px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile: Scroll horizontal */}
        <div className="md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-[25px] px-4">
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-[280px] h-[420px]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
