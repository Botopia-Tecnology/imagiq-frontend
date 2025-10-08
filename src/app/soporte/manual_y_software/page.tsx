"use client";

import { HeroManuales } from "@/components/sections/soporte/manuales/HeroManuales";
import { SearchModelSection } from "@/components/sections/soporte/manuales/SearchModelSection";
import { CategorySelector } from "@/components/sections/soporte/manuales/CategorySelector";
import { ContactInfoSection } from "@/components/sections/soporte/manuales/ContactInfoManuales";

export default function ManualYSoftwarePage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroManuales />
      <SearchModelSection />
      <CategorySelector />
      <ContactInfoSection />
    </div>
  );
}
