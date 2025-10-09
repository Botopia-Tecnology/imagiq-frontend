/**
 * Componente de imagen del producto
 * - Badge NUEVO
 * - Imagen optimizada con Cloudinary
 * - Botón "Vistazo rápido"
 */

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  isNew?: boolean;
  viewMode?: "grid" | "list";
  onImageClick: (e: React.MouseEvent) => void;
  onQuickView: (e: React.MouseEvent) => void;
}

export default function ProductImage({
  src,
  alt,
  width,
  height,
  sizes,
  isNew = false,
  viewMode = "grid",
  onImageClick,
  onQuickView,
}: ProductImageProps) {
  return (
    <div
      className={cn(
        "relative bg-gray-100 overflow-visible group",
        viewMode === "list" ? "w-24 h-24 md:w-32 md:h-32 flex-shrink-0" : "aspect-square w-full"
      )}
    >
      {/* Badge NUEVO */}
      {isNew && (
        <div className="absolute top-0 left-0 z-10">
          <span className="bg-black text-white text-xs font-bold px-2 py-1 uppercase">
            NUEVO
          </span>
        </div>
      )}

      {/* Imagen - Más pequeña solo en mobile, desktop igual que antes */}
      <button
        type="button"
        className="relative w-full h-full cursor-pointer bg-transparent border-0 p-0"
        onClick={onImageClick}
        aria-label={`Ver detalles de ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="object-contain p-6 md:p-4 w-full h-full"
          sizes={sizes}
        />
      </button>

      {/* Botón "Vistazo rápido" - Fondo negro, siempre visible en mobile, hover en desktop */}
      <div className="absolute bottom-2 md:bottom-3 left-1/2 transform -translate-x-1/2 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={onQuickView}
          className="bg-black text-white px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-semibold hover:bg-gray-800 transition-all duration-200 whitespace-nowrap shadow-lg"
        >
          Vistazo rápido
        </button>
      </div>
    </div>
  );
}
