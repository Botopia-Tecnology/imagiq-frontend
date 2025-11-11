/**
 * 🏠 PÁGINA PRINCIPAL - IMAGIQ ECOMMERCE
 */

"use client";

import HeroSection from "@/components/sections/HeroSection";
import GalaxyShowcaseBanner from "@/components/sections/GalaxyShowcaseBanner/index";
import AITVsBanner from "@/components/sections/AITVsBanner";
import DynamicBanner from "@/components/banners/DynamicBannerClean";
import TVProductsGrid from "@/components/sections/TVProductsGrid";
import BespokeAIBanner from "@/components/sections/BespokeAIBanner";
import AppliancesProductsGrid from "@/components/sections/AppliancesProductsGrid";
import Reviews from "@/components/sections/Reviews";
// import { CategoriesSection } from "@/components/sections/CategoriesSection";
// import { Ofertas } from "@/components/sections/Ofertas";
// import Beneficios from "@/components/sections/Beneficios";
import { CTASection } from "@/components/sections/CTASection";
import SEO from "@/components/SEO";
import LocationMap from "@/components/LocationMap";
import StoresCarousel from "@/components/StoresCarousel";
import ProductShowcase from "@/components/sections/ProductShowcase";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import CookieConsentBar from "@/components/CookieConsentBar";

export default function HomePage() {
  // Configuración para animaciones scroll reveal
  const heroReveal = useScrollReveal<HTMLDivElement>({
    offset: 100,
    duration: 700,
    direction: "up",
  });
  const galaxyShowcaseReveal = useScrollReveal<HTMLDivElement>({
    offset: 80,
    duration: 600,
    direction: "up",
  });
  const aiTVsReveal = useScrollReveal<HTMLDivElement>({
    offset: 80,
    duration: 600,
    direction: "up",
  });
  const bespokeAIReveal = useScrollReveal<HTMLDivElement>({
    offset: 80,
    duration: 600,
    direction: "up",
  });
  // const categoriesReveal = useScrollReveal<HTMLDivElement>({
  //   offset: 80,
  //   duration: 600,
  //   direction: "up",
  // });
  // const ofertasReveal = useScrollReveal<HTMLDivElement>({
  //   offset: 80,
  //   duration: 600,
  //   direction: "up",
  // });
  // const beneficiosReveal = useScrollReveal<HTMLDivElement>({
  //   offset: 80,
  //   duration: 600,
  //   direction: "up",
  // });
  const showcaseReveal = useScrollReveal<HTMLDivElement>({
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
  const carouselReveal = useScrollReveal<HTMLElement>({
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
      {/* Sin padding top para que el video empiece desde arriba y el navbar quede encima */}
      <div
        id="main-page"
        className="min-h-screen md:mr-0 md:overflow-x-clip"
      >
        <motion.div ref={heroReveal.ref} {...heroReveal.motionProps}>
          <HeroSection />
        </motion.div>
        <motion.div
          ref={galaxyShowcaseReveal.ref}
          {...galaxyShowcaseReveal.motionProps}
        >
          <DynamicBanner placement="home-2" className="mt-6 md:mt-8 lg:mt-12">
            <GalaxyShowcaseBanner />
          </DynamicBanner>
        </motion.div>
        <motion.div ref={showcaseReveal.ref} {...showcaseReveal.motionProps}>
          <ProductShowcase />
        </motion.div>
        <motion.div ref={aiTVsReveal.ref} {...aiTVsReveal.motionProps}>
          <DynamicBanner placement="home-3" className="mt-6 md:mt-8 lg:mt-12">
            <AITVsBanner />
          </DynamicBanner>
        </motion.div>
        <TVProductsGrid />
        <motion.div ref={bespokeAIReveal.ref} {...bespokeAIReveal.motionProps}>
          {/* Usar banner dinámico desde el placement "home-4".
              Si no hay banner en el API, renderizamos el fallback `BespokeAIBanner`. */}
          <DynamicBanner placement="home-4" className="mt-6 md:mt-8 lg:mt-12">
            <BespokeAIBanner />
          </DynamicBanner>
        </motion.div>
        <AppliancesProductsGrid />
        {/* <motion.div
          ref={categoriesReveal.ref}
          {...categoriesReveal.motionProps}
        >
          <CategoriesSection />
        </motion.div> */}
        {/* <motion.div ref={ofertasReveal.ref} {...ofertasReveal.motionProps}>
          <Ofertas />
        </motion.div>
        <motion.div
          ref={beneficiosReveal.ref}
          {...beneficiosReveal.motionProps}
        >
          <Beneficios />
        </motion.div> */}
        {/* Sección de reseñas de clientes - arriba del mapa */}
        <motion.section
          ref={reviewsReveal.ref}
          {...reviewsReveal.motionProps}
          id="reviews-slider"
          className="bg-white"
        >
          <Reviews />
        </motion.section>
        {/* Sección de carrusel de tiendas */}
        <motion.section
          ref={carouselReveal.ref}
          {...carouselReveal.motionProps}
          id="tiendas-carrusel"
          className="bg-white"
        >
          <StoresCarousel />
        </motion.section>
        {/* Sección de ubicaciones de tiendas - coincide exactamente con la imagen */}
        <motion.section
          ref={tiendasReveal.ref}
          {...tiendasReveal.motionProps}
          id="tiendas"
          className="py-2 bg-white"
        >
          <div className="container mx-auto px-6">
            <LocationMap />
          </div>
        </motion.section>
        <motion.div ref={ctaReveal.ref} {...ctaReveal.motionProps}>
          <CTASection />
        </motion.div>
      </div>
      <CookieConsentBar moreInfoUrl="/privacidad" />
    </>
  );
}
