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
 * Contenedor para el carrusel de imágenes del producto
 * El sticky se maneja en el componente padre (col-span-5)
 */
export default function StickyImageContainer({
  productName,
  imagePreviewUrl,
  imageDetailsUrls,
  onImageClick,
}: StickyImageContainerProps) {
  return (
    <DeviceCarousel
      alt={productName}
      imagePreviewUrl={imagePreviewUrl}
      imageDetailsUrls={imageDetailsUrls}
      onImageClick={onImageClick}
    />
  );
}
