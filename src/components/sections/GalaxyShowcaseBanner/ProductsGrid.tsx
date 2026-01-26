/**
 * Products Grid Component
 * Grid uniforme con altura consistente
 */

"use client";

import { FEATURED_PRODUCTS } from "./data";
import { ProductCard } from "./ProductCard";

export function ProductsGrid() {
  return (
    <div className="w-full bg-white">
      <div className="w-full mx-auto" style={{ maxWidth: "1440px" }}>
        {/* Desktop: Grid 4 columnas sin gaps */}
        <div className="hidden md:grid md:grid-cols-4 gap-0">
          {FEATURED_PRODUCTS.map((product) => (
            <div key={product.id} className="w-full h-[420px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile: Scroll horizontal */}
        <div className="md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-0 px-4">
            {FEATURED_PRODUCTS.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[calc(100vw-32px)] sm:w-[280px] h-[420px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
