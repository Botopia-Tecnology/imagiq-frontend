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

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { posthogUtils } from "@/lib/posthogClient";
import { useDeviceType } from "@/components/responsive";

import SmartphonesSection from "./Smartphones";
import RelojesSection from "./Relojes";
import TabletasSection from "./Tabletas";
import GalaxyBudsSection from "./GalaxyBuds";
import AccesoriosSection from "./Accesorios";

type SectionType = "smartphones" | "relojes" | "tabletas" | "buds" | "accesorios";

function DispositivosMovilesContent() {
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState<SectionType>("smartphones");
  const device = useDeviceType();

  useEffect(() => {
    // Prefetch manual de los bundles de las secciones
    import("./Smartphones");
    import("./Relojes");
    import("./Tabletas");
    import("./GalaxyBuds");
    import("./Accesorios");

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

// Componente de loading para el Suspense boundary
function DispositivosMovilesLoading() {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );
}

export default function DispositivosMovilesPage() {
  return (
    <Suspense fallback={<DispositivosMovilesLoading />}>
      <DispositivosMovilesContent />
    </Suspense>
  );
}
