"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const cards = [
  {
    title: "Tips de uso para Galaxy",
    image: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1759841244/Tips_Galaxy_Z_Flip_Desktop_cuwjgx.png",
    href: "#",
  },
  {
    title: "Dispositivos móviles",
    image: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1759841276/Dispositivos_moviles_Desktop_rqhmia.jpg",
    href: "#",
  },
  {
    title: "Guía útil para electrodomésticos",
    image: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1759841281/desktop_How-to_Useful-guide-for-HA_08-12-2022_allpxx.jpg",
    href: "#",
  },
  {
    title: "Consejos para utilizar tu Smart TV",
    image: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1759841320/Consejos_Smart_Tv_pysiev.png",
    href: "#",
  },
  {
    title: "Manuales & Descargas",
    image: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1759841351/PC_manuals-and-download_330_330_ahbuqe.avif",
    href: "#",
  },
];

const expertSlides = [
  {
    title: "Ahorra energía de forma inteligente",
    subtitle: "Tecnología Samsung para una vida sostenible",
    description: "",
    buttonText: "Conozca más",
    image: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1759841406/horizontal-banner_y4rul7.jpg",
  },
  {
    title: "Servicio técnico especializado",
    subtitle: "Nuestros expertos están listos para ayudarte.",
    description: "Soporte profesional cuando lo necesites.",
    buttonText: "Contactar",
    image: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1759841420/energy_efficiency_PC_3_pkaz8m.jpg",
  },
  {
    title: "¿Necesita ayuda de expertos?",
    subtitle: "Contamos con el apoyo experto que necesita.",
    description: "Descubre cuál es el adecuado para usted.",
    buttonText: "Conocer más",
    image: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1759841424/cs_soporte_desktop_jtf1zv.jpg",
  },
];

export function HowToSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < expertSlides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  return (
    <div className="bg-white py-4">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-black text-center mb-8">
          ¿Cómo hacerlo?
        </h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16 max-w-5xl mx-auto">
          {/* Large card - spans 2 rows */}
          <Link
            href={cards[0].href}
            className="lg:col-span-2 lg:row-span-2 group relative rounded-3xl overflow-hidden bg-gray-100 h-full min-h-[600px]"
          >
            <Image
              src={cards[0].image}
              alt={cards[0].title}
              fill
              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
            />
            {/* Título arriba */}
            <div className="absolute bottom-130 left-0 right-0 px-6 text-black flex justify-center">
              <h3 className="text-2xl font-bold text-center">{cards[0].title}</h3>
            </div>
            
            {/* Botón abajo */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-black flex flex-col items-center justify-center">
              {/* Button - slides in from bottom on hover */}
              <div className="overflow-hidden h-0 group-hover:h-10 transition-all duration-300">
                <button className="bg-black text-white hover:bg-white hover:text-black px-5 py-2 rounded-full font-medium text-xs translate-y-10 group-hover:translate-y-0 transition-all duration-300 whitespace-nowrap">
                  Más información
                </button>
              </div>
            </div>
          </Link>

          {/* Small cards */}
          {cards.slice(1).map((card, index) => (
            <Link
              key={index}
              href={card.href}
              className="group relative rounded-3xl overflow-hidden bg-gray-100 h-80"
            >
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-black flex flex-col items-center justify-center">
                <h3 className="text-lg font-bold text-center mb-2">{card.title}</h3>
                
                {/* Button - slides in from bottom on hover */}
                <div className="overflow-hidden h-0 group-hover:h-10 transition-all duration-300">
                  <button className="bg-black text-white hover:bg-white hover:text-black px-5 py-2 rounded-full font-medium text-xs translate-y-10 group-hover:translate-y-0 transition-all duration-300 whitespace-nowrap">
                    Más información
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Expert Help Carousel */}
        <div className="relative">
          <div className="overflow-hidden rounded-3xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {expertSlides.map((slide, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0"
                >
                  <div className="relative h-96 bg-gray-200">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover"
                    />
                    
                    <div className="absolute inset-0 flex items-center">
                      <div className="max-w-xl p-12">
                        <h3 className={`text-3xl font-bold mb-4 ${index === 1 ? 'text-white' : 'text-black'}`}>{slide.title}</h3>
                        <p className={`text-base mb-2 ${index === 1 ? 'text-white' : 'text-black'}`}>{slide.subtitle}</p>
                        {slide.description && (
                          <p className={`text-sm mb-6 ${index === 1 ? 'text-white' : 'text-black'}`}>{slide.description}</p>
                        )}
                        <button className="bg-white text-black hover:bg-gray-100 px-6 py-2.5 rounded-full font-medium text-sm transition-colors inline-flex items-center gap-2 border border-gray-300">
                          {slide.buttonText}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          {currentSlide > 0 && (
            <button
              onClick={prevSlide}
              className="absolute -left-6 top-1/2 -translate-y-1/2 bg-gray-600/80 hover:bg-gray-700 rounded-full p-2.5 shadow-lg transition-colors z-10"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {currentSlide < expertSlides.length - 1 && (
            <button
              onClick={nextSlide}
              className="absolute -right-6 top-1/2 -translate-y-1/2 bg-gray-600/80 hover:bg-gray-700 rounded-full p-2.5 shadow-lg transition-colors z-10"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-6">
            {expertSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all border ${
                  currentSlide === index ? "bg-black border-black" : "bg-transparent border-gray-500"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
