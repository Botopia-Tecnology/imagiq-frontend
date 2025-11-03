"use client";

import Link from "next/link";
import { useState } from "react";

const results = [
  {
    title: "Galaxy A30s - ¿Cómo activar la función Mobile Hotspot?",
    description:
      "Preguntas más frecuentes para Samsung dispositivos móviles. Encuentra más información sobre 'Galaxy A30s - ¿Cómo activar la función Mobile Hotspot?' con el Soporte de Samsung.",
    category: "Asistencia técnica",
    subcategory: "Soluciones",
    highlighted: "Mobile",
  },
  {
    title: "Galaxy A31 - ¿Cómo ocultar los contactos sin número teléfonico?",
    description:
      "Preguntas mas frecuentes para Samsung dispositivos móviles. Encuentra mas información sobre 'Galaxy A31 - ¿Cómo ocultar los contactos sin número teléfonico?' con el Soporte de Samsung.",
    category: "Asistencia técnica",
    subcategory: "Soluciones",
  },
  {
    title: "Cómo activar las llamadas por Wi-Fi en tu teléfono Galaxy",
    description:
      "Preguntas frecuentes para celulares. Descubre más acerca de 'llamadas Wi-Fi' con el Soporte de Samsung",
    category: "Asistencia técnica",
    subcategory: "Soluciones",
  },
];

export function ResultsList() {
  return (
    <div className="flex-1 bg-white px-6 pt-6">
      <div className="max-w-5xl mx-auto">
        <div className="space-y-4">
          {results.map((result, index) => (
          <Link
            key={index}
            href="#"
            className="block bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow border border-gray-200"
          >
            <h3 className="text-lg font-bold mb-2 text-black hover:underline">
              {result.highlighted ? (
                <>
                  {result.title.split(result.highlighted)[0]}
                  <span className="text-black">{result.highlighted}</span>
                  {result.title.split(result.highlighted)[1]}
                </>
              ) : (
                result.title
              )}
            </h3>

            <p className="text-sm text-gray-700 mb-4 line-clamp-2">
              {result.description}
            </p>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{result.category}</span>
              <span>›</span>
              <span>{result.subcategory}</span>
            </div>
          </Link>
          ))}
        </div>

        {/* Botón Ver más */}
        <div className="flex justify-center mt-8">
          <button className="px-8 py-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex items-center gap-2">
            <span className="text-sm font-medium text-black">Ver más</span>
            <svg
              className="w-4 h-4 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
