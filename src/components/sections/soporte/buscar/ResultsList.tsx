"use client";

import Link from "next/link";

const results = [
  {
    title: "Galaxy A80 - ¿Cómo cambiar el usuario y contraseña de Mobile Hotspot?",
    description:
      "Preguntas más frecuentes para Samsung Dispositivo móviles. Encuentra más información sobre ' Galaxy A80 - ¿Cómo cambiar el usuario y contraseña de Mobile Hotspot? 'Con el Soporte de Samsung.",
    category: "Asistencia técnica",
    subcategory: "Soluciones",
    highlighted: "Mobile",
  },
  {
    title: "Galaxy Note20 Ultra - ¿Cómo activar el ahorro de datos móviles?",
    description:
      "Preguntas frecuentes para celulares. Descubre más acerca de 'el ahorro de datos móviles' con el Soporte de Samsung.",
    category: "Asistencia técnica",
    subcategory: "Soluciones",
  },
  {
    title:
      "Galaxy Note20 Ultra - ¿Cómo poner una alarma para el límite de consumo de datos móviles?",
    description:
      "Preguntas más frecuentes para Samsung dispositivos móviles. Encuentra más información sobre Galaxy Note20 Ultra - ¿Cómo poner una alarma para el límite de consumo de datos móviles? con el Soporte de Samsung.",
    category: "Asistencia técnica",
    subcategory: "Soluciones",
  },
  {
    title: "Qué hacer cuando mi teléfono Galaxy no conecta a la red WiFi",
    description:
      "Preguntas frecuentes para celulares. Descubre más acerca de 'Qué hacer cuando mi teléfono Galaxy no conecta a la red WiFi' con el Soporte de Samsung",
    category: "Asistencia técnica",
    subcategory: "Soluciones",
  },
];

export function ResultsList() {
  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        {results.map((result, index) => (
          <Link
            key={index}
            href="#"
            className="block bg-white rounded-lg p-6 hover:shadow-md transition-shadow border border-gray-200"
          >
            <h3 className="text-lg font-semibold mb-2 text-blue-600 hover:underline">
              {result.highlighted ? (
                <>
                  {result.title.split(result.highlighted)[0]}
                  <span className="text-blue-600">{result.highlighted}</span>
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
    </div>
  );
}
