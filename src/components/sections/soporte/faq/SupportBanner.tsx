"use client";

import Link from "next/link";

export function SupportBanner() {
  return (
    <div className="bg-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden h-[400px] bg-gray-50">
          {/* Grid layout for content and image */}
          <div className="h-full grid grid-cols-1 lg:grid-cols-2 items-center">
            {/* Left side - Content */}
            <div className="px-8 md:px-16 py-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-black leading-tight">
                Guía útil para compras en línea
              </h2>
              <div className="flex flex-wrap gap-6">
                <Link
                  href="#"
                  className="text-base font-bold border-b-2 border-black pb-1 text-black hover:text-gray-700 transition-colors"
                >
                  Trade-in
                </Link>
                <Link
                  href="#"
                  className="text-base font-medium text-black hover:text-gray-700 transition-colors"
                >
                  Revisa nuestras ofertas
                </Link>
              </div>
            </div>

            {/* Right side - Image */}
            <div className="hidden lg:flex justify-end items-center h-full">
              <div 
                className="w-full h-full bg-no-repeat bg-contain bg-center"
                style={{
                  backgroundImage: "url('https://res.cloudinary.com/dcljjtnxr/image/upload/v1759861645/faq_home_useful_guide_for_online_pc_noback_l8njhd.avif')",
                  backgroundPosition: "right center"
                }}
              />
            </div>
          </div>
        </div>

        {/* Second Banner */}
        <div 
          className="relative rounded-2xl overflow-hidden h-[450px] mt-8 flex items-center"
          style={{
            backgroundImage: "url('https://res.cloudinary.com/dcljjtnxr/image/upload/v1759862204/Captura_ncibza.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30 rounded-2xl"></div>
          
          {/* Content positioned in center-right area */}
          <div className="relative z-10 w-full flex items-center">
            <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
              <div className="flex justify-end">
                <div className="max-w-xl text-right pr-8 lg:pr-16">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    Soporte para compras<br />
                    en línea
                  </h2>
                  <p className="text-white text-lg md:text-xl leading-relaxed">
                    ¿Necesitas ayuda escogiendo un nuevo dispositivo?<br />
                    Contáctanos a través de nuestro chat o contáctanos por nuestros<br />
                    canales oficiales
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
