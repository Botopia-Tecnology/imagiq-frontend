"use client";

import Image from "next/image";

export function HeroSection() {
  return (
    <div className="w-full">
      <div className="relative w-full h-[400px] md:h-[450px] lg:h-[500px] overflow-hidden">
        <Image
          src="https://res.cloudinary.com/dcljjtnxr/image/upload/v1760488356/KV_pc_jn3k23.jpg"
          alt="Información sobre la garantía"
          fill
          className="object-cover object-center"
          priority
        />

        {/* Contenido del hero centrado */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-4 max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 drop-shadow-xl">
            Información sobre la garantía
          </h1>
          <p className="text-xs md:text-sm lg:text-base text-white max-w-4xl leading-relaxed drop-shadow-lg mb-6 font-normal">
            Para tu tranquilidad, te ofrecemos una garantía en todos nuestros productos. 
            Si necesitas realizar un reclamo referente a la garantía, ponte en contacto con nosotros y te guiaremos a través del proceso.
            A continuación encontrarás un resumen de lo que cubre la garantía, enlaces para registrar tus productos y tus actuales productos registrados.
            Te recomendamos registrar tu producto con nosotros, para que podamos ayudarte lo más rápido y eficientemente posible.
          </p>
          
          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition-colors duration-300 flex items-center gap-2">
              REGISTRA TU PRODUCTO
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition-colors duration-300 flex items-center gap-2">
              MI PRODUCTO REGISTRADO
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
