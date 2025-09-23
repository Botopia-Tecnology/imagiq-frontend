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

import React, { useState, useRef, useEffect } from "react";

import Image, { StaticImageData } from "next/image";
// Iconos de navegación eliminados: el slider usa scroll horizontal condicionalmente
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
  const [itemsPerView, setItemsPerView] = useState(4);
  const sliderRef = useRef<HTMLUListElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
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

  // Detecta si el contenedor desborda (activar scroll horizontal solo si es necesario)
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const check = () => {
      // scrollWidth > clientWidth => hay overflow horizontal
      setIsScrollable(el.scrollWidth > el.clientWidth + 1);
    };

    // Initial check
    check();

    // Observa cambios de tamaño del contenedor y del contenido
    const ro = new ResizeObserver(check);
    ro.observe(el);

    // También re-evalúa en resize de ventana por si cambia el layout
    window.addEventListener("resize", check);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", check);
    };
  }, [categories, itemsPerView]);

  // Navegación por scroll horizontal — se eliminó el estado y funciones de slide.

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
          {/* Navegación por scroll horizontal únicamente - botones eliminados */}

          {/* Contenedor de categorías */}
          {/* En móviles permitimos scroll horizontal y tamaños más pequeños, sin margen lateral (a ras de pantalla) */}
          <div className="-mx-2 sm:mx-8">
            <ul
              ref={sliderRef}
              // Aplica scroll horizontal y snap solo si hay overflow
              className={cn(
                "flex gap-4 py-2",
                isScrollable
                  ? "overflow-x-auto no-scrollbar snap-x snap-mandatory items-start"
                  : "overflow-visible justify-between items-center",
                "-ml-0"
              )}
            >
              {categories.map((category, index) => (
                <li
                  key={`${category.id}-${index}`}
                  className={cn(
                    // base
                    "px-1 sm:px-3 flex flex-col items-center",
                    // Si no es scrollable, dejamos que los items se expandan para evitar overflow
                    !isScrollable
                      ? "flex-1 min-w-0"
                      : // Si es scrollable, mantenemos anchos fijos para snap
                        "flex-shrink-0",
                    // Anchos por itemsPerView (solo relevantes cuando es scrollable)
                    isScrollable && itemsPerView === 1 && "w-36 sm:w-full",
                    isScrollable && itemsPerView === 2 && "w-32 sm:w-1/2",
                    isScrollable && itemsPerView === 3 && "w-40 sm:w-1/3",
                    isScrollable && itemsPerView === 4 && "w-40 sm:w-1/4",
                    // Si es scrollable, habilita snap
                    isScrollable && "snap-start"
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
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export type { Category, CategorySliderProps };
