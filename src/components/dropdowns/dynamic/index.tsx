"use client";

import { posthogUtils } from "@/lib/posthogClient";
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
  const handleClick = (label: string, href: string) => {
    posthogUtils.capture("dropdown_item_click", {
      category: categoryName,
      item: label,
      href,
    });
    onItemClick?.();
  };

  // Transformar los menús de la API a items con nombreVisible para generar slugs dinámicos
  const items = transformMenusToItems(menus, categoryCode, categoryVisibleName);

  return isMobile ? (
    <MobileView items={items} categoryName={categoryName} onItemClick={handleClick} loading={loading} />
  ) : (
    <DesktopView items={items} categoryName={categoryName} categoryCode={categoryCode} onItemClick={handleClick} loading={loading} />
  );
}
