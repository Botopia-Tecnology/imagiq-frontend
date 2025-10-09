"use client";


export function HeroManuales() {
  return (
    <div className="relative w-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 2xl:px-48 py-4">
      {/* Background Image Container */}
      <div 
        className="relative w-full h-[400px] bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden"
        style={{
          backgroundImage: "url('https://res.cloudinary.com/dcljjtnxr/image/upload/v1759856989/Manual_downloads_KV_jyfpas.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
            Manuales & Descargas
          </h1>
          <p className="text-white text-lg sm:text-xl md:text-2xl max-w-4xl font-medium">
            Encuentra y descarga el manual de usuario en PDF, guías, software o
            instrucciones de tu producto Samsung
          </p>
        </div>
      </div>
      
      {/* Línea separadora */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="w-full h-px bg-gray-200"></div>
      </div>
    </div>
  );
}
