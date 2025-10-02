/**
 * 📦 PRODUCTOS CATEGORIZADOS PAGE - IMAGIQ ECOMMERCE
 *
 * Página dinámica que maneja diferentes categorías de productos:
 * - Electrodomésticos, Dispositivos Móviles, TVs, Audio
 * - Sistema estandarizado para obtener productos de BD
 * - Navegación entre secciones por categoría
 * - Layout responsive y escalable
 */

"use client";

import { useEffect, Suspense, use } from "react";
import { useSearchParams } from "next/navigation";
import { posthogUtils } from "@/lib/posthogClient";
import { useDeviceType } from "@/components/responsive";

import { CategoriaParams, Seccion } from "./types";
import { isValidCategory } from "./utils/categoryUtils";
import {
  DEFAULT_SECTION,
  isValidSectionForCategory,
  getSectionTitle,
} from "./constants/categoryConstants";

// Importar componentes de categoría dinámicamente
import CategorySection from "./components/CategorySection";
import OfertasSection from "./components/OfertasSection";

interface CategoriaPageContentProps {
  readonly categoria: CategoriaParams;
}

function CategoriaPageContent({ categoria }: CategoriaPageContentProps) {
  const searchParams = useSearchParams();
  const device = useDeviceType();

  // Obtener la sección de los query params
  const seccionParam = searchParams?.get("seccion");
  
  // Verificar si es una página de ofertas
  const isOfertasPage = categoria === "ofertas";

  // Validar y obtener sección activa
  const activeSection =
    seccionParam && isValidSectionForCategory(categoria, seccionParam)
      ? (seccionParam as Seccion)
      : DEFAULT_SECTION[categoria];

  // Tracking de vista de página
  useEffect(() => {
    posthogUtils.capture("page_view", {
      page: "productos_categoria",
      categoria,
      section: activeSection,
      device,
    });
  }, [categoria, activeSection, device]);

  // Padding responsivo
  let devicePaddingClass = "px-0 py-0";
  if (device === "mobile") {
    devicePaddingClass = "px-2 py-2";
  } else if (device === "tablet") {
    devicePaddingClass = "px-4 py-4";
  }

  // Si es página de ofertas, mostrar componente especial
  if (isOfertasPage) {
    return (
      <div className={`bg-white min-h-screen ${devicePaddingClass}`}>
        <OfertasSection seccion={seccionParam} />
      </div>
    );
  }

  return (
    <div className={`bg-white min-h-screen ${devicePaddingClass}`}>
      <CategorySection
        categoria={categoria}
        seccion={activeSection}
        sectionTitle={getSectionTitle(activeSection)}
      />
    </div>
  );
}

// Componente de loading para el Suspense boundary
function CategoriaPageLoading() {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );
}

export default function Page({
  params,
}: Readonly<{ params: Promise<{ categoria: CategoriaParams }> }>) {
  const { categoria } = use(params);

  // Validar que la categoría existe (incluyendo ofertas)
  if (!isValidCategory(categoria) && categoria !== "ofertas") {
    return (
      <main className="px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error: La categoría &quot;{categoria}&quot; no existe
          </h1>
          <p className="text-gray-600">
            Las categorías disponibles son: electrodomestico, moviles, tvs,
            audio, ofertas
          </p>
        </div>
      </main>
    );
  }

  return (
    <Suspense fallback={<CategoriaPageLoading />}>
      <CategoriaPageContent categoria={categoria} />
    </Suspense>
  );
}
