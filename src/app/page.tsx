/**
 * 🏠 PÁGINA PRINCIPAL - IMAGIQ ECOMMERCE
 *
 * Server Component con ISR (Incremental Static Regeneration)
 * Revalida cada 60 segundos para contenido actualizado
 */

import { Suspense } from "react";
import { getHomeProducts, getStores, getProductsByCategory } from "@/lib/api-server";
import { mapApiProductsToFrontend } from "@/lib/mappers/product-mapper";

// Server Components (sin "use client")
import SEO from "@/components/SEO";
import { CTASection } from "@/components/sections/CTASection";

// Client Components (necesitan interactividad)
import HeroSection from "@/components/sections/HeroSection";
import GalaxyShowcaseBanner from "@/components/sections/GalaxyShowcaseBanner/index";
import AITVsBanner from "@/components/sections/AITVsBanner";
import DynamicBanner from "@/components/banners/DynamicBannerClean";
import TVProductsGrid from "@/components/sections/TVProductsGrid";
import BespokeAIBanner from "@/components/sections/BespokeAIBanner";
import AppliancesProductsGrid from "@/components/sections/AppliancesProductsGrid";
import Reviews from "@/components/sections/Reviews";

// Componentes que reciben datos del servidor
import ProductShowcase from "@/components/sections/ProductShowcase";
import LocationMap from "@/components/LocationMap";
import StoresCarousel from "@/components/StoresCarousel";

// Skeletons para Suspense
import ProductShowcaseSkeleton from "@/components/sections/ProductShowcaseSkeleton";
import StoresCarouselSkeleton from "@/components/StoresCarouselSkeleton";

// Client wrapper para efectos del lado del cliente (scroll, etc.)
import HomePageClient from "./HomePageClient";

// ISR: regenerar cada 60 segundos
export const revalidate = 60;

export default async function HomePage() {
  // Fetch paralelo de datos en el servidor - más eficiente que CSR
  // Pedimos 50 productos de AV y 100 de DA para asegurar 4 con stock después del filtrado
  const [productsData, tvProductsData, appliancesData, stores] = await Promise.all([
    getHomeProducts(300).catch(() => ({
      products: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    })),
    getProductsByCategory("AV", undefined, undefined, 1, 50, "precio", "desc").catch(() => ({
      products: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    })),
    getProductsByCategory("DA", undefined, undefined, 1, 100, "precio", "desc").catch(() => ({
      products: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    })),
    getStores().catch(() => []),
  ]);

  // Helper para filtrar productos con stock > 0
  const hasStock = (p: any) => {
    const stockTotal = p.apiProduct?.stockTotal;
    if (Array.isArray(stockTotal)) {
      return stockTotal.some(stock => stock > 0);
    }
    return stockTotal ? stockTotal > 0 : false;
  };

  // Mapear productos de API a formato del frontend y filtrar por stock > 0
  // Tomar solo los primeros 4 con stock disponible
  const mappedProducts = productsData.products.length > 0
    ? mapApiProductsToFrontend(productsData.products).filter(hasStock)
    : [];

  const mappedTVProducts = tvProductsData.products.length > 0
    ? mapApiProductsToFrontend(tvProductsData.products).filter(hasStock).slice(0, 4)
    : [];

  const mappedAppliancesProducts = appliancesData.products.length > 0
    ? mapApiProductsToFrontend(appliancesData.products).filter(hasStock).slice(0, 4)
    : [];

  return (
    <>
      <SEO
        title="Imagiq - Distribuidor Oficial Samsung Colombia"
        description="Distribuidor oficial de Samsung en Colombia. Encuentra los últimos Galaxy, tablets, wearables y electrodomésticos con garantía oficial. Envío gratis, soporte especializado y las mejores promociones."
        keywords="Samsung Colombia, distribuidor oficial Samsung, Galaxy, Samsung Store, electrodomésticos Samsung, tablets Samsung, smartwatch Samsung, Galaxy Z Fold, Galaxy Z Flip, tienda Samsung Colombia"
      />

      <HomePageClient>
        <div id="main-page" className="min-h-screen md:mr-0 md:overflow-x-clip">
          <HeroSection />

          <DynamicBanner placement="home-2" className="mt-6 md:mt-8 lg:mt-12">
            <GalaxyShowcaseBanner />
          </DynamicBanner>

          {/* ProductShowcase con Suspense */}
          <Suspense fallback={<ProductShowcaseSkeleton />}>
            <ProductShowcase initialProducts={mappedProducts} />
          </Suspense>

          <DynamicBanner placement="home-3" className="mt-6 md:mt-8 lg:mt-12">
            <AITVsBanner />
          </DynamicBanner>

          <TVProductsGrid initialProducts={mappedTVProducts} />

          <DynamicBanner placement="home-4" className="mt-6 md:mt-8 lg:mt-12">
            <BespokeAIBanner />
          </DynamicBanner>

          <AppliancesProductsGrid initialProducts={mappedAppliancesProducts} />

          <section id="reviews-slider" className="bg-white">
            <Reviews />
          </section>

          {/* Carrusel de tiendas con datos del servidor */}
          <Suspense fallback={<StoresCarouselSkeleton />}>
            <section id="tiendas-carrusel" className="bg-white">
              <StoresCarousel initialStores={stores} />
            </section>
          </Suspense>

          {/* Mapa de tiendas con datos del servidor */}
          <section id="tiendas" className="py-2 bg-white">
            <div className="container mx-auto px-6">
              <LocationMap initialStores={stores} />
            </div>
          </section>

          <CTASection />
        </div>
      </HomePageClient>
    </>
  );
}
