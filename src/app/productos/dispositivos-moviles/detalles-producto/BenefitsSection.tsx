// Sección de Beneficios Imagiq
// Componente reutilizable para mostrar los beneficios de la tienda
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
    subtitle: "tarjetas débito",
  },
  {
    icon: settingIcon,
    title: "Soporte técnico",
    subtitle: "garantizado",
  },
  {
    icon: addiIcon,
    title: "Retira en más de 14",
    subtitle: "ciudades de Colombia",
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

/**
 * Sección de Beneficios Imagiq
 * Replica fielmente el diseño de la imagen de referencia
 * Responsive, modular y profesional
 */
const BenefitsSection: React.FC = () => (
  <section
    className="w-full pt-4 md:pt-6 pb-8 md:pb-12 bg-[#fafbfc]"
    aria-labelledby="benefits-title"
  >
    <div className="max-w-6xl mx-auto px-4 md:px-0">
      {/* Encabezado */}
      <div className="text-center mb-8 md:mb-10">
        <h2
          id="benefits-title"
          className="text-2xl md:text-3xl font-light text-[#222] mb-2"
          style={{ fontFamily: "SamsungSharpSans" }}
        >
          Beneficios imagiq
        </h2>
        <p
          className="text-sm md:text-base text-gray-500 font-light"
          style={{ fontFamily: "SamsungSharpSans" }}
        >
          Compra con confianza y disfruta de ventajas exclusivas
        </p>
      </div>
      {/* Lista de beneficios - Responsive: horizontal scroll en móvil, vertical en desktop */}
      <div className="w-full">
        {/* Móvil: fila horizontal con scroll */}
        <div
          className="flex flex-row gap-6 overflow-x-auto whitespace-nowrap scroll-smooth md:hidden pb-2"
          style={{ WebkitOverflowScrolling: "touch" }}
          tabIndex={0}
          aria-label="Beneficios imagiq"
        >
          {benefits.map((benefit, idx) => (
            <div key={idx} className="inline-block min-w-[180px] max-w-[220px]">
              <BenefitItem {...benefit} />
            </div>
          ))}
        </div>
        {/* Desktop: vertical como siempre */}
        <div className="hidden md:flex md:flex-row md:justify-center md:gap-12 items-center w-full">
          {benefits.map((benefit, idx) => (
            <BenefitItem key={idx} {...benefit} />
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default BenefitsSection;
