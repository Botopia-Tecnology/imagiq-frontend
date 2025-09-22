import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import samsungImage from "@/img/electrodomesticos/especificaciones_nevera.png";
import i1 from "@/img/electrodomesticos/i1.png";
import i2 from "@/img/electrodomesticos/i2.png";
import i3 from "@/img/electrodomesticos/i3.png";
import i4 from "@/img/electrodomesticos/i4.png";
import i5 from "@/img/electrodomesticos/i5.png";
import i6 from "@/img/electrodomesticos/i6.png";
import i7 from "@/img/electrodomesticos/i7.png";
import i8 from "@/img/electrodomesticos/i8.png";
import i9 from "@/img/electrodomesticos/i9.png";

/**
 * 📱 EspecificacionesProduct - IMAGIQ ECOMMERCE
 *
 * Componente premium de especificaciones para electrodomesticos.
 * - Grid 3x2, tarjetas con iconos reales
 * - Imagen del producto a la izquierda
 * - Animaciones suaves y diseño responsive
 * - Código limpio, escalable y documentado
 * - Background y layout idénticos a la imagen de referencia
 */

// Especificaciones con iconos reales
const especificacionesData = [
  {
    label: "Parte inferior izquierda",
    desc: "...",
    icon: i1,
  },
  {
    label: "Parte inferior derecha",
    desc: "...",
    icon: i2,
  },
  {
    label: "Capacidad",
    desc: "...",
    icon: i3,
  },
  {
    label: "Rendimiento",
    desc: "...",
    icon: i4,
  },
  {
    label: "Conectividad",
    desc: "...",
    icon: i5,
  },
  {
    label: "Categoría",
    desc: "...",
    icon: i6,
  },
  {
    label: "Funicón de enfriamiento",
    desc: "...",
    icon: i7,
  },
  {
    label: "Características exteriores",
    desc: "...",
    icon: i8,
  },
  {
    label: "Especificaciones fisicas",
    desc: "...",
    icon: i9,
  },
];

const deviceImages: (StaticImageData | string)[] = [
  samsungImage,
  // Puedes agregar más imágenes aquí si lo deseas
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
  const [currentImg, setCurrentImg] = useState(0);
  const images = deviceImages.length > 0 ? deviceImages : [productImage];
  // Mezclar datos del padre con los originales, priorizando los del padre
  const mergedSpecs = especificacionesData.map((defaultSpec) => {
    const custom = specs?.find((s) => s.label === defaultSpec.label);
    return {
      label: defaultSpec.label,
      desc: custom?.value || defaultSpec.desc,
      icon: defaultSpec.icon,
    };
  });

  const handlePrev = () => {
    setCurrentImg((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setCurrentImg((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
        className="relative flex items-center justify-center w-full min-h-[600px] "
        style={{
          fontFamily: "SamsungSharpSans",
        }}
      >
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
        <div className="flex flex-col xl:flex-row w-full items-center justify-between ">
          {/* Imagen del producto a la izquierda */}
          <div className="w-full xl:flex-1 flex flex-col items-center mb-12 xl:mb-0 relative h-full ">
            <div className="relative mx-auto sm:mx-0 flex justify-center items-center w-full h-full">
              <div className="w-[98vw] h-[80vw] max-w-[370px] max-h-[370px] sm:w-[340px] sm:h-[450px] rounded-2xl flex items-center justify-center">
                {/* Flecha izquierda */}
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-black  rounded-full shadow-lg p-2 text-3xl sm:left-0 sm:text-black sm:bg-transparent sm:shadow-none sm:text-4xl"
                  aria-label="Anterior"
                  onClick={handlePrev}
                  style={{ transition: "background 0.2s" }}
                >
                  ‹
                </button>
                <Image
                  src={images[currentImg]}
                  alt="Smartphone"
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                  className="z-0"
                />
                {/* Flecha derecha */}
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-black   rounded-full shadow-lg p-2 text-3xl sm:right-0 sm:text-black sm:bg-transparent sm:shadow-none sm:text-4xl"
                  aria-label="Siguiente"
                  onClick={handleNext}
                  style={{ transition: "background 0.2s" }}
                >
                  ›
                </button>
              </div>
            </div>
            {/* Indicadores de navegación (puntos) */}
            <div className="flex justify-center mt-10 space-x-3">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`block w-2.5 h-2.5 rounded-full ${
                    i === currentImg ? "bg-black" : "bg-black/30"
                  }`}
                />
              ))}
            </div>
            {/* Botón Vista previa */}
            <div className="flex justify-center mt-5">
              <button
                className="bg-transparent text-black border border-black rounded-full px-4 py-2 font-semibold text-base shadow hover:bg-black hover:text-gray transition-all"
                aria-label="Vista previa"
                style={{ background: "transparent" }}
              >
                Vista previa
              </button>
            </div>
          </div>
          {/* Grid 3x2 de especificaciones */}
          <div className="w-full xl:flex-1 flex justify-center xl:ml-16">
            <div className="grid grid-cols-3 grid-rows-2 gap-2 sm:gap-5 max-w-full sm:max-w-none">
              {mergedSpecs.map((spec, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg flex flex-col items-center justify-center py-3 px-1 shadow-sm sm:py-6 sm:px-4 text-center"
                  tabIndex={0}
                  aria-label={spec.label}
                >
                  <div className="flex justify-center items-center mb-2">
                    <Image
                      src={spec.icon}
                      alt={spec.label + " icon"}
                      width={70}
                      height={70}
                      className="w-10 h-10 sm:w-[70px] sm:h-[70px]"
                    />
                  </div>
                  <h3 className="font-bold text-[11px] sm:text-[13px] md:text-base text-black mb-1 break-words whitespace-normal text-center">
                    {spec.label}
                  </h3>
                  <div className="text-center text-gray-600 text-[11px] sm:text-xs leading-tight mt-auto mb-3 break-words whitespace-pre-line">
                    {spec.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
};

export default EspecificacionesProduct;
