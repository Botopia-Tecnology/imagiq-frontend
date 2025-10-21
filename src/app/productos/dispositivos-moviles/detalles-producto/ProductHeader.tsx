import React from "react";
import { Heart } from "lucide-react";

interface ProductHeaderProps {
  name: string;
  sku?: string;
  codigoMarket?: string;
  stock?: number;
  stockTotal?: number;
  rating?: number;
  reviewCount?: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function ProductHeader({
  name,
  sku,
  codigoMarket,
  stock,
  stockTotal,
  rating,
  reviewCount,
  isFavorite,
  onToggleFavorite,
}: ProductHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-start gap-4 mb-4 pr-4">
        <h1
          className="text-[2rem] leading-tight font-bold text-[#222] flex-1"
          style={{ letterSpacing: "-0.5px" }}
        >
          {name}
        </h1>
        {/* Botón de favoritos */}
        <button
          onClick={onToggleFavorite}
          className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-all duration-200 relative z-10"
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

      {/* Información del producto */}
      {(sku || codigoMarket || stock !== undefined || stockTotal !== undefined) && (
        <div className="text-sm text-gray-500 mb-3 space-y-1">
          {sku && (
            <div>
              <span className="font-medium">SKU:</span> {sku}
            </div>
          )}
          {codigoMarket && (
            <div>
              <span className="font-medium">Código:</span> {codigoMarket}
            </div>
          )}
          {stock !== undefined && (
            <div>
              <span className="font-medium">Stock:</span> {stock}
            </div>
          )}
          {stockTotal !== undefined && (
            <div>
              <span className="font-medium">Stock Total:</span> {stockTotal}
            </div>
          )}
        </div>
      )}

      {/* Calificación del producto */}
      {rating && (
        <div className="flex items-center gap-2 mb-8">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <svg
                key={index}
                className={`w-3.5 h-3.5 ${
                  index < Math.floor(rating)
                    ? "text-black fill-black"
                    : index < rating
                    ? "text-black fill-black"
                    : "text-gray-300 fill-gray-300"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-[#222] font-semibold">
            {rating.toFixed(1)}
          </span>
          {reviewCount && (
            <span className="text-sm text-[#222]">
              ({reviewCount})
            </span>
          )}
        </div>
      )}

      {/* Línea separadora */}
      <div className="h-px bg-gray-200 mb-8"></div>
    </div>
  );
}
