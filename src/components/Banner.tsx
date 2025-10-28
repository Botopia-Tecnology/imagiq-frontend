/**
 * Reusable Banner Component
 * Displays promotional banners with optional CTA
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import type { BannerConfig } from "@/config/banners";

interface BannerProps {
  readonly config: BannerConfig;
  readonly className?: string;
}

export default function Banner({ config, className = "" }: Readonly<BannerProps>) {
  if (!config.enabled || !config.imageUrl) {
    return null;
  }

  const content = (
    <div
      className={`relative w-full overflow-hidden rounded-lg ${className}`}
      style={{
        backgroundColor: config.backgroundColor || "#000000",
        height: config.heightMobile || "180px",
      }}
    >
      {/* Desktop Image */}
      <div
        className="hidden md:block relative w-full h-full"
        style={{ height: config.height || "280px" }}
      >
        <Image
          src={config.imageUrl}
          alt={config.title || "Banner"}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Mobile Image */}
      <div className="md:hidden relative w-full h-full">
        <Image
          src={config.imageUrlMobile || config.imageUrl}
          alt={config.title || "Banner"}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Optional Text Overlay */}
      {(config.title || config.subtitle || config.description) && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
          style={{ color: config.textColor || "#000000" }}
        >
          {config.title && (
            <h2 className="text-3xl md:text-5xl font-bold mb-2">
              {config.title}
            </h2>
          )}
          {config.subtitle && (
            <p className="text-lg md:text-2xl mb-4">{config.subtitle}</p>
          )}
          {config.description && (
            <p className="text-sm md:text-base max-w-2xl">
              {config.description}
            </p>
          )}
        </div>
      )}

      {/* Optional CTA Button */}
      {config.buttonText && config.buttonLink && (
        <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <Link
            href={config.buttonLink}
            className="bg-black/80 backdrop-blur-sm px-6 md:px-8 py-2.5 md:py-3 rounded-full font-medium text-sm md:text-base hover:bg-black transition-all duration-300 shadow-lg hover:shadow-xl"
            style={{ color: config.textColor || '#ffffff' }}
          >
            {config.buttonText}
          </Link>
        </div>
      )}
    </div>
  );

  // Si hay link y no hay botón específico, hacer toda la imagen clickeable
  if (config.buttonLink && !config.buttonText) {
    return (
      <Link href={config.buttonLink} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
