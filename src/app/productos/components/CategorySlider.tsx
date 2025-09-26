"use client";
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Image, { StaticImageData } from "next/image";
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
  /** Cuando true, se hace compacto: logos más pequeños y sin textos */
  condensed?: boolean;
}

export default function CategorySlider({
  categories,
  onCategoryClick,
  trackingPrefix = "category",
  className,
  condensed = false,
}: Readonly<CategorySliderProps>) {
  const [itemsPerView, setItemsPerView] = useState(4);
  const sliderRef = useRef<HTMLUListElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const sectionParam = searchParams.get("section");
  const hash = typeof window !== "undefined" ? window.location.hash : "";

  const activeCategoryId = useMemo(() => {
    if (sectionParam) {
      const foundCategory = categories.find((cat) =>
        cat.href.includes(`section=${sectionParam}`)
      );
      if (foundCategory) return foundCategory.id;
    }
    if (hash) {
      const foundCategory = categories.find(
        (cat) => cat.href.startsWith("#") && cat.href === hash
      );
      if (foundCategory) return foundCategory.id;
    }
    return categories[0]?.id || "";
  }, [sectionParam, hash, categories]);

  // Responsive items per view
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) { setItemsPerView(1); setIsDesktop(false); }
      else if (w < 768) { setItemsPerView(2); setIsDesktop(false); }
      else if (w < 1024) { setItemsPerView(3); setIsDesktop(false); }
      else { setItemsPerView(4); setIsDesktop(true); }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const scrollByPage = useCallback((direction: 1 | -1) => {
    const el = sliderRef.current;
    if (!el) return;
    const page = el.clientWidth || 300;
    el.scrollBy({ left: direction * page, behavior: "smooth" });
  }, []);
  const scrollPrev = useCallback(() => scrollByPage(-1), [scrollByPage]);
  const scrollNext = useCallback(() => scrollByPage(1), [scrollByPage]);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const check = () => {
      if (isDesktop) {
        setIsScrollable(
          categories.length > itemsPerView || el.scrollWidth > el.clientWidth + 1
        );
      } else {
        setIsScrollable(el.scrollWidth > el.clientWidth + 1);
      }
    };
    check();

    const ro = new ResizeObserver(check);
    ro.observe(el);
    window.addEventListener("resize", check);

    const updateScrollState = () => {
      setCanScrollPrev(el.scrollLeft > 0);
      setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    const onKey = (e: KeyboardEvent) => {
      if (!isDesktop) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); scrollPrev(); }
      if (e.key === "ArrowRight") { e.preventDefault(); scrollNext(); }
    };

    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("keydown", onKey);
    updateScrollState();

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", check);
      el.removeEventListener("scroll", updateScrollState as EventListener);
      window.removeEventListener("keydown", onKey);
    };
  }, [categories, itemsPerView, isDesktop, scrollPrev, scrollNext]);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el || !activeCategoryId) return;

    const scrollToActive = () => {
      const idx = categories.findIndex((cat) => cat.id === activeCategoryId);
      if (idx === -1) return;

      if (isDesktop) {
        const containerWidth = el.clientWidth;
        const itemWidth = containerWidth / itemsPerView;
        const targetScrollLeft = idx * itemWidth;
        const current = el.scrollLeft;
        const visibleStart = current;
        const visibleEnd = current + containerWidth;
        const itemStart = targetScrollLeft;
        const itemEnd = targetScrollLeft + itemWidth;

        if (itemStart < visibleStart || itemEnd > visibleEnd) {
          el.scrollTo({ left: Math.max(0, targetScrollLeft - itemWidth / 2), behavior: "smooth" });
        }
      } else {
        const node = el.children[idx] as HTMLElement;
        if (node) node.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    };

    const t = setTimeout(scrollToActive, 100);
    return () => clearTimeout(t);
  }, [activeCategoryId, categories, isDesktop, itemsPerView]);

  const handleCategoryClick = (category: Category) => {
    posthogUtils.capture(`${trackingPrefix}_click`, {
      category_id: category.id,
      category_name: category.name,
      category_subtitle: category.subtitle,
    });
    if (onCategoryClick) onCategoryClick(category);
    else router.push(category.href);
  };

  /** ==== Tamaños / estilos RESPONSIVE ===== */
  const isMobile = !isDesktop;

  // 1) Círculo (más grande en móvil, y más chico si "condensed")
  const circleSize = condensed
    ? (isMobile ? "" : "w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16")
    : (isMobile ? "" : "w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-36 lg:h-36");

  // 2) Imagen interna (subo el tamaño base en móvil)
  const imgSize = condensed
    ? (isMobile ? 64 : (itemsPerView <= 2 ? 40 : 60))
    : (isMobile ? 88 : (itemsPerView <= 2 ? 90 : 150));

  // 3) Activo: se encoge con scroll; crece en vista normal
  const activeScale = condensed ? "scale-75" : "scale-[100%]";
  const activeRingClasses = condensed ? "ring-0" : "";

  // 4) Hover: sólo en no-condensed
  const hoverMotion = condensed ? "" : "hover:-translate-y-0.5";

  // 5) Espaciados: container más angosto en móvil y gutters mínimos en la lista
  const sectionPadding = "py-0";
  const listGap = condensed ? "gap-2 sm:gap-3 lg:gap-4" : "gap-4 sm:gap-6 lg:gap-8";
  const listPy = condensed ? "py-0" : "py-2";

  return (
    <section
      className={cn(
        "bg-white w-full transition-[padding,height] duration-200 -mt-px",
        sectionPadding,
        className
      )}
    >
      {/* ⬇️ Contenedor más angosto en móvil */}
      <div className="mx-auto w-full max-w-[92vw] sm:max-w-[640px] md:max-w-[860px] lg:max-w-[980px] xl:max-w-[1100px] 2xl:max-w-[1180px] px-2 sm:px-3 md:px-4">
        <div className="relative w-full">
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" className="h-5 w-5 text-gray-700">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                </svg>
              </button>

              <button
                onClick={scrollNext}
                aria-label="Siguiente"
                disabled={!canScrollNext}
                className={cn(
  "hidden lg:flex absolute -right-8 xl:-right-10 top-1/2 -translate-y-1/2 z-20 items-center justify-center rounded-full bg-white/90 p-2 shadow-md",
  !canScrollNext && "opacity-40 cursor-not-allowed"
)}

              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" className="h-5 w-5 text-gray-700">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </>
          )}

          <div className="w-full">
            <ul
              ref={sliderRef}
              className={cn(
                "flex no-scrollbar snap-x snap-mandatory items-start w-full transition-[gap,padding] duration-200",
                listGap,
                listPy,
                // gutters aún más angostos en móvil
                isScrollable ? "px-1 sm:px-2 lg:px-16 xl:px-20 2xl:px-24" : "",

                isDesktop && isScrollable ? "overflow-x-hidden" : "overflow-x-auto"
              )}
            >
              {categories.map((category, index) => (
                <li
                  key={`${category.id}-${index}`}
                  className={cn(
                    "px-0 sm:px-1 flex flex-col items-center transition-all duration-200",
                    "flex-shrink-0",
                    isScrollable ? "snap-center" : "snap-start"
                  )}
                  style={
                    isDesktop
                      ? ({ flex: `0 0 ${100 / itemsPerView}%`, maxWidth: `${100 / itemsPerView}%` } as React.CSSProperties)
                      : ({ flex: "0 0 auto", minWidth: condensed ? 76 : 108 } as React.CSSProperties)
                  }
                >
                  <button
                    onClick={() => handleCategoryClick(category)}
                    className={cn(
                      "relative flex items-center justify-center transition-all duration-200",
                      "transform-gpu will-change-transform origin-center",
                      "rounded-full category-circle cursor-pointer",
                      "overflow-hidden",
                      circleSize,
                      hoverMotion,
                      activeCategoryId === category.id
                        ? cn("bg-blue-500/30", activeRingClasses, activeScale)
                        : "bg-white hover:bg-white-100"
                    )}
                  >
                    <div className="flex items-center justify-center w-full h-full pointer-events-none">
                      <Image
                        src={category.image}
                        alt={`${category.name} ${category.subtitle}`}
                        width={imgSize}
                        height={imgSize}
                        className="object-contain object-center drop-shadow-lg transition-all duration-200"
                        priority={activeCategoryId === category.id}
                      />
                    </div>
                  </button>

                  {!condensed && (
                    <div className="text-center mt-2 sm:mt-2">
                      <div className="font-bold text-gray-900 text-[10px] sm:text-xs">
                        {category.name}
                      </div>
                      <div className="font-bold text-gray-900 text-[10px] sm:text-xs">
                        {category.subtitle}
                      </div>
                    </div>
                  )}
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
