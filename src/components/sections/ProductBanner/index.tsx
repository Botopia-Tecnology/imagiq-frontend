/**
 * 🎨 PRODUCT BANNER - Reusable Component
 *
 * Componente reutilizable para banners de productos
 * - Configurable mediante props
 * - Soporta temas light/dark
 * - Alineación de texto configurable
 * - Responsive
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { BannerImage } from "./BannerImage";
import { BannerConfig } from "./types";
import { posthogUtils } from "@/lib/posthogClient";

interface ProductBannerProps {
  config: BannerConfig;
}

export default function ProductBanner({ config }: ProductBannerProps) {
  const [isHovering, setIsHovering] = useState(false);

  const {
    images,
    content,
    theme = "dark",
    textAlignment = "left",
    trackingEvent = "product_banner_click",
  } = config;

  const isDark = theme === "dark";
  const textColor = isDark ? "text-white" : "text-black";
  const bgColor = isDark ? "bg-black" : "bg-white";

  const alignmentClasses = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  };

  const handleButtonClick = () => {
    posthogUtils.capture(trackingEvent, {
      action: "click",
      source: "product_banner",
      href: content.buttonHref,
    });
  };

  return (
    <section
      className={`w-full relative ${bgColor}`}
      aria-label={content.ariaLabel}
    >
      {/* Main Banner */}
      <div className="relative w-full h-[680px] md:h-[500px] lg:h-[810px] max-w-[1440px] mx-auto overflow-hidden">
        {/* Background Image */}
        <BannerImage images={images} alt={content.ariaLabel} />

        {/* Content Overlay */}
        <div
          className={`relative z-10 h-full flex flex-col justify-center px-6 md:px-12 lg:px-20 ${alignmentClasses[textAlignment]}`}
        >
          {/* Title */}
          <h2
            className={`text-4xl md:text-5xl lg:text-6xl font-black ${textColor} mb-3 md:mb-4 tracking-tight`}
          >
            <span
              style={{
                fontFamily: "'Samsung Sharp Sans', sans-serif",
                fontWeight: 900,
              }}
            >
              {content.title}
            </span>
          </h2>

          {/* Subtitle (optional) */}
          {content.subtitle && (
            <p
              className={`text-sm md:text-base lg:text-lg ${textColor} mb-6 md:mb-8 max-w-md`}
            >
              <span
                style={{
                  fontFamily: "'Samsung Sharp Sans', sans-serif",
                  fontWeight: 400,
                }}
              >
                {content.subtitle}
              </span>
            </p>
          )}

          {/* Action Button */}
          <Link
            href={content.buttonHref}
            className="group inline-block"
            onClick={handleButtonClick}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <button
              className={`
                px-6 md:px-8 py-2.5 md:py-3 rounded-full text-sm md:text-base font-bold
                transition-all duration-300
                ${
                  isHovering
                    ? isDark
                      ? "bg-white text-black"
                      : "bg-black text-white"
                    : isDark
                    ? "bg-transparent text-white border-2 border-white"
                    : "bg-transparent text-black border-2 border-black"
                }
              `}
            >
              <span
                style={{
                  fontFamily: "'Samsung Sharp Sans', sans-serif",
                  fontWeight: 700,
                }}
              >
                {content.buttonText}
              </span>
            </button>
          </Link>
        </div>

        {/* Gradient Overlay for better text readability */}
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-gradient-to-r from-black/60 via-black/30 to-transparent"
              : "bg-gradient-to-r from-white/60 via-white/30 to-transparent"
          } pointer-events-none md:hidden`}
        />
        <div
          className={`hidden md:block absolute inset-0 ${
            isDark
              ? "bg-gradient-to-r from-black/40 via-transparent to-transparent"
              : "bg-gradient-to-r from-white/40 via-transparent to-transparent"
          } pointer-events-none`}
        />
      </div>
    </section>
  );
}
