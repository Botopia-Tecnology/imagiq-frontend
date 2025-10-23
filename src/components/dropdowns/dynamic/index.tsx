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
  isMobile = false,
  onItemClick,
}: DynamicDropdownProps) {
  const handleClick = (label: string, href: string) => {
    posthogUtils.capture("dropdown_item_click", {
      category: categoryName,
      item: label,
      href,
    });
    onItemClick?.();
  };

  // Transformar los menús de la API a items
  const items = transformMenusToItems(menus, categoryCode);

  return isMobile ? (
    <MobileView items={items} categoryName={categoryName} onItemClick={handleClick} />
  ) : (
    <DesktopView items={items} categoryName={categoryName} onItemClick={handleClick} />
  );
}
