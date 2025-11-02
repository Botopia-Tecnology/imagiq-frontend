"use client";

import { HeroSection } from "@/components/sections/soporte/costo-reparacion/HeroSection";
import { SearchSection } from "@/components/sections/soporte/costo-reparacion/SearchSection";
import { InfoSection } from "@/components/sections/soporte/costo-reparacion/InfoSection";
import { ServiceRequestSection } from "@/components/sections/soporte/costo-reparacion/ServiceRequestSection";
import { ServicesSection } from "@/components/sections/soporte/costo-reparacion/ServicesSection";
import { CarouselSection } from "@/components/sections/soporte/costo-reparacion/CarouselSection";

export default function CostoDeReparacionPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <SearchSection />
      <InfoSection />
      <ServiceRequestSection />
      <ServicesSection />
      <CarouselSection />
    </div>
  );
}
