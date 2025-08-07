/**
 * 🎯 CATEGORY SLIDER COMPONENT - IMAGIQ ECOMMERCE
 *
 * Componente reutilizable de categorías con:
 * - Slider horizontal
 * - Configuración dinámica de categorías
 * - Navegación con botones
 * - Responsive design
 * - Tracking de clicks
 */

"use client";

import { useState, useRef } from "react";
import Image, { StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { posthogUtils } from "@/lib/posthogClient";

interface Category {
  id: string;
  name: string;
  subtitle: string;
  image: string | StaticImageData;
  href: string;
}

interface CategorySliderProps {
  categories: Category[];
  onCategoryClick?: (category: Category) => void;
  trackingPrefix?: string;
  className?: string;
}

export default function CategorySlider({
  categories,
  onCategoryClick,
  trackingPrefix = "category",
  className,
}: CategorySliderProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const maxIndex = Math.max(0, categories.length - 4);

  const slideLeft = () => {
    setSlideIndex((prev) => Math.max(0, prev - 1));
  };

  const slideRight = () => {
    setSlideIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const handleCategoryClick = (category: Category) => {
    posthogUtils.capture(`${trackingPrefix}_click`, {
      category_id: category.id,
      category_name: category.name,
      category_subtitle: category.subtitle,
    });

    if (onCategoryClick) {
      onCategoryClick(category);
    } else {
      // Si no hay handler personalizado, navegar al href
      window.location.href = category.href;
    }
  };

  return (
    <section
      className={cn("bg-white border-b border-gray-200 py-8", className)}
    >
      <div className="container mx-auto px-6">
        <div className="relative max-w-6xl mx-auto">
          {/* Botón anterior */}
          <button
            onClick={slideLeft}
            disabled={slideIndex === 0}
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-200",
              slideIndex === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-50 hover:shadow-xl"
            )}
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          {/* Botón siguiente */}
          <button
            onClick={slideRight}
            disabled={slideIndex >= maxIndex}
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-200",
              slideIndex >= maxIndex
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-50 hover:shadow-xl"
            )}
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          {/* Contenedor de categorías */}
          <div className="overflow-hidden mx-12">
            <div
              ref={sliderRef}
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${slideIndex * 25}%)`,
              }}
            >
              {categories.map((category, index) => (
                <div
                  key={`${category.id}-${index}`}
                  className="w-1/4 flex-shrink-0 px-3"
                >
                  <button
                    onClick={() => handleCategoryClick(category)}
                    className="group w-full bg-[#D9D9D9] rounded-2xl p-6 transition-all duration-300 hover:bg-gray-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="aspect-square relative mb-3">
                      <Image
                        src={category.image}
                        alt={`${category.name} ${category.subtitle}`}
                        fill
                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-gray-900 text-sm">
                        {category.name}
                      </div>
                      <div className="font-bold text-gray-900 text-sm">
                        {category.subtitle}
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export type { Category, CategorySliderProps };
