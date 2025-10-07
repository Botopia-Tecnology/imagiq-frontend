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
          src="https://res.cloudinary.com/dcljjtnxr/image/upload/v1759799247/home_soporte_wmnfrn.png"
          alt="Soporte Samsung"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <p className="text-sm mb-2 font-bold tracking-wide">Estamos para ayudarte</p>
        <h1 className="text-4xl md:text-5xl font-black mb-8 tracking-wide">
          Bienvenido a Soporte Samsung Colombia
        </h1>

        {/* Search Bar */}
        <div className="bg-white/20 backdrop-blur-md rounded-full p-2 flex items-center max-w-2xl mx-auto mb-6 border border-white/30 shadow-lg">
          <svg
            className="w-6 h-6 text-white/80 ml-3"
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
            className="flex-1 px-4 py-2 outline-none text-white placeholder-white/70 bg-transparent"
          />
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-2 justify-center max-w-4xl mx-auto">
          {/* Primera fila - 3 botones */}
          <div className="flex gap-2 justify-center">
            {quickLinks.slice(0, 3).map((link, index) => (
              <button
                key={index}
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white hover:text-white px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md border border-white/20"
              >
                {link}
              </button>
            ))}
          </div>
          
          {/* Segunda fila - 3 botones */}
          <div className="flex gap-2 justify-center">
            {quickLinks.slice(3, 6).map((link, index) => (
              <button
                key={index + 3}
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white hover:text-white px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md border border-white/20"
              >
                {link}
              </button>
            ))}
          </div>
          
          {/* Tercera fila - 1 botón centrado */}
          <div className="flex gap-2 justify-center">
            {quickLinks.slice(6, 7).map((link, index) => (
              <button
                key={index + 6}
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white hover:text-white px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md border border-white/20"
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
