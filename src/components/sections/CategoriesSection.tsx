/**
 * 📂 CATEGORIES SECTION - IMAGIQ ECOMMERCE
 *
 * Sección de categorías principales con:
 * - Grid de categorías destacadas
 * - Links a las secciones del navbar
 * - Tracking de interacciones
 * - Diseño idéntico a Samsung Store
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { posthogUtils } from "@/lib/posthogClient";

// Importar las imágenes reales de categorías
import smartphoneImage from "../../img/categorias/Smartphones.png";
import tabletImage from "../../img/categorias/Tabletas.png";
import ElectrodomesticosImage from "../../img/categorias/Electrodomesticos.png";
import monitorImage from "../../img/categorias/Tv_Monitores.png";

// Datos de las categorías con las rutas correctas
const categories = [
  {
    id: 1,
    title: "Smartphones",
    image: smartphoneImage,
    href: "/productos/dispositivos-moviles?seccion=smartphones",
    description: "Los últimos Galaxy y más",
  },
  {
    id: 2,
    title: "Tabletas",
    image: tabletImage,
    href: "/productos/dispositivos-moviles?seccion=tabletas",
    description: "Galaxy Tab para trabajo y entretenimiento",
  },
  {
    id: 3,
    title: "Electrodomésticos",
    image: ElectrodomesticosImage,
    href: "/tienda/electrodomesticos",
    description: "Innovación para el hogar",
  },
  {
    id: 4,
    title: "TV y Monitores",
    image: monitorImage,
    href: "/tienda/televisores",
    description: "Experiencia visual incomparable",
  },
];

export const CategoriesSection = () => {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

  const handleCategoryClick = (category: (typeof categories)[0]) => {
    posthogUtils.capture("category_card_click", {
      category_name: category.title,
      category_href: category.href,
      source: "categories_section",
    });
  };

  return (
    // Responsive optimizado eliminando porcentajes problemáticos:
    // mt-[-280px]: iPhone SE, Galaxy S8+ (móviles pequeños)
    // sm:mt-[-320px]: iPhone 6/7/8 Plus (móviles medianos)
    // md:mt-[-200px]: Surface Duo, iPad Portrait (tablets pequeños)
    // lg:mt-[-120px]: iPad Landscape (tablets grandes)
    // xl:mt-0: Desktop (escritorio)
    // Valores fijos más estables para mejor control visual
    <section className="py-22 bg-transparent md:bg-white mt-[-280px] sm:mt-[-320px] md:mt-[-200px] lg:mt-[-120px] xl:mt-0 relative z-[100] md:z-auto">
      <div className="container mx-auto px-0 md:px-8 max-w-7xl">
        {/* Grid/Carrusel de categorías - Optimizado para móviles e iPad */}
        <div className="block lg:hidden">
          <div
            className="flex flex-row gap-3 overflow-x-auto pb-2 scrollbar-hide items-end w-full max-w-[375px] sm:max-w-[420px] md:max-w-[640px] lg:max-w-[768px] mx-auto px-2"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {categories.map((category) => (
              <Link
                key={category.id}
                href={category.href}
                onClick={() => handleCategoryClick(category)}
                className="group min-w-[110px] max-w-[110px] sm:min-w-[120px] sm:max-w-[120px] md:min-w-[140px] md:max-w-[140px] flex-shrink-0 mx-0"
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div
                  className={cn(
                    "relative rounded-xl p-2 pt-3 pb-2 transition-all duration-300 shadow-sm hover:shadow-lg",
                    "transform hover:scale-105 cursor-pointer"
                  )}
                  style={{ backgroundColor: "#D6E3F3" }}
                >
                  {/* Título de la categoría - Responsive overflow fix */}
                  <div className="text-center mb-1 w-full max-w-full overflow-hidden">
                    <h3
                      className="text-xs font-bold text-gray-800 transition-colors duration-300 group-hover:text-blue-700 truncate break-words leading-tight max-w-full"
                      style={{ fontFamily: "'Samsung Sharp Sans', sans-serif" }}
                      title={category.title}
                    >
                      {category.title}
                    </h3>
                  </div>
                  {/* Imagen del producto real */}
                  <div className="flex justify-center items-center h-12 sm:h-14 md:h-16 mb-1">
                    <div className="relative w-full h-full">
                      <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        className={cn(
                          "object-contain transition-transform duration-300",
                          hoveredCategory === category.id && "scale-110"
                        )}
                        sizes="(max-width: 640px) 110px, (max-width: 768px) 140px, (max-width: 1024px) 31vw"
                        priority={category.id <= 2}
                      />
                    </div>
                  </div>
                  {/* Overlay con efecto hover */}
                  <div
                    className={cn(
                      "absolute inset-0 rounded-xl bg-blue-600/10 opacity-0 transition-opacity duration-300",
                      hoveredCategory === category.id && "opacity-100"
                    )}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
        {/* Desktop y tablet grande: grid original */}
        <div className="hidden lg:grid grid-cols-2 xl:grid-cols-4 gap-8 xl:gap-12 justify-center">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              onClick={() => handleCategoryClick(category)}
              className="group flex justify-center"
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <div
                className={cn(
                  "relative rounded-2xl p-8 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-105 cursor-pointer overflow-hidden max-w-[260px] w-full flex flex-col items-center"
                )}
                style={{ backgroundColor: "#D6E3F3" }}
              >
                {/* Título de la categoría */}
                <div className="w-full pt-4 pb-2 text-center">
                  <h3
                    className="text-lg font-bold text-gray-800 transition-colors duration-300 group-hover:text-blue-700 text-center truncate"
                    style={{ fontFamily: "'Samsung Sharp Sans', sans-serif" }}
                    title={category.title}
                  >
                    {category.title}
                  </h3>
                </div>

                {/* Imagen del producto real */}
                <div className="flex justify-center items-center w-full mb-4">
                  <div className="relative w-full h-[160px] flex justify-center items-center">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className={cn(
                        "object-contain transition-transform duration-300 max-h-[160px] w-auto",
                        hoveredCategory === category.id && "scale-110"
                      )}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      priority={category.id <= 2}
                    />
                  </div>
                </div>

                {/* Overlay con efecto hover */}
                <div
                  className={cn(
                    "absolute inset-0 rounded-2xl bg-blue-600/10 opacity-0 transition-opacity duration-300",
                    hoveredCategory === category.id && "opacity-100"
                  )}
                />

                {/* Indicador de hover */}
                <div
                  className={cn(
                    "absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-300",
                    hoveredCategory === category.id
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2"
                  )}
                ></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
