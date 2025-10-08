/**
 * 📺 TV PRODUCTS GRID - Main Component
 *
 * Grid de productos de TV y Audio destacados
 * - Componente modular y reutilizable
 * - Grid 2x2 en móvil, 4 columnas en desktop
 * - Animación hover en tarjetas
 */

"use client";

import { TV_PRODUCTS } from "./data";
import { ProductCard } from "./ProductCard";

export default function TVProductsGrid() {
  return (
    <div className="w-full bg-white pt-8 pb-0">
      <div className="w-full mx-auto" style={{ maxWidth: "1440px" }}>
        {/* Desktop: Grid 4 columnas */}
        <div className="hidden md:grid md:grid-cols-4 gap-[25px]">
          {TV_PRODUCTS.map((product) => (
            <div key={product.id} className="w-full h-[420px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile: Scroll horizontal */}
        <div className="md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-[25px] px-4">
            {TV_PRODUCTS.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[280px] h-[420px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
