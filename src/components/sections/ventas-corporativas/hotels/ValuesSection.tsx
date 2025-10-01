/**
 * 💡 VALUES SECTION - HOTELES
 * Sección "Nuestros valores" con características para sector hotelero
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
    id: "connected-spaces",
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
          d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
        />
      </svg>
    ),
    title: "Espacios conectados",
    description:
      "Implementa la automatización de los equipos en cualquier lugar",
  },
  {
    id: "service-integrity",
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
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    title: "Servicio e Integridad",
    description: "Brinda la mejor experiencia a los clientes hoteleros",
  },
  {
    id: "sustainable-innovation",
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
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
    title: "Innovación sostenible",
    description:
      "Garantiza una visión ambiental pensada en todas las generaciones",
  },
];

export default function ValuesSection() {
  return (
    <section id="valores" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Masifica los espacios automatizados
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Potencia la conectividad de los equipos y haz de tu negocio el lugar
            ideal para los clientes
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
                <div className="text-gray-700 group-hover:text-amber-600 transition-colors">
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

        {/* Image Section - Conexiones que trascienden */}
        <div className="relative w-full aspect-[1366/607] rounded-2xl overflow-hidden shadow-2xl mb-16">
          <Image
            src={`https://res.cloudinary.com/dqsdl9bwv/image/upload/${SECTION_IMAGES.hotels.values}`}
            alt="Conexiones que trascienden"
            width={1366}
            height={607}
            quality={90}
            className="w-full h-auto object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            loading="lazy"
            unoptimized
          />

          {/* Texto superpuesto - Alineado a la derecha */}
          <div className="absolute inset-0 flex items-center justify-end px-8 lg:px-16">
            <div className="text-right max-w-xl">
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Conexiones que <br className="hidden sm:inline" />
                trascienden
              </h3>
              <p className="text-lg text-gray-700">
                Permite que los dispositivos conecten{" "}
                <br className="hidden sm:inline" />
                en cualquier lugar
              </p>
            </div>
          </div>
        </div>

        {/* Sección adicional - Soluciones que complementan */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Soluciones que complementan
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Impacta positivamente la estadía de los clientes y su estilo de vida
          </p>
        </div>

        {/* Image Section - Zonas funcionales que inspiran */}
        <div className="relative w-full aspect-[1366/607] rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src={`https://res.cloudinary.com/dqsdl9bwv/image/upload/${SECTION_IMAGES.hotels.feature}`}
            alt="Zonas funcionales que inspiran"
            width={1366}
            height={607}
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
                Zonas funcionales que inspiran
              </h3>
              <p className="text-lg text-gray-700">
                Tranquilidad en los espacios, aportando a la{" "}
                <br className="hidden sm:inline" />
                sostenibilidad
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
