import React from "react";
import { Heart } from "lucide-react";

interface ProductHeaderProps {
  name: string;
  sku?: string;
  rating?: number;
  reviewCount?: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function ProductHeader({
  name,
  sku,
  rating,
  reviewCount,
  isFavorite,
  onToggleFavorite,
}: ProductHeaderProps) {
  return (
    <div className="mb-2">
      <div className="flex items-start gap-3 mb-2 pr-4">
        <h1
          className="text-[2.5rem] leading-[1.08] font-bold text-[#222] flex-1 max-w-[85%]"
          style={{ letterSpacing: "-1.5px" }}
        >
          {name}
        </h1>
        {/* Botón de favoritos */}
        <button
          onClick={onToggleFavorite}
          className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-all duration-200 relative z-10 mt-1"
          aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          <Heart
            className={`w-6 h-6 transition-all duration-200 ${
              isFavorite
                ? "fill-red-500 text-red-500"
                : "text-gray-400 hover:text-red-500"
            }`}
          />
        </button>
      </div>

      {/* SKU del producto */}
      {sku && (
        <div className="text-xs text-[#8A8A8A] mb-3">
          {sku}
        </div>
      )}

      {/* Calificación del producto */}
      {rating && (
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <svg
                key={index}
                className={`w-4 h-4 ${
                  index < Math.floor(rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : index < rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300 fill-gray-300"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-[#222] font-medium">
            {rating.toFixed(1)}
          </span>
          {reviewCount && (
            <span className="text-xs text-[#8A8A8A]">
              ({reviewCount} {reviewCount === 1 ? 'reseña' : 'reseñas'})
            </span>
          )}
        </div>
      )}

      {/* Línea separadora minimalista */}
      <div className="w-48 h-px bg-gray-200 mb-4"></div>
    </div>
  );
}
