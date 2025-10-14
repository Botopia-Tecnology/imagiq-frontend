"use client";

import Image from "next/image";

export function HeroSection() {
  return (
    <div className="relative h-[400px] flex items-start justify-start mx-24 md:mx-32 lg:mx-40 xl:mx-48 -mt-4">
      <div className="absolute inset-0">
        <Image
          src="https://res.cloudinary.com/dcljjtnxr/image/upload/v1760419926/banner_whatsapp_1440x300_pc_yjad0q.jpg"
          alt="WhatsApp Samsung Support Banner"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Solo el texto "Ayudarte ahora es más fácil" posicionado abajo a la derecha */}
      <div className="absolute bottom-12 right-52 z-10">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight drop-shadow-lg">
          Ayudarte ahora es más fácil
        </h1>
      </div>
    </div>
  );
}
