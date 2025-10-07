/**
 * TV Product Card Component
 * Diseño Samsung Store con animación hover y botón de comprar
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { posthogUtils } from "@/lib/posthogClient";
import { TVProduct } from "./types";

interface ProductCardProps {
  product: TVProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    posthogUtils.capture("tv_products_grid_click", {
      product_name: product.title,
      product_id: product.id,
      source: "tv_products_grid",
    });
  };

  return (
    <Link
      href={product.href}
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
              {product.title}
            </span>
          </h3>
        </div>

        {/* Image Container with Hover Effects */}
        <div className="relative flex-1 flex items-center justify-center px-8 pb-20 bg-transparent">
          <div className="relative w-full aspect-square max-w-[280px] bg-transparent">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className={`object-contain transition-transform duration-500 ease-out ${
                isHovered ? "scale-110" : "scale-100"
              }`}
              style={{
                mixBlendMode: "multiply",
                filter: "brightness(1.05)",
              }}
              sizes="(max-width: 768px) 50vw, 360px"
              unoptimized
            />
          </div>

          {/* Botón Comprar - Aparece en la parte inferior en hover */}
          <div
            className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
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
