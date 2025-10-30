"use client";

import { useEffect } from "react";
import { posthogUtils } from "@/lib/posthogClient";
import { DesktopView } from "./DesktopView";
import { MobileView } from "./MobileView";

type SoporteDropdownProps = {
  isMobile?: boolean;
  onClose?: () => void;
};

export default function SoporteDropdown({ isMobile = false, onClose }: SoporteDropdownProps) {
  useEffect(() => {
    posthogUtils.capture("soporte_dropdown_opened", {
      device: isMobile ? "mobile" : "desktop",
    });
  }, [isMobile]);

  const handleItemClick = (label: string, href: string) => {
    posthogUtils.capture("soporte_dropdown_item_clicked", {
      item_name: label,
      item_href: href,
      device: isMobile ? "mobile" : "desktop",
    });

    // Cerrar el dropdown al hacer clic en un item
    window.dispatchEvent(new Event("close-dropdown"));
  };

  return isMobile ? (
    <MobileView onItemClick={handleItemClick} />
  ) : (
    <DesktopView onItemClick={handleItemClick} onClose={onClose} />
  );
}
