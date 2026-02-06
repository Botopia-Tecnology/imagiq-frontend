"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import {
  categoriesEndpoints,
  type VisibleCategoryComplete,
  type Menu,
  type Submenu,
} from "@/lib/api";
import { toSlug } from "@/app/productos/[categoria]/utils/slugUtils";
import type { BreadcrumbItem } from "@/components/breadcrumbs/types";

// Metadata types for lookups
interface CategoryMetadata {
  uuid: string;
  code: string; // "IM", "AV", etc.
  displayName: string; // "Dispositivos móviles"
  slug: string; // "dispositivos-moviles"
}

interface MenuMetadata {
  uuid: string;
  code: string;
  displayName: string;
  slug: string;
  categoryCode: string;
  categorySlug: string;
}

interface SubmenuMetadata {
  uuid: string;
  code: string;
  displayName: string;
  slug: string;
  menuUuid: string;
  menuSlug: string;
  categoryCode: string;
  categorySlug: string;
}

interface CategoryMetadataContextValue {
  // State
  isReady: boolean;
  isLoading: boolean;
  error: string | null;

  // Category lookups
  getCategoryDisplayName: (codeOrSlug: string) => string;
  getCategorySlug: (code: string) => string;
  getCategoryBySlug: (slug: string) => CategoryMetadata | undefined;

  // Menu lookups
  getMenuDisplayName: (menuUuidOrSlug: string) => string;
  getMenuSlug: (menuUuid: string) => string;

  // Submenu lookups
  getSubmenuDisplayName: (submenuUuid: string) => string;
  getSubmenuSlug: (submenuUuid: string) => string;

  // Breadcrumb builder
  buildDynamicBreadcrumbs: (
    productId: string,
    categoryCode?: string,
    subcategoria?: string,
    menuUuid?: string,
    submenuUuid?: string
  ) => BreadcrumbItem[];

  // Full data access (for advanced use cases)
  categories: VisibleCategoryComplete[];
}

const CategoryMetadataContext = createContext<
  CategoryMetadataContextValue | undefined
>(undefined);

export function CategoryMetadataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, setCategories] = useState<VisibleCategoryComplete[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Build lookup maps from categories data
  const { categoryMap, categoryBySlugMap, menuMap, menuBySlugMap, submenuMap } =
    useMemo(() => {
      const catMap = new Map<string, CategoryMetadata>();
      const catBySlugMap = new Map<string, CategoryMetadata>();
      const mnuMap = new Map<string, MenuMetadata>();
      const mnuBySlugMap = new Map<string, MenuMetadata>();
      const subMap = new Map<string, SubmenuMetadata>();

      categories.forEach((category) => {
        const categorySlug = toSlug(category.nombreVisible || category.nombre);
        const categoryMeta: CategoryMetadata = {
          uuid: category.uuid,
          code: category.nombre,
          displayName: category.nombreVisible || category.nombre,
          slug: categorySlug,
        };

        // Map by code (uppercase like "IM")
        catMap.set(category.nombre.toUpperCase(), categoryMeta);
        // Also map by lowercase for flexibility
        catMap.set(category.nombre.toLowerCase(), categoryMeta);
        // Map by slug for reverse lookups
        catBySlugMap.set(categorySlug, categoryMeta);

        category.menus?.forEach((menu: Menu) => {
          const menuSlug = toSlug(menu.nombreVisible || menu.nombre);
          const menuMeta: MenuMetadata = {
            uuid: menu.uuid,
            code: menu.nombre,
            displayName: menu.nombreVisible || menu.nombre,
            slug: menuSlug,
            categoryCode: category.nombre,
            categorySlug: categorySlug,
          };

          // Map by UUID
          mnuMap.set(menu.uuid, menuMeta);
          // Map by nombre (code)
          mnuMap.set(menu.nombre.toUpperCase(), menuMeta);
          mnuMap.set(menu.nombre.toLowerCase(), menuMeta);
          // Map by slug (with category context for disambiguation)
          mnuBySlugMap.set(`${categorySlug}/${menuSlug}`, menuMeta);
          // Also map by slug alone (last one wins if duplicates)
          mnuBySlugMap.set(menuSlug, menuMeta);

          menu.submenus?.forEach((submenu: Submenu) => {
            const submenuSlug = toSlug(
              submenu.nombreVisible || submenu.nombre
            );
            const submenuMeta: SubmenuMetadata = {
              uuid: submenu.uuid,
              code: submenu.nombre,
              displayName: submenu.nombreVisible || submenu.nombre,
              slug: submenuSlug,
              menuUuid: menu.uuid,
              menuSlug: menuSlug,
              categoryCode: category.nombre,
              categorySlug: categorySlug,
            };

            // Map by UUID
            subMap.set(submenu.uuid, submenuMeta);
            // Map by nombre (code)
            subMap.set(submenu.nombre.toUpperCase(), submenuMeta);
            subMap.set(submenu.nombre.toLowerCase(), submenuMeta);
          });
        });
      });

      return {
        categoryMap: catMap,
        categoryBySlugMap: catBySlugMap,
        menuMap: mnuMap,
        menuBySlugMap: mnuBySlugMap,
        submenuMap: subMap,
      };
    }, [categories]);

  // Load categories on mount
  useEffect(() => {
    let mounted = true;

    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const response = await categoriesEndpoints.getCompleteCategories();

        if (mounted) {
          if (response.success && response.data) {
            setCategories(response.data);
            setError(null);
          } else {
            setError(response.message || "Error loading category metadata");
          }
        }
      } catch (err) {
        if (mounted) {
          setError("Failed to load category metadata");
          console.error("[CategoryMetadataProvider] Load error:", err);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  // Helper function for slug -> title fallback
  const formatSlugAsTitle = useCallback((slug: string): string => {
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, []);

  // Lookup functions with fallbacks
  const getCategoryDisplayName = useCallback(
    (codeOrSlug: string): string => {
      if (!codeOrSlug) return "";

      // Try by code first (uppercase)
      const byCode = categoryMap.get(codeOrSlug.toUpperCase());
      if (byCode) return byCode.displayName;

      // Try by slug
      const bySlug = categoryBySlugMap.get(codeOrSlug.toLowerCase());
      if (bySlug) return bySlug.displayName;

      // Fallback: format slug as title
      return formatSlugAsTitle(codeOrSlug);
    },
    [categoryMap, categoryBySlugMap, formatSlugAsTitle]
  );

  const getCategorySlug = useCallback(
    (code: string): string => {
      if (!code) return "";
      const meta = categoryMap.get(code.toUpperCase());
      return meta?.slug || toSlug(code);
    },
    [categoryMap]
  );

  const getCategoryBySlug = useCallback(
    (slug: string): CategoryMetadata | undefined => {
      return categoryBySlugMap.get(slug.toLowerCase());
    },
    [categoryBySlugMap]
  );

  const getMenuDisplayName = useCallback(
    (menuUuidOrSlug: string): string => {
      if (!menuUuidOrSlug) return "";

      // Try by UUID first
      const byUuid = menuMap.get(menuUuidOrSlug);
      if (byUuid) return byUuid.displayName;

      // Try by slug
      const bySlug = menuBySlugMap.get(menuUuidOrSlug.toLowerCase());
      if (bySlug) return bySlug.displayName;

      return formatSlugAsTitle(menuUuidOrSlug);
    },
    [menuMap, menuBySlugMap, formatSlugAsTitle]
  );

  const getMenuSlug = useCallback(
    (menuUuid: string): string => {
      if (!menuUuid) return "";
      const meta = menuMap.get(menuUuid);
      return meta?.slug || toSlug(menuUuid);
    },
    [menuMap]
  );

  const getSubmenuDisplayName = useCallback(
    (submenuUuid: string): string => {
      if (!submenuUuid) return "";
      const meta = submenuMap.get(submenuUuid);
      return meta?.displayName || formatSlugAsTitle(submenuUuid);
    },
    [submenuMap, formatSlugAsTitle]
  );

  const getSubmenuSlug = useCallback(
    (submenuUuid: string): string => {
      if (!submenuUuid) return "";
      const meta = submenuMap.get(submenuUuid);
      return meta?.slug || toSlug(submenuUuid);
    },
    [submenuMap]
  );

  // Build breadcrumbs dynamically from product data
  const buildDynamicBreadcrumbs = useCallback(
    (
      productId: string,
      categoryCode?: string,
      subcategoria?: string,
      menuUuid?: string,
      submenuUuid?: string
    ): BreadcrumbItem[] => {
      const items: BreadcrumbItem[] = [];

      // Add category
      if (categoryCode) {
        const categorySlug = getCategorySlug(categoryCode);
        const categoryName = getCategoryDisplayName(categoryCode);
        items.push({
          label: categoryName,
          href: `/productos/${categorySlug}`,
        });

        // Try to add menu/submenu if available
        if (menuUuid) {
          const menuMeta = menuMap.get(menuUuid);
          if (menuMeta) {
            items.push({
              label: menuMeta.displayName,
              href: `/productos/${categorySlug}?seccion=${menuMeta.slug}`,
            });

            // Add submenu if present
            if (submenuUuid) {
              const submenuMeta = submenuMap.get(submenuUuid);
              if (submenuMeta) {
                items.push({
                  label: submenuMeta.displayName,
                  href: `/productos/${categorySlug}?seccion=${menuMeta.slug}&subseccion=${submenuMeta.slug}`,
                });
              }
            }
          }
        } else if (subcategoria) {
          // Fallback: try to find menu by subcategoria name
          const menuMeta = menuMap.get(subcategoria.toUpperCase()) ||
                          menuMap.get(subcategoria.toLowerCase());
          if (menuMeta) {
            items.push({
              label: menuMeta.displayName,
              href: `/productos/${categorySlug}?seccion=${menuMeta.slug}`,
            });
          } else if (subcategoria) {
            // Last resort: use subcategoria as-is with slug conversion
            const submenuSlug = toSlug(subcategoria);
            items.push({
              label: subcategoria,
              href: `/productos/${categorySlug}?seccion=${submenuSlug}`,
            });
          }
        }
      }

      // Add product ID as final item (no link)
      items.push({
        label: productId,
        href: undefined,
      });

      return items;
    },
    [getCategorySlug, getCategoryDisplayName, menuMap, submenuMap]
  );

  const value: CategoryMetadataContextValue = useMemo(
    () => ({
      isReady: !isLoading && categories.length > 0,
      isLoading,
      error,
      getCategoryDisplayName,
      getCategorySlug,
      getCategoryBySlug,
      getMenuDisplayName,
      getMenuSlug,
      getSubmenuDisplayName,
      getSubmenuSlug,
      buildDynamicBreadcrumbs,
      categories,
    }),
    [
      isLoading,
      error,
      categories,
      getCategoryDisplayName,
      getCategorySlug,
      getCategoryBySlug,
      getMenuDisplayName,
      getMenuSlug,
      getSubmenuDisplayName,
      getSubmenuSlug,
      buildDynamicBreadcrumbs,
    ]
  );

  return (
    <CategoryMetadataContext.Provider value={value}>
      {children}
    </CategoryMetadataContext.Provider>
  );
}

/**
 * Hook to consume the CategoryMetadata context
 * Throws if used outside of CategoryMetadataProvider
 */
export function useCategoryMetadata(): CategoryMetadataContextValue {
  const context = useContext(CategoryMetadataContext);
  if (!context) {
    throw new Error(
      "useCategoryMetadata must be used within CategoryMetadataProvider"
    );
  }
  return context;
}

/**
 * Optional hook that returns undefined if outside provider
 * Useful for components that can work with or without the provider
 */
export function useCategoryMetadataOptional():
  | CategoryMetadataContextValue
  | undefined {
  return useContext(CategoryMetadataContext);
}
