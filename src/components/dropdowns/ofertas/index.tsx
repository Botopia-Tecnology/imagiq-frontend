"use client";

import { posthogUtils } from "@/lib/posthogClient";
import type { DropdownProps } from "./types";
import { MobileView } from "./MobileView";
import { DesktopView } from "./DesktopView";

export default function OfertasDropdown({
  isMobile = false,
  onItemClick,
}: DropdownProps) {
  const handleClick = (label: string, href: string) => {
    posthogUtils.capture("dropdown_item_click", {
      category: "Ofertas",
      item: label,
      href,
    });

    // Cerrar el dropdown al hacer clic en un item
    window.dispatchEvent(new Event("close-dropdown"));

    onItemClick?.();
  };

  return isMobile ? (
    <MobileView onItemClick={handleClick} />
  ) : (
    <DesktopView onItemClick={handleClick} />
  );
}
