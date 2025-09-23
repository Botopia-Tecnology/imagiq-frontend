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

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { posthogUtils } from "@/lib/posthogClient";
import { useDeviceType } from "@/components/responsive";

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

function DispositivosMovilesContent() {
  const searchParams = useSearchParams();
  const device = useDeviceType();

  // Prefetch manual de los bundles de las secciones (mount only)
  useEffect(() => {
    import("./Smartphones");
    import("./Relojes");
    import("./Tabletas");
    import("./GalaxyBuds");
    import("./Accesorios");
  }, []);

  // Derivar la sección activa directamente desde los query params
  const sectionParam = (searchParams.get("section") || "") as SectionType | "";
  const activeSection: SectionType = [
    "smartphones",
    "relojes",
    "tabletas",
    "buds",
    "accesorios",
  ].includes(sectionParam as SectionType)
    ? (sectionParam as SectionType)
    : "smartphones";

  // Tracking de vista de página cuando cambian los params o device
  useEffect(() => {
    posthogUtils.capture("page_view", {
      page: "dispositivos_moviles",
      section: sectionParam || activeSection,
      category: "productos",
      device,
    });
  }, [sectionParam, device, activeSection]);

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

  let devicePaddingClass = "px-0 py-0";
  if (device === "mobile") {
    devicePaddingClass = "px-2 py-2";
  } else if (device === "tablet") {
    devicePaddingClass = "px-4 py-4";
  }

  return (
    <div className={`bg-white min-h-screen ${devicePaddingClass}`}>
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
