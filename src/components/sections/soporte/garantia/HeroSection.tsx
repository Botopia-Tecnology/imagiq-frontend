"use client";

import Image from "next/image";

export function HeroSection() {
  return (
    <div className="relative h-[500px] flex items-center justify-center mx-24 md:mx-32 lg:mx-40 xl:mx-48">
      <div className="absolute inset-0">
        <Image
          src="/images/garantia-hero.png"
          alt="Información sobre la garantía"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
          Información sobre la garantía
        </h1>
        
        <div className="max-w-4xl mx-auto mb-8">
          <p className="text-sm md:text-base leading-relaxed opacity-90">
            Para tu tranquilidad, te ofrecemos una garantía en todos nuestros productos. 
            Si necesitas realizar un reclamo referente a la garantía, ponte en contacto con nosotros 
            y te guiaremos a través del proceso. A continuación encontrarás un resumen de lo que 
            cubre la garantía, enlaces para registrar tus productos y tus actuales productos registrados. 
            Te recomendamos registrar tu producto con nosotros, para que podamos ayudarte lo más rápido 
            y eficientemente posible.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="bg-transparent border-2 border-white text-white hover:opacity-80 px-6 py-3 rounded-full font-bold text-sm transition-opacity duration-200 shadow-lg hover:shadow-xl inline-flex items-center gap-2 cursor-pointer">
            REGISTRA TU PRODUCTO
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </button>
          
          <button className="bg-transparent border-2 border-white text-white hover:opacity-80 px-6 py-3 rounded-full font-bold text-sm transition-opacity duration-200 shadow-lg hover:shadow-xl inline-flex items-center gap-2 cursor-pointer">
            MI PRODUCTO REGISTRADO
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
