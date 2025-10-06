"use client";

import React from "react";
import DeviceCarousel from "./DeviceCarousel";
import type { StaticImageData } from "next/image";

interface StickyImageContainerProps {
  productName: string;
  imagePreviewUrl?: string;
  imageDetailsUrls?: string[];
  onImageClick: (images: (string | StaticImageData)[], currentIndex: number) => void;
}

export default function StickyImageContainer({
  productName,
  imagePreviewUrl,
  imageDetailsUrls,
  onImageClick,
}: StickyImageContainerProps) {
  return (
    <div className="sticky top-24 self-start">
      <div className="w-full flex flex-col items-center">
        <DeviceCarousel
          alt={productName}
          imagePreviewUrl={imagePreviewUrl}
          imageDetailsUrls={imageDetailsUrls}
          onImageClick={onImageClick}
        />
      </div>
    </div>
  );
}
