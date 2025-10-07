"use client";

import Image from "next/image";
import Link from "next/link";

export function SupportBanner() {
  return (
    <div className="bg-gray-100 py-0 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden h-[400px]">
          {/* Background Image */}
          <Image
            src="/soporte/faq-banner.jpg"
            alt="Soporte para compras en línea"
            fill
            className="object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-xl ml-12 md:ml-24 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Soporte para compras en línea
              </h2>
              <p className="text-base mb-6">
                ¿Necesitas ayuda escogiendo un nuevo dispositivo? Contáctanos a
                través de nuestro chat o contáctanos por nuestros canales oficiales
              </p>
            </div>
          </div>
        </div>

        {/* Guide Section */}
        <div className="bg-white rounded-t-3xl -mt-8 relative z-10 p-8">
          <h3 className="text-2xl font-bold mb-4">Guía útil para compras en línea</h3>
          <div className="flex gap-4">
            <Link
              href="#"
              className="text-sm font-medium border-b-2 border-black pb-1"
            >
              Trade-in
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-600 hover:text-black transition-colors pb-1"
            >
              Revisa nuestras ofertas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
