/**
 * Banner Image Component
 */

"use client";

import Image from "next/image";
import { BannerImages } from "./types";
import { getCloudinaryUrl } from "@/lib/cloudinary";

interface BannerImageProps {
  images: BannerImages;
}

export function BannerImage({ images }: BannerImageProps) {
  // Optimizar imágenes con Cloudinary
  const optimizedDesktop = getCloudinaryUrl(images.desktop, 'hero-banner');
  const optimizedMobile = getCloudinaryUrl(images.mobile, 'mobile-banner');

  return (
    <>
      {/* Desktop Image - 1440x816 */}
      <div className="hidden md:block absolute inset-0 top-[22px]">
        <Image
          src={optimizedDesktop}
          alt="Galaxy Z Flip7 y Watch8"
          fill
          className="object-contain md:object-cover"
          sizes="(max-width: 768px) 100vw, 1440px"
          priority
          quality={95}
        />
      </div>

      {/* Mobile Image */}
      <div className="block md:hidden absolute inset-0 top-[22px]">
        <Image
          src={optimizedMobile}
          alt="Galaxy Z Flip7 y Watch8"
          fill
          className="object-cover"
          sizes="100vw"
          priority
          quality={90}
        />
      </div>
    </>
  );
}
