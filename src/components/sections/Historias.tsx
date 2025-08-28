/**
 * 📚 Sección de Historias - Imagiq Store
 * Muestra cards pequeñas con imágenes y títulos, siguiendo el diseño exacto de la referencia.
 * Código limpio, documentado, escalable y accesible.
 */

import Image from "next/image";
import SamsungHealth from "@/img/Hero/Samsung_health.png";
import CambiateGalaxy from "@/img/Hero/Cambiate_Galaxy.png";
import OneUI from "@/img/Hero/One_UI.png";
import SamsungVisionAI from "@/img/Hero/Samsung_Vision.png";

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
      className="w-full bg-white py-12 flex flex-col items-center"
    >
      {/* Título principal */}
      <h2
        id="historias-title"
        className="text-2xl md:text-3xl font-bold mb-8 text-center"
      >
        ¡Explora Las historias!
      </h2>
      {/* Imágenes y textos alineados exactamente como la referencia */}
      <div className="flex flex-row justify-center items-end gap-16 w-full max-w-5xl px-4 mt-10 mb-10">
        {historias.map((historia, idx) => (
          <div
            key={historia.title}
            className="flex flex-col items-center"
            tabIndex={0}
            aria-label={historia.title}
          >
            <div className="w-[240px] h-[240px] flex items-center justify-center bg-white shadow-[8px_16px_24px_-8px_rgba(0,0,0,0.18)] transition-transform duration-300 hover:scale-105">
              <Image
                src={historia.image}
                alt={historia.title}
                width={240}
                height={240}
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
    </section>
  );
}
