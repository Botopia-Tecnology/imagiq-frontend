"use client";

export function HeroNoticias() {
  return (
    <div className="w-full flex justify-center">
      <div className="relative w-full max-w-[1400px]">
        <div 
          className="relative text-white py-20 md:py-24 lg:py-28 px-8 overflow-hidden min-h-[500px] flex items-center justify-center rounded-lg"
          style={{
            backgroundImage: "url('https://res.cloudinary.com/dcljjtnxr/image/upload/v1762055060/News_Alerts_PC_pylt1d_fbczx9.avif')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        >
          <div className="absolute inset-0 bg-black/20" />
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Compruebe la variedad de
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Noticias y Alertas.
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}