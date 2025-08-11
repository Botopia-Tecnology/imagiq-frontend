/**
 * 🦸 HERO SECTION - IMAGIQ ECOMMERCE
 *
 * Sección principal de la landing page con:
 * - Banner principal con ofertas destacadas
 * - CTAs de conversión principales
 * - Integración con PostHog para tracking
 */

"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import gifAudifonos from "@/img/gif/gif_audifonos.gif";
import samsungLogo from "@/img/Samsung_black.png";

// Hero slides data matching Samsung style
const heroSlides = [
  {
    id: 1,
    title: "Nuevos Galaxy Buds Core",
    subtitle: "Resistentes al agua",
    description:
      "Diseñado para el confort durante todo el día, Galaxy Buds Core cuenta con puntas de silicona para un ajuste sin presión. Ya sea que estés relajándote en casa o corriendo por el parque, Galaxy Buds Core se mantiene en su lugar sintiéndote ligero y cómodo.",
    price: "$219.900",
    originalPrice: "$259.900",
    offerText: "Oferta especial de lanzamiento",
    buttonText: "¡Compra aquí!",
    gifSrc: gifAudifonos.src,
    bgColor: "#24538F", // Base color for spotlight effect
  },
  {
    id: 2,
    title: "Nuevos Galaxy Buds Core",
    subtitle: "Resistentes al agua",
    description:
      "Diseñado para el confort durante todo el día, Galaxy Buds Core cuenta con puntas de silicona para un ajuste sin presión. Ya sea que estés relajándote en casa o corriendo por el parque, Galaxy Buds Core se mantiene en su lugar sintiéndote ligero y cómodo.",
    price: "$219.900",
    originalPrice: "$259.900",
    offerText: "Oferta especial de lanzamiento",
    buttonText: "¡Compra aquí!",
    gifSrc: gifAudifonos.src,
    bgColor: "#24538F",
  },
  {
    id: 3,
    title: "Nuevos Galaxy Buds Core",
    subtitle: "Resistentes al agua",
    description:
      "Diseñado para el confort durante todo el día, Galaxy Buds Core cuenta con puntas de silicona para un ajuste sin presión. Ya sea que estés relajándote en casa o corriendo por el parque, Galaxy Buds Core se mantiene en su lugar sintiéndote ligero y cómodo.",
    price: "$219.900",
    originalPrice: "$259.900",
    offerText: "Oferta especial de lanzamiento",
    buttonText: "¡Compra aquí!",
    gifSrc: gifAudifonos.src,
    bgColor: "#24538F",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds of manual interaction
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section
      className="relative w-full h-[85vh] min-h-[700px] md:min-h-[800px] lg:min-h-[600px] overflow-hidden"
      style={{
        marginTop: "0px",
        zIndex: 1,
      }}
    >
      {/* Base background color */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          backgroundColor: currentSlideData.bgColor,
          top: "-1px",
          height: "calc(100% + 1px)",
        }}
      />

      {/* Spotlight effect - responsive radial gradient */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse at center, 
            rgba(255, 255, 255, 0.3) 0%, 
            rgba(255, 255, 255, 0.18) 25%, 
            rgba(255, 255, 255, 0.10) 50%, 
            transparent 70%)`,
          top: "-1px",
          height: "calc(100% + 1px)",
        }}
      />

      {/* Subtle depth overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-transparent to-blue-900/10"></div>

      {/* Slide container - responsive layout optimizado para móvil */}
      <div className="relative w-full h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full max-w-7xl py-8 lg:py-0">
          {/* Layout móvil - columna única centrada */}
          <div className="flex flex-col items-center justify-center h-full space-y-6 lg:hidden">
            {/* Títulos en móvil */}
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight text-white drop-shadow-lg">
                {currentSlideData.title}
              </h1>
              <h2 className="text-xl sm:text-2xl font-normal opacity-90 text-white drop-shadow-md">
                {currentSlideData.subtitle}
              </h2>
            </div>

            {/* GIF centrado en móvil */}
            <div className="flex justify-center items-center">
              <div className="relative">
                <Image
                  src={currentSlideData.gifSrc}
                  alt="Galaxy Buds Core"
                  width={600}
                  height={600}
                  className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] object-contain"
                  style={{
                    filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.15))",
                  }}
                  unoptimized
                  priority
                />
              </div>
            </div>

            {/* Precio y botón en móvil */}
            <div className="text-center space-y-6">
              {/* Price section móvil */}
              <div className="inline-block bg-white/20 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/30 shadow-2xl">
                <div className="text-center">
                  <p className="text-sm opacity-90 mb-2 text-white font-medium">
                    {currentSlideData.offerText}
                  </p>
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-3xl sm:text-4xl font-bold text-white drop-shadow-md">
                      {currentSlideData.price}
                    </span>
                  </div>
                  <p className="text-sm opacity-80 mt-2 text-gray-100">
                    Precio Normal:{" "}
                    <span className="line-through">
                      {currentSlideData.originalPrice}
                    </span>
                  </p>
                </div>
              </div>

              {/* Botón de compra móvil */}
              <button className="bg-[#0F1B3C] hover:bg-[#1a2850] text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl w-full max-w-xs">
                {currentSlideData.buttonText}
              </button>
            </div>
          </div>

          {/* Layout desktop - horizontal como antes */}
          <div className="hidden lg:flex items-center justify-between h-full">
            {/* Left side - Product GIF desktop */}
            <div className="flex-1 flex justify-center items-center">
              <div className="relative">
                <Image
                  src={currentSlideData.gifSrc}
                  alt="Galaxy Buds Core"
                  width={600}
                  height={600}
                  className="w-[500px] h-[500px] xl:w-[600px] xl:h-[600px] object-contain"
                  style={{
                    filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.15))",
                  }}
                  unoptimized
                  priority
                />
              </div>
            </div>

            {/* Right side - Content desktop */}
            <div className="flex-1 text-white max-w-2xl pl-8 xl:pl-12 text-left">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 leading-tight text-white drop-shadow-lg">
                {currentSlideData.title}
              </h1>

              <h2 className="text-lg md:text-xl lg:text-2xl font-normal mb-6 opacity-90 text-white drop-shadow-md">
                {currentSlideData.subtitle}
              </h2>

              <p className="text-sm lg:text-base leading-relaxed mb-8 opacity-85 max-w-lg text-gray-200">
                {currentSlideData.description}
              </p>

              {/* Price section desktop */}
              <div className="mb-8">
                <div className="inline-block bg-white/20 backdrop-blur-xl rounded-2xl lg:rounded-3xl px-6 lg:px-8 py-4 lg:py-5 border border-white/30 shadow-2xl">
                  <div className="text-center">
                    <p className="text-sm opacity-90 mb-2 text-white font-medium">
                      {currentSlideData.offerText}
                    </p>
                    <div className="flex items-center justify-center space-x-3">
                      <span className="text-3xl lg:text-4xl font-bold text-white drop-shadow-md">
                        {currentSlideData.price}
                      </span>
                    </div>
                    <p className="text-sm opacity-80 mt-2 text-gray-100">
                      Precio Normal:{" "}
                      <span className="line-through">
                        {currentSlideData.originalPrice}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons desktop */}
              <div className="flex space-x-4 mb-10">
                <button className="bg-[#0F1B3C] hover:bg-[#1a2850] text-white px-8 py-4 rounded-2xl lg:rounded-3xl font-semibold text-base lg:text-lg transition-all duration-300 transform hover:scale-105 shadow-xl">
                  {currentSlideData.buttonText}
                </button>

                <button className="bg-transparent hover:bg-white/10 text-white p-4 rounded-2xl lg:rounded-3xl transition-all duration-300 transform hover:scale-105 border-2 border-white/40 hover:border-white/60 shadow-lg">
                  <Heart className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation arrows - responsive positioning */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 sm:left-4 lg:left-6 top-1/2 transform -translate-y-1/2 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white p-3 lg:p-4 rounded-full transition-all duration-300 border border-white/20 shadow-lg"
      >
        <ChevronLeft className="w-5 h-5 lg:w-7 lg:h-7" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-2 sm:right-4 lg:right-6 top-1/2 transform -translate-y-1/2 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white p-3 lg:p-4 rounded-full transition-all duration-300 border border-white/20 shadow-lg"
      >
        <ChevronRight className="w-5 h-5 lg:w-7 lg:h-7" />
      </button>

      {/* Slide indicators - responsive positioning */}
      <div className="absolute bottom-6 sm:bottom-8 lg:bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3 lg:space-x-4">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-3 h-3 lg:w-4 lg:h-4 rounded-full transition-all duration-300 shadow-md",
              currentSlide === index
                ? "bg-white scale-125 shadow-lg"
                : "bg-white/60 hover:bg-white/80"
            )}
          />
        ))}
      </div>

      {/* Samsung logo - responsive sizing and positioning */}
      <div className="absolute bottom-6 sm:bottom-8 lg:bottom-12 right-4 sm:right-6 lg:right-12">
        <Image
          src={samsungLogo.src}
          alt="Samsung"
          width={120}
          height={40}
          className="h-6 sm:h-8 lg:h-10 w-auto opacity-80"
          priority
        />
      </div>

      {/* Auto-play indicator - responsive positioning */}
      {isAutoPlaying && (
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white/60 rounded-full animate-pulse"></div>
        </div>
      )}
    </section>
  );
}
