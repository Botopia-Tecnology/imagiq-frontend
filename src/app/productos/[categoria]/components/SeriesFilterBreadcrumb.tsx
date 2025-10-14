/**
 * 🧭 BREADCRUMB - Navegación de breadcrumb para series filter
 */

"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { SeriesFilterConfig } from "../config/series-configs";
import type { FilterState } from "../../components/FilterSidebar";

interface Props {
  readonly config: SeriesFilterConfig;
  readonly activeFilters: FilterState;
  readonly seccion: string;
  readonly showSectionDropdown: boolean;
  readonly showSeriesDropdown: boolean;
  readonly onToggleSectionDropdown: () => void;
  readonly onToggleSeriesDropdown: () => void;
  readonly onClearAllSeries: () => void;
  readonly onSerieClick: (serieId: string) => void;
  readonly sectionDropdownRef: React.RefObject<HTMLDivElement | null>;
  readonly seriesDropdownRef: React.RefObject<HTMLDivElement | null>;
}

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

export default function SeriesFilterBreadcrumb({
  config,
  activeFilters,
  seccion,
  showSectionDropdown,
  showSeriesDropdown,
  onToggleSectionDropdown,
  onToggleSeriesDropdown,
  onClearAllSeries,
  onSerieClick,
  sectionDropdownRef,
  seriesDropdownRef,
}: Props) {
  const router = useRouter();
  const hasSeries = config.series && config.series.length > 0;

  return (
    <nav className="flex items-center gap-2 mb-1.5 sm:mb-4 text-[10px] sm:text-sm text-gray-600 overflow-hidden max-w-full">
      <span className="hover:text-gray-900 cursor-pointer flex-shrink-0 truncate max-w-[100px] sm:max-w-[150px]">{config.breadcrumbCategory}</span>
      <span className="flex-shrink-0 mx-0.5">/</span>

      {/* Section Dropdown */}
      <div ref={sectionDropdownRef} className="relative flex-shrink min-w-0 max-w-[150px] sm:max-w-[200px]">
        <button
          onClick={onToggleSectionDropdown}
          className="hover:text-gray-900 font-medium flex items-center gap-1 w-full min-w-0"
          type="button"
        >
          <span className="truncate block overflow-hidden text-ellipsis whitespace-nowrap">{config.breadcrumbSection}</span>
          <span className="flex-shrink-0"><ChevronDownIcon /></span>
        </button>

        {showSectionDropdown && (
          <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 min-w-[240px]">
            {config.navigationLinks.map((link) => (
              <Link
                key={link.sectionId}
                href={link.href}
                onClick={() => {
                  onToggleSectionDropdown();
                  router.push(link.href);
                }}
                className={cn(
                  "block px-4 py-2 text-sm hover:bg-gray-100",
                  link.sectionId === seccion && "bg-gray-50 font-semibold border-l-4 border-black"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      <span className="flex-shrink-0 mx-0.5">/</span>

      {/* Series Dropdown o solo título */}
      {hasSeries ? (
        <div ref={seriesDropdownRef} className="relative flex-shrink min-w-0 max-w-[150px] sm:max-w-[250px]">
          <button
            onClick={onToggleSeriesDropdown}
            className="text-gray-900 font-medium flex items-center gap-1 hover:text-gray-700 w-full min-w-0"
            type="button"
          >
            <span className="truncate block overflow-hidden text-ellipsis whitespace-nowrap">{config.title}</span>
            <span className="flex-shrink-0"><ChevronDownIcon /></span>
          </button>

          {showSeriesDropdown && (
            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 min-w-[240px]">
              {config.series.map((serie) => {
                const isActive = activeFilters.serie?.includes(serie.id) || false;
                return (
                  <button
                    key={serie.id}
                    onClick={() => {
                      onSerieClick(serie.id);
                      onToggleSeriesDropdown();
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-between",
                      isActive && "bg-gray-50 font-semibold"
                    )}
                    type="button"
                  >
                    {serie.name}
                    {isActive && <CheckIcon />}
                  </button>
                );
              })}

              <div className="border-t border-gray-200 mt-2 pt-2">
                <button
                  onClick={() => {
                    onClearAllSeries();
                    onToggleSeriesDropdown();
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-between",
                    (!activeFilters.serie || activeFilters.serie.length === 0) && "bg-gray-50 font-semibold"
                  )}
                  type="button"
                >
                  {config.title}
                  {(!activeFilters.serie || activeFilters.serie.length === 0) && <CheckIcon />}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <span className="text-gray-900 font-medium truncate block overflow-hidden text-ellipsis whitespace-nowrap flex-shrink min-w-0 max-w-[150px] sm:max-w-[250px]">{config.title}</span>
      )}
    </nav>
  );
}
