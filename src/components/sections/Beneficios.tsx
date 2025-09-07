// Sección de Beneficios - Samsung Style
"use client";
import React from "react";
import Image from "next/image";
import ChieldCheck from "../../img/iconos/Chield_check_light.png";
import PackageCar from "../../img/iconos/package_car.png";
import PercentLight from "../../img/iconos/Percent_light.png";
import SettingLine from "../../img/iconos/Setting_line.png";
import IntercambioCel from "../../img/iconos/intercambio_cel.png";

const beneficios = [
  {
    icon: ChieldCheck,
    text: "1 Año de Garantía con Samsung Colombia",
  },
  {
    icon: PackageCar,
    text: "Envío gratis a nivel Nacional",
  },
  {
    icon: PercentLight,
    text: "0% de interés con bancos aliados",
  },
  {
    icon: SettingLine,
    text: "Samsung servicio técnico autorizado",
  },
  {
    icon: IntercambioCel,
    text: "Plan recambio",
  },
];

export default function Beneficios() {
  return (
    <section className="bg-white py-6 mb-4">
      <div className="max-w-10xl mx-auto px-4">
        <h2 className="text-4xl font-semibold text-center mb-8 text-[#0F2A4A]">
          Beneficios
        </h2>
        {/* Carrusel automático solo en móvil */}
        <div className="md:hidden w-full overflow-x-hidden relative">
          <div
            className="flex flex-nowrap gap-4 animate-beneficios-scroll"
            style={{ animationDuration: "18s" }}
          >
            {beneficios
              .concat(beneficios)
              .concat(beneficios)
              .map((b, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center min-w-[100px] w-[100px] px-2 flex-shrink-0"
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
        {/* Desktop/tablet: grid original */}
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
      {/* Agrego animación CSS para el carrusel móvil */}
      <style jsx>{`
        @keyframes beneficios-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-66%);
          }
        }
        .animate-beneficios-scroll {
          animation: beneficios-scroll linear infinite;
        }
      `}</style>
    </section>
  );
}
