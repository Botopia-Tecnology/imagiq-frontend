/**
 * 💡 VALUES SECTION - GOBIERNO
 * Sección "Nuestros valores" con características para sector gubernamental
 */

"use client";

import React from "react";
import Image from "next/image";
import { SECTION_IMAGES } from "@/constants/hero-images";

interface ValueCard {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const VALUES: ValueCard[] = [
  {
    id: "durability-reliability",
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
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    title: "Resistencia y fiabilidad",
    description:
      "Equipa a los equipos con herramientas creadas para entornos exigentes",
  },
  {
    id: "ready-for-mission",
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
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
    title: "Listos para cualquier misión",
    description:
      "Asegúrate de que el personal está preparado y siempre listo para la siguiente llamada",
  },
  {
    id: "security",
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
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),
    title: "Seguridad",
    description: "Refuerza las medidas de ciberseguridad y seguridad ciudadana",
  },
];

export default function ValuesSection() {
  return (
    <section id="valores" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Apoya a los que prestan servicio
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Prepara a tu equipo para el éxito con soluciones que mejoran la
            seguridad y minimizan el tiempo de inactividad.
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
                <div className="text-gray-700 group-hover:text-indigo-600 transition-colors">
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

        {/* Image Section - Permitir el trabajo sobre el terreno */}
        <div className="relative w-full aspect-[1440/640] rounded-2xl overflow-hidden shadow-2xl mb-16">
          <Image
            src={`https://res.cloudinary.com/dqsdl9bwv/image/upload/${SECTION_IMAGES.government.values}`}
            alt="Permitir el trabajo sobre el terreno"
            width={1440}
            height={640}
            quality={90}
            className="w-full h-auto object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            loading="lazy"
            unoptimized
          />

          {/* Texto superpuesto */}
          <div className="absolute inset-0 flex items-center justify-start px-8 lg:px-16">
            <div className="text-left max-w-xl">
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Permitir el trabajo sobre el terreno
              </h3>
              <p className="text-lg text-gray-700">
                Permite a los agentes conectar rápidamente su teléfono a una
                pantalla más grande para gestionar las tareas sobre la marcha.
              </p>
            </div>
          </div>
        </div>

        {/* Sección adicional - Mantén el equipo listo para la misión */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Mantén el equipo listo para la misión
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Asegúrate de que los equipos en entornos de acuartelamiento se
            mantengan sanos y listos para prestar servicio.
          </p>
        </div>

        {/* Image Section - Equipo limpio en todo momento */}
        <div className="relative w-full aspect-[1440/640] rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src={`https://res.cloudinary.com/dqsdl9bwv/image/upload/${SECTION_IMAGES.government.feature}`}
            alt="Equipo limpio en todo momento"
            width={1440}
            height={640}
            quality={90}
            className="w-full h-auto object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            loading="lazy"
            unoptimized
          />

          {/* Texto superpuesto */}
          <div className="absolute inset-0 flex items-center justify-end px-8 lg:px-16">
            <div className="text-right max-w-xl">
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Equipo limpio en todo momento
              </h3>
              <p className="text-lg text-gray-700">
                Con el SmartControl + de nuestras lavadoras, los bomberos pueden
                asegurarse de que la ropa está desinfectada para su próxima
                llamada.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
