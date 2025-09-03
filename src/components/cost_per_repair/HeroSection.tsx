"use client";

export default function HeroSection() {
  return (
    <section className="relative h-[300px] bg-gradient-to-r from-blue-900 to-blue-700 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          {/* Imagen de técnicos trabajando */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 300"><rect fill="%23374151" width="800" height="300"/><g fill="%23ffffff" opacity="0.1"><circle cx="200" cy="100" r="50"/><circle cx="600" cy="200" r="70"/><rect x="100" y="150" width="100" height="80" rx="10"/></g></svg>')`
            }}
          ></div>
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
