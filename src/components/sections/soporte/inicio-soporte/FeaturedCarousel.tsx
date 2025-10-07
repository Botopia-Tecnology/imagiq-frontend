"use client";

import Image from "next/image";
import { useState } from "react";

const slides = [
  {
    title: "",
    subtitle: "",
    description: "",
    buttonText: "Conocer más",
    buttonHref: "#",
    image: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1759841068/Banner_Try_And_Buy_Desktop_448x440_uh6rwo.jpg",
    theme: "light",
    buttonStyle: "white",
  },
  {
    title: "Lengua de señas",
    subtitle: "Accede a soporte por video chat con un intérprete experto en nuestros productos o recibe asesoría en tu compra.",
    description: "Tener siempre a alguien que entienda en tu idioma es Smart Xperience.",
    buttonText: "Conocer más",
    buttonHref: "#",
    image: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1759841100/banner_sign_language_624x892-v1_p3xchj.jpg",
    theme: "light",
    buttonStyle: "white",
  },
  {
    title: "SmartThings",
    subtitle: "Ten el control de tu casa en la palma de tu mano.",
    buttonText: "Más información",
    buttonHref: "#",
    image: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1759841130/banner_448x440_smartthings_kvmvox.jpg",
    theme: "light",
    buttonStyle: "black",
  },
  {
    title: "Conscious Services",
    subtitle: "Juntos, construyendo un futuro mejor todos los días.",
    buttonText: "Más información",
    buttonHref: "#",
    image: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1759841177/banner_448x440_eco-conscious_gjm5fe.jpg",
    theme: "light",
    buttonStyle: "black",
  },
  {
    title: "Abre una cuenta Samsung gratuita y ten todos tus dispositivos en un único lugar",
    subtitle: "",
    description: "Solo así puedes acceder a la app SmartThings y disfrutar una vida conectada y mucho más inteligente.",
    buttonText: "Abrir cuenta",
    buttonHref: "#",
    image: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1759841205/Combo_SmartThings-624x892-V1_dckgnh.jpg",
    theme: "blue",
    buttonStyle: "white",
  },
  {
    title: "Samsung Select",
    subtitle: "El servicio especial de Samsung para ti que mereces exclusividad.",
    description: "",
    buttonText: "Conoce más",
    buttonHref: "#",
    image: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1759841209/banner_448x440_select_ll228l.jpg",
    theme: "dark",
    buttonStyle: "white",
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
    <div className="max-w-7xl mx-auto px-4 pb-6">
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
                className="w-1/3 flex-shrink-0 px-1"
              >
                <div className={`relative rounded-3xl overflow-hidden h-[400px] group ${
                  slide.theme === 'dark' ? 'bg-black' : 
                  slide.theme === 'blue' ? 'bg-blue-600' : 
                  'bg-gray-200'
                }`}>
                  <Image
                    src={slide.image}
                    alt={slide.title || 'Samsung'}
                    fill
                    className="object-cover transition-transform duration-500"
                    id={`image-${index}`}
                    priority={index < 3}
                    unoptimized
                  />
                  
                  {/* Content */}
                  <div className={`absolute inset-0 p-8 flex flex-col ${
                    slide.title && slide.title !== "Lengua de señas" ? 'justify-between' : 'justify-center items-center'
                  } ${slide.theme === 'light' ? 'text-black' : 'text-white'}`}>
                    {slide.title && slide.title !== "Lengua de señas" && (
                      <div>
                        <h3 className="text-2xl font-bold mb-3">{slide.title}</h3>
                        <p className="text-xs mb-2">{slide.subtitle}</p>
                        {slide.description && (
                          <p className="text-xs opacity-90">{slide.description}</p>
                        )}
                      </div>
                    )}

                    {slide.title === "Lengua de señas" && (
                      <div className="text-left mb-8 -translate-y-24">
                        <h3 className="text-lg font-black mb-2 text-white">Lengua de señas</h3>
                        <p className="text-xs text-white mb-1">Accede a soporte por video chat con un intérprete experto en nuestros productos o recibe asesoría en tu compra.</p>
                      </div>
                    )}
                    
                    <button 
                      className={`self-start border-2 transition-all duration-300 ${
                        slide.buttonStyle === 'white' 
                          ? `border-white bg-white text-black hover:bg-black hover:text-white ${slide.title === "Lengua de señas" ? 'transform -translate-y-28' : slide.title === "Abre una cuenta Samsung gratuita y ten todos tus dispositivos en un único lugar" ? 'transform -translate-y-29' : slide.title === "Samsung Select" ? 'transform -translate-y-56' : 'transform -translate-y-16'}`
                          : slide.buttonStyle === 'black'
                          ? `border-black bg-black text-white hover:bg-white hover:text-black ${slide.title === "SmartThings" || slide.title === "Conscious Services" ? 'transform -translate-y-56' : slide.title === "Lengua de señas" ? 'transform -translate-y-28' : 'transform -translate-y-16'}`
                          : slide.theme === 'dark' 
                          ? `border-white bg-white text-black hover:bg-black hover:text-white ${slide.title === "Lengua de señas" ? 'transform -translate-y-28' : slide.title === "Samsung Select" ? 'transform -translate-y-56' : 'transform -translate-y-16'}` 
                          : slide.theme === 'blue'
                          ? `border-white bg-white text-black hover:bg-blue-600 hover:text-white ${slide.title === "Lengua de señas" ? 'transform -translate-y-28' : 'transform -translate-y-16'}`
                          : `border-white bg-black text-white hover:bg-white hover:text-black ${slide.title === "Lengua de señas" ? 'transform -translate-y-28' : 'transform -translate-y-16'}`
                      } px-3 py-1 rounded-full font-medium text-xs inline-flex items-center gap-1 hover:scale-110`}
                      onMouseEnter={() => {
                        const image = document.getElementById(`image-${index}`);
                        if (image) image.classList.add('scale-110');
                      }}
                      onMouseLeave={() => {
                        const image = document.getElementById(`image-${index}`);
                        if (image) image.classList.remove('scale-110');
                      }}
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
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-60 hover:bg-opacity-80 border-2 border-white rounded-full p-3 shadow-lg transition-colors z-10"
            aria-label="Previous slide"
          >
            <svg
              className="w-6 h-6 text-black"
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
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-60 hover:bg-opacity-80 border-2 border-white rounded-full p-3 shadow-lg transition-colors z-10"
            aria-label="Next slide"
          >
            <svg
              className="w-6 h-6 text-black"
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
      <div className="flex justify-center gap-3 mt-4">
        <div className="border border-gray-300 rounded-full px-4 py-2 shadow-sm">
          {Array.from({ length: maxSlideIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 w-3 rounded-full transition-all mx-1 ${
                currentSlide === index
                  ? "bg-black"
                  : "bg-gray-400 hover:bg-gray-600"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
