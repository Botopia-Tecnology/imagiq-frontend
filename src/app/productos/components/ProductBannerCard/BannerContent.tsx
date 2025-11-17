/**
 * Componente de contenido del banner de producto
 */

"use client";

import Link from "next/link";
import type { BannerTextStyles } from "@/types/banner";

interface BannerContentProps {
  title: string | null;
  description: string | null;
  cta: string | null;
  linkUrl: string | null;
  colorFont: string;
  positionStyle: React.CSSProperties;
  isVisible: boolean;
  textStyles?: BannerTextStyles | null;
}

export function BannerContent({
  title,
  description,
  cta,
  linkUrl,
  colorFont,
  positionStyle,
  isVisible,
  textStyles,
}: Readonly<BannerContentProps>) {
  if (!isVisible) return null;

  return (
    <div
      className="absolute z-10 flex flex-col items-center justify-center text-center"
      style={{
        ...positionStyle,
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s",
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      {/* Título */}
      {title && (
        <h3
          className="text-2xl md:text-3xl font-bold mb-2 tracking-tight"
          style={{
            color: colorFont,
            ...(textStyles?.title || {}),
          }}
        >
          {title}
        </h3>
      )}

      {/* Descripción */}
      {description && (
        <p
          className="text-base md:text-lg mb-4 font-normal"
          style={{
            color: colorFont,
            ...(textStyles?.description || {}),
          }}
        >
          {description}
        </p>
      )}

      {/* CTA Button */}
      {cta && linkUrl && (
        <Link
          href={linkUrl}
          className="bg-transparent hover:opacity-80 px-6 py-2 text-sm rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
          style={{
            color: colorFont,
            borderWidth: "2px",
            borderColor: colorFont,
            ...(textStyles?.cta || {}),
          }}
        >
          {cta}
        </Link>
      )}
    </div>
  );
}
