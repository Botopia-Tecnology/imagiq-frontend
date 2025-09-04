"use client";

import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative h-[300px] bg-gradient-to-r from-blue-500 to-blue-600 overflow-hidden">
      {/* Background con gradiente azul */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          {/* Gradiente azul de fondo */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          {/* Patrón sutil opcional */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Precios de partes
          </h1>
          <p className="text-xl md:text-2xl font-light opacity-90">
            Piezas originales, técnicos certificados y herramientas especializadas
          </p>
        </div>
      </div>
    </section>
  );
}
