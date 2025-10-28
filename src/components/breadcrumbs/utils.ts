import {
  CATEGORY_NAMES,
  SECTION_NAMES,
  SERIES_NAMES,
  STORAGE_NAMES,
  COLOR_NAMES,
} from "./constants";
import { BreadcrumbFilters } from "./types";

/**
 * Formats a URL slug into a human-readable name
 * First checks mappings, then falls back to title case
 */
export function formatSlugToName(slug: string): string {
  // Check category mappings
  if (CATEGORY_NAMES[slug]) {
    return CATEGORY_NAMES[slug];
  }

  // Check section mappings
  if (SECTION_NAMES[slug]) {
    return SECTION_NAMES[slug];
  }

  // Check series mappings
  if (SERIES_NAMES[slug]) {
    return SERIES_NAMES[slug];
  }

  // Check storage mappings
  if (STORAGE_NAMES[slug]) {
    return STORAGE_NAMES[slug];
  }

  // Check color mappings
  if (COLOR_NAMES[slug]) {
    return COLOR_NAMES[slug];
  }

  // Fallback: Convert slug to title case
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Builds a URL path by combining base path with filters
 * Preserves existing query params from basePath
 */
export function buildFilterPath(
  basePath: string,
  filters: BreadcrumbFilters,
  existingParams?: URLSearchParams
): string {
  const params = new URLSearchParams();

  // Preserve existing params (like seccion)
  if (existingParams) {
    existingParams.forEach((value, key) => {
      // Don't copy filter params, we'll set them explicitly
      if (key !== "serie" && key !== "almacenamiento" && key !== "color") {
        params.set(key, value);
      }
    });
  }

  if (filters.serie) {
    params.set("serie", filters.serie);
  }
  if (filters.almacenamiento) {
    params.set("almacenamiento", filters.almacenamiento);
  }
  if (filters.color) {
    params.set("color", filters.color);
  }

  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}

/**
 * Parses URL search params into BreadcrumbFilters
 */
export function parseFiltersFromParams(
  searchParams: URLSearchParams
): BreadcrumbFilters {
  return {
    serie: searchParams.get("serie") || undefined,
    almacenamiento: searchParams.get("almacenamiento") || undefined,
    color: searchParams.get("color") || undefined,
  };
}

/**
 * Checks if any filters are active
 */
export function hasActiveFilters(filters: BreadcrumbFilters): boolean {
  return Boolean(filters.serie || filters.almacenamiento || filters.color);
}

/**
 * Gets display name for a filter value
 */
export function getFilterDisplayName(
  filterType: keyof BreadcrumbFilters,
  value: string
): string {
  switch (filterType) {
    case "serie":
      return SERIES_NAMES[value] || formatSlugToName(value);
    case "almacenamiento":
      return STORAGE_NAMES[value] || formatSlugToName(value);
    case "color":
      return COLOR_NAMES[value] || formatSlugToName(value);
    default:
      return formatSlugToName(value);
  }
}
