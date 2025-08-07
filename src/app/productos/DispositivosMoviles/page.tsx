/**
 * 📱 DISPOSITIVOS MÓVILES PAGE - IMAGIQ ECOMMERCE
 *
 * Página principal que gestiona las diferentes secciones de dispositivos móviles:
 * - Smartphones, Relojes, Tabletas, Galaxy Buds, Accesorios
 * - Navegación entre secciones
 * - Layout limpio y escalable
 */

"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { posthogUtils } from "@/lib/posthogClient";
import SmartphonesSection from "./Smartphones";
import RelojesSection from "./Relojes";
import TabletasSection from "./Tabletas";
import GalaxyBudsSection from "./GalaxyBuds";
import AccesoriosSection from "./Accesorios";

type SectionType =
  | "smartphones"
  | "relojes"
  | "tabletas"
  | "buds"
  | "accesorios";

export default function DispositivosMovilesPage() {
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] =
    useState<SectionType>("smartphones");

  useEffect(() => {
    // Determinar sección activa basada en URL params
    const section = searchParams.get("section") as SectionType;
    if (
      section &&
      ["smartphones", "relojes", "tabletas", "buds", "accesorios"].includes(
        section
      )
    ) {
      setActiveSection(section);
    }

    posthogUtils.capture("page_view", {
      page: "dispositivos_moviles",
      section: activeSection,
      category: "productos",
    });
  }, [searchParams, activeSection]);

  const renderActiveSection = () => {
    switch (activeSection) {
      case "smartphones":
        return <SmartphonesSection />;
      case "relojes":
        return <RelojesSection />;
      case "tabletas":
        return <TabletasSection />;
      case "buds":
        return <GalaxyBudsSection />;
      case "accesorios":
        return <AccesoriosSection />;
      default:
        return <SmartphonesSection />;
    }
  };

  return <div className="min-h-screen bg-white">{renderActiveSection()}</div>;
}
