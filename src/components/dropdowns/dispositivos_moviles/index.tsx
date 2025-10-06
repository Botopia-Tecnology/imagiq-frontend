"use client";

import { posthogUtils } from "@/lib/posthogClient";
import type { DropdownProps } from "./types";
import { MobileView } from "./MobileView";
import { DesktopView } from "./DesktopView";

export default function DispositivosMovilesDropdown({
  isMobile = false,
  onItemClick,
}: DropdownProps) {
  const handleClick = (label: string, href: string) => {
    posthogUtils.capture("dropdown_item_click", {
      category: "Dispositivos móviles",
      item: label,
      href,
    });
    onItemClick?.();
  };

  return isMobile ? (
    <MobileView onItemClick={handleClick} />
  ) : (
    <DesktopView onItemClick={handleClick} />
  );
}
