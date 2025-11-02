"use client";

const quickTags = ["pago", "devoluciones", "cancelaciones", "entrega", "trade-in", "garantía"];

export function HeroFAQ() {
  return (
    <div className="w-full flex justify-center">
      <div className="relative w-full max-w-[1400px]">
        <div 
          className="relative text-white py-20 md:py-24 lg:py-28 px-8 overflow-hidden"
          style={{
            backgroundImage: "url('https://res.cloudinary.com/dcljjtnxr/image/upload/v1759860713/Captura_wdrzi1.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        >

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <p className="text-sm mb-2 opacity-90">Estamos aquí para ti</p>
        <h1 className="text-3xl md:text-4xl font-bold mb-8">
          Bienvenidos al sitio de soporte de nuestra Tienda en Línea
        </h1>

        {/* Search Bar */}
        <div className="bg-white rounded-full p-2 flex items-center max-w-2xl mx-auto mb-6">
          <svg
            className="w-6 h-6 text-gray-400 ml-3"
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
            placeholder="Escribe tu pregunta"
            className="flex-1 px-4 py-2 outline-none text-gray-800"
          />
        </div>

        {/* Quick Tags */}
        <div className="flex flex-wrap gap-3 justify-center">
          {quickTags.map((tag, index) => (
            <button
              key={index}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white px-6 py-2 text-sm rounded-full transition-all duration-300 font-medium"
            >
              {tag}
            </button>
          ))}
        </div>
        </div>
      </div>
      </div>
    </div>
  );
}