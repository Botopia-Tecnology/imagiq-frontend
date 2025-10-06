"use client";

import Image from "next/image";

const quickLinks = [
  "Verificación de dos pasos",
  "Una interfaz de usuario 8 Android 16",
  "Encuentra un centro de soporte de Samsung",
  "Manuales Descargas",
  "Restablecer mi Galaxy",
  "Información sobre garantía",
  "Actualizar el software de tu televisor",
];

export function HeroSection() {
  return (
    <div className="relative h-[450px] flex items-center justify-center mx-24 md:mx-32 lg:mx-40 xl:mx-48">
      <div className="absolute inset-0">
        <Image
          src="/soporte/hero-soporte.jpg"
          alt="Soporte Samsung"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <p className="text-sm mb-2">Estamos para ayudarte</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-8">
          Bienvenido a Soporte Samsung Colombia
        </h1>

        {/* Search Bar */}
        <div className="bg-white rounded-full p-2 flex items-center max-w-2xl mx-auto mb-6">
          <svg
            className="w-6 h-6 text-gray-400 ml-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Buscar en Soporte"
            className="flex-1 px-4 py-2 outline-none text-gray-800"
          />
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-3 justify-center">
          {quickLinks.map((link, index) => (
            <button
              key={index}
              className="bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-full text-sm transition-colors"
            >
              {link}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
