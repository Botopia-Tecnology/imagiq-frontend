/**
 * 💡 VALUES SECTION - EDUCACIÓN
 * Sección "Nuestros valores" con características educativas
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
    id: "connected-classrooms",
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
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    title: "Aulas conectadas",
    description: "Que los alumnos aprendan con la más reciente tecnología",
  },
  {
    id: "interactive-engagement",
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
    title: "Compromiso interactivo",
    description:
      "Crea y comparte ideas fácilmente con dispositivos interconectados",
  },
  {
    id: "healthy-environments",
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
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
    title: "Entornos saludables",
    description:
      "Garantiza una mejor ventilación en la escuela con aire limpio",
  },
];

export default function ValuesSection() {
  return (
    <section id="valores" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Permite el aprendizaje en cualquier lugar
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Rompe las barreras entre el aprendizaje en la escuela y el
            aprendizaje a distancia manteniendo a todos conectados.
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
                <div className="text-gray-700 group-hover:text-purple-600 transition-colors">
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

        {/* Image Section con texto superpuesto */}
        <div className="relative w-full aspect-[1440/640] rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src={`https://res.cloudinary.com/dqsdl9bwv/image/upload/${SECTION_IMAGES.education.values}`}
            alt="Aprendizaje colaborativo con S Pen"
            width={1440}
            height={640}
            quality={90}
            className="w-full h-auto object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            loading="lazy"
            unoptimized
          />

          {/* Texto superpuesto */}
          <div className="absolute inset-0 flex items-center justify-center lg:justify-end px-8 lg:px-16">
            <div className="text-center lg:text-right max-w-xl">
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Aprendizaje colaborativo con S Pen
              </h3>
              <p className="text-lg text-gray-700">
                Con su gran pantalla y su suave lápiz, el Galaxy Tab es un
                dispositivo imprescindible dentro o fuera de la escuela.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
