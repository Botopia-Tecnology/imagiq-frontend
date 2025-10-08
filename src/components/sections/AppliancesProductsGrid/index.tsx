/**
 * 🏠 APPLIANCES PRODUCTS GRID - Main Component
 *
 * Grid de productos de electrodomésticos destacados
 * - Componente modular y reutilizable
 * - Scroll horizontal en móvil, Grid 4 columnas en desktop
 * - Animación hover en tarjetas
 */

"use client";

import { APPLIANCE_PRODUCTS } from "./data";
import { ProductCard } from "./ProductCard";

export default function AppliancesProductsGrid() {
  return (
    <div className="w-full bg-white py-[25px]">
      <div className="w-full mx-auto" style={{ maxWidth: "1440px" }}>
        {/* Desktop: Grid 4 columnas */}
        <div className="hidden md:grid md:grid-cols-4 gap-[25px]">
          {APPLIANCE_PRODUCTS.map((product) => (
            <div key={product.id} className="w-full h-[420px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile: Scroll horizontal */}
        <div className="md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-[25px] px-4">
            {APPLIANCE_PRODUCTS.map((product) => (
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
