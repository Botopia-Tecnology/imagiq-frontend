import React, { useState } from "react";
import { useCartContext } from "@/features/cart/CartContext";
import { usePointsContext } from "@/contexts/PointsContext";
import type { ProductCardProps } from "@/app/productos/components/ProductCard";
import FlixmediaSpecifications from "@/components/FlixmediaSpecifications";

interface SpecificationsProps {
  product: ProductCardProps;
}


const Specifications: React.FC<SpecificationsProps> = ({ product }) => {
  const { addProduct } = useCartContext();
  const { recalculatePoints } = usePointsContext();
  const [showFlixmedia, setShowFlixmedia] = useState(true);

  // --- VISUAL: Precio formateado y mostrado dentro del botón ---
  // Usar el precio real del producto, formateado
  const priceNumber =
    typeof product.price === "number"
      ? product.price
      : parseInt((product.price || "0").toString().replace(/[^\d]/g, ""));
  const displayPrice = priceNumber.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });

  // Handler para añadir al carrito y actualizar puntos Q (no cambia lógica)
  const handleAddToCart = () => {
    const image =
      typeof product.image === "string"
        ? product.image
        : product.image?.src || "";
    addProduct({
      id: product.id,
      name: product.name,
      image,
      price: priceNumber,
      sku: product.sku || "SKU",
      quantity: 1,
      puntos_q: product.puntos_q ?? 4,
    });
    recalculatePoints();
  };

  // --- VISUAL: UX mejorada, tabs y contenido ---
  return (
    <section
      id="especificaciones-section"
      className="w-full max-w-5xl mx-auto px-2 sm:px-4 md:px-8 py-8 md:py-12 mt-36  "
      aria-label="Especificaciones técnicas"
    >
      {/* Intentar cargar especificaciones de Flixmedia */}
      {showFlixmedia && product.sku && (
        <FlixmediaSpecifications
          mpn={product.sku}
          ean={null}
          className="mb-8"
        />
      ) }

      {/* Botón grande con feedback visual y animación */}
      <div className="flex flex-col items-center w-full mt-2 px-0 sm:px-0">
        <button
          type="button"
          className="w-full max-w-xs sm:max-w-md bg-[#0099FF] hover:bg-[#007ACC] active:scale-95 text-white font-bold py-3 sm:py-4 rounded-full shadow-lg text-base sm:text-lg lg:text-xl transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 focus-visible:ring-offset-2 mb-2"
          onClick={handleAddToCart}
          aria-label={`Añadir al carrito por ${displayPrice}`}
        >
          Añadir al carrito – {displayPrice}
        </button>
      </div>
    </section>
  );
};

export default Specifications;
