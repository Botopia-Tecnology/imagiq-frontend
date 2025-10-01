/**
 * 💡 VALUES SECTION - FINANCIERO
 * Sección "Nuestros valores" con características para servicios financieros
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
    id: "optimized-productivity",
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
    title: "Productividad optimizada",
    description:
      "Permitir que el personal actúe y responda a las necesidades de los clientes con eficacia",
  },
  {
    id: "comprehensive-vision",
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
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    title: "Visión de conjunto",
    description:
      "Ver el panorama completo del mercado con una calidad de imagen precisa",
  },
  {
    id: "digital-service-first",
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
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
    title: "El servicio digital es lo primero",
    description: "Proporciona la mejor experiencia a los clientes financieros",
  },
];

export default function ValuesSection() {
  return (
    <section id="valores" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Digitaliza el día a día
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Simplifica las transacciones rutinarias para ofrecer a los clientes
            las interacciones sin fricciones que ansían.
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
                <div className="text-gray-700 group-hover:text-blue-600 transition-colors">
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

        {/* Image Section - Servicio de atención al cliente instantáneo */}
        <div className="relative w-full aspect-[1366/607] rounded-2xl overflow-hidden shadow-2xl mb-16">
          <Image
            src={`https://res.cloudinary.com/dqsdl9bwv/image/upload/${SECTION_IMAGES.finance.values}`}
            alt="Servicio de atención al cliente instantáneo"
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
                Servicio de atención al <br className="hidden sm:inline" />
                cliente instantáneo
              </h3>
              <p className="text-lg text-gray-700">
                Con una tableta, el personal puede acceder rápidamente a los
                datos de los clientes para ofrecerles consejos y ofertas más
                pertinentes.
              </p>
            </div>
          </div>
        </div>

        {/* Sección adicional - Soluciones para ferias */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Soluciones para ferias
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Mantente al tanto de los cambios en las tendencias financieras con
            soluciones que te ofrecen una mejor visión del mercado.
          </p>
        </div>

        {/* Image Section - Pantallas para panorama general */}
        <div className="relative w-full aspect-[1366/607] rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src={`https://res.cloudinary.com/dqsdl9bwv/image/upload/${SECTION_IMAGES.finance.feature}`}
            alt="Pantallas que muestran el panorama general"
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
                Pantallas que muestran el <br className="hidden sm:inline" />
                panorama general
              </h3>
              <p className="text-lg text-gray-700">
                Transmite las noticias y los precios de las acciones a través de
                pantallas de gran tamaño para lograr la sala de control
                definitiva.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
