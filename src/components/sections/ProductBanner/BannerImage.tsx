/**
 * Banner Image Component - Reusable
 */

"use client";

import Image from "next/image";
import { BannerImages } from "./types";

interface BannerImageProps {
  images: BannerImages;
  alt: string;
}

export function BannerImage({ images, alt }: BannerImageProps) {
  return (
    <>
      {/* Desktop Image */}
      <div className="hidden md:block absolute inset-0">
        <Image
          src={images.desktop}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1440px"
          priority
          quality={100}
          unoptimized
        />
      </div>

      {/* Mobile Image */}
      <div className="block md:hidden absolute inset-0">
        <Image
          src={images.mobile}
          alt={alt}
          fill
          className="object-cover"
          sizes="100vw"
          priority
          quality={100}
          unoptimized
        />
      </div>
    </>
  );
}
