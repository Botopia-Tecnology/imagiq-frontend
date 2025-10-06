"use client";

import Image from "next/image";
import { useState } from "react";

const slides = [
  {
    title: "Lengua de señas",
    subtitle: "Accede a soporte por video chat con un intérprete experto en nuestros productos o recibe asesoría en tu compra.",
    description: "Tener siempre a alguien que entienda en tu idioma es Smart Xperience.",
    buttonText: "Conocer más",
    buttonHref: "#",
    image: "/soporte/carousel-lengua.svg",
    theme: "dark",
  },
  {
    title: "SmartThings",
    subtitle: "Ten el control de tu casa en la palma de tu mano.",
    buttonText: "Más información",
    buttonHref: "#",
    image: "/soporte/carousel-smartthings.svg",
    theme: "light",
  },
  {
    title: "Conscious Services",
    subtitle: "Juntos, construyendo un futuro mejor todos los días.",
    buttonText: "Más información",
    buttonHref: "#",
    image: "/soporte/carousel-conscious.svg",
    theme: "light",
  },
  {
    title: "Abre una cuenta Samsung",
    subtitle: "Abre una cuenta Samsung gratuita y ten todos tus dispositivos en un único lugar.",
    description: "Solo así puedes acceder a la app SmartThings y disfrutar una vida conectada y mucho más inteligente.",
    buttonText: "Abrir cuenta",
    buttonHref: "#",
    image: "/soporte/carousel-account.svg",
    theme: "blue",
  },
  {
    title: "Samsung Select",
    subtitle: "El servicio especial de Samsung para ti que mereces exclusividad.",
    buttonText: "Conoce más",
    buttonHref: "#",
    image: "/soporte/carousel-select.svg",
    theme: "dark",
  },
];

export function FeaturedCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const maxSlideIndex = Math.max(0, slides.length - 3);

  const nextSlide = () => {
    if (currentSlide < maxSlideIndex) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide >= maxSlideIndex;

  return (
    <div className="max-w-7xl mx-auto px-4 pb-16">
      <div className="relative">
        {/* Carousel container - shows 3 slides at a time */}
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 33.333}%)` }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                className="w-1/3 flex-shrink-0 px-3"
              >
                <div className={`relative rounded-3xl overflow-hidden h-[450px] ${
                  slide.theme === 'dark' ? 'bg-black' : 
                  slide.theme === 'blue' ? 'bg-blue-600' : 
                  'bg-gray-200'
                }`}>
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                  />
                  <div className={`absolute inset-0 ${
                    slide.theme === 'dark' ? 'bg-black/50' : 
                    slide.theme === 'blue' ? 'bg-blue-600/70' : 
                    'bg-white/30'
                  }`} />
                  
                  {/* Content */}
                  <div className={`absolute inset-0 p-8 flex flex-col justify-between ${
                    slide.theme === 'light' ? 'text-black' : 'text-white'
                  }`}>
                    <div>
                      <h3 className="text-2xl font-bold mb-3">{slide.title}</h3>
                      <p className="text-sm mb-2">{slide.subtitle}</p>
                      {slide.description && (
                        <p className="text-xs opacity-90">{slide.description}</p>
                      )}
                    </div>
                    
                    <button 
                      className={`self-start border-2 ${
                        slide.theme === 'dark' 
                          ? 'border-white bg-white text-black hover:bg-black hover:text-white' 
                          : slide.theme === 'blue'
                          ? 'border-white bg-white text-black hover:bg-blue-600 hover:text-white'
                          : 'border-black bg-black text-white hover:bg-white hover:text-black'
                      } px-5 py-2 rounded-full font-medium text-sm transition-all inline-flex items-center gap-2`}
                    >
                      {slide.buttonText}
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons - Black with opacity */}
        {!isFirstSlide && (
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 rounded-full p-3 shadow-lg transition-colors z-10"
            aria-label="Previous slide"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {!isLastSlide && (
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 rounded-full p-3 shadow-lg transition-colors z-10"
            aria-label="Next slide"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Dots Indicators - Below carousel */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: maxSlideIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2.5 w-2.5 rounded-full transition-all ${
              currentSlide === index
                ? "bg-black"
                : "bg-gray-400 hover:bg-gray-600"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
