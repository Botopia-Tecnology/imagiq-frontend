import React from "react";
import Image, { StaticImageData } from "next/image";
import samsungImage from "@/img/dispositivosMoviles/cel1.png";

/**
 * 📱 EspecificacionesProduct - IMAGIQ ECOMMERCE
 *
 * Componente de especificaciones igual a la imagen de referencia.
 * - Grid 3x2, tarjetas con iconos
 * - Imagen del producto a la izquierda
 * - Diseño responsive
 * - Diseño idéntico a la referencia visual
 * - Código limpio y escalable
 */

// Definición de las especificaciones con los datos e iconos actualizados
const especificacionesData = [
  {
    label: "Procesador",
    desc: "Velocidad de la CPU: 4.47GHz, 3.5GHz\nTipo CPU: Octa-Core",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect x="14" y="14" width="12" height="12" rx="4" fill="#14213D" />
        <rect
          x="4"
          y="4"
          width="32"
          height="32"
          rx="8"
          stroke="#14213D"
          strokeWidth="2"
        />
        <rect x="18" y="18" width="4" height="4" rx="2" fill="#fff" />
      </svg>
    ),
  },
  {
    label: "Pantalla",
    desc: "156.4mm (6.2'' rectángulo completo) / 152.3mm (6.0'' bordes redondeados)",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect x="10" y="14" width="20" height="12" rx="4" fill="#14213D" />
        <rect
          x="4"
          y="4"
          width="32"
          height="32"
          rx="8"
          stroke="#14213D"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    label: "Cámara",
    desc: "Velocidad de la CPU: 4.47GHz, 3.5GHz\nTipo CPU: Octa-Core",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="8" fill="#14213D" />
        <rect
          x="4"
          y="4"
          width="32"
          height="32"
          rx="8"
          stroke="#14213D"
          strokeWidth="2"
        />
        <circle cx="20" cy="20" r="3" fill="#fff" />
      </svg>
    ),
  },
  {
    label: "Memoria",
    desc: "Almacenamiento (GB) 256",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect x="12" y="18" width="16" height="8" rx="2" fill="#14213D" />
        <rect
          x="4"
          y="4"
          width="32"
          height="32"
          rx="8"
          stroke="#14213D"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    label: "Red",
    desc: "Almacenamiento (GB) 256",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle
          cx="20"
          cy="20"
          r="8"
          stroke="#14213D"
          strokeWidth="2"
          fill="none"
        />
        <rect
          x="4"
          y="4"
          width="32"
          height="32"
          rx="8"
          stroke="#14213D"
          strokeWidth="2"
        />
        <circle cx="20" cy="20" r="3" fill="#14213D" />
      </svg>
    ),
  },
  {
    label: "Conectividad",
    desc: "USB Interfaz USB Tipo-C",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path d="M20 10C24 10 28 14 28 18" stroke="#14213D" strokeWidth="2" />
        <path
          d="M20 14C22.5 14 25 16.5 25 18"
          stroke="#14213D"
          strokeWidth="2"
        />
        <circle cx="20" cy="24" r="2" fill="#14213D" />
        <rect
          x="4"
          y="4"
          width="32"
          height="32"
          rx="8"
          stroke="#14213D"
          strokeWidth="2"
        />
      </svg>
    ),
  },
];

// Permite recibir especificaciones desde el padre (ViewProduct)
const EspecificacionesProduct = ({
  specs,
  productImage = samsungImage,
}: {
  specs?: { label: string; value: string; icon?: React.ReactNode }[];
  productImage?: StaticImageData | string; // Acepta StaticImageData o string URL
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
    <div
      className="w-full flex flex-col items-center"
      style={{
        fontFamily: "SamsungSharpSans",
        minHeight: "600px",
        padding: "40px 20px",
      }}
    >
      <div className="max-w-7xl w-full mx-auto">
        {/* Título centrado */}
        <h2
          className="text-4xl font-bold text-white mb-10 text-center"
          style={{ letterSpacing: "-0.5px" }}
        >
          Especificaciones
        </h2>

        <div className="flex flex-col lg:flex-row w-full gap-8 items-center justify-center">
          {/* Teléfono a la izquierda */}
          <div className="w-full lg:w-1/3 flex justify-center lg:justify-start mb-8 lg:mb-0 relative">
            <div
              className="relative"
              style={{ width: "280px", height: "380px" }}
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
              className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white text-4xl opacity-70 hover:opacity-100"
              aria-label="Anterior"
              style={{ left: "-30px" }}
            >
              ‹
            </button>
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white text-4xl opacity-70 hover:opacity-100"
              aria-label="Siguiente"
              style={{ right: "-30px" }}
            >
              ›
            </button>
          </div>

          {/* Grid 3x2 de especificaciones */}
          <div className="w-full lg:w-2/3 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {mergedSpecs.map((spec, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center py-8 px-6"
                  style={{ height: "180px" }}
                >
                  <div className="mb-3">{spec.icon}</div>
                  <div
                    className="text-center text-gray-600 font-medium mb-2"
                    style={{ fontSize: "1rem" }}
                  >
                    {spec.desc.split("\n").map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </div>
                  <h3 className="font-bold text-xl text-[#14213D]">
                    {spec.label}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Indicadores de navegación (puntos) */}
        <div className="flex justify-center mt-10 space-x-2">
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className={`block w-2 h-2 rounded-full ${
                i === 0 ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Botón Vista previa */}
        <div className="flex justify-center mt-5">
          <button className="px-8 py-2 border border-white text-white rounded-full text-sm font-medium hover:bg-white/10 transition-colors">
            Vista previa
          </button>
        </div>
      </div>
    </div>
  );
};

export default EspecificacionesProduct;
