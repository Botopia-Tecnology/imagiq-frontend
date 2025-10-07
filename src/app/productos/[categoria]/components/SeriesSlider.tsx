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
      className="absolute top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all"
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
                "relative rounded-lg transition-all duration-300 flex-shrink-0",
                "bg-[#F8F8F8] hover:bg-[#EFEFEF]",
                "px-5 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6",
                "border border-transparent hover:border-gray-300",
                "hover:scale-[1.02] hover:shadow-md",
                "flex items-center gap-4",
                "w-[280px] sm:w-[320px] lg:w-[360px]",
                "min-h-[100px] sm:min-h-[110px] lg:min-h-[120px]",
                isActive && "border-black bg-white shadow-lg scale-[1.02]"
              )}
              type="button"
            >
              {serie.image ? (
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex-shrink-0">
                  <Image
                    src={serie.image}
                    alt={serie.name}
                    fill
                    className={cn(
                      "object-contain transition-transform duration-300",
                      hoveredSerie === serie.id && "scale-105"
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
                  "text-base sm:text-lg lg:text-xl font-bold flex-1 min-w-0",
                  "break-words leading-tight",
                  isActive ? "text-black" : "text-gray-900"
                )}
                style={{ fontFamily: "'Samsung Sharp Sans', sans-serif" }}
              >
                {serie.name}
              </h3>

              <div
                className={cn(
                  "absolute bottom-0 left-0 right-0 h-0.5 bg-black transition-all",
                  isActive ? "opacity-100" : "opacity-0"
                )}
              />
            </button>
          );
        })}
      </div>

      <ScrollButton direction="right" onClick={() => scroll("right")} visible={canScrollRight} />
    </div>
  );
}
