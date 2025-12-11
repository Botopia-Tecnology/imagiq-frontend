"use client";

import ServicioTecnicoDropdownDesktop from "./servicio_tecnico/ServicioTecnicoDropdownDesktop";
import ServicioTecnicoDropdownMobile from "./servicio_tecnico/ServicioTecnicoDropdownMobile";
import { posthogUtils } from "@/lib/posthogClient";

interface ServicioTecnicoDropdownProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

export default function ServicioTecnicoDropdown({
  isMobile = false,
  onItemClick,
}: ServicioTecnicoDropdownProps) {
  const handleClick = (label: string, href: string) => {
    posthogUtils.capture("dropdown_item_click", {
      category: "Servicio Técnico",
      item: label,
      href,
    });

    // Cerrar el dropdown al hacer clic en un item
    window.dispatchEvent(new Event("close-dropdown"));

    onItemClick?.();
  };

  return isMobile ? (
    <ServicioTecnicoDropdownMobile onItemClick={handleClick} />
  ) : (
    <ServicioTecnicoDropdownDesktop onItemClick={handleClick} />
  );
}
