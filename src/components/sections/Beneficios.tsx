"use client";

import React from "react";
import Image from "next/image";
import ChieldCheck from "../../img/iconos/Chield_check_light.png";
import PackageCar from "../../img/iconos/package_car.png";
import PercentLight from "../../img/iconos/Percent_light.png";
import SettingLine from "../../img/iconos/Setting_line.png";
import IntercambioCel from "../../img/iconos/intercambio_cel.png";

const beneficios = [
  { icon: ChieldCheck, text: "1 Año de Garantía con Samsung Colombia" },
  { icon: PackageCar, text: "Envío gratis a nivel Nacional" },
  { icon: PercentLight, text: "0% de interés con bancos aliados" },
  { icon: SettingLine, text: "Samsung servicio técnico autorizado" },
  { icon: IntercambioCel, text: "Plan recambio" },
];

export default function Beneficios() {
  // Duplicamos los ítems para crear un loop sin cortes
  const beneficiosDuplicados = [...beneficios, ...beneficios];

  return (
    <section className="bg-white md:py-6 md:mb-4 ">
      <div className="max-w-10xl md:px-4 mx-auto px-0">
        <h2 className="text-4xl font-semibold text-center mb-8 text-[#0F2A4A]">
          Beneficios
        </h2>

        {/* Carrusel infinito SOLO en mobile */}
        <div className="md:hidden relative w-full overflow-hidden">
          {/* Overlays con degradado negro en los lados, elegante y sutil */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/60 via-black/30 to-transparent z-10" />

          {/* Track que se desplaza de forma continua */}
          <div
            className="flex flex-nowrap gap-6 animate-beneficios-infinito"
            style={{ animationDuration: "14s" }}
            role="list"
            aria-label="Beneficios Samsung Colombia"
          >
            {beneficiosDuplicados.map((b, i) => (
              <div
                key={i}
                className="flex flex-col items-center min-w-[100px] w-[100px] flex-shrink-0 mb-0"
                role="listitem"
              >
                <div className="mb-3">
                  <span className="flex items-center justify-center rounded-full bg-[#0F2A4A] w-14 h-14">
                    <Image
                      src={b.icon}
                      alt={b.text}
                      width={40}
                      height={40}
                      className="mx-auto"
                    />
                  </span>
                </div>
                <span className="text-xs text-[#0F2A4A] text-center font-medium leading-tight">
                  {b.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop/tablet: diseño original intacto */}
        <div className="hidden md:flex flex-wrap justify-center gap-6 w-full max-w-full overflow-visible">
          {beneficios.map((b, i) => (
            <div
              key={i}
              className="flex flex-col items-center md:w-40 md:min-w-0 md:px-0"
            >
              <div className="mb-3">
                <span className="flex items-center justify-center rounded-full bg-[#0F2A4A] w-[78px] h-[78px]">
                  <Image
                    src={b.icon}
                    alt={b.text}
                    width={40}
                    height={40}
                    className="mx-auto"
                  />
                </span>
              </div>
              <span className="text-sm text-[#0F2A4A] text-center font-medium leading-tight">
                {b.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Animación CSS optimizada para loop infinito sin saltos */}
      <style jsx>{`
        @keyframes beneficios-infinito {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .animate-beneficios-infinito {
          display: flex;
          width: max-content;
          animation: beneficios-infinito linear infinite;
        }
      `}</style>
    </section>
  );
}
