/**
 * 📚 Sección de Historias - Imagiq Store
 * Muestra cards pequeñas con imágenes y títulos, siguiendo el diseño exacto de la referencia.
 * Código limpio, documentado, escalable y accesible.
 */

"use client";

import Image from "next/image";
import SamsungHealth from "@/img/hero/Samsung_health.png";
import CambiateGalaxy from "@/img/hero/Cambiate_Galaxy.png";
import OneUI from "@/img/hero/One_UI.png";
import SamsungVisionAI from "@/img/hero/Samsung_Vision.png";

// Datos escalables para las historias
const historias = [
  {
    title: "Samsung Health",
    image: SamsungHealth,
  },
  {
    title: "Cambiate a Galaxy",
    image: CambiateGalaxy,
  },
  {
    title: "One UI",
    image: OneUI,
  },
  {
    title: "Samsung Vision AI",
    image: SamsungVisionAI,
  },
];

/**
 * Componente principal de Historias
 */
export default function Historias() {
  return (
    <section
      aria-labelledby="historias-title"
      className="w-full py-12 flex flex-col items-center"
    >
      {/* Título principal */}
      <h2
        id="historias-title"
        className="text-2xl md:text-3xl font-bold mb-8 text-center"
      >
        ¡Explora Las historias!
      </h2>
      {/* Imágenes y textos alineados exactamente como la referencia */}
      {/* Carrusel automático solo en móvil, animación suave e infinita */}
      <div className="relative w-full ">
        <div className="md:hidden w-full overflow-x-hidden p-0 m-0">
          {/* Carrusel infinito mobile: animación fluida y continua */}
          <div
            className="flex flex-nowrap gap-4 w-[calc(140px_*_24)] animate-historias-infinito-mobile"
            style={{ animationDuration: "32s" }}
            role="list"
            aria-label="Historias Samsung"
          >
            {/* Duplicamos las historias para loop infinito, sin cortes */}
            {[
              ...historias,
              ...historias,
              ...historias,
              ...historias,
              ...historias,
              ...historias,
            ].map((historia, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center min-w-[140px] w-[140px] px-2 flex-shrink-0"
                tabIndex={0}
                aria-label={historia.title}
                role="listitem"
              >
                <div className="w-full h-full flex items-center justify-center bg-transparent shadow-[8px_16px_24px_-8px_rgba(0,0,0,0.18)] transition-transform duration-300 hover:scale-105">
                  <Image
                    src={historia.image}
                    alt={historia.title}
                    width={120}
                    height={120}
                    className="object-contain"
                    draggable={false}
                    priority={idx === 0}
                  />
                </div>
                <span className="text-xs font-semibold text-center mt-2">
                  {historia.title}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* Desktop/tablet: grid centrado visualmente */}
        <div className="hidden md:flex md:justify-center w-full">
          <div className="grid grid-cols-4 gap-12 max-w-5xl w-full px-2 md:px-4 mt-6 mb-6">
            {historias.map((historia, idx) => (
              <div
                key={historia.title}
                className="flex flex-col items-center w-full h-full"
                tabIndex={0}
                aria-label={historia.title}
              >
                <div className="w-full h-full flex items-center justify-center bg-transparent shadow-[8px_16px_24px_-8px_rgba(0,0,0,0.18)] transition-transform duration-300 hover:scale-105">
                  <Image
                    src={historia.image}
                    alt={historia.title}
                    width={200}
                    height={200}
                    className="object-contain"
                    draggable={false}
                    priority={idx === 0}
                  />
                </div>
                <span className="text-base font-semibold text-center mt-4">
                  {historia.title}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* Animación mejorada para carrusel móvil */}
        <style jsx>{`
          @keyframes historias-infinito-mobile {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-historias-infinito-mobile {
            animation: historias-infinito-mobile linear infinite;
            width: max-content;
          }
          @keyframes historias-scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-66%);
            }
          }
          .animate-historias-scroll {
            animation: historias-scroll linear infinite;
          }
        `}</style>
      </div>
    </section>
  );
}
