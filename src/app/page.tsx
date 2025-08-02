/**
 * 🏠 PÁGINA PRINCIPAL - IMAGIQ ECOMMERCE
 */

import { HeroSection } from "@/components/sections/HeroSection";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { CTASection } from "@/components/sections/CTASection";
import SEO from "@/components/SEO";

export default function HomePage() {
  return (
    <>
      <SEO
        title="Imagiq Store - Tu tienda online de confianza"
        description="Descubre productos de calidad: Outlet con hasta 70% OFF, Novedades, Recomendados y Ventas Corporativas. Envío gratis +$999"
        keywords="ecommerce, outlet, novedades, recomendados, ventas corporativas, soporte"
      />
      <div className="min-h-screen">
        <HeroSection />
        <CategoriesSection />
        <FeaturedProducts />
        <BenefitsSection />
        <TestimonialsSection />
        <CTASection />
      </div>
    </>
  );
}
