"use client";

/**
 * @module SamsungPrivacyPage
 * @description Página de Política de Privacidad replicando exactamente Samsung Colombia
 */

import React, { useState, useRef } from "react";
import PrivacyHeader from "./privacy/PrivacyHeader";
import ColombianPolicy from "./privacy/ColombianPolicy";
import GlobalPolicyAccordion from "./privacy/GlobalPolicyAccordion";
import VersionControlTable from "./privacy/VersionControlTable";

interface SamsungPrivacyPageProps {
  onBack: () => void;
}

const SamsungPrivacyPage: React.FC<SamsungPrivacyPageProps> = ({ onBack }) => {
  const [expandedGlobalSection, setExpandedGlobalSection] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"colombia" | "global">("colombia");

  const colombianSectionRef = useRef<HTMLDivElement>(null);
  const globalSectionRef = useRef<HTMLDivElement>(null);

  const toggleGlobalSection = (index: number) => {
    setExpandedGlobalSection(expandedGlobalSection === index ? null : index);
  };

  const scrollToSection = (section: "colombia" | "global") => {
    setActiveTab(section);
    const ref = section === "colombia" ? colombianSectionRef : globalSectionRef;
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <PrivacyHeader onBack={onBack} />

      {/* Hero Banner */}
      <div className="w-full bg-gradient-to-r from-gray-900 to-blue-900 py-16 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
          Privacidad de Samsung
        </h1>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex border-b border-gray-300">
          <button
            onClick={() => scrollToSection("colombia")}
            className={`flex-1 py-4 text-center font-semibold transition-all ${
              activeTab === "colombia"
                ? "border-b-3 border-black text-black"
                : "text-gray-600 hover:text-black"
            }`}
          >
            POLÍTICA DE PRIVACIDAD DE SAMSUNG COLOMBIA
          </button>
          <button
            onClick={() => scrollToSection("global")}
            className={`flex-1 py-4 text-center font-semibold transition-all ${
              activeTab === "global"
                ? "border-b-3 border-black text-black"
                : "text-gray-600 hover:text-black"
            }`}
          >
            POLÍTICA DE PRIVACIDAD GLOBAL
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Parte 1: Política Colombiana */}
        <div ref={colombianSectionRef} className="mb-16 scroll-mt-20">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">
            POLÍTICA DE TRATAMIENTO DE INFORMACIÓN DE SAMSUNG ELECTRONICS COLOMBIA S.A.
          </h2>
          <ColombianPolicy />
          <div className="mt-12">
            <VersionControlTable />
          </div>
        </div>

        {/* Parte 2: Política Global */}
        <div ref={globalSectionRef} className="mb-12 scroll-mt-20">
          <h2 className="text-3xl font-bold text-black mb-4 text-center">
            POLÍTICA GLOBAL DE PRIVACIDAD SAMSUNG
          </h2>
          <p className="text-sm text-gray-600 mb-2 text-center">
            <strong>Fecha de Inicio de Vigencia:</strong> 28 de diciembre de 2022
          </p>
          <p className="text-gray-700 mb-8 leading-relaxed text-center">
            Aplica a todos dispositivos y servicios globales Samsung: teléfonos, tabletas,
            televisores, electrodomésticos y servicios en línea.
          </p>
          <GlobalPolicyAccordion
            expandedSection={expandedGlobalSection}
            onToggle={toggleGlobalSection}
          />
        </div>
      </div>
    </div>
  );
};

export default SamsungPrivacyPage;
