/**
 * 📱 DISPOSITIVOS MÓVILES PAGE - IMAGIQ ECOMMERCE
 *
 * Página principal que gestiona las diferentes secciones de dispositivos móviles:
 * - Smartphones, Relojes, Tabletas, Galaxy Buds, Accesorios
 * - Navegación entre secciones
 * - Layout limpio y escalable
 * - Responsive global implementado
 */

"use client";

import { Suspense, lazy, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { posthogUtils } from "@/lib/posthogClient";
import { useDeviceType } from "@/components/responsive"; // Importa el hook responsive

const SmartphonesSection = lazy(() => import("./Smartphones"));
const RelojesSection = lazy(() => import("./Relojes"));
const TabletasSection = lazy(() => import("./Tabletas"));
const GalaxyBudsSection = lazy(() => import("./GalaxyBuds"));
const AccesoriosSection = lazy(() => import("./Accesorios"));

type SectionType = "smartphones" | "relojes" | "tabletas" | "buds" | "accesorios";

// Este componente usa useSearchParams y debe estar dentro de <Suspense>
function DispositivosMovilesContent() {
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState<SectionType>("smartphones");
  const device = useDeviceType();

  useEffect(() => {
    const section = searchParams.get("section") as SectionType;
    if (
      section &&
      ["smartphones", "relojes", "tabletas", "buds", "accesorios"].includes(section)
    ) {
      setActiveSection(section);
    }
    posthogUtils.capture("page_view", {
      page: "dispositivos_moviles",
      section: section || activeSection,
      category: "productos",
      device,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, device]);

  let SectionComponent;
  switch (activeSection) {
    case "smartphones":
      SectionComponent = SmartphonesSection;
      break;
    case "relojes":
      SectionComponent = RelojesSection;
      break;
    case "tabletas":
      SectionComponent = TabletasSection;
      break;
    case "buds":
      SectionComponent = GalaxyBudsSection;
      break;
    case "accesorios":
      SectionComponent = AccesoriosSection;
      break;
    default:
      SectionComponent = SmartphonesSection;
  }

  return (
    <div
      className={
        device === "mobile"
          ? "bg-white min-h-screen px-2 py-2"
          : device === "tablet"
          ? "bg-white min-h-screen px-4 py-4"
          : "bg-white min-h-screen px-0 py-0"
      }
    >
      <SectionComponent />
    </div>
  );
}

// El componente principal de la página debe envolver DispositivosMovilesContent en <Suspense>
export default function DispositivosMovilesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <DispositivosMovilesContent />
    </Suspense>
  );
}
