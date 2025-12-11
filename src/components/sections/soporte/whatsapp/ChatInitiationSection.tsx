"use client";

import Image from "next/image";

export function ChatInitiationSection() {
  return (
    <div className="bg-white py-4">
      <div className="max-w-6xl mx-auto px-8">
        {/* Main Title */}
        <h2 className="text-5xl md:text-6xl font-black text-center mb-12 text-black">
          1. Iniciar un chat con Samsung
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
          {/* Option 2 - Direct Chat Button */}
          <div className="text-center">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 text-black">
              2. Opción
            </h3>
            <p className="text-black mb-6 text-base">
              Haz click en el botón para abrir directamente un chat con WhatsApp
            </p>
            
            {/* Cookie Preferences Button */}
            <div className="flex justify-center mb-4">
              <Image
                src="https://res.cloudinary.com/dcljjtnxr/image/upload/v1760421424/es-cookiepref_snvbyk.png"
                alt="Preferencias de cookies"
                width={180}
                height={50}
                className="object-contain"
              />
            </div>
            
            {/* Chat Button */}
            <div className="flex justify-center">
              <button className="bg-white border-2 border-black text-black px-8 py-3 rounded-full font-bold text-base transition-colors duration-200 hover:bg-gray-50">
                CHATEA AQUÍ
              </button>
            </div>
          </div>

          {/* Option 3 - QR Code */}
          <div className="text-center">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 text-black">
              3. Opción
            </h3>
            <p className="text-black mb-6 text-base">
              Escanea el código QR con la cámara de tu smartphone para iniciar un chat de WhatsApp
            </p>
            
            {/* QR Code */}
            <div className="flex justify-center">
              <Image
                src="https://res.cloudinary.com/dcljjtnxr/image/upload/v1760421247/whatsapp_hd1jql.png"
                alt="WhatsApp QR Code"
                width={320}
                height={320}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}