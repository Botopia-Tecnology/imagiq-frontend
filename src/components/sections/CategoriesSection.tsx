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
    href: "/productos/dispositivos-moviles?section=smartphones",
    description: "Los últimos Galaxy y más",
  },
  {
    id: 2,
    title: "Tabletas",
    image: tabletImage,
    href: "/productos/dispositivos-moviles?section=tabletas",
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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-8 max-w-7xl">
        {/* Grid/Carrusel de categorías */}
        <div className="block md:hidden">
          <div
            className="flex flex-row gap-6 overflow-x-auto pb-2 scrollbar-hide"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {categories.map((category) => (
              <Link
                key={category.id}
                href={category.href}
                onClick={() => handleCategoryClick(category)}
                className="group min-w-[48%] max-w-[52%] flex-shrink-0"
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div
                  className={cn(
                    "relative rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-lg",
                    "transform hover:scale-105 cursor-pointer"
                  )}
                  style={{ backgroundColor: "#D6E3F3" }}
                >
                  {/* Título de la categoría */}
                  <div className="text-center mb-4">
                    <h3
                      className="text-lg font-bold text-gray-800 transition-colors duration-300 group-hover:text-blue-700"
                      style={{ fontFamily: "'Samsung Sharp Sans', sans-serif" }}
                    >
                      {category.title}
                    </h3>
                  </div>
                  {/* Imagen del producto real */}
                  <div className="flex justify-center items-center h-32 mb-2">
                    <div className="relative w-full h-full">
                      <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        className={cn(
                          "object-contain transition-transform duration-300",
                          hoveredCategory === category.id && "scale-110"
                        )}
                        sizes="(max-width: 768px) 48vw"
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
                </div>
              </Link>
            ))}
          </div>
        </div>
        {/* Desktop y tablet: grid original */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-12">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              onClick={() => handleCategoryClick(category)}
              className="group block"
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <div
                className={cn(
                  "relative rounded-2xl p-8 transition-all duration-300 shadow-sm hover:shadow-lg",
                  "transform hover:scale-105 cursor-pointer"
                )}
                style={{ backgroundColor: "#D6E3F3" }}
              >
                {/* Título de la categoría */}
                <div className="text-center mb-6">
                  <h3
                    className="text-2xl font-bold text-gray-800 transition-colors duration-300 group-hover:text-blue-700"
                    style={{ fontFamily: "'Samsung Sharp Sans', sans-serif" }}
                  >
                    {category.title}
                  </h3>
                </div>

                {/* Imagen del producto real */}
                <div className="flex justify-center items-center h-48 mb-4">
                  <div className="relative w-full h-full">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className={cn(
                        "object-contain transition-transform duration-300",
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
