/**
 * TV Product Card Component
 * Diseño Samsung Store con animación hover y botón de comprar
 * Ahora con soporte para productos reales del backend
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { posthogUtils } from "@/lib/posthogClient";
import type { ProductCardProps as ProductData } from "@/app/productos/components/ProductCard";
import emptyImg from "@/img/empty.jpeg";

interface ProductCardProps {
  product: ProductData;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    posthogUtils.capture("tv_products_grid_click", {
      product_name: product.name,
      product_id: product.id,
      source: "tv_products_grid",
    });
  };

  // Determinar la URL del producto
  const productSku = product.selectedColor?.sku || product.colors?.[0]?.sku || product.id;
  const productUrl = `/productos/multimedia/${productSku}`;

  // Usar la imagen (puede ser base64 o URL) o empty como fallback
  const imageUrl = product.image || emptyImg;

  return (
    <Link
      href={productUrl}
      className="group block"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-gray-50 overflow-hidden transition-all duration-300 h-full flex flex-col">
        {/* Product Title - Arriba */}
        <div className="p-6 pb-4">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 text-center leading-tight h-[48px] flex items-center justify-center">
            <span style={{ fontFamily: "'Samsung Sharp Sans', sans-serif" }}>
              {product.name}
            </span>
          </h3>
        </div>

        {/* Image Container with Hover Effects */}
        <div className="relative flex-1 flex items-center justify-center px-8 pb-6 bg-transparent">
          <div className="relative w-full aspect-square max-w-[280px] bg-transparent">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className={`object-contain transition-transform duration-500 ease-out ${
                isHovered ? "scale-110" : "scale-100"
              }`}
              style={{
                mixBlendMode: "multiply",
                filter: "brightness(1.05)",
              }}
              sizes="(max-width: 768px) 50vw, 360px"
            />
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
        </div>
      </div>
    </Link>
  );
}
