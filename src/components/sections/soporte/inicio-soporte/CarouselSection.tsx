"use client";

import Image from "next/image";
import { useState } from "react";

const slides = [
  {
    title: "Impulsa tu negocio con productos y servicios Samsung",
    subtitle:
      "Conoce las promociones y como Samsung puede llevarte al siguiente nivel",
    buttonText: "Conoce más",
    buttonHref: "#",
    image: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1759816417/Banner-SMB-PC_oowh6x.webp",
    textColor: "black",
  },
  {
    title: "Soluciones empresariales Samsung",
    subtitle: "Descubre cómo Samsung puede transformar tu negocio",
    buttonText: "Conoce más",
    buttonHref: "#",
    image: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1759840611/Prueba-Banner-SmartXperience-2_ys7dou.png",
    textColor: "white",
  },
];

export function CarouselSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-16">
      <div className="relative bg-gray-100 rounded-3xl overflow-hidden">
        <div className="flex transition-transform duration-500 ease-in-out">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 relative"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              <div className="grid md:grid-cols-2 gap-8 items-center p-6 md:p-12 relative min-h-[280px] md:min-h-[320px]">
                {/* Background Image */}
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover rounded-3xl"
                  />
                </div>

                {/* Text Content */}
                <div className="relative z-10 space-y-4 px-8 md:px-4">
                  <h2 className={`text-2xl md:text-3xl font-black ${slide.textColor === 'black' ? 'text-black' : 'text-white'}`}>
                    {slide.title}
                  </h2>
                  <p className={`${slide.textColor === 'black' ? 'text-black' : 'text-white'} text-sm md:text-base opacity-90`}>{slide.subtitle}</p>
                  <button className={`${slide.textColor === 'black' ? 'bg-black hover:bg-gray-800 text-white' : 'bg-white hover:bg-gray-100 text-black'} px-6 py-2.5 rounded-full font-medium transition-colors text-sm`}>
                    {slide.buttonText}
                  </button>
                </div>

                {/* Spacer for grid layout */}
                <div className="relative z-10"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-600/80 hover:bg-gray-700 rounded-full p-2.5 shadow-lg transition-colors"
          aria-label="Previous slide"
        >
          <svg
            className="w-5 h-5 text-white"
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

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-600/80 hover:bg-gray-700 rounded-full p-2.5 shadow-lg transition-colors"
          aria-label="Next slide"
        >
          <svg
            className="w-5 h-5 text-white"
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

        {/* Dots Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1 rounded-full transition-all ${
                currentSlide === index
                  ? "bg-gray-800 w-10"
                  : "bg-gray-400 w-10 hover:bg-gray-600"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
