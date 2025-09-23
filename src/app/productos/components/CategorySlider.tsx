"use client";
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
}: Readonly<CategorySliderProps>) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const sliderRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Detecta la sección activa desde la URL
  const sectionParam = searchParams.get("section");
  // Obtén el hash solo en cliente
  const hash = typeof window !== "undefined" ? window.location.hash : "";

  // Busca la categoría activa según el parámetro de la URL o el hash
  const activeCategoryId =
    categories.find(
      (cat) =>
        cat.href.includes(sectionParam || "") ||
        (cat.href.startsWith("#") && cat.href === hash)
    )?.id || categories[0].id;

  // Configuración responsive para items por vista
  React.useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsPerView(1); // móvil: 1 item
      } else if (width < 768) {
        setItemsPerView(2); // tablet pequeña: 2 items
      } else if (width < 1024) {
        setItemsPerView(3); // tablet: 3 items
      } else {
        setItemsPerView(4); // desktop: 4 items
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, categories.length - itemsPerView);

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
      router.push(category.href);
    }
  };

  return (
    <section
      className={cn(
        "bg-white border-b border-gray-200 py-4 sm:py-8 sm:ml-0",
        className
      )}
    >
      <div className="container mx-auto px-0 sm:px-6">
        <div className="relative max-w-6xl mx-auto">
          {/* Botones de navegación: se ocultan en pantallas pequeñas (se usará scroll horizontal) */}
          <button
            onClick={slideLeft}
            disabled={slideIndex === 0}
            className={cn(
              "hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg border border-gray-200 items-center justify-center transition-all duration-200",
              slideIndex === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-50 hover:shadow-xl"
            )}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>

          <button
            onClick={slideRight}
            disabled={slideIndex >= maxIndex}
            className={cn(
              "hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg border border-gray-200 items-center justify-center transition-all duration-200",
              slideIndex >= maxIndex
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-50 hover:shadow-xl"
            )}
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>

          {/* Contenedor de categorías */}
          {/* En móviles permitimos scroll horizontal y tamaños más pequeños, sin margen lateral (a ras de pantalla) */}
          <div className="-mx-2 sm:mx-8">
            <div
              ref={sliderRef}
              className="flex transition-transform duration-300 ease-in-out sm:overflow-hidden overflow-x-auto no-scrollbar gap-4 py-2"
              style={{
                transform:
                  itemsPerView >= 4
                    ? `translateX(-${slideIndex * (100 / itemsPerView)}%)`
                    : undefined,
              }}
            >
              {categories.map((category, index) => (
                <div
                  key={`${category.id}-${index}`}
                  className={cn(
                    "flex-shrink-0 px-1 sm:px-3 flex flex-col items-center",
                    // En móvil queremos que quepan más y sean pequeños, con ancho fijo para el scroll
                    itemsPerView === 1 && "w-36 sm:w-full",
                    itemsPerView === 2 && "w-32 sm:w-1/2",
                    itemsPerView === 3 && "w-40 sm:w-1/3",
                    itemsPerView === 4 && "w-40 sm:w-1/4"
                  )}
                >
                  <button
                    onClick={() => handleCategoryClick(category)}
                    className={cn(
                      "relative flex items-center justify-center transition-all duration-300 hover:-translate-y-1",
                      "rounded-full category-circle",
                      "overflow-hidden",
                      // Tamaños reducidos en móvil para que se muestren todos
                      "size-20 sm:size-24 md:size-32 lg:size-36",
                      activeCategoryId === category.id
                        ? "bg-blue-500/30 ring-2 ring-green-50 scale-[115%]"
                        : "bg-white hover:bg-white-100 scale-75"
                    )}
                  >
                    {/* Contenedor centrado para la imagen */}
                    <div className="flex items-center justify-center w-full h-full pointer-events-none">
                      <Image
                        src={category.image}
                        alt={`${category.name} ${category.subtitle}`}
                        width={itemsPerView <= 2 ? 90 : 150}
                        height={itemsPerView <= 2 ? 90 : 150}
                        className="object-contain object-center drop-shadow-lg"
                        priority={activeCategoryId === category.id}
                      />
                    </div>
                  </button>
                  {/* Texto debajo */}
                  <div className="text-center mt-2 sm:mt-3">
                    <div className="font-bold text-gray-900 text-xs sm:text-sm">
                      {category.name}
                    </div>
                    <div className="font-bold text-gray-900 text-xs sm:text-sm">
                      {category.subtitle}
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
