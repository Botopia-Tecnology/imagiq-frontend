"use client";

import { posthogUtils } from "@/lib/posthogClient";
import { useAnalytics } from "@/lib/analytics/hooks/useAnalytics";
import type { DynamicDropdownProps } from "./types";
import { MobileView } from "./MobileView";
import { DesktopView } from "./DesktopView";
import { transformMenusToItems } from "./utils";

export default function DynamicDropdown({
  menus,
  categoryName,
  categoryCode,
  categoryVisibleName,
  isMobile = false,
  onItemClick,
  loading = false,
}: DynamicDropdownProps) {
  const { trackCategoryClick } = useAnalytics();

  const handleClick = (label: string, href: string) => {
    // 🔥 Track Category Click Event para GA4
    trackCategoryClick(
      `${categoryName}-${label}`.toLowerCase().replace(/\s+/g, "-"),
      label
    );

    posthogUtils.capture("dropdown_item_click", {
      category: categoryName,
      item: label,
      href,
    });

    // Cerrar el dropdown al hacer clic en un item
    window.dispatchEvent(new Event("close-dropdown"));

    onItemClick?.();
  };

  // Transformar los menús de la API a items con nombreVisible para generar slugs dinámicos
  const items = transformMenusToItems(menus, categoryCode, categoryVisibleName);

  return isMobile ? (
    <MobileView
      items={items}
      categoryName={categoryName}
      onItemClick={handleClick}
      loading={loading}
    />
  ) : (
    <DesktopView
      items={items}
      categoryName={categoryName}
      categoryCode={categoryCode}
      onItemClick={handleClick}
      loading={loading}
    />
  );
}
