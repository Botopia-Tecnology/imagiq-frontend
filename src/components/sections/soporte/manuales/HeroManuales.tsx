"use client";

import Image from "next/image";

export function HeroManuales() {
  return (
    <div className="relative bg-black text-white py-16 px-4 mx-24 md:mx-32 lg:mx-40 xl:mx-48">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div className="space-y-4">
            <div className="w-16 h-16 bg-teal-400 rounded-full flex items-center justify-center mb-4">
              <span className="text-black text-2xl font-bold">i</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Manuales & Descargas
            </h1>
            <p className="text-gray-300 text-lg">
              Encuentra y descarga el manual de usuario en PDF, guías, software o
              instrucciones de tu producto Samsung
            </p>
          </div>

          {/* Graphics */}
          <div className="relative h-64 flex items-center justify-end">
            <Image
              src="/soporte/manuales-descargas.svg"
              alt="Manuales y Descargas"
              width={400}
              height={300}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
