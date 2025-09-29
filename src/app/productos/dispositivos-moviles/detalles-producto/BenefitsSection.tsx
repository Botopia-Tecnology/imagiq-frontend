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
 * Sección de beneficios para desktop.
 */
export const BenefitsSectionDesktop: React.FC = () => (
  <div className="col-span-2 flex flex-col space-y-6">
    <h2
      className="text-lg font-bold text-gray-900 mb-4"
      style={{ fontFamily: "SamsungSharpSans" }}
    >
      Beneficios Imagiq
    </h2>
    <div className="flex flex-col space-y-6">
      {benefits.map((benefit, index) => (
        <div key={index} className="flex flex-col items-center text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
            style={{ backgroundColor: "#002142" }}
          >
            {benefit.icon === addiIcon ? (
              <Image
                src={benefit.icon}
                alt={benefit.title}
                width={24}
                height={24}
                className="object-contain"
              />
            ) : (
              <Image
                src={benefit.icon}
                alt={benefit.title}
                width={24}
                height={24}
                className="object-contain filter brightness-0 invert"
              />
            )}
          </div>
          <h3
            className="font-semibold text-gray-900 text-xs leading-tight"
            style={{ fontFamily: "SamsungSharpSans" }}
          >
            {benefit.title}
          </h3>
          <p
            className="text-gray-600 text-xs leading-tight"
            style={{ fontFamily: "SamsungSharpSans" }}
          >
            {benefit.subtitle}
          </p>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Sección de beneficios para mobile.
 */
export const BenefitsSectionMobile: React.FC = () => (
  <div className="bg-gray-100 py-12 lg:hidden">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-8">
        <h2
          className="text-2xl font-bold text-gray-900 mb-2"
          style={{ fontFamily: "SamsungSharpSans" }}
        >
          Beneficios Imagiq
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: "#002142" }}
            >
              {benefit.icon === addiIcon ? (
                <Image
                  src={benefit.icon}
                  alt={benefit.title}
                  width={32}
                  height={32}
                  className="object-contain "
                />
              ) : (
                <Image
                  src={benefit.icon}
                  alt={benefit.title}
                  width={32}
                  height={32}
                  className="object-contain filter brightness-0 invert"
                />
              )}
            </div>
            <h3
              className="font-semibold text-gray-900 text-sm"
              style={{ fontFamily: "SamsungSharpSans" }}
            >
              {benefit.title}
            </h3>
            <p
              className="text-gray-600 text-sm"
              style={{ fontFamily: "SamsungSharpSans" }}
            >
              {benefit.subtitle}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
