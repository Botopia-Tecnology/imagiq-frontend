/**
 * 🏠 PÁGINA PRINCIPAL - IMAGIQ ECOMMERCE
 */

import HeroSection from "@/components/sections/HeroSection";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { Ofertas } from "@/components/sections/Ofertas";
import Beneficios from "@/components/sections/Beneficios";
import { CTASection } from "@/components/sections/CTASection";
import SEO from "@/components/SEO";
import { LocationMap } from "@/components/LocationMap";
import UltimosProductos from "@/components/sections/UltimosProductos";

export default function HomePage() {
  return (
    <>
      <SEO
        title="Imagiq Store - Tu tienda online de confianza"
        description="Descubre productos de calidad: Outlet con hasta 70% OFF, Novedades, Recomendados y Ventas Corporativas. Envío gratis +$999"
        keywords="ecommerce, outlet, novedades, recomendados, ventas corporativas, soporte"
      />
      {/* pt-16 en móvil si hay scroll y navbar sticky, pt-0 en desktop */}
      <div id="main-page" className="min-h-screen md:mr-0 pt-20 md:pt-0">
        <HeroSection />
        <CategoriesSection />
        <Ofertas />
        <Beneficios />
        <UltimosProductos />
        {/* Sección de ubicaciones de tiendas - coincide exactamente con la imagen */}
        <section id="tiendas" className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <LocationMap />
          </div>
        </section>
        <CTASection />
      </div>
    </>
  );
}
