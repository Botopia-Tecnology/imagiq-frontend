/**
 * 🏠 ELECTRODOMÉSTICOS PAGE - IMAGIQ ECOMMERCE
 *
 * Página principal que gestiona las diferentes secciones de electrodomésticos:
 * - Refrigeradores, Lavadoras, Lavavajillas, Hornos, Aspiradoras
 * - Navegación entre secciones mediante parámetros de URL
 * - Suspense para mejor UX durante cargas
 */

"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { posthogUtils } from "@/lib/posthogClient";
import RefrigeradoresSection from "./Refrigeradores";
import LavadorasSection from "./Lavadoras";
import LavavajillasSection from "./Lavavajillas";
import HornosSection from "./Hornos";
import AspiradorasSection from "./Aspiradoras";
import MicroondasSection from "./Microondas";
import AireAcondicionadoSection from "./AireAcondicionado";
import CategoriesSection from "./CategoriesSection";

type SectionType =
  | "refrigeradores"
  | "lavadoras"
  | "lavavajillas"
  | "hornos"
  | "aspiradoras"
  | "microondas"
  | "aire-acondicionado"
  | "categorias";

function ElectrodomesticosContent() {
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState<SectionType>("categorias");

  useEffect(() => {
    // Determinar sección activa basada en URL params
    const section = searchParams.get("section") as SectionType;
    if (
      section &&
      [
        "refrigeradores",
        "lavadoras",
        "lavavajillas",
        "hornos",
        "aspiradoras",
        "microondas",
        "aire-acondicionado",
      ].includes(section)
    ) {
      setActiveSection(section);
    }

    posthogUtils.capture("page_view", {
      page: "electrodomesticos",
      section: activeSection,
      category: "productos",
    });
  }, [searchParams, activeSection]);

  const renderActiveSection = () => {
    switch (activeSection) {
      case "refrigeradores":
        return <RefrigeradoresSection />;
      case "lavadoras":
        return <LavadorasSection />;
      case "lavavajillas":
        return <LavavajillasSection />;
      case "hornos":
        return <HornosSection />;
      case "aspiradoras":
        return <AspiradorasSection />;
      case "microondas":
        return <MicroondasSection />;
      case "aire-acondicionado":
        return <AireAcondicionadoSection />;
      default:
        return <CategoriesSection />;
    }
  };

  return <div className="min-h-screen bg-white">{renderActiveSection()}</div>;
}

export default function ElectrodomesticosPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando electrodomésticos...</p>
          </div>
        </div>
      }
    >
      <ElectrodomesticosContent />
    </Suspense>
  );
}
