import React from "react";
import HeroImage from "@/components/ui/HeroImage";
import { SECTION_IMAGES } from "@/constants/hero-images";

interface ValueCard {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const VALUES: ValueCard[] = [
  {
    id: "elevacion-marca",
    icon: (
      <svg
        className="w-12 h-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
    title: "Elevación de la marca",
    description:
      "Mejora el entorno de tu tienda para los clientes más exigentes",
  },
  {
    id: "velocidades-satisfacen",
    icon: (
      <svg
        className="w-12 h-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "Velocidades que satisfacen",
    description:
      "Permite que el personal actúe y atiendas las necesidades del cliente con eficiencia",
  },
  {
    id: "compra-sin-contacto",
    icon: (
      <svg
        className="w-12 h-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    title: "Compra sin contacto",
    description:
      "Descubre la tecnología de visualización para interacciones fluidas",
  },
];

export default function ValuesSection() {
  return (
    <section id="valores" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Soluciones sin contacto
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Crea una experiencia segura en la tienda para los clientes en
            nuestra nueva realidad de distancia social.
          </p>
        </div>

        {/* Values Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {VALUES.map((value) => (
            <div
              key={value.id}
              className="text-center group hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex justify-center mb-6">
                <div className="text-gray-700 group-hover:text-pink-400 transition-colors">
                  {value.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {value.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        {/* Imagen de valores con texto superpuesto */}
        {SECTION_IMAGES.retail.values && (
          <div className="relative w-full aspect-[1440/640] rounded-2xl overflow-hidden shadow-2xl">
            <HeroImage
              publicId={SECTION_IMAGES.retail.values}
              alt="Lo último en pedidos sin contacto"
              className="w-full h-full object-cover"
            />

            {/* Texto superpuesto - Estilo Education */}
            <div className="absolute inset-0 flex items-center justify-center lg:justify-start px-8 lg:px-16">
              <div className="text-left max-w-xl">
                <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Lo último en pedidos sin contacto
                </h3>
                <p className="text-lg text-gray-700">
                  Atrae a los clientes, aumenta las ventas y optimiza las
                  operaciones con soluciones de exposición para tu restaurante
                  de servicio rápido.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
