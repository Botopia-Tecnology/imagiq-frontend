"use client";

import React from "react";
import DeviceCarousel from "./DeviceCarousel";
import type { StaticImageData } from "next/image";

interface StickyImageContainerProps {
  readonly productName: string;
  readonly imagePreviewUrl?: string;
  readonly imageDetailsUrls?: string[];
  readonly onImageClick: (images: (string | StaticImageData)[], currentIndex: number) => void;
}

/**
 * Contenedor sticky para el carrusel de imágenes del producto
 * Se mantiene pegado en la parte superior mientras se hace scroll,
 * usando position: sticky nativo de CSS para mejor rendimiento
 */
export default function StickyImageContainer({
  productName,
  imagePreviewUrl,
  imageDetailsUrls,
  onImageClick,
}: StickyImageContainerProps) {
  return (
    <div className="sticky top-24 self-start">
      <DeviceCarousel
        alt={productName}
        imagePreviewUrl={imagePreviewUrl}
        imageDetailsUrls={imageDetailsUrls}
        onImageClick={onImageClick}
      />
    </div>
  );
}
