import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { BreadcrumbItem, BreadcrumbFilters } from "./types";
import {
  formatSlugToName,
  buildFilterPath,
  parseFiltersFromParams,
  getFilterDisplayName,
} from "./utils";

interface UseBreadcrumbsOptions {
  productName?: string;
  customItems?: BreadcrumbItem[];
}

/**
 * Hook to generate breadcrumb items based on current route and filters
 * @param options - Optional configuration for product name or custom items
 * @returns Array of breadcrumb items
 */
export function useBreadcrumbs(
  options: UseBreadcrumbsOptions = {}
): BreadcrumbItem[] {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { productName, customItems } = options;

  return useMemo(() => {
    const items: BreadcrumbItem[] = [
      {
        label: "Inicio",
        href: "/",
      },
    ];

    // If custom items provided, use them and skip auto-generation
    if (customItems && customItems.length > 0) {
      return [...items, ...customItems];
    }

    // Parse path segments
    const segments = pathname.split("/").filter(Boolean);

    // Handle productos routes
    if (segments[0] === "productos") {
      // Add category
      if (segments[1]) {
        const category = segments[1];
        const categoryPath = `/productos/${category}`;

        items.push({
          label: formatSlugToName(category),
          href: categoryPath,
        });

        // Get section (subsection) from query params
        const section = searchParams.get("seccion");

        // Add section/subsection if present (e.g., smartphones, tablets)
        if (section) {
          const sectionPath = `${categoryPath}?seccion=${section}`;
          items.push({
            label: formatSlugToName(section),
            href: sectionPath,
          });
        }

        // Parse filters from search params
        const filters = parseFiltersFromParams(searchParams);

        // Add filter breadcrumbs
        if (filters.serie) {
          const serieLabel = getFilterDisplayName("serie", filters.serie);
          const seriePath = buildFilterPath(
            categoryPath,
            {
              serie: filters.serie,
            },
            searchParams
          );

          items.push({
            label: serieLabel,
            href: seriePath,
          });

          // Add storage filter if present
          if (filters.almacenamiento) {
            const storageLabel = getFilterDisplayName(
              "almacenamiento",
              filters.almacenamiento
            );
            const storagePath = buildFilterPath(
              categoryPath,
              {
                serie: filters.serie,
                almacenamiento: filters.almacenamiento,
              },
              searchParams
            );

            items.push({
              label: storageLabel,
              href: storagePath,
            });

            // Add color filter if present
            if (filters.color) {
              const colorLabel = getFilterDisplayName("color", filters.color);
              const colorPath = buildFilterPath(
                categoryPath,
                {
                  serie: filters.serie,
                  almacenamiento: filters.almacenamiento,
                  color: filters.color,
                },
                searchParams
              );

              items.push({
                label: colorLabel,
                href: colorPath,
              });
            }
          } else if (filters.color) {
            // Color without storage
            const colorLabel = getFilterDisplayName("color", filters.color);
            const colorPath = buildFilterPath(
              categoryPath,
              {
                serie: filters.serie,
                color: filters.color,
              },
              searchParams
            );

            items.push({
              label: colorLabel,
              href: colorPath,
            });
          }
        } else {
          // No serie, but might have other filters
          if (filters.almacenamiento) {
            const storageLabel = getFilterDisplayName(
              "almacenamiento",
              filters.almacenamiento
            );
            const storagePath = buildFilterPath(
              categoryPath,
              {
                almacenamiento: filters.almacenamiento,
              },
              searchParams
            );

            items.push({
              label: storageLabel,
              href: storagePath,
            });
          }

          if (filters.color) {
            const colorLabel = getFilterDisplayName("color", filters.color);
            const colorPath = buildFilterPath(
              categoryPath,
              {
                almacenamiento: filters.almacenamiento,
                color: filters.color,
              },
              searchParams
            );

            items.push({
              label: colorLabel,
              href: colorPath,
            });
          }
        }

        // Handle product detail views
        if (segments[2] === "detalles-producto" || segments[2] === "viewpremium") {
          // Add product name if provided
          if (productName) {
            items.push({
              label: productName,
              href: undefined, // No link for current page
            });
          }
        }
      }
    }

    // Handle other routes (carrito, etc)
    if (segments[0] === "carrito") {
      items.push({
        label: "Carrito",
        href: "/carrito/step1",
      });

      // Add step if present
      if (segments[1]) {
        const stepNumber = segments[1].replace("step", "");
        items.push({
          label: `Paso ${stepNumber}`,
          href: undefined,
        });
      }
    }

    return items;
  }, [pathname, searchParams, productName, customItems]);
}
