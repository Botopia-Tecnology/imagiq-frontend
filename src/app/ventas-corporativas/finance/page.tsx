/**
 * 💼 PÁGINA FINANCIERO - VENTAS CORPORATIVAS
 * Página completa para servicios financieros con topbar secundario y modal de contacto
 */

"use client";

import React from "react";
import SecondaryNavbar, {
  NavItem,
} from "@/components/sections/ventas-corporativas/SecondaryNavbar";
import HeroSection from "@/components/sections/ventas-corporativas/shared/HeroSection";
import ContactSection from "@/components/sections/ventas-corporativas/shared/ContactSection";
import { ValuesSection } from "@/components/sections/ventas-corporativas/finance";
import SpecializedConsultationModal from "@/components/sections/ventas-corporativas/SpecializedConsultationModal";
import { SECTION_IMAGES } from "@/constants/hero-images";
import { useIndustryModal } from "@/hooks/useIndustryModal";

const NAV_ITEMS: NavItem[] = [
  { id: "caracteristicas", label: "Características", href: "#hero" },
  { id: "valores", label: "Nuestros valores", href: "#valores" },
];

export default function FinancePage() {
  const {
    isModalOpen,
    isSubmitting,
    handleContactClick,
    handleModalClose,
    handleFormSubmit,
  } = useIndustryModal("Financiero");

  return (
    <main className="min-h-screen">
      <SecondaryNavbar
        items={NAV_ITEMS}
        onContactClick={handleContactClick}
        brandLabel="Financiero"
      />

      <HeroSection
        publicId={SECTION_IMAGES.finance.hero}
        alt="Samsung para Servicios Financieros"
        subtitle="Tecnología de vanguardia para instituciones financieras"
      />

      <ValuesSection />

      <ContactSection
        onContactClick={handleContactClick}
        title="¿Listo para transformar tu institución financiera?"
        description="Descubre cómo Samsung puede ayudar a modernizar tus servicios financieros con tecnología segura y confiable."
        gradientFrom="from-purple-600"
        gradientVia="via-indigo-600"
        gradientTo="to-blue-700"
        buttonTextColor="text-purple-600"
      />

      <SpecializedConsultationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
      />
    </main>
  );
}
