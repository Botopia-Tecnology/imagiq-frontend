// Sección de Beneficios Imagiq
// Componente reutilizable para mostrar los beneficios de la tienda
"use client";
import React from "react";
import Image, { StaticImageData } from "next/image";
import settingIcon from "@/img/iconos/Setting_line.png";
import addiIcon from "@/img/iconos/addi_logo.png";
import packageIcon from "@/img/iconos/package_car.png";
import percentIcon from "@/img/iconos/Percent_light.png";

interface Benefit {
  icon: StaticImageData;
  title: string;
  subtitle: string;
}

/**
 * Lista de beneficios de Imagiq, reutilizable para desktop y mobile.
 */
export const benefits: Benefit[] = [
  {
    icon: packageIcon,
    title: "Envío gratis a",
    subtitle: "toda Colombia",
  },
  {
    icon: percentIcon,
    title: "0% de interés en",
    subtitle: "débito/crédito",
  },
  {
    icon: settingIcon,
    title: "Soporte técnico",
    subtitle: "garantizado",
  },
  {
    icon: addiIcon,
    title: "Paga a crédito con addi",
    subtitle: "Sin tarjeta de crédito",
  },
];

/**
 * Componente individual para cada beneficio
 * Modular y reutilizable, recibe icono, título y subtítulo
 */
const BenefitItem: React.FC<Benefit> = ({ icon, title, subtitle }) => (
  <div className="flex flex-col items-center text-center" role="listitem">
    <div
      className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-2.5 md:mb-3 shadow-md"
      style={{ backgroundColor: "#0d2345" }}
      aria-label={title}
    >
      <Image
        src={icon}
        alt={title}
        width={32}
        height={32}
        className="object-contain"
        priority
      />
    </div>
    <h3
      className="font-semibold text-[#0d2345] text-[11px] md:text-sm leading-tight mb-0.5"
      style={{ fontFamily: "SamsungSharpSans" }}
    >
      {title}
    </h3>
    <p
      className="text-gray-700 text-[10px] md:text-xs leading-tight"
      style={{ fontFamily: "SamsungSharpSans" }}
    >
      {subtitle}
    </p>
  </div>
);

const BenefitsSection: React.FC = () => {
  const [paused, setPaused] = React.useState(false);
  const duplicated = [...benefits, ...benefits, ...benefits];

  return (
    <section className="w-full pt-4 md:pt-6 pb-2 md:pb-3 bg-[#fafbfc]">
      <style jsx>{`
        @keyframes scroll { to { transform: translateX(calc(-100% / 3)); } }
        .carousel { animation: scroll 15s linear infinite; }
        .carousel.paused { animation-play-state: paused; }
      `}</style>
      
      <div className="max-w-6xl mx-auto px-4 md:px-0">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-light text-[#222] mb-2" style={{ fontFamily: "SamsungSharpSans" }}>
            Beneficios imagiq
          </h2>
          <p className="text-sm md:text-base text-gray-500 font-light" style={{ fontFamily: "SamsungSharpSans" }}>
            Compra con confianza y disfruta de ventajas exclusivas
          </p>
        </div>
        
        <div className="md:hidden overflow-x-auto scroll-smooth" 
          onTouchStart={() => setPaused(true)} 
          onTouchEnd={() => setPaused(false)}>
          <div className={`flex gap-6 carousel ${paused ? 'paused' : ''}`}>
            {duplicated.map((b, i) => (
              <div key={i} className="min-w-[180px] flex-shrink-0">
                <BenefitItem {...b} />
              </div>
            ))}
          </div>
        </div>
        
        <div className="hidden md:flex md:justify-center md:gap-12">
          {benefits.map((b, i) => <BenefitItem key={i} {...b} />)}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
