/**
 * Rating del producto
 * - Estrellas de calificación
 * - Número de reviews
 */

import React from "react";

interface ProductRatingProps {
  rating?: number;
  reviewCount?: number;
}

export default function ProductRating({
  rating = 4.8,
  reviewCount = 429,
}: ProductRatingProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {/* Estrellas */}
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg
            key={`star-${i}-${rating}`}
            className="w-4 h-4 fill-current text-yellow-500"
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
      {/* Rating número */}
      <span className="text-base font-bold text-gray-900">{rating}</span>
      <span className="text-base text-gray-500">({reviewCount})</span>
    </div>
  );
}
