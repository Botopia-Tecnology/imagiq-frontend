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

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";

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
  const [isDesktop, setIsDesktop] = useState(true);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Detecta la sección activa desde la URL
  const sectionParam = searchParams.get("section");
  // Obtén el hash solo en cliente
  const hash = typeof window !== "undefined" ? window.location.hash : "";

  // Busca la categoría activa según el parámetro de la URL o el hash
  const activeCategoryId = useMemo(() => {
    if (sectionParam) {
      // Busca por el parámetro de sección específico
      const foundCategory = categories.find(cat =>
        cat.href.includes(`section=${sectionParam}`)
      );
      if (foundCategory) return foundCategory.id;
    }

    if (hash) {
      // Busca por hash
      const foundCategory = categories.find(cat =>
        cat.href.startsWith("#") && cat.href === hash
      );
      if (foundCategory) return foundCategory.id;
    }

    // Por defecto, primera categoría
    return categories[0]?.id || "";
  }, [sectionParam, hash, categories]);

  // Configuración responsive para items por vista
  React.useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsPerView(1); // móvil: 1 item
        setIsDesktop(false);
      } else if (width < 768) {
        setItemsPerView(2); // tablet pequeña: 2 items
        setIsDesktop(false);
      } else if (width < 1024) {
        setItemsPerView(3); // tablet: 3 items
        setIsDesktop(false);
      } else {
        setItemsPerView(4); // desktop: 4 items
        setIsDesktop(true);
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  // Helpers to slide by a page (clientWidth) — used only on desktop
  const scrollByPage = useCallback((direction: 1 | -1) => {
    const el = sliderRef.current;
    if (!el) return;
    const page = el.clientWidth || 300;
    el.scrollBy({ left: direction * page, behavior: "smooth" });
  }, []);

  const scrollPrev = useCallback(() => scrollByPage(-1), [scrollByPage]);
  const scrollNext = useCallback(() => scrollByPage(1), [scrollByPage]);

  // Detecta si el contenedor desborda (activar scroll horizontal solo si es necesario)
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const check = () => {
      // scrollWidth > clientWidth => hay overflow horizontal
      // En desktop consideramos que hay scroll si el número de categorías
      // es mayor que itemsPerView (ej. 5 > 4) o si scrollWidth > clientWidth
      if (isDesktop) {
        setIsScrollable(
          categories.length > itemsPerView ||
            el.scrollWidth > el.clientWidth + 1
        );
      } else {
        setIsScrollable(el.scrollWidth > el.clientWidth + 1);
      }
    };

    // Initial check
    check();

    // Observa cambios de tamaño del contenedor y del contenido
    const ro = new ResizeObserver(check);
    ro.observe(el);

    // También re-evalúa en resize de ventana por si cambia el layout
    window.addEventListener("resize", check);

    // También actualiza los estados de scroll (para botones prev/next)
    const updateScrollState = () => {
      setCanScrollPrev(el.scrollLeft > 0);
      setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    // Keyboard navigation en desktop
    const onKey = (e: KeyboardEvent) => {
      if (!isDesktop) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollPrev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollNext();
      }
    };

    // Escucha el evento scroll para actualizar los botones
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("keydown", onKey);
    // initial
    updateScrollState();

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", check);
      el.removeEventListener("scroll", updateScrollState as EventListener);
      window.removeEventListener("keydown", onKey);
    };
  }, [categories, itemsPerView, isDesktop, scrollPrev, scrollNext]);

  // Auto-scroll hacia la categoría activa cuando cambie
  useEffect(() => {
    const el = sliderRef.current;
    if (!el || !activeCategoryId) return;

    const scrollToActiveCategory = () => {
      const activeIndex = categories.findIndex(cat => cat.id === activeCategoryId);
      if (activeIndex === -1) return;

      // En desktop, calculamos la posición basada en el ancho del contenedor
      if (isDesktop) {
        const containerWidth = el.clientWidth;
        const itemWidth = containerWidth / itemsPerView;
        const targetScrollLeft = activeIndex * itemWidth;

        // Solo hacer scroll si la categoría activa no está visible
        const currentScrollLeft = el.scrollLeft;
        const visibleStart = currentScrollLeft;
        const visibleEnd = currentScrollLeft + containerWidth;
        const itemStart = targetScrollLeft;
        const itemEnd = targetScrollLeft + itemWidth;

        if (itemStart < visibleStart || itemEnd > visibleEnd) {
          el.scrollTo({
            left: Math.max(0, targetScrollLeft - itemWidth / 2),
            behavior: "smooth"
          });
        }
      } else {
        // En móvil/tablet, scroll hacia el elemento específico
        const activeElement = el.children[activeIndex] as HTMLElement;
        if (activeElement) {
          activeElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center"
          });
        }
      }
    };

    // Pequeño delay para asegurar que el DOM esté renderizado
    const timer = setTimeout(scrollToActiveCategory, 100);
    return () => clearTimeout(timer);
  }, [activeCategoryId, categories, isDesktop, itemsPerView]);

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
      <div className="container mx-auto px-6">
        <div className="relative w-full">
          {/* Flechas visibles en desktop cuando el slider tiene overflow */}
          {isDesktop && isScrollable && (
            <>
              <button
                onClick={scrollPrev}
                aria-label="Anterior"
                disabled={!canScrollPrev}
                className={cn(
                  "hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 items-center justify-center rounded-full bg-white/90 p-2 shadow-md",
                  !canScrollPrev && "opacity-40 cursor-not-allowed"
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="h-5 w-5 text-gray-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={scrollNext}
                aria-label="Siguiente"
                disabled={!canScrollNext}
                className={cn(
                  "hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 items-center justify-center rounded-full bg-white/90 p-2 shadow-md",
                  !canScrollNext && "opacity-40 cursor-not-allowed"
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="h-5 w-5 text-gray-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}
          {/* Navegación por scroll horizontal únicamente - botones eliminados */}

          {/* Contenedor de categorías */}
          {/* En móviles permitimos scroll horizontal y tamaños más pequeños, sin margen lateral (a ras de pantalla) */}
          <div className="w-full">
            <ul
              ref={sliderRef}
              // Si mostramos flechas (desktop + isScrollable) desactivamos scroll nativo
              className={cn(
                "flex gap-4 sm:gap-6 lg:gap-8 py-2 no-scrollbar snap-x snap-mandatory items-start w-full",
                // lateral padding cuando hay scroll para que los elementos no queden cortados en los bordes
                isScrollable ? "px-4 sm:px-6" : "",
                isDesktop && isScrollable
                  ? "overflow-x-hidden"
                  : "overflow-x-auto"
              )}
              onWheel={(e) => {
                // Si las flechas están visibles, bloqueamos el desplazamiento horizontal del mouse
                if (isDesktop && isScrollable) {
                  // permitimos scroll vertical si el usuario intenta desplazarse verticalmente
                  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                    e.preventDefault();
                  }
                }
              }}
              onTouchMove={(e) => {
                if (isDesktop && isScrollable) {
                  // bloquear el touchmove horizontal en desktop cuando las flechas están activas
                  const touch = e.touches?.[0];
                  if (touch) {
                    // No hacemos nada sofisticado aquí — prevenir el scroll para evitar solapamientos
                    e.preventDefault();
                  }
                }
              }}
            >
              {categories.map((category, index) => (
                <li
                  key={`${category.id}-${index}`}
                  className={cn(
                    // base
                    "px-1 sm:px-3 flex flex-col items-center",
                    // En móvil/tablet dejamos que los items no se encojan para evitar solapamientos
                    "flex-shrink-0",
                    // Snap: si hay overflow queremos centrar los items al hacer snap
                    isScrollable ? "snap-center" : "snap-start"
                  )}
                  // En desktop forzamos el ancho para que siempre quepan como máximo `itemsPerView` items
                  style={
                    isDesktop
                      ? ({
                          flex: `0 0 ${100 / itemsPerView}%`,
                          maxWidth: `${100 / itemsPerView}%`,
                        } as React.CSSProperties)
                      : ({
                          flex: "0 0 auto",
                          minWidth: 110,
                        } as React.CSSProperties)
                  }
                >
                  <button
                    onClick={() => handleCategoryClick(category)}
                    className={cn(
                      "relative flex items-center justify-center transition-all duration-300 hover:-translate-y-1",
                      "rounded-full category-circle cursor-pointer",
                      "overflow-hidden",
                      // Tamaños reducidos en móvil para que se muestren todos (w/h explícitos)
                      "w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-36 lg:h-36",
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
