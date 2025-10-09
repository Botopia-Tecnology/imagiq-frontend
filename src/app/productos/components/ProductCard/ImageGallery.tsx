/**
 * ImageGallery - Galería de imágenes con miniaturas scrolleables
 * Componente reutilizable para mostrar múltiples imágenes
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  productName: string;
  className?: string;
}

export default function ImageGallery({ 
  images, 
  productName,
  className 
}: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) return null;

  return (
    <div className={cn("w-full", className)}>
      {/* Imagen principal */}
      <div className="relative w-full aspect-square rounded-lg overflow-hidden max-w-[280px] md:max-w-none mx-auto mb-3 md:mb-4">
        <Image
          src={images[selectedIndex]}
          alt={`${productName} - Vista ${selectedIndex + 1}`}
          fill
          className="object-contain p-4 md:p-6"
          priority={selectedIndex === 0}
        />
      </div>

      {/* Miniaturas scrolleables - visible en mobile y desktop */}
      {images.length > 1 && (
        <div className="w-full overflow-x-auto scrollbar-hide px-1">
          <div className="flex gap-2 md:gap-3 pb-2 min-w-min">
            {images.map((img, index) => (
              <button
                key={`${img}-${index}`}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  "relative flex-shrink-0 w-14 h-14 md:w-20 md:h-20 rounded-md md:rounded-lg overflow-hidden border-2 transition-all",
                  selectedIndex === index
                    ? "border-black ring-2 ring-black ring-offset-2 scale-105 shadow-md"
                    : "border-gray-200 hover:border-gray-400"
                )}
                aria-label={`Ver imagen ${index + 1}`}
              >
                <Image
                  src={img}
                  alt={`${productName} miniatura ${index + 1}`}
                  fill
                  className="object-contain p-1.5 md:p-2"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
