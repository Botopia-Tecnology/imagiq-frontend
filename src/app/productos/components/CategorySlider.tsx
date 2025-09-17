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

import React, { useState, useRef } from "react";
import Image, { StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { posthogUtils } from "@/lib/posthogClient";
import { useSearchParams, useRouter } from "next/navigation";

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
  const router = useRouter();
  // Estilos responsivos para móvil vertical
  React.useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @media (max-width: 480px) and (orientation: portrait) {
        .category-circle {
          width: 80px !important;
          height: 80px !important;
          min-width: 80px !important;
          min-height: 80px !important;
        }
        .category-image-container img {
          width: 95px !important;
          height: 95px !important;
        }
        .category-image-container {
          width: 95px !important;
          height: 95px !important;
        }
        .category-text {
          font-size: 0.8rem !important;
        }
        .category-slider-col {
          padding-left: 0.8rem !important;   /* <-- Cambia este valor para aumentar la separación */
          padding-right: 0.8rem !important;  /* <-- Cambia este valor para aumentar la separación */
          margin-left: 0 !important;
          margin-right: 0 !important;
        }
        .category-slider-col > .mt-3 {
          margin-top: 0.15rem !important;
        }
        .category-arrow-btn {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const [slideIndex, setSlideIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  // Detecta la sección activa desde la URL
  const sectionParam = searchParams.get("section");
  // Obtén el hash solo en cliente
  const hash = typeof window !== "undefined" ? window.location.hash : "";

  // Busca la categoría activa según el parámetro de la URL o el hash
  const activeCategoryId =
    categories.find((cat) =>
      cat.href.includes(sectionParam || "") ||
      (cat.href.startsWith("#") && cat.href === hash)
    )?.id || categories[0].id;

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
      router.replace(category.href); // Solo cambia el query param, navegación interna
    }
  };

  return (
  <section className={cn("bg-white border-b border-gray-200 py-8", className)} style={{ overflow: "visible" }}> {/* py distancia entre slider y linea gris */}
      <div
        className={cn(
          // En PC, slider alineado con el header (max-w-[1600px] centrado y px-35 dato que sirve para margen en el ancho )
          "w-full",
          "min-[1024px]:max-w-[1600px] min-[1024px]:mx-auto min-[1024px]:px-35",
          // En móvil mantiene el padding
          "max-[1023px]:container max-[1023px]:mx-auto max-[1023px]:px-6"
        )}
        style={{ overflow: "visible" }}
      >
        <div
          className={cn(
            "relative w-full", // En PC ocupa todo el ancho del contenedor
            "min-[1024px]:max-w-[1600px] min-[1024px]:mx-auto",
            "max-[1023px]:max-w-6xl max-[1023px]:mx-auto"
          )}
          style={{ overflow: "visible" }}
        >
          {/* Botón anterior */}
          <button
            onClick={slideLeft}
            disabled={slideIndex === 0}
            className={cn(
              "absolute left-0 top-[45%] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-200 category-arrow-btn",
              "max-[480px]:w-8 max-[480px]:h-8", // móvil vertical
              slideIndex === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-50 hover:shadow-xl"
            )}
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 max-[480px]:w-4 max-[480px]:h-4" />
          </button>

          {/* Botón siguiente */}
          <button
            onClick={slideRight}
            disabled={slideIndex >= maxIndex}
            className={cn(
              "absolute right-0 top-[45%] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-200 category-arrow-btn",
              "max-[480px]:w-8 max-[480px]:h-8", // móvil vertical
              slideIndex >= maxIndex
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-50 hover:shadow-xl"
            )}
          >
            <ChevronRight className="w-5 h-5 text-gray-600 max-[480px]:w-4 max-[480px]:h-4" />
          </button>

          {/* Contenedor de categorías */}
          <div className={cn(
            "overflow-visible w-full", // PC ocupa todo el ancho del contenedor
            "min-[1024px]:w-full min-[1024px]:px-0 min-[1024px]:mx-0",
            "max-[1023px]:mx-0 max-[1023px]:px-0"
          )}>
            <div
              ref={sliderRef}
              className={cn(
                "flex transition-transform duration-300 ease-in-out justify-between items-end w-full",
                "min-[1024px]:gap-x-0", // Sin gap en PC para aprovechar ancho
                "max-[1023px]:gap-x-3"
              )}
              style={{
                transform: `translateX(-${slideIndex * 25}%)`,
                overflow: "visible",
                minHeight: "240px"
              }}
            >
              {categories.map((category, index) => (
                <div
                  key={`${category.id}-${index}`}
                  className={cn(
                    "flex-shrink-0 flex flex-col items-center category-slider-col",
                    "min-[1024px]:min-w-[260px] min-[1024px]:min-h-[260px]", // PC: mucho más grande
                    "min-[481px]:flex-1 min-[481px]:mx-0",
                    "max-[480px]:w-[25%] max-[480px]:mx-2",
                    activeCategoryId === category.id ? "z-10" : ""
                  )}
                >
                  <button
                    onClick={() => handleCategoryClick(category)}
                    className={cn(
                      "relative flex items-center justify-center transition-all duration-300 hover:-translate-y-1",
                      "rounded-full category-circle",
                      "min-[1024px]:min-w-[180px] min-[1024px]:min-h-[180px] min-[1024px]:w-[180px] min-[1024px]:h-[180px]", // PC: círculo mucho más grande
                      "overflow-visible",
                      activeCategoryId === category.id
                        ? "bg-green-100 ring-2 ring-green-50 scale-115 max-[480px]:scale-105"
                        : "bg-white hover:bg-white-100 scale-100"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none category-image-container",
                        "min-[1024px]:w-[220px] min-[1024px]:h-[220px]", // PC: imagen mucho más grande
                        activeCategoryId === category.id
                          ? "scale-115 max-[480px]:scale-105"
                          : "scale-100"
                      )}
                    >
                      <Image
                        src={category.image}
                        alt={`${category.name} ${category.subtitle}`}
                        width={220}
                        height={220}
                        className="object-contain drop-shadow-lg"
                        priority={activeCategoryId === category.id}
                      />
                    </span>
                  </button>
                  {/* Texto debajo */}
                  <div className="text-center mt-6">  {/* mt ajuste distancia del texto a la imagen */}
                    {/* PC: una sola línea, móvil: dos líneas */}
                    <div
                      className={cn(
                        "font-bold text-gray-900 text-lg category-text inline-block",
                        "min-[481px]:whitespace-nowrap min-[481px]:max-w-[220px] min-[481px]:overflow-hidden min-[481px]:text-ellipsis",
                        "max-[480px]:block max-[480px]:text-xs max-[480px]:whitespace-normal",
                        activeCategoryId === category.id ? "scale-110" : ""
                      )}
                      style={{ lineHeight: 1.2 }}
                    >
                      <span className="min-[481px]:inline max-[480px]:block">{category.name}</span>
                      <span className="min-[481px]:inline max-[480px]:block"> {category.subtitle}</span>
                    </div>
                  </div>
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