/**
 * 🦸 hero SECTION - IMAGIQ ECOMMERCE
 */

"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import gifAudifonos from "@/img/gif/gif_audifonos.gif";

import { useGifOnce } from "@/hooks/useGifOnce";

// hero slides data matching Samsung style
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
    title: "",
    subtitle: "",
    description: "",
    price: "",
    originalPrice: "",
    offerText: "",
    buttonText: "Descubre más",
    gifSrc: "https://images.samsung.com/is/image/samsung/assets/co/home/HOME_TS11_Hero-KV_1920x1080_pc_1.jpg?$1920_N_JPG$",
    gifSrcMobile: "https://images.samsung.com/is/image/samsung/assets/co/home/HOME_TS11_Hero-KV_720x1248_mo.jpg?$720_N_JPG$",
    bgColor: "#000000",
    isFullImage: true,
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
  const [isAutoPlaying] = useState(true);
  const { isGifPlaying, imgRef, staticImageUrl, isTransitioning } = useGifOnce(
    gifAudifonos.src,
    2950,
    400
  );
  const pathname = usePathname();
  const isHome = pathname === "/";
  const currentSlideData = heroSlides[currentSlide];

  // Producto actual mostrado en el hero
  const productoActual = {
    sku: `SKU${currentSlideData.id}`,
    name: currentSlideData.title,
    quantity: "1",
    unitPrice: currentSlideData.price.replace(/[^\d]/g, ""), // Solo números
  };

  // Handler para el botón
  const handleAddiPayment = async () => {
    try {
      const token = localStorage.getItem("imagiq_token");
      if (!token) {
        alert("No se encontró el token");
        return;
      }
      // Body con el producto actual
      const body = {
        totalAmount: productoActual.unitPrice,
        shippingAmount: "0",
        currency: "COP",
        item: [productoActual],
        userInfo: {
          email: "aristizabalsantiago482@gmail.com",
          nombre: "Santiago",
          apellido: "Aristizabal",
          direccion_linea_uno: "Calle 123 #45-67",
          direccion_ciudad: "Bogotá",
          direccion_pais: "CO",
          numero_documento: "1001812664",
          tipo_documento: "CC",
        },
      };
      const response = await fetch(
        "https://imagiq-backend-production.up.railway.app/api/payments/addi/apply",
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

  // Auto-play effect
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5000); // Cambiar cada 5 segundos
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying]);

  return (
    <section
      className="relative w-full h-screen flex items-center justify-center mt-[-34%] md:mt-[-17%] md:pt-64 overflow-hidden transition-colors duration-1000 ease-in-out"
      style={{
        zIndex: 1,
        backgroundColor: currentSlideData.bgColor
      }}
      data-hero="true"
    >
      {/* Fondo gradiente y spotlight - solo si no es full image */}
      {!currentSlideData.isFullImage && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#4A7AC7] via-[#7CA6E6] to-[#24538F] transition-opacity duration-1000 ease-in-out" />
          <div
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.10) 40%, transparent 80%)",
            }}
          />
        </>
      )}

      {/* Imagen de fondo para slides con isFullImage */}
      {currentSlideData.isFullImage && (
        <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
          {/* Desktop image */}
          <Image
            src={currentSlideData.gifSrc}
            alt={currentSlideData.title || "Banner"}
            fill
            className="object-cover hidden md:block transition-opacity duration-1000 ease-in-out"
            sizes="100vw"
            priority
          />
          {/* Mobile image */}
          {currentSlideData.gifSrcMobile && (
            <Image
              src={currentSlideData.gifSrcMobile}
              alt={currentSlideData.title || "Banner"}
              fill
              className="object-contain md:hidden transition-opacity duration-1000 ease-in-out"
              sizes="100vw"
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/20 transition-opacity duration-1000 ease-in-out" />
        </div>
      )}
      {/* MOBILE: layout vertical, centrado, sin margen derecho, igual a la imagen */}
      <div className="md:hidden w-full flex flex-col items-center justify-center py-12 px-4 transition-opacity duration-1000 ease-in-out">
        {/* Título arriba del gif */}
        <h1 className="text-3xl font-bold text-white mb-4 text-center leading-tight tracking-tight transition-opacity duration-1000 ease-in-out">
          {currentSlideData.title}
        </h1>
        {/* Gif o imagen - ocultar si es fullImage */}
        {!currentSlideData.isFullImage && (
          <div className="flex items-center justify-center mb-4 transition-opacity duration-1000 ease-in-out">
            {isGifPlaying ? (
              <Image
                ref={imgRef}
                src={currentSlideData.gifSrc}
                alt="Galaxy Buds Core"
                width={220}
                height={220}
                className="w-[220px] h-[220px] object-contain drop-shadow-2xl transition-opacity duration-1000 ease-in-out"
                unoptimized={true}
                priority
              />
            ) : (
              <Image
                src={staticImageUrl || currentSlideData.gifSrc}
                alt="Galaxy Buds Core"
                width={220}
                height={220}
                className="w-[220px] h-[220px] object-contain drop-shadow-2xl transition-opacity duration-1000 ease-in-out"
                unoptimized={false}
                priority
              />
            )}
          </div>
        )}
        {/* Card de precio - solo si hay precio */}
        {currentSlideData.price && (
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
        )}
        {/* Botón de compra debajo de la card de precio */}
        {!currentSlideData.isFullImage && (
          <button className="bg-[#0F1B3C] hover:bg-[#1a2850] text-white px-7 py-3 rounded-xl font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-xl w-full max-w-xs mb-2">
            {currentSlideData.buttonText}
          </button>
        )}
        {/* Botón para fullImage en mobile */}
        {currentSlideData.isFullImage && (
          <button className="bg-white hover:bg-gray-100 text-black px-7 py-3 rounded-xl font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-xl w-full max-w-xs mb-2">
            {currentSlideData.buttonText}
          </button>
        )}
      </div>
      {/* DESKTOP: layout horizontal original restaurado */}
      <div className="hidden md:flex relative z-10 w-full max-w-6xl mx-auto flex-row items-center justify-center py-8">
        {/* Columna izquierda: Características y descripción - ocultar si es fullImage */}
        {!currentSlideData.isFullImage && (
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
        )}
        {/* Columna central: GIF producto - ocultar si es fullImage */}
        {!currentSlideData.isFullImage && (
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
        )}
        {/* Columna derecha: Título, precio y botón - ocultar si es fullImage */}
        {!currentSlideData.isFullImage && (
          <div className="w-1/3 flex flex-col items-end justify-center ">
            <h1 className="text-3xl sm:text-3xl lg:text-5xl font-bold text-white mb-2 text-right leading-tight tracking-tight">
              {currentSlideData.title}
              <span className="block ml-2 mt-1">
                <img
                  src="/img/Samsung_black.svg"
                  alt="Samsung"
                  width={90}
                  height={54}
                  className="inline h-10 w-auto align-middle"
                  style={{ filter: "brightness(0.7) opacity(0.8)" }}
                />
              </span>
            </h1>
            {currentSlideData.price && (
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
            )}
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
        )}

        {/* Layout para fullImage: solo botón */}
        {currentSlideData.isFullImage && (
          <div className="w-full flex items-start justify-start pl-12 pt-20">
            <button
              className="bg-white hover:bg-gray-100 text-black px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              {currentSlideData.buttonText}
            </button>
          </div>
        )}
      </div>
      {/* Navegación y logo Samsung (unificado, sin duplicados) - ocultar dots en fullImage */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center justify-center">
        {/* Slide indicators - solo mostrar si NO es fullImage */}
        {!currentSlideData.isFullImage && (
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
        )}
        {/* Logo Samsung */}
        <div className="flex items-center justify-center">
          <img
            src="/img/Samsung_black.svg"
            alt="Samsung"
            width={110}
            height={32}
            className="h-7 w-auto opacity-80"
            style={{ filter: isHome ? "invert(1) brightness(2)" : "none" }}
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
