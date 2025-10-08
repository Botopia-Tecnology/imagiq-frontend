"use client";
/**
 * 📱 COMPARATION PRODUCT COMPONENT - IMAGIQ ECOMMERCE
 *
 * Componente para comparar múltiples dispositivos móviles.
 * - Tabla comparativa con especificaciones técnicas detalladas
 * - Diseño responsive y limpio
 * - Interfaz fiel al diseño de referencia
 * - Código limpio, escalable y documentado
 * - Experiencia de usuario optimizada
 */

import React from "react";
import Image from "next/image";

/**
 * Interfaz para definir las especificaciones de cada producto
 */
interface ProductSpecs {
  display: string;
  processor: string;
  ram: string;
  camera: string;
  battery: string;
  uniqueFeature: string;
}

/**
 * Interfaz para definir la estructura de cada producto
 */
interface Product {
  name: string;
  image: string;
  specs: ProductSpecs;
}

/**
 * Array de productos con sus especificaciones técnicas
 * Datos basados en la imagen de referencia proporcionada
 */
const products: Product[] = [
  {
    name: "Galaxy Z Fold7",
    image: "/img/dispositivosmoviles/galaxy-fold7.png",
    specs: {
      display: '7.6" plegable • 6.2" externa',
      processor: "Snapdragon 8 Gen 4",
      ram: "12GB / 16GB",
      camera: "200MP",
      battery: "5000mAh",
      uniqueFeature: "Pantalla plegable • S Pen integrado",
    },
  },
  {
    name: "Galaxy S25 Ultra",
    image: "/img/dispositivosmoviles/galaxy-s25-ultra.png",
    specs: {
      display: '6.9"',
      processor: "Snapdragon 8 Gen 4",
      ram: "16GB",
      camera: "250MP",
      battery: "5200mAh",
      uniqueFeature: "Zoom óptico 10x • S Pen incluido",
    },
  },
  {
    name: "Galaxy S24 Ultra",
    image: "/img/dispositivosmoviles/galaxy-s24-ultra.png",
    specs: {
      display: '6.8"',
      processor: "Snapdragon 8 Gen 3",
      ram: "12GB",
      camera: "200MP",
      battery: "5000mAh",
      uniqueFeature: "S Pen incluido",
    },
  },
];

/**
 * Array con las categorías de especificaciones a mostrar
 * Cada categoría incluye su etiqueta y la clave correspondiente en ProductSpecs
 */
const specCategories = [
  { label: "Pantalla", key: "display" as keyof ProductSpecs },
  { label: "Procesador", key: "processor" as keyof ProductSpecs },
  { label: "RAM", key: "ram" as keyof ProductSpecs },
  { label: "Cámara principal", key: "camera" as keyof ProductSpecs },
  { label: "Batería", key: "battery" as keyof ProductSpecs },
  { label: "Característica única", key: "uniqueFeature" as keyof ProductSpecs },
];

/**
 * Componente principal de comparación de productos
 * Renderiza la tabla comparativa con diseño fiel a la imagen de referencia
 */
export default function ComparationProduct() {
  // Índice de la columna activa (la primera)
  const activeIndex = 0;
  return (
    <div
      className="w-full min-h-screen bg-white py-16 px-4"
      style={{ fontFamily: "SamsungSharpSans" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-black mb-4">
            Compara dispositivos
          </h1>
          <p className="text-lg text-gray-500 font-light">
            Ve cómo se compara el Galaxy Z Fold7 con otros dispositivos
          </p>
        </div>

        {/* Comparison Table - Desktop y Tablet */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table Header - Product Images and Names */}
          <div className="grid grid-cols-4 border-b border-gray-100">
            {/* Empty cell for specification labels */}
            <div className="p-6"></div>
            {/* Product Headers */}
            {products.map((product, idx) => (
              <div
                key={product.name}
                className={`p-6 text-center ${
                  idx === activeIndex ? "bg-[#eaf6ff]" : "bg-white"
                } transition`}
              >
                {/* Imagen real del producto optimizada */}
                <Image
                  src={product.image}
                  alt={product.name}
                  width={64}
                  height={80}
                  className={`mx-auto mb-4 rounded-lg object-contain w-16 h-20 ${
                    idx === activeIndex ? "" : "opacity-60 grayscale"
                  }`}
                  style={{
                    background: idx === activeIndex ? "#eaf6ff" : "#f3f4f6",
                  }}
                  priority={idx === activeIndex}
                />
                {/* Nombre del producto */}
                <h3
                  className={`font-semibold text-sm ${
                    idx === activeIndex ? "text-[#17407A]" : "text-gray-400"
                  }`}
                >
                  {product.name}
                </h3>
              </div>
            ))}
          </div>

          {/* Specification Rows */}
          {specCategories.map((category, categoryIndex) => (
            <div
              key={category.key}
              className={`grid grid-cols-4 ${
                categoryIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
              } border-b border-gray-100 last:border-b-0`}
            >
              {/* Specification Label */}
              <div className="p-6 font-semibold text-gray-700 bg-gray-50">
                {category.label}
              </div>
              {/* Product Specifications */}
              {products.map((product, idx) => (
                <div key={`${product.name}-${category.key}`} className="p-6">
                  <span
                    className={`font-medium text-base ${
                      idx === activeIndex
                        ? "text-[#0094e8] underline underline-offset-2"
                        : "text-gray-500"
                    } ${category.key === "uniqueFeature" ? "font-normal" : ""}`}
                  >
                    {product.specs[category.key]}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Comparison Table - Móvil con scroll horizontal */}
        <div className="md:hidden">
          <div
            className="overflow-x-auto scroll-smooth"
            style={{
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "thin",
              scrollbarColor: "#cbd5e1 #f1f5f9",
            }}
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-w-[800px]">
              {/* Table Header móvil - Product Images and Names */}
              <div className="grid grid-cols-4 border-b border-gray-100">
                {/* Empty cell for specification labels */}
                <div className="p-4 w-[200px]"></div>
                {/* Product Headers */}
                {products.map((product, idx) => (
                  <div
                    key={product.name}
                    className={`p-4 text-center w-[200px] ${
                      idx === activeIndex ? "bg-[#eaf6ff]" : "bg-white"
                    } transition`}
                  >
                    {/* Imagen del producto móvil */}
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={48}
                      height={60}
                      className={`mx-auto mb-3 rounded-lg object-contain w-12 h-15 ${
                        idx === activeIndex ? "" : "opacity-60 grayscale"
                      }`}
                      style={{
                        background: idx === activeIndex ? "#eaf6ff" : "#f3f4f6",
                      }}
                      priority={idx === activeIndex}
                    />
                    {/* Nombre del producto móvil */}
                    <h3
                      className={`font-semibold text-xs ${
                        idx === activeIndex ? "text-[#17407A]" : "text-gray-400"
                      }`}
                    >
                      {product.name}
                    </h3>
                  </div>
                ))}
              </div>

              {/* Specification Rows móvil */}
              {specCategories.map((category, categoryIndex) => (
                <div
                  key={category.key}
                  className={`grid grid-cols-4 ${
                    categoryIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } border-b border-gray-100 last:border-b-0`}
                >
                  {/* Specification Label móvil */}
                  <div className="p-4 font-semibold text-gray-700 bg-gray-50 w-[200px] text-sm">
                    {category.label}
                  </div>
                  {/* Product Specifications móvil */}
                  {products.map((product, idx) => (
                    <div
                      key={`${product.name}-${category.key}`}
                      className="p-4 w-[200px]"
                    >
                      <span
                        className={`font-medium text-sm ${
                          idx === activeIndex
                            ? "text-[#0094e8] underline underline-offset-2"
                            : "text-gray-500"
                        } ${
                          category.key === "uniqueFeature"
                            ? "font-normal text-xs"
                            : ""
                        }`}
                      >
                        {product.specs[category.key]}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          {/* Indicador de scroll para tabla móvil */}
          <div className="flex justify-center mt-3">
            <p className="text-xs text-gray-500 italic">
              Desliza horizontalmente para ver más
            </p>
          </div>
        </div>

        {/* Call to Action Button */}
        <div className="text-center mt-12">
          <button className="bg-[#0094e8] hover:bg-[#0077c2] text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Ver comparación completa
          </button>
        </div>

        {/* Mobile Responsive Version - Scroll horizontal optimizado */}
        <div className="md:hidden mt-16">
          {/* Contenedor con scroll horizontal fluido y accesible */}
          <section
            className="flex flex-row gap-4 overflow-x-auto scroll-smooth pb-4 px-2"
            style={{
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "thin",
              scrollbarColor: "#cbd5e1 #f1f5f9",
            }}
            aria-label="Comparación horizontal de dispositivos móviles"
          >
            {products.map((product, idx) => (
              <article
                key={product.name}
                className={`flex-shrink-0 w-[280px] bg-white rounded-2xl border-2 p-5 shadow-md transition-all duration-300 ${
                  idx === activeIndex
                    ? "border-[#0094e8] shadow-lg scale-[1.02]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                aria-labelledby={`product-${product.name}-title`}
              >
                {/* Mobile Product Header optimizado */}
                <div className="text-center mb-5">
                  <div
                    className={`rounded-xl p-3 mb-4 ${
                      idx === activeIndex ? "bg-[#eaf6ff]" : "bg-gray-50"
                    }`}
                  >
                    <Image
                      src={product.image}
                      alt={`${product.name} - Imagen del producto`}
                      width={60}
                      height={75}
                      className={`mx-auto rounded-lg object-contain w-15 h-19 transition-all duration-300 ${
                        idx === activeIndex
                          ? "scale-110"
                          : "opacity-80 grayscale hover:opacity-100 hover:grayscale-0"
                      }`}
                      priority={idx === activeIndex}
                    />
                  </div>
                  <h3
                    id={`product-${product.name}-title`}
                    className={`font-bold text-base leading-tight transition-colors duration-300 ${
                      idx === activeIndex ? "text-[#17407A]" : "text-gray-500"
                    }`}
                  >
                    {product.name}
                  </h3>
                </div>

                {/* Mobile Specifications optimizadas */}
                <div className="space-y-3">
                  {specCategories.map((category) => (
                    <div
                      key={category.key}
                      className="flex flex-col border-b border-gray-100 pb-3 last:border-b-0"
                    >
                      <span className="font-semibold text-gray-700 text-xs uppercase tracking-wide mb-1">
                        {category.label}
                      </span>
                      <span
                        className={`text-sm leading-tight transition-colors duration-300 ${
                          idx === activeIndex
                            ? "text-[#0094e8] font-semibold"
                            : "text-gray-600 font-medium"
                        } ${
                          category.key === "uniqueFeature"
                            ? "text-xs italic"
                            : ""
                        }`}
                      >
                        {product.specs[category.key]}
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </section>

          {/* Indicador de scroll para mejorar UX */}
          <div className="flex justify-center mt-4">
            <div className="flex gap-1">
              {products.map((product) => (
                <div
                  key={`indicator-${product.name}`}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    product.name === products[activeIndex].name
                      ? "bg-[#0094e8] w-4"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          {/* Mobile CTA */}
          <div className="text-center mt-8">
            <button className="w-full bg-[#0094e8] hover:bg-[#0077c2] text-white font-semibold py-4 rounded-full transition-all duration-300">
              Ver comparación completa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
