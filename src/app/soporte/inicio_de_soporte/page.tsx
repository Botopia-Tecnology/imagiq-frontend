"use client";

import { HeroSection } from "@/components/sections/soporte/inicio-soporte/HeroSection";
import { SupportTopBar } from "@/components/sections/soporte/inicio-soporte/TopBar";
import { ProductsSection } from "@/components/sections/soporte/inicio-soporte/ProductsSection";
import { CarouselSection } from "@/components/sections/soporte/inicio-soporte/CarouselSection";
import { InfoCardsSection } from "@/components/sections/soporte/inicio-soporte/InfoCardsSection";
import { AdditionalInfoSection } from "@/components/sections/soporte/inicio-soporte/AdditionalInfoSection";
import { FeaturedCarousel } from "@/components/sections/soporte/inicio-soporte/FeaturedCarousel";
import { HowToSection } from "@/components/sections/soporte/inicio-soporte/HowToSection";
import { ContactInfoSection } from "@/components/sections/soporte/inicio-soporte/ContactInfoSection";

export default function InicioDeSoportePage() {
  return (
    <div className="min-h-screen bg-white">
      <SupportTopBar />
      <HeroSection />
      <ProductsSection />
      <CarouselSection />
      <InfoCardsSection />
      <AdditionalInfoSection />
      <FeaturedCarousel />
      <HowToSection />
      <ContactInfoSection />
    </div>
  );
}
