import React from "react";
import Image, { StaticImageData } from "next/image";
import samsungImage from "@/img/dispositivosmoviles/cel1.png";
import cpuIcon from "@/img/dispositivosmoviles/cpu-icon.png";
import fullAltIcon from "@/img/dispositivosmoviles/full_alt_light-icon.png";
import cameraIcon from "@/img/dispositivosmoviles/camera-icon.png";
import boxOpenIcon from "@/img/dispositivosmoviles/box_open_light-icon.png";
import webIcon from "@/img/dispositivosmoviles/web-icon.png";
import wifiIcon from "@/img/dispositivosmoviles/wifi-icon.png";

/**
 * 📱 EspecificacionesProduct - IMAGIQ ECOMMERCE
 *
 * Componente premium de especificaciones para productos móviles.
 * - Grid 3x2, tarjetas con iconos reales
 * - Imagen del producto a la izquierda
 * - Animaciones suaves y diseño responsive
 * - Código limpio, escalable y documentado
 * - Background y layout idénticos a la imagen de referencia
 */

// Especificaciones con iconos reales
const especificacionesData = [
  {
    label: "Procesador",
    desc: "Velocidad de la CPU:\n4.47GHz, 3.5GHz\nTipo CPU: Octa-Core",
    icon: cpuIcon,
  },
  {
    label: "Pantalla",
    desc: "156.4mm (6.2'' rectángulo completo) / 152.3mm (6.0'' bordes redondeados)",
    icon: fullAltIcon,
  },
  {
    label: "Cámara",
    desc: "Velocidad de la CPU:\n4.47GHz, 3.5GHz\nTipo CPU: Octa-Core",
    icon: cameraIcon,
  },
  {
    label: "Memoria",
    desc: "Almacenamiento (GB) 256",
    icon: boxOpenIcon,
  },
  {
    label: "Red",
    desc: "Almacenamiento (GB) 256",
    icon: webIcon,
  },
  {
    label: "Conectividad",
    desc: "USB Interfaz USB Tipo-C",
    icon: wifiIcon,
  },
];

/**
 * Componente principal de especificaciones
 * @param specs - Especificaciones personalizadas
 * @param productImage - Imagen del producto
 */
const EspecificacionesProduct = ({
  specs,
  productImage = samsungImage,
}: {
  specs?: { label: string; value: string; icon?: StaticImageData }[];
  productImage?: StaticImageData | string;
}) => {
  // Mezclar datos del padre con los originales, priorizando los del padre
  const mergedSpecs = especificacionesData.map((defaultSpec) => {
    const custom = specs?.find((s) => s.label === defaultSpec.label);
    return {
      label: defaultSpec.label,
      desc: custom?.value || defaultSpec.desc,
      icon: defaultSpec.icon,
    };
  });

  return (
    <section
      className="w-full flex flex-col items-center"
      style={{
        fontFamily: "SamsungSharpSans",
        minHeight: "650px",
        padding: "60px 20px 80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-label="Especificaciones del producto"
    >
      <div className="max-w-7xl w-full mx-auto">
        <div className="flex flex-col xl:flex-row w-full items-center justify-between px-4 md:px-10 lg:px-16">
          {/* Imagen del producto a la izquierda */}
          <div className="w-full xl:w-auto flex flex-col items-center mb-12 xl:mb-0 relative">
            <div
              className="relative"
              style={{ width: "340px", height: "450px" }}
            >
              <Image
                src={productImage}
                alt="Smartphone"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
            {/* Flechas de navegación */}
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white text-4xl"
              aria-label="Anterior"
              style={{ left: "-40px" }}
            >
              ‹
            </button>
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white text-4xl"
              aria-label="Siguiente"
              style={{ right: "-40px" }}
            >
              ›
            </button>

            {/* Indicadores de navegación (puntos) */}
            <div className="flex justify-center mt-10 space-x-3">
              {[...Array(4)].map((_, i) => (
                <span
                  key={i}
                  className={`block w-2.5 h-2.5 rounded-full ${
                    i === 0 ? "bg-white" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
            {/* Botón Vista previa */}
            <div className="flex justify-center mt-5">
              <button
                className="px-10 py-2 border border-white text-white rounded-full text-sm font-medium hover:bg-white/10"
                aria-label="Vista previa"
                style={{ background: "transparent" }}
              >
                Vista previa
              </button>
            </div>
          </div>
          {/* Grid 3x2 de especificaciones */}
          <div className="w-full xl:w-auto flex-1 flex justify-center xl:ml-16">
            <div className="grid grid-cols-3 grid-rows-2 gap-5">
              {mergedSpecs.map((spec, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg flex flex-col items-center justify-between py-6 px-4"
                  style={{
                    height: "190px",
                    width: "190px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  }}
                  tabIndex={0}
                  aria-label={spec.label}
                >
                  <div className="flex justify-center items-center mb-2">
                    <Image
                      src={spec.icon}
                      alt={spec.label + " icon"}
                      width={50}
                      height={50}
                    />
                  </div>
                  <div
                    className="text-center text-gray-600 text-xs leading-tight mt-auto mb-3"
                    style={{ fontSize: "12px" }}
                  >
                    {spec.desc.split("\n").map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </div>
                  <h3 className="font-bold text-base text-black mb-1">
                    {spec.label}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EspecificacionesProduct;
