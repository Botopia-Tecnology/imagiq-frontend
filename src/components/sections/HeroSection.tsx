/**
 * 🦸 HERO SECTION - IMAGIQ ECOMMERCE
 */

"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import gifAudifonos from "@/img/gif/gif_audifonos.gif";
import samsungLogoBlack from "@/img/Samsung_black.png";
import samsungLogoWhite from "@/img/logo_Samsung.png";
import samsungLogoGray from "@/img/samsung_gray.png";

import { useGifOnce } from "@/hooks/useGifOnce";

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
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const { isGifPlaying, imgRef, staticImageUrl, isTransitioning } = useGifOnce(
    gifAudifonos.src,
    2950,
    400
  );
  const pathname = usePathname();
  const isHome = pathname === "/";
  const currentSlideData = heroSlides[currentSlide];

  // Productos de ejemplo para el body
  const productosAddi = [
    {
      sku: "IQ5468578",
      name: "Samsumg Galaxy A12",
      quantity: "1",
      unitPrice: "255000",
    },
    {
      sku: "IQ5468573",
      name: "Samsumg Galaxy A53",
      quantity: "1",
      unitPrice: "2355000",
    },
  ];

  // Handler para el botón
  const handleAddiPayment = async () => {
    try {
      // Obtener el token (puedes cambiar esto por tu lógica real)
      const token = localStorage.getItem("imagiq_token");
      if (!token) {
        alert("No se encontró el token");
        return;
      }
      // Body de la petición
      const body = {
        totalAmount: "2610000",
        shippingAmount: "0",
        currency: "COP",
        item: productosAddi,
      };
      const response = await fetch(
        "http://localhost:3001/api/payments/addi/apply",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );
      if (!response.ok) {
        throw new Error("Error en la petición");
      }
      const data = await response.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        alert("No se recibió la URL de redirección");
      }
    } catch (error) {
      alert("Hubo un error al procesar el pago");
      console.error(error);
    }
  };

  // Navegación de slides
  const goToSlide = (index: number) => setCurrentSlide(index);
  const goToPrevious = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  const goToNext = () =>
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);

  return (
    <section
      className="relative w-full min-h-screen flex items-center justify-center mt-[-34%] md:mt-[-17%] md:pt-64 bg-[#24538F] overflow-hidden"
      style={{ zIndex: 1 }}
      data-hero="true"
    >
      {/* Fondo gradiente y spotlight */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#4A7AC7] via-[#7CA6E6] to-[#24538F]" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.10) 40%, transparent 80%)",
        }}
      />
      {/* MOBILE: layout vertical, centrado, sin margen derecho, igual a la imagen */}
      <div className="md:hidden w-full flex flex-col items-center justify-center py-12 px-4">
        {/* Título arriba del gif */}
        <h1 className="text-3xl font-bold text-white mb-4 text-center leading-tight tracking-tight">
          {currentSlideData.title}
        </h1>
        {/* Gif */}
        <div className="flex items-center justify-center mb-4">
          {isGifPlaying ? (
            <Image
              ref={imgRef}
              src={currentSlideData.gifSrc}
              alt="Galaxy Buds Core"
              width={220}
              height={220}
              className="w-[220px] h-[220px] object-contain drop-shadow-2xl"
              unoptimized={true}
              priority
            />
          ) : (
            <Image
              src={staticImageUrl || currentSlideData.gifSrc}
              alt="Galaxy Buds Core"
              width={220}
              height={220}
              className="w-[220px] h-[220px] object-contain drop-shadow-2xl"
              unoptimized={false}
              priority
            />
          )}
        </div>
        {/* Card de precio SIN borde derecho en móvil (solo border-r en md) */}
        <div className="w-full max-w-xs bg-white/10 backdrop-blur-xl rounded-xl px-6 py-5 border-l border-t border-b border-white/30 shadow-2xl mb-4 flex flex-col items-center border-r-0 md:border-r md:border-white/30">
          <p className="text-xs text-white font-medium mb-1 text-center">
            {currentSlideData.offerText}
          </p>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-3xl font-bold text-white drop-shadow-md">
              {currentSlideData.price}
            </span>
          </div>
          <p className="text-xs text-gray-100 text-center">
            Precio Normal:{" "}
            <span className="line-through">
              {currentSlideData.originalPrice}
            </span>
          </p>
        </div>
        {/* Botón de compra debajo de la card de precio */}
        <button className="bg-[#0F1B3C] hover:bg-[#1a2850] text-white px-7 py-3 rounded-xl font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-xl w-full max-w-xs mb-2">
          {currentSlideData.buttonText}
        </button>
      </div>
      {/* DESKTOP: layout horizontal original restaurado */}
      <div className="hidden md:flex relative z-10 w-full max-w-6xl mx-auto flex-row items-center justify-center py-8">
        {/* Columna izquierda: Características y descripción */}
        <div className="w-1/3 flex flex-col items-start justify-center px-6">
          <h2 className="text-lg lg:text-xl font-semibold text-white mb-2 text-left tracking-tight">
            {currentSlideData.subtitle}
          </h2>
          <p className="text-xs lg:text-sm text-white/90 mb-6 text-left max-w-xs leading-relaxed">
            {currentSlideData.description}
          </p>
          {/* Características con iconos */}
          <div className="grid grid-cols-4 gap-x-4 gap-y-2 mb-4 w-full max-w-xs">
            {/* ...iconos y características... */}
            <div className="flex flex-col items-center">
              <svg width="48" height="28" viewBox="0 0 48 28" fill="none">
                <rect
                  x="2"
                  y="8"
                  width="36"
                  height="8"
                  rx="4"
                  fill="#fff"
                  fillOpacity="0.7"
                />
                <rect
                  x="10"
                  y="2"
                  width="20"
                  height="20"
                  rx="10"
                  fill="#fff"
                  fillOpacity="0.7"
                />
              </svg>
              <span className="text-[11px] text-white/80 mt-1 text-center font-medium">
                Cancelación activa de ruido
              </span>
            </div>
            <div className="flex flex-col items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C7.03 2 2.73 6.11 2.05 11.02C2.02 11.18 2 11.34 2 11.5C2 16.52 6.48 21 12 21C17.52 21 22 16.52 22 11.5C22 11.34 21.98 11.18 21.95 11.02C21.27 6.11 16.97 2 12 2Z"
                  fill="#fff"
                  fillOpacity="0.7"
                />
              </svg>
              <span className="text-[11px] text-white/80 mt-1 text-center font-medium">
                Certificación IPX
              </span>
            </div>
            <div className="flex flex-col items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#fff" fillOpacity="0.7" />
                <path
                  d="M12 8V12L14 14"
                  stroke="#24538F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[11px] text-white/80 mt-1 text-center font-medium">
                Diseño intuitivo y cómodo
              </span>
            </div>
            <div className="flex flex-col items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
                  fill="#fff"
                  fillOpacity="0.7"
                />
                <path
                  d="M8 12L12 16L16 12"
                  stroke="#24538F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[11px] text-white/80 mt-1 text-center font-medium">
                Conectividad básica con IA
              </span>
            </div>
          </div>
        </div>
        {/* Columna central: GIF producto */}
        <div className="w-1/2 flex items-center justify-center px-2">
          <div className="relative flex items-center justify-center">
            {isGifPlaying ? (
              <div
                className={`transition-opacity duration-300 ${
                  isTransitioning ? "opacity-50" : "opacity-100"
                }`}
              >
                <Image
                  ref={imgRef}
                  src={currentSlideData.gifSrc}
                  alt="Galaxy Buds Core"
                  width={540}
                  height={540}
                  className="w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] lg:w-[540px] lg:h-[540px] object-contain drop-shadow-2xl"
                  unoptimized={true}
                  priority
                />
              </div>
            ) : (
              <div className="animate-fade-in">
                <Image
                  src={staticImageUrl || currentSlideData.gifSrc}
                  alt="Galaxy Buds Core"
                  width={540}
                  height={540}
                  className="w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] lg:w-[540px] lg:h-[540px] object-contain drop-shadow-2xl"
                  unoptimized={false}
                  priority
                />
              </div>
            )}
          </div>
        </div>
        {/* Columna derecha: Título, precio y botón */}
        <div className="w-1/3 flex flex-col items-end justify-center ">
          <h1 className="text-3xl sm:text-3xl lg:text-5xl font-bold text-white mb-2 text-right leading-tight tracking-tight">
            {currentSlideData.title}
            <span className="block ml-2 mt-1">
              <Image
                src={samsungLogoGray}
                alt="Samsung"
                width={90}
                height={54}
                className="inline h-10 w-auto align-middle"
                priority
              />
            </span>
          </h1>
          <div className="w-full max-w-xs bg-white/10 backdrop-blur-xl rounded-xl px-6 py-5 border border-white/30 shadow-2xl mb-4 flex flex-col items-end">
            <p className="text-xs text-white font-medium mb-1 text-right">
              {currentSlideData.offerText}
            </p>
            <div className="flex items-center justify-end space-x-2">
              <span className="text-3xl lg:text-4xl font-bold text-white drop-shadow-md">
                {currentSlideData.price}
              </span>
            </div>
            <p className="text-xs text-gray-100 text-right">
              Precio Normal:{" "}
              <span className="line-through">
                {currentSlideData.originalPrice}
              </span>
            </p>
          </div>
          <div className="flex items-center space-x-2 w-full max-w-xs">
            <button
              className="bg-[#0F1B3C] hover:bg-[#1a2850] text-white px-7 py-3 rounded-xl font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-xl w-full"
              onClick={handleAddiPayment}
            >
              {currentSlideData.buttonText}
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-all duration-300 transform hover:scale-105 border-2 border-white/40 hover:border-white/60 shadow-lg flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      {/* Navegación y logo Samsung (unificado, sin duplicados) */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center justify-center">
        {/* Slide indicators */}
        <div className="flex items-center justify-center space-x-3 mb-4">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300 shadow-md",
                currentSlide === index
                  ? "bg-black scale-125 shadow-lg"
                  : "bg-black/40 hover:bg-black/60"
              )}
            />
          ))}
        </div>
        {/* Logo Samsung */}
        <div className="flex items-center justify-center">
          <Image
            src={isHome ? samsungLogoWhite : samsungLogoBlack}
            alt="Samsung"
            width={110}
            height={32}
            className="h-7 w-auto opacity-80"
            priority
          />
        </div>
      </div>
      {/* Flechas navegación */}
      <button
        onClick={goToPrevious}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white p-2 rounded-full transition-all duration-300 border border-white/20 shadow-lg"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white p-2 rounded-full transition-all duration-300 border border-white/20 shadow-lg"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      {/* Indicador de auto-play */}
      {isAutoPlaying && (
        <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
      )}
    </section>
  );
}
