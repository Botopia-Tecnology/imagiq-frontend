/**
 * 🎯 HERO SECTION - COMPARTIDO
 * Componente genérico hero reutilizable para todas las industrias
 */

"use client";

import React from "react";
import HeroImage from "@/components/ui/HeroImage";

interface HeroSectionProps {
  publicId: string;
  alt: string;
  title?: string;
  subtitle: string;
}

export default function HeroSection({
  publicId,
  alt,
  title = "Nuevo Samsung para Empresas",
  subtitle,
}: HeroSectionProps) {
  return (
    <section id="hero" className="relative w-full overflow-hidden">
      <div className="relative w-full" style={{ aspectRatio: "1366/607" }}>
        <HeroImage
          publicId={publicId}
          alt={alt}
          className="w-full h-full object-cover"
        />

        {/* Texto superpuesto - Sin overlay, texto negro bold */}
        <div className="absolute inset-0 z-10">
          <div className="max-w-7xl mx-auto h-full flex items-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1
                className="text-4xl md:text-5xl lg:text-6xl text-black mb-4 lg:mb-6 leading-tight tracking-tight"
                style={{
                  fontWeight: 700,
                  fontFamily:
                    '"SamsungSharpSans", "Montserrat", Arial, sans-serif',
                  WebkitFontSmoothing: "antialiased",
                  textShadow: "0 0 0.5px currentColor, 0 0 0.5px currentColor",
                }}
              >
                {title}
              </h1>
              <p
                className="text-base md:text-lg lg:text-xl text-black leading-relaxed"
                style={{ fontWeight: 400 }}
              >
                {subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
