"use client";

import Image from "next/image";

export function HeroSection() {
  return (
    <div className="w-full flex justify-center">
      <div className="relative w-full max-w-[1400px]">
        <div className="relative w-full h-[400px] md:h-[450px] lg:h-[500px] overflow-hidden">
          <Image
            src="https://res.cloudinary.com/dcljjtnxr/image/upload/v1762121443/Blue_Elegant_Traditional_Artwork_Authenticity_Certificate_sizx9i.png"
            alt="Costo y Repuestos"
            fill
            className="object-cover object-center"
            priority
          />

          {/* Contenido del hero centrado */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-8 max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 drop-shadow-xl">
              Precios de partes
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-white max-w-4xl leading-relaxed drop-shadow-lg font-bold">
              Piezas originales, técnicos certificados y herramientas especializadas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

