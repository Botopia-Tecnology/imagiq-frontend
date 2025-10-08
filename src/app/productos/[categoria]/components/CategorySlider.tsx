"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Image, { StaticImageData } from "next/image";
import { cn } from "@/lib/utils";

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
  activeCategoryId?: string;
  className?: string;
  condensed?: boolean;
}

export default function CategorySlider({
  categories,
  onCategoryClick,
  activeCategoryId,
  className,
  condensed = false,
}: CategorySliderProps) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Check if we're on desktop
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Check scroll state
  const checkScrollState = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    checkScrollState();
    el.addEventListener("scroll", checkScrollState, { passive: true });

    return () => el.removeEventListener("scroll", checkScrollState);
  }, [checkScrollState, categories]);

  // Scroll functions
  const scrollLeft = () => {
    const el = sliderRef.current;
    if (!el) return;
    el.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    const el = sliderRef.current;
    if (!el) return;
    el.scrollBy({ left: 200, behavior: "smooth" });
  };

  // Handle category click
  const handleCategoryClick = (category: Category) => {
    if (onCategoryClick) {
      onCategoryClick(category);
    }
  };

  // Determine if we need arrows (when content is scrollable)
  const needsArrows = canScrollLeft || canScrollRight;

  return (
    <div className={cn("relative", className)}>
      {/* Left Arrow */}
      {needsArrows && canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 -bottom-10 -translate-y-1/2 z-20 bg-white/90 rounded-full p-2 shadow-md hover:bg-white transition-colors"
          aria-label="Scroll left"
        >
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Right Arrow */}
      {needsArrows && canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-0 -bottom-10 -translate-y-1/2 z-20 bg-white/90 rounded-full p-2 shadow-md hover:bg-white transition-colors"
          aria-label="Scroll right"
        >
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}

      {/* Slider Container */}
      <div
        ref={sliderRef}
        className={cn(
          "flex overflow-x-auto scrollbar-hide scroll-smooth transition-all duration-300",
          condensed ? "gap-6" : "gap-12",
          isDesktop ? "px-8" : "px-4",
          needsArrows ? "justify-start" : "justify-center"
        )}
      >
        {categories.map((category) => {
          const isActive = activeCategoryId === category.id;

          return (
            <button
              key={category.id}
              className={cn(
                "flex flex-col items-center flex-shrink-0 transition-all duration-200 bg-transparent border-none p-0",
                isDesktop ? "min-w-[120px]" : "min-w-[80px]"
              )}
              onClick={() => handleCategoryClick(category)}
            >
              {/* Category Circle */}
              <div
                className={cn(
                  "relative rounded-full border-2 transition-all duration-300 flex items-center justify-center",
                  condensed
                    ? "w-16 h-16"
                    : isDesktop
                    ? "w-28 h-28"
                    : "w-20 h-20",
                  isActive
                    ? "border-blue-500 bg-blue-50 shadow-lg"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 scale-90"
                )}
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  width={condensed ? 42 : isDesktop ? 60 : 52}
                  height={condensed ? 42 : isDesktop ? 60 : 52}
                  className="object-contain"
                />
              </div>

              {/* Category Text */}
              {!condensed && (
                <div className="text-center mt-2 max-w-[100px] transition-opacity duration-300">
                  <div
                    className={cn(
                      "font-semibold text-xs leading-tight",
                      isActive ? "text-blue-600" : "text-gray-700"
                    )}
                  >
                    {category.name}
                  </div>
                  {category.subtitle && (
                    <div
                      className={cn(
                        "text-xs leading-tight",
                        isActive ? "text-blue-500" : "text-gray-500"
                      )}
                    >
                      {category.subtitle}
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export type { Category };
