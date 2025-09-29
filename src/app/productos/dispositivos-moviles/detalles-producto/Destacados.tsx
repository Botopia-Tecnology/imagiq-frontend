import React from "react";
import type { FC } from "react";

// --- Interfaz para productos destacados ---
export interface Destacado {
  id: string;
  nombre: string;
  descripcion: string;
  // imagen: string; // Si en el futuro se usan imágenes
  precio?: string;
  enlace?: string;
}

// --- Datos mockeados (pueden ser reemplazados por props en el futuro) ---
const destacadosMock: Destacado[] = [
  {
    id: "1",
    nombre: "Pantalla sin bordes",
    descripcion: "Experiencia inmersiva con la pantalla plegable más avanzada",
  },
  {
    id: "2",
    nombre: "S Pen integrado",
    descripcion: "Productividad mejorada con S Pen incorporado",
  },
  {
    id: "3",
    nombre: "IA Avanzada",
    descripcion: "Galaxy AI con funciones exclusivas para plegables",
  },
  {
    id: "4",
    nombre: "Durabilidad Premium",
    descripcion: "Certificación IPX8 y Gorilla Glass Armor",
  },
];

// --- Componente principal ---
/**
 * Componente de características destacadas
 * - Replica el diseño de la imagen adjunta
 * - Responsive: grid en desktop, scroll horizontal en mobile
 * - Preparado para datos dinámicos
 */
const Destacados: FC<{ destacados?: Destacado[] }> = ({
  destacados = destacadosMock,
}) => {
  return (
    <section
      className="w-full py-8 md:py-12 bg-white flex flex-col items-center justify-center"
      aria-label="Características destacadas"
    >
      {/* Título principal */}
      <h2
        className="text-2xl md:text-3xl font-bold text-[#222] text-center mb-8 md:mb-12 tracking-tight"
        style={{ fontFamily: "SamsungSharpSans" }}
      >
        Características destacadas
      </h2>
      {/* Grid de destacados (scroll horizontal en mobile, grid en desktop) */}
      <ul
        className="w-full max-w-6xl flex md:grid md:grid-cols-4 gap-6 md:gap-8 px-4 md:px-0 overflow-x-auto md:overflow-visible"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {destacados.map((item) => (
          <li
            key={item.id}
            className="flex-shrink-0 w-[260px] md:w-auto md:max-w-none bg-transparent flex flex-col items-center text-center px-2 md:px-0 group transition-all duration-300"
            aria-label={item.nombre}
          >
            {/* Círculo azul con sombra suave y animación de hover */}
            <span
              className="flex w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#E6F3FF] items-center justify-center mb-4 md:mb-6 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md"
              aria-hidden="true"
            >
              <span className="block w-6 h-6 md:w-7 md:h-7 rounded-full bg-[#1DA1F2] mx-auto transition-all duration-300 group-hover:scale-110" />
            </span>
            {/* Nombre */}
            <h3
              className="text-base md:text-lg font-semibold text-[#222] mb-1 md:mb-2 leading-tight transition-colors duration-300 group-hover:text-[#0099FF]"
              style={{ fontFamily: "SamsungSharpSans" }}
            >
              {item.nombre}
            </h3>
            {/* Descripción */}
            <p className="text-xs md:text-sm text-[#8A8A8A] font-normal leading-snug max-w-[220px] md:max-w-none mx-auto transition-colors duration-300 group-hover:text-[#222]">
              {item.descripcion}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Destacados;
