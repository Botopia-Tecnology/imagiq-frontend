/**
 * 📺 TELEVISORES Y AV PAGE - IMAGIQ ECOMMERCE
 *
 * Página principal que gestiona las diferentes secciones de televisores y audio:
 * - Crystal UHD, QLED TV, Smart TV, Barras de Sonido, Sistemas de Audio
 * - Navegación entre secciones
 * - Layout limpio y escalable
 * - Replica exactamente la estructura de dispositivos móviles
 */

"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { posthogUtils } from "@/lib/posthogClient";
import CrystalUhdSection from "./CrystalUhd";
import QledTvSection from "./QledTv";
import SmartTvSection from "./SmartTv";
import BarrasSonidoSection from "./BarrasSonido";
import SistemasAudiosSection from "./SistemasAudios";

type SectionType =
  | "crystal-uhd"
  | "qled-tv"
  | "smart-tv"
  | "barras-sonido"
  | "sistemas-audio";

function TelevisoresContent() {
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] =
    useState<SectionType>("crystal-uhd");

  useEffect(() => {
    // Determinar sección activa basada en URL params
    const section = searchParams.get("section") as SectionType;
    if (
      section &&
      [
        "crystal-uhd",
        "qled-tv",
        "smart-tv",
        "barras-sonido",
        "sistemas-audio",
      ].includes(section)
    ) {
      setActiveSection(section);
    }

    posthogUtils.capture("page_view", {
      page: "televisores_av",
      section: activeSection,
      category: "productos",
    });
  }, [searchParams, activeSection]);

  const renderActiveSection = () => {
    switch (activeSection) {
      case "crystal-uhd":
        return <CrystalUhdSection />;
      case "qled-tv":
        return <QledTvSection />;
      case "smart-tv":
        return <SmartTvSection />;
      case "barras-sonido":
        return <BarrasSonidoSection />;
      case "sistemas-audio":
        return <SistemasAudiosSection />;
      default:
        return <CrystalUhdSection />;
    }
  };

  return <div className="min-h-screen bg-white">{renderActiveSection()}</div>;
}

export default function TelevisoresPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando productos...</p>
          </div>
        </div>
      }
    >
      <TelevisoresContent />
    </Suspense>
  );
}