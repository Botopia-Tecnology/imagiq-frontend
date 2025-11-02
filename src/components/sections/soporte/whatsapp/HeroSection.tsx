"use client";

import Image from "next/image";

export function HeroSection() {
  return (
    <div className="w-full flex justify-center">
      <div className="relative w-full max-w-[1400px] h-[300px] md:h-[320px] lg:h-[340px] overflow-hidden">
        <Image
          src="https://res.cloudinary.com/dcljjtnxr/image/upload/v1760419926/banner_whatsapp_1440x300_pc_yjad0q.jpg"
          alt="WhatsApp Samsung Support Banner"
          fill
          className="object-contain object-center"
          priority
        />

        {/* Texto sobre el banner, alineado a la izquierda y en una sola línea en pantallas medianas+ */}
        <div className="absolute bottom-6 left-8 md:left-[36%] lg:left-[42%] xl:left-[46%] z-10 text-left px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight drop-shadow-xl md:whitespace-nowrap">
            Ayudarte ahora es más fácil
          </h1>
        </div>
      </div>
    </div>
  );
}
