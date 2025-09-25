import React from "react";
import Image, { StaticImageData } from "next/image";
import samsungImage from "@/img/electrodomesticos/especificaciones_nevera.png";


/**
 * 📱 CaracteristicasProduct - IMAGIQ ECOMMERCE
 *
 * Componente premium de especificaciones para electrodomesticos.
 * - Grid 3x2, tarjetas con iconos reales
 * - Imagen del producto a la izquierda
 * - Animaciones suaves y diseño responsive
 * - Código limpio, escalable y documentado
 * - Background y layout idénticos a la imagen de referencia
 */



/**
 * Componente principal de especificaciones
 * @param specs - Especificaciones personalizadas
 * @param productImage - Imagen del producto
 */
const CaracteristicasProduct = ({
  specs,
  productImage = samsungImage,
}: {
  specs?: { label: string; value: string; icon?: StaticImageData }[];
  productImage?: StaticImageData | string;
}) => {


  return (
    <section
      className="w-full flex flex-col items-center"
      style={{
        fontFamily: "SamsungSharpSans",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "40px",
        paddingBottom: "40px",
        backgroundColor: "#ffffffff",
      }}
      aria-label="Especificaciones del producto"
    >
      <div className="max-w-7xl w-full mx-auto">
        <div className="flex flex-col xl:flex-row w-full items-center justify-between ">
          {/* Grid 3x2 de especificaciones */}
          <div className="w-full xl:flex-1 flex justify-center xl:ml-16">
            <div className="grid
                grid-cols-1 
                sm:grid-cols-2 
                md:grid-cols-3 
                gap-4  /* móvil pequeño: 1rem */
                sm:gap-6 /* sm: 1.5rem */
                md:gap-8 /* md: 2rem */
                lg:gap-30 /* lg: 3rem */
                max-w-4xl
                mx-auto" >
              {mergedSpecs.map((spec, index) => (
                <div
                  key={index}
                  className="w-[160px] h-[160px] bg-[#D9D9D9] rounded-full flex flex-col items-center justify-center text-center overflow-hidden shadow-sm "
                  tabIndex={0}
                  aria-label={spec.label}
                >
                  <h3 className="font-bold text-[13px] text-black break-words whitespace-normal leading-tight">
                    {spec.label}
                  </h3>
                  <div className="flex justify-center items-center mb-2">
                    <Image
                      src={spec.icon}
                      alt={spec.label + " icon"}
                      width={70}
                      height={70}
                      className="w-10 h-10 sm:w-[70px] sm:h-[70px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaracteristicasProduct;
