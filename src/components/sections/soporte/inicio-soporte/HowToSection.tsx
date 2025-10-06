"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const cards = [
  {
    title: "Tips de uso para Galaxy",
    image: "/soporte/tips-galaxy.svg",
    href: "#",
  },
  {
    title: "Dispositivos móviles",
    image: "/soporte/dispositivos-moviles.svg",
    href: "#",
  },
  {
    title: "Guía útil para electrodomésticos",
    image: "/soporte/guia-electrodomesticos.svg",
    href: "#",
  },
  {
    title: "Consejos para utilizar tu Smart TV",
    image: "/soporte/consejos-smart-tv.svg",
    href: "#",
  },
  {
    title: "Manuales & Descargas",
    image: "/soporte/manuales-descargas.svg",
    href: "#",
  },
];

const expertSlides = [
  {
    title: "¿Necesita ayuda de expertos?",
    subtitle: "Contamos con el apoyo experto que necesita.",
    description: "Descubre cuál es el adecuado para usted.",
    buttonText: "Conocer más",
    image: "/soporte/expertos-1.svg",
  },
  {
    title: "Servicio técnico especializado",
    subtitle: "Nuestros expertos están listos para ayudarte.",
    description: "Soporte profesional cuando lo necesites.",
    buttonText: "Contactar",
    image: "/soporte/expertos-2.svg",
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
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          ¿Cómo hacerlo?
        </h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* Large card - spans 2 rows */}
          <Link
            href={cards[0].href}
            className="lg:row-span-2 group relative rounded-3xl overflow-hidden bg-gray-200 h-full min-h-[500px]"
          >
            <Image
              src={cards[0].image}
              alt={cards[0].title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-white text-2xl font-bold text-center">{cards[0].title}</h3>
            </div>
          </Link>

          {/* Small cards */}
          {cards.slice(1).map((card, index) => (
            <Link
              key={index}
              href={card.href}
              className="group relative rounded-3xl overflow-hidden bg-gray-200 h-64"
            >
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-lg font-bold text-center">{card.title}</h3>
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
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-100/90 to-transparent" />
                    
                    <div className="absolute inset-0 flex items-center">
                      <div className="max-w-xl p-12">
                        <h3 className="text-3xl font-bold mb-4 text-black">{slide.title}</h3>
                        <p className="text-base mb-2 text-gray-800">{slide.subtitle}</p>
                        <p className="text-sm mb-6 text-gray-700">{slide.description}</p>
                        <button className="bg-black text-white hover:bg-gray-800 px-6 py-2.5 rounded-full font-medium text-sm transition-colors inline-flex items-center gap-2">
                          {slide.buttonText}
                          <span>→</span>
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
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-600/80 hover:bg-gray-700 rounded-full p-2.5 shadow-lg transition-colors z-10"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {currentSlide < expertSlides.length - 1 && (
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-600/80 hover:bg-gray-700 rounded-full p-2.5 shadow-lg transition-colors z-10"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {expertSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1 rounded-full transition-all ${
                  currentSlide === index ? "bg-gray-800 w-10" : "bg-gray-400 w-10 hover:bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
