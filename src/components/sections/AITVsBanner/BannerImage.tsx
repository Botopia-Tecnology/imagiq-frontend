/**
 * Banner Image Component - AI TVs
 */

"use client";

import Image from "next/image";
import { BannerImages } from "./types";

interface BannerImageProps {
  images: BannerImages;
}

export function BannerImage({ images }: BannerImageProps) {
  return (
    <>
      {/* Desktop Image - 1440x810 */}
      <div className="hidden md:block absolute inset-0 top-[22px]">
        <Image
          src={images.desktop}
          alt="Nuevos AI TVs 2025"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1440px"
          priority
          quality={100}
          unoptimized
        />
      </div>

      {/* Mobile Image - 720x1120 */}
      <div className="block md:hidden absolute inset-0 top-[22px]">
        <Image
          src={images.mobile}
          alt="Nuevos AI TVs 2025"
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
