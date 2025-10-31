/**
 * 🦸 HERO SECTION - IMAGIQ ECOMMERCE
 * Refactored to use configuration system
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { useHeroConfig } from "@/config/home";
import Link from "next/link";

export default function HeroSection() {
  const { config, loading } = useHeroConfig();
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoMobileRef = useRef<HTMLVideoElement>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const desktop = videoRef.current;
    const mobile = videoMobileRef.current;

    if (desktop) {
      desktop.muted = config.muted;
      desktop.playsInline = true;
      desktop.load();

      if (desktop.readyState >= 3) {
        desktop.play().catch(() => {});
      }
    }

    if (mobile) {
      mobile.muted = config.muted;
      mobile.playsInline = true;
      mobile.load();

      if (mobile.readyState >= 3) {
        mobile.play().catch(() => {});
      }
    }
  }, [config.muted]);

  // Efecto de scroll para reducir el video
  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      const scrolled = window.scrollY;

      // Calcular progreso: 0 al inicio, 1 cuando hemos scrolleado toda la altura del hero
      const progress = Math.min(scrolled / heroHeight, 1);

      setScrollProgress(progress);
    };

    // Ejecutar al cargar para establecer el estado inicial
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleVideoEnd = () => {
    if (config.showContentOnEnd) {
      setVideoEnded(true);
    }

    if (config.loop && videoRef.current && videoMobileRef.current) {
      videoRef.current.play().catch(() => {});
      videoMobileRef.current.play().catch(() => {});
    }
  };

  if (loading) {
    return (
      <section
        className="relative w-full h-screen flex items-center justify-center overflow-hidden -mt-[64px] xl:-mt-[100px] pt-[64px] xl:pt-[100px]"
        style={{ backgroundColor: "#000000" }}
      >
        <div className="animate-pulse w-full h-full bg-gray-900" />
      </section>
    );
  }

  return (
    <section
      className="relative w-full h-screen flex items-center justify-center overflow-hidden transition-colors duration-1000 ease-in-out -mt-[64px] xl:-mt-[100px] pt-[64px] xl:pt-[100px]"
      style={{
        zIndex: 1,
        backgroundColor: '#ffffff',
      }}
      data-hero="true"
    >
      {/* Video de fondo */}
      <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
        {/* Desktop video */}
        <video
          ref={videoRef}
          className="hidden md:block h-full object-cover"
          autoPlay={config.autoplay}
          muted={config.muted}
          loop={config.loop}
          playsInline
          preload="metadata"
          onEnded={handleVideoEnd}
          poster={config.posterSrc}
          style={{
            opacity: videoEnded ? 0 : 1,
            width: `${100 - scrollProgress * 8}%`,
            marginLeft: `${scrollProgress * 4}%`,
            marginRight: `${scrollProgress * 4}%`,
            transition: "opacity 0.5s ease-in-out, width 0.3s ease-out, margin 0.3s ease-out",
          }}
        >
          <source src={config.videoSrc} type="video/mp4" />
        </video>

        {/* Desktop poster image - shown when video ends */}
        <div
          className="hidden md:block absolute top-0 left-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${config.posterSrc})`,
            opacity: videoEnded ? 1 : 0,
            width: `${100 - scrollProgress * 8}%`,
            height: '100%',
            marginLeft: `${scrollProgress * 4}%`,
            transition: "opacity 0.5s ease-in-out, width 0.3s ease-out, margin 0.3s ease-out",
          }}
        />

        {/* Mobile video */}
        <video
          ref={videoMobileRef}
          className="md:hidden h-full object-cover"
          autoPlay={config.autoplay}
          muted={config.muted}
          loop={config.loop}
          playsInline
          preload="metadata"
          onEnded={handleVideoEnd}
          poster={config.posterSrcMobile}
          style={{
            opacity: videoEnded ? 0 : 1,
            width: `${100 - scrollProgress * 8}%`,
            marginLeft: `${scrollProgress * 4}%`,
            marginRight: `${scrollProgress * 4}%`,
            transition: "opacity 0.5s ease-in-out, width 0.3s ease-out, margin 0.3s ease-out",
          }}
        >
          <source src={config.videoSrcMobile} type="video/mp4" />
        </video>

        {/* Mobile poster image - shown when video ends */}
        <div
          className="md:hidden absolute top-0 left-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${config.posterSrcMobile})`,
            opacity: videoEnded ? 1 : 0,
            width: `${100 - scrollProgress * 8}%`,
            height: '100%',
            marginLeft: `${scrollProgress * 4}%`,
            transition: "opacity 0.5s ease-in-out, width 0.3s ease-out, margin 0.3s ease-out",
          }}
        />
      </div>

      {/* Contenido que aparece cuando el video termina - Solo Desktop */}
      {config.showContentOnEnd && (
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
          {config.title && (
            <h1 className="text-5xl xl:text-6xl font-bold text-black mb-3 tracking-tight">
              {config.title}
            </h1>
          )}
          {config.subtitle && (
            <p className="text-xl xl:text-2xl text-gray-700 mb-6 font-normal">
              {config.subtitle}
            </p>
          )}
          {config.buttonText && (
            <Link
              href={config.buttonLink || "#"}
              className="bg-transparent hover:bg-black/5 text-black border-2 border-black px-7 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105"
            >
              {config.buttonText}
            </Link>
          )}
        </div>
      )}

      {/* Contenido Mobile - aparece cuando termina el video */}
      {config.showContentOnEnd && (
        <div
          className="md:hidden absolute top-32 left-0 right-0 z-10 flex flex-col items-center px-6 w-full"
          style={{
            opacity: videoEnded ? 1 : 0,
            transform: videoEnded ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s",
            pointerEvents: videoEnded ? "auto" : "none",
          }}
        >
          {config.title && (
            <h1 className="text-4xl font-bold text-black mb-3 tracking-tight text-center">
              {config.title}
            </h1>
          )}
          {config.subtitle && (
            <p className="text-lg text-black/80 mb-6 font-medium text-center">
              {config.subtitle}
            </p>
          )}
          {config.buttonText && (
            <Link
              href={config.buttonLink || "#"}
              className="bg-transparent hover:bg-black/5 text-black border-2 border-black px-7 py-3 rounded-full font-semibold text-base transition-all duration-300 transform hover:scale-105 w-full max-w-xs text-center"
            >
              {config.buttonText}
            </Link>
          )}
        </div>
      )}
    </section>
  );
}