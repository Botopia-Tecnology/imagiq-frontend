/**
 * 🏠 PÁGINA PRINCIPAL - IMAGIQ ECOMMERCE
 */

"use client";

import HeroSection from "@/components/sections/HeroSection";
import Reviews from "@/components/sections/Reviews";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { Ofertas } from "@/components/sections/Ofertas";
import Beneficios from "@/components/sections/Beneficios";
import { CTASection } from "@/components/sections/CTASection";
import SEO from "@/components/SEO";
import LocationMap from "@/components/LocationMap";
import UltimosProductos from "@/components/sections/UltimosProductos";
import ProductShowcase from "@/components/sections/ProductShowcase";
import Historias from "@/components/sections/Historias";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function HomePage() {
  // Configuración para animaciones scroll reveal
  const heroReveal = useScrollReveal<HTMLDivElement>({
    offset: 100,
    duration: 700,
    direction: "up",
  });
  const categoriesReveal = useScrollReveal<HTMLDivElement>({
    offset: 80,
    duration: 600,
    direction: "up",
  });
  const ofertasReveal = useScrollReveal<HTMLDivElement>({
    offset: 80,
    duration: 600,
    direction: "up",
  });
  const beneficiosReveal = useScrollReveal<HTMLDivElement>({
    offset: 80,
    duration: 600,
    direction: "up",
  });
  const showcaseReveal = useScrollReveal<HTMLDivElement>({
    offset: 80,
    duration: 600,
    direction: "up",
  });
  const historiasReveal = useScrollReveal<HTMLDivElement>({
    offset: 80,
    duration: 600,
    direction: "up",
  });
  const ultimosReveal = useScrollReveal<HTMLDivElement>({
    offset: 80,
    duration: 600,
    direction: "up",
  });
  const reviewsReveal = useScrollReveal<HTMLElement>({
    offset: 80,
    duration: 600,
    direction: "up",
  });
  const tiendasReveal = useScrollReveal<HTMLElement>({
    offset: 80,
    duration: 600,
    direction: "up",
  });
  const ctaReveal = useScrollReveal<HTMLDivElement>({
    offset: 80,
    duration: 600,
    direction: "up",
  });

  return (
    <>
      <SEO
        title="Imagiq Store - Tu tienda online de confianza"
        description="Descubre productos de calidad: Outlet con hasta 70% OFF, Novedades, Recomendados y Ventas Corporativas. Envío gratis +$999"
        keywords="ecommerce, outlet, novedades, recomendados, ventas corporativas, soporte"
      />
      {/* pt-16 en móvil si hay scroll y navbar sticky, pt-0 en desktop */}
      <div
        id="main-page"
        className="min-h-screen md:mr-0 pt-20 md:pt-0 md:overflow-x-clip"
      >
        <motion.div ref={heroReveal.ref} {...heroReveal.motionProps}>
          <HeroSection />
        </motion.div>
        <motion.div
          ref={categoriesReveal.ref}
          {...categoriesReveal.motionProps}
        >
          <CategoriesSection />
        </motion.div>
        <motion.div ref={ofertasReveal.ref} {...ofertasReveal.motionProps}>
          <Ofertas />
        </motion.div>
        <motion.div
          ref={beneficiosReveal.ref}
          {...beneficiosReveal.motionProps}
        >
          <Beneficios />
        </motion.div>
        <motion.div ref={showcaseReveal.ref} {...showcaseReveal.motionProps}>
          <ProductShowcase />
        </motion.div>
        {/* Sección de Historias justo debajo de ProductShowcase */}
        <motion.div ref={historiasReveal.ref} {...historiasReveal.motionProps}>
          <Historias />
        </motion.div>
        <motion.div ref={ultimosReveal.ref} {...ultimosReveal.motionProps}>
          <UltimosProductos />
        </motion.div>
        {/* Sección de reseñas de clientes - arriba del mapa */}
        <motion.section
          ref={reviewsReveal.ref}
          {...reviewsReveal.motionProps}
          id="reviews-slider"
          className="bg-white"
        >
          <Reviews />
        </motion.section>
        {/* Sección de ubicaciones de tiendas - coincide exactamente con la imagen */}
        <motion.section
          ref={tiendasReveal.ref}
          {...tiendasReveal.motionProps}
          id="tiendas"
          className="py-16 bg-white"
        >
          <div className="container mx-auto px-6">
            <LocationMap />
          </div>
        </motion.section>
        <motion.div ref={ctaReveal.ref} {...ctaReveal.motionProps}>
          <CTASection />
        </motion.div>
      </div>
    </>
  );
}
