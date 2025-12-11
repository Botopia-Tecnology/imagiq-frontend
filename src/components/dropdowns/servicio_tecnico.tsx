"use client";

import ServicioTecnicoDropdownDesktop from "./servicio_tecnico/ServicioTecnicoDropdownDesktop";
import ServicioTecnicoDropdownMobile from "./servicio_tecnico/ServicioTecnicoDropdownMobile";

interface ServicioTecnicoDropdownProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

export default function ServicioTecnicoDropdown({
  isMobile = false,
  onItemClick,
}: ServicioTecnicoDropdownProps) {
  return isMobile ? (
    <ServicioTecnicoDropdownMobile onItemClick={onItemClick} />
  ) : (
    <ServicioTecnicoDropdownDesktop />
  );
}
