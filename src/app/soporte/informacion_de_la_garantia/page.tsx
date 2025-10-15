"use client";

import { HeroSection } from "@/components/sections/soporte/garantia/HeroSection";
import { WarrantyCategoriesSection } from "@/components/sections/soporte/garantia/WarrantyCategoriesSection";
import { WarrantyPolicySection } from "@/components/sections/soporte/garantia/WarrantyPolicySection";

export default function InformacionDeLaGarantiaPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <WarrantyCategoriesSection />
      <WarrantyPolicySection />
    </div>
  );
}
