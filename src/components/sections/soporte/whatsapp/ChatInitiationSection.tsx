"use client";

import Image from "next/image";

export function ChatInitiationSection() {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Title */}
        <h2 className="text-3xl md:text-4xl font-black text-center mb-12">
          1. Iniciar un chat con Samsung
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Option 2 - Direct Chat Button */}
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-6">2. Opción</h3>
            <p className="text-gray-700 mb-8 text-lg">
              Haz click en el botón para abrir directamente un chat con WhatsApp
            </p>
            
            {/* Chat Button */}
            <div className="flex justify-center">
              <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                CHATEA AQUÍ
              </button>
            </div>
          </div>

          {/* Option 3 - QR Code */}
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-6">3. Opción</h3>
            <p className="text-gray-700 mb-8 text-lg">
              Escanea el código QR con la cámara de tu smartphone para iniciar un chat de WhatsApp
            </p>
            
            {/* QR Code */}
            <div className="flex justify-center">
              <div className="w-48 h-48 bg-white border-2 border-gray-300 rounded-lg p-4 shadow-lg">
                <Image
                  src="/images/whatsapp-qr.png"
                  alt="WhatsApp QR Code"
                  width={176}
                  height={176}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            
            {/* Instructions */}
            <p className="text-sm text-gray-600 mt-4">
              Escanea con la cámara de tu teléfono
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
