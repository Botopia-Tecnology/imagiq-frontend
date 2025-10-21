/**
 * 🦸 hero SECTION - IMAGIQ ECOMMERCE
 */

"use client";

import { useState, useRef, useEffect } from "react";

// hero video data
const heroData = {
  id: 1,
  title: "",
  subtitle: "",
  description: "",
  buttonText: "Descubre más",
  videoSrc:
    "https://res.cloudinary.com/dnglv0zqg/video/upload/v1761051112/videohero.mp4",
  videoSrcMobile:
    "https://res.cloudinary.com/dnglv0zqg/video/upload/v1761051478/24565_MO_Home_ai-just-for-you_HD08_HeroKV-1_720x1248_oh4svc.mp4",
  posterSrc:
    "https://res.cloudinary.com/dnglv0zqg/image/upload/v1761051213/24565_PC_Home_ai-just-for-you_HD08_HeroKV-1_1920x1080_lypipf.webp",
  posterSrcMobile:
    "https://res.cloudinary.com/dnglv0zqg/image/upload/v1761051497/24565_MO_Home_ai-just-for-you_HD08_HeroKV-1_720x1248_s068hd.webp",
  bgColor: "#000000",
};

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoMobileRef = useRef<HTMLVideoElement>(null);
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    const desktop = videoRef.current;
    const mobile = videoMobileRef.current;

    if (desktop) {
      desktop.muted = true;
      desktop.playsInline = true;
      desktop.load();
      
      if (desktop.readyState >= 3) {
        desktop.play().catch(() => {});
      }
    }

    if (mobile) {
      mobile.muted = true;
      mobile.playsInline = true;
      mobile.load();
      
      if (mobile.readyState >= 3) {
        mobile.play().catch(() => {});
      }
    }
  }, []);

  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  return (
    <section
      className="relative w-full h-screen flex items-center justify-center overflow-hidden transition-colors duration-1000 ease-in-out -mt-[64px] xl:-mt-[100px] pt-[64px] xl:pt-[100px]"
      style={{
        zIndex: 1,
        backgroundColor: heroData.bgColor,
      }}
      data-hero="true"
    >
      {/* Video de fondo */}
      <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
        {/* Desktop video */}
        <video
          ref={videoRef}
          className="hidden md:block w-full h-full object-cover"
          autoPlay
          muted
          playsInline
          preload="metadata"
          onEnded={handleVideoEnd}
          poster={heroData.posterSrc}
          style={{
            opacity: videoEnded ? 0 : 1,
            transition: "opacity 0.5s ease-in-out",
          }}
        >
          <source src={heroData.videoSrc} type="video/mp4" />
        </video>

        {/* Desktop poster image - shown when video ends */}
        <div
          className="hidden md:block absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroData.posterSrc})`,
            opacity: videoEnded ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
          }}
        />

        {/* Mobile video */}
        <video
          ref={videoMobileRef}
          className="md:hidden w-full h-full object-cover"
          autoPlay
          muted
          playsInline
          preload="metadata"
          onEnded={handleVideoEnd}
          poster={heroData.posterSrcMobile}
          style={{
            opacity: videoEnded ? 0 : 1,
            transition: "opacity 0.5s ease-in-out",
          }}
        >
          <source src={heroData.videoSrcMobile} type="video/mp4" />
        </video>

        {/* Mobile poster image - shown when video ends */}
        <div
          className="md:hidden absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroData.posterSrcMobile})`,
            opacity: videoEnded ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
          }}
        />
      </div>

      {/* Contenido que aparece cuando el video termina - Solo Desktop */}
      <div
        className="hidden md:flex relative z-10 flex-col items-start justify-center w-full"
        style={{
          opacity: videoEnded ? 1 : 0,
          transform: videoEnded ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s",
          pointerEvents: videoEnded ? "auto" : "none",
          paddingLeft: "8%",
        }}
      >
        <h1 className="text-5xl xl:text-6xl font-bold text-black mb-3 tracking-tight">
          AI, just for you
        </h1>
        <p className="text-xl xl:text-2xl text-gray-700 mb-6 font-normal">
          0% de interés a 3, 6 o 12 cuotas
        </p>
        <button className="bg-transparent hover:bg-black/5 text-black border-2 border-black px-7 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105">
          Más información
        </button>
      </div>

      {/* Contenido Mobile - aparece cuando termina el video */}
      <div
        className="md:hidden absolute top-32 left-0 right-0 z-10 flex flex-col items-center px-6 w-full"
        style={{
          opacity: videoEnded ? 1 : 0,
          transform: videoEnded ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s",
          pointerEvents: videoEnded ? "auto" : "none",
        }}
      >
        <h1 className="text-4xl font-bold text-black mb-3 tracking-tight text-center">
          AI, just for you
        </h1>
        <p className="text-lg text-black/80 mb-6 font-medium text-center">
          0% de interés a 3, 6 o 12 cuotas
        </p>
        <button className="bg-transparent hover:bg-black/5 text-black border-2 border-black px-7 py-3 rounded-full font-semibold text-base transition-all duration-300 transform hover:scale-105 w-full max-w-xs">
          Más información
        </button>
      </div>

  
    </section>
  );
}