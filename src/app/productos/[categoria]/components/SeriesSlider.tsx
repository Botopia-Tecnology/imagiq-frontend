/**
 * 🎢 SERIES SLIDER - Slider horizontal con series
 */

"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { SeriesItem } from "../config/series-configs";
import type { FilterState } from "../../components/FilterSidebar";

interface Props {
  readonly series: readonly SeriesItem[];
  readonly activeFilters: FilterState;
  readonly onSerieClick: (serieId: string) => void;
}

const ScrollButton = ({
  direction,
  onClick,
  visible
}: {
  direction: "left" | "right";
  onClick: () => void;
  visible: boolean;
}) => {
  if (!visible) return null;

  return (
    <button
      onClick={onClick}
      className="hidden md:block absolute top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all"
      style={{ [direction]: 0 }}
      type="button"
      aria-label={`Scroll ${direction}`}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
        />
      </svg>
    </button>
  );
};

export default function SeriesSlider({ series, activeFilters, onSerieClick }: Props) {
  const [hoveredSerie, setHoveredSerie] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft =
        direction === "left"
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const scrollContainer = scrollContainerRef.current;
    
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", updateScrollButtons);
      window.addEventListener("resize", updateScrollButtons);
      
      return () => {
        scrollContainer.removeEventListener("scroll", updateScrollButtons);
        window.removeEventListener("resize", updateScrollButtons);
      };
    }
  }, [series]);

  return (
    <div className="relative">
      <ScrollButton direction="left" onClick={() => scroll("left")} visible={canScrollLeft} />

      <div
        ref={scrollContainerRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {series.map((serie) => {
          const isActive = activeFilters.serie?.includes(serie.id) || false;

          return (
            <button
              key={serie.id}
              onClick={() => onSerieClick(serie.id)}
              onMouseEnter={() => setHoveredSerie(serie.id)}
              onMouseLeave={() => setHoveredSerie(null)}
              className={cn(
                "relative rounded-xl transition-all duration-300 flex-shrink-0",
                "flex items-center gap-3 sm:gap-4",
                "px-4 sm:px-5 py-3 sm:py-4",
                "min-w-[280px] max-w-[450px]",
                "min-h-[100px] sm:min-h-[110px] lg:min-h-[120px]",
                // Estilos cuando NO está activo
                !isActive && [
                  "bg-gray-100",
                  "hover:bg-[#EFEFEF]",
                  "hover:border-gray-300",
                  "hover:shadow-sm"
                ],
                // Estilos cuando SÍ está activo - SIMPLIFICADO
                isActive && [
                  "bg-white",
                  "border-2 border-black",
                  "shadow-lg"
                ]
              )}
              type="button"
              aria-pressed={isActive}
            >
              {serie.image ? (
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex-shrink-0">
                  <Image
                    src={serie.image}
                    alt={serie.name}
                    fill
                    className={cn(
                      "object-contain transition-transform duration-300",
                      (hoveredSerie === serie.id || isActive) && "scale-105"
                    )}
                    sizes="(max-width: 640px) 64px, (max-width: 1024px) 80px, 96px"
                    priority
                  />
                </div>
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-lg">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-300">
                    {serie.name.split(" ").map((w) => w.charAt(0)).join("")}
                  </span>
                </div>
              )}

              <h3
                className={cn(
                  "text-sm sm:text-base lg:text-lg font-bold",
                  "text-left leading-tight break-words",
                  isActive ? "text-black" : "text-gray-900"
                )}
                style={{ fontFamily: "'Samsung Sharp Sans', sans-serif" }}
              >
                {serie.name}
              </h3>
            </button>
          );
        })}
      </div>

      <ScrollButton direction="right" onClick={() => scroll("right")} visible={canScrollRight} />
    </div>
  );
}
