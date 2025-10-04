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

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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

        {/* Call to Action Button */}
        <div className="text-center mt-12">
          <button className="bg-[#0094e8] hover:bg-[#0077c2] text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Ver comparación completa
          </button>
        </div>

        {/* Mobile Responsive Version */}
        <div className="md:hidden mt-16">
          <div className="space-y-8">
            {products.map((product, idx) => (
              <div
                key={product.name}
                className={`bg-white rounded-2xl border border-gray-200 p-6 shadow-sm ${
                  idx === activeIndex ? "border-[#0094e8]" : ""
                }`}
              >
                {/* Mobile Product Header */}
                <div className="text-center mb-6">
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
                  <h3
                    className={`font-semibold text-lg ${
                      idx === activeIndex ? "text-[#17407A]" : "text-gray-400"
                    }`}
                  >
                    {product.name}
                  </h3>
                </div>
                {/* Mobile Specifications */}
                <div className="space-y-4">
                  {specCategories.map((category) => (
                    <div
                      key={category.key}
                      className="flex justify-between items-start border-b border-gray-100 pb-3"
                    >
                      <span className="font-medium text-gray-600 text-sm">
                        {category.label}:
                      </span>
                      <span
                        className={`text-right flex-1 ml-4 font-medium text-sm ${
                          idx === activeIndex
                            ? "text-[#0094e8] underline underline-offset-2"
                            : "text-gray-500"
                        } ${
                          category.key === "uniqueFeature" ? "font-normal" : ""
                        }`}
                      >
                        {product.specs[category.key]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
