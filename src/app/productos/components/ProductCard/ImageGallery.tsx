/**
 * ImageGallery - Galería de imágenes con miniaturas scrolleables
 * Componente reutilizable para mostrar múltiples imágenes
 * Mobile: Scroll horizontal sin thumbnails
 * Desktop: Imagen principal + thumbnails
 */

"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  productName: string;
  className?: string;
}

export default function ImageGallery({ 
  images, 
  productName,
  className 
}: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es mobile para evitar renderizar ambas versiones
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (images.length === 0) return null;

  // Handler para scroll en mobile
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const itemWidth = container.scrollWidth / images.length;
    const newIndex = Math.round(scrollLeft / itemWidth);
    if (newIndex !== selectedIndex) {
      setSelectedIndex(newIndex);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {/* MOBILE: Carrusel horizontal sin thumbnails */}
      {isMobile && (
        <div>
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          >
            {images.map((img, index) => (
              <div
                key={`mobile-${img}-${index}`}
                className="relative flex-shrink-0 w-full h-48 snap-center"
              >
                <Image
                  src={img}
                  alt={`${productName} - Vista ${index + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain p-3"
                  priority={index === 0}
                  loading={index === 0 ? undefined : "eager"}
                  unoptimized={false}
                />
              </div>
            ))}
          </div>
          {/* Indicadores de página en mobile */}
          {images.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-2">
              {images.map((img, index) => (
                <button
                  key={`indicator-${img}-${index}`}
                  onClick={() => {
                    const container = scrollContainerRef.current;
                    if (container) {
                      const itemWidth = container.scrollWidth / images.length;
                      container.scrollTo({ left: itemWidth * index, behavior: 'smooth' });
                    }
                  }}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all",
                    selectedIndex === index ? "bg-black w-6" : "bg-gray-300"
                  )}
                  aria-label={`Ir a imagen ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* DESKTOP: Imagen principal + thumbnails */}
      {!isMobile && (
        <div>
          <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4">
            <Image
              src={images[selectedIndex]}
              alt={`${productName} - Vista ${selectedIndex + 1}`}
              fill
              sizes="(max-width: 768px) 280px, 400px"
              className="object-contain p-6"
              priority={selectedIndex === 0}
              loading={selectedIndex === 0 ? undefined : "eager"}
            />
          </div>

          {/* Thumbnails solo en desktop */}
          {images.length > 1 && (
            <div className="w-full overflow-x-auto scrollbar-hide px-2">
              <div className="flex gap-4 pb-2 min-w-min">
                {images.map((img, index) => (
                  <button
                    key={`desktop-${img}-${index}`}
                    onClick={() => setSelectedIndex(index)}
                    className={cn(
                      "relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                      selectedIndex === index
                        ? "border-black scale-105"
                        : "border-gray-200 hover:border-gray-400"
                    )}
                    aria-label={`Ver imagen ${index + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`${productName} miniatura ${index + 1}`}
                      fill
                      sizes="80px"
                      className="object-contain p-2"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
