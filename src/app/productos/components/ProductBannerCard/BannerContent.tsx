/**
 * Componente de contenido del banner de producto
 */

"use client";

import Link from "next/link";

interface BannerContentProps {
  title: string | null;
  description: string | null;
  cta: string | null;
  linkUrl: string | null;
  colorFont: string;
  positionStyle: React.CSSProperties;
  isVisible: boolean;
}

export function BannerContent({
  title,
  description,
  cta,
  linkUrl,
  colorFont,
  positionStyle,
  isVisible,
}: Readonly<BannerContentProps>) {
  if (!isVisible) return null;

  return (
    <div
      className="absolute z-10 flex flex-col items-start justify-start"
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
          style={{ color: colorFont }}
        >
          {title}
        </h3>
      )}

      {/* Descripción */}
      {description && (
        <p
          className="text-base md:text-lg mb-4 font-normal"
          style={{ color: colorFont }}
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
          }}
        >
          {cta}
        </Link>
      )}
    </div>
  );
}
