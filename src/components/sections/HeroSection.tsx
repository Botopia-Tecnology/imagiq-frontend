/**
 * 🦸 HERO SECTION - IMAGIQ ECOMMERCE
 * Refactored to use configuration system
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { useHeroBanner } from "@/hooks/useHeroBanner";
import { useHeroContext } from "@/contexts/HeroContext";
import { positionToCSS } from "@/utils/bannerCoordinates";
import Link from "next/link";
import type { HeroBannerConfig } from "@/types/banner";

/**
 * Componente de contenido del Hero (reutilizable para desktop y mobile)
 */
interface HeroContentProps {
  config: HeroBannerConfig;
  videoEnded: boolean;
  positionStyle: React.CSSProperties;
  isMobile?: boolean;
}

function HeroContent({ config, videoEnded, positionStyle, isMobile }: Readonly<HeroContentProps>) {
  const textSize = isMobile
    ? "text-3xl"
    : "text-5xl xl:text-6xl";
  const subSize = isMobile
    ? "text-base mb-4 font-medium"
    : "text-xl xl:text-2xl mb-6 font-normal";
  const buttonSize = isMobile
    ? "px-6 py-2 text-sm"
    : "px-7 py-2.5 text-sm";

  return (
    <div
      className={`${isMobile ? 'md:hidden flex flex-col items-center text-center' : 'hidden md:flex flex-col items-start'} z-10`}
      style={{
        ...positionStyle,
        position: 'absolute',
        opacity: videoEnded ? 1 : 0,
        transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s",
        pointerEvents: videoEnded ? "auto" : "none",
        ...(isMobile && { maxWidth: '90%' }),
      }}
    >
      {config.heading && (
        <h1
          className={`${textSize} font-bold mb-3 tracking-tight`}
          style={{
            color: config.textColor,
            ...(config.textStyles?.title || {}),
          }}
        >
          {config.heading}
        </h1>
      )}
      {config.subheading && (
        <p
          className={subSize}
          style={{
            color: config.textColor,
            ...(config.textStyles?.description || {}),
          }}
        >
          {config.subheading}
        </p>
      )}
      {config.ctaText && (
        <Link
          href={config.ctaLink || "#"}
          className={`bg-transparent hover:opacity-80 ${buttonSize} rounded-full font-semibold transition-all duration-300 transform hover:scale-105`}
          style={{
            color: config.textColor,
            borderWidth: '2px',
            borderColor: config.textColor,
            ...(config.textStyles?.cta || {}),
          }}
        >
          {config.ctaText}
        </Link>
      )}
    </div>
  );
}

export default function HeroSection() {
  const { configs, config, loading } = useHeroBanner();
  const { setTextColor } = useHeroContext();
  const [videoEnded, setVideoEnded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // NUEVO: Estados para el carrusel
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const BANNER_DISPLAY_DURATION = 5000; // 5 segundos

  // NUEVO: Config actualmente visible
  const currentConfig = configs[currentBannerIndex] || config;

  // NUEVO: Función para avanzar al siguiente banner (con loop)
  const goToNextBanner = () => {
    setCurrentBannerIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return nextIndex >= configs.length ? 0 : nextIndex;
    });
  };

  // NUEVO: Handler cuando termina un video
  const handleVideoEndCarousel = () => {
    if (configs.length > 1) {
      timerRef.current = setTimeout(() => {
        goToNextBanner();
      }, BANNER_DISPLAY_DURATION);
    }
  };

  // NUEVO: Efecto para gestionar el carrusel automático
  useEffect(() => {
    if (configs.length <= 1) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const currentBannerData = configs[currentBannerIndex];
    const hasVideo = Boolean(currentBannerData?.videoSrc || currentBannerData?.mobileVideoSrc);

    if (!hasVideo) {
      timerRef.current = setTimeout(() => {
        goToNextBanner();
      }, BANNER_DISPLAY_DURATION);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBannerIndex, configs.length]);

  // Sincronizar color del Hero con el Navbar
  useEffect(() => {
    if (currentConfig.textColor) {
      setTextColor(currentConfig.textColor);
    }
  }, [currentConfig.textColor, setTextColor]);

  // Efecto de scroll para reducir el video
  useEffect(() => {
    const handleScroll = () => {
      const viewportWidth = window.innerWidth;
      const maxContentWidth = 1440;

      if (viewportWidth <= maxContentWidth) {
        setScrollProgress(0);
        return;
      }

      const targetWidth = (maxContentWidth / viewportWidth) * 100;
      const maxReduction = 100 - targetWidth;
      const scrollProgress = Math.min(window.scrollY / window.innerHeight, 1);
      const actualProgress = scrollProgress * (maxReduction / 8);

      setScrollProgress(Math.min(actualProgress, maxReduction / 8));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleVideoEnd = () => {
    if (currentConfig.showContentOnEnd) {
      setVideoEnded(true);
    }

    // NUEVO: Si hay múltiples banners, avanzar al siguiente después del video
    handleVideoEndCarousel();
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

  // Estilos de posicionamiento con el nuevo sistema
  const desktopPositionStyle = positionToCSS(currentConfig.positionDesktop ?? null);
  const mobilePositionStyle = positionToCSS(currentConfig.positionMobile ?? null);

  // Variables para decidir si mostrar el contenido del Hero
  const hasAnyVideo = Boolean(currentConfig.videoSrc || currentConfig.mobileVideoSrc);
  const showImmediately = !hasAnyVideo; // no hay video -> mostrar siempre
  const canShow = showImmediately || Boolean(currentConfig.showContentOnEnd);
  // Cuando mostramos inmediatamente forzamos videoEnded=true para que el contenido sea visible
  const effectiveVideoEnded = showImmediately ? true : videoEnded;

  return (
    <section
      className="relative w-full h-screen flex items-center justify-center overflow-hidden transition-colors duration-1000 ease-in-out -mt-[64px] xl:-mt-[100px] pt-[64px] xl:pt-[100px]"
      style={{
        zIndex: 1,
        backgroundColor: '#ffffff',
      }}
      data-hero="true"
    >
      {/* Media de fondo */}
      <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
        {/* Desktop media */}
        <div className="hidden md:block absolute inset-0">
          {currentConfig.videoSrc ? (
            <>
              {/* Desktop video */}
              <video
                key={`hero-desktop-video-${currentBannerIndex}`}
                className="h-full object-cover"
                autoPlay
                muted
                loop={currentConfig.loop}
                playsInline
                preload="metadata"
                onEnded={handleVideoEnd}
                poster={currentConfig.imageSrc || undefined}
                style={{
                  opacity: videoEnded ? 0 : 1,
                  width: `${100 - scrollProgress * 8}%`,
                  marginLeft: `${scrollProgress * 4}%`,
                  marginRight: `${scrollProgress * 4}%`,
                  transition: "opacity 0.5s ease-in-out, width 0.3s ease-out, margin 0.3s ease-out",
                }}
              >
                <source src={currentConfig.videoSrc} type="video/mp4" />
              </video>
              {/* Desktop poster image - shown when video ends */}
              {currentConfig.imageSrc && (
                <div
                  className="absolute top-0 left-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${currentConfig.imageSrc})`,
                    opacity: videoEnded ? 1 : 0,
                    width: `${100 - scrollProgress * 8}%`,
                    height: '100%',
                    marginLeft: `${scrollProgress * 4}%`,
                    transition: "opacity 0.5s ease-in-out, width 0.3s ease-out, margin 0.3s ease-out",
                  }}
                />
              )}
            </>
          ) : (
            /* Desktop image only */
            currentConfig.imageSrc && (
              <div
                key={`hero-desktop-image-${currentBannerIndex}`}
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${currentConfig.imageSrc})`,
                  width: `${100 - scrollProgress * 8}%`,
                  marginLeft: `${scrollProgress * 4}%`,
                  marginRight: `${scrollProgress * 4}%`,
                  transition: "width 0.3s ease-out, margin 0.3s ease-out",
                }}
              />
            )
          )}
        </div>

        {/* Mobile media */}
        <div className="md:hidden absolute inset-0">
          {currentConfig.mobileVideoSrc ? (
            <>
              {/* Mobile video */}
              <video
                key={`hero-mobile-video-${currentBannerIndex}`}
                className="h-full object-cover"
                autoPlay
                muted
                loop={currentConfig.loop}
                playsInline
                preload="metadata"
                onEnded={handleVideoEnd}
                poster={currentConfig.mobileImageSrc || undefined}
                style={{
                  opacity: videoEnded ? 0 : 1,
                  width: `${100 - scrollProgress * 8}%`,
                  marginLeft: `${scrollProgress * 4}%`,
                  marginRight: `${scrollProgress * 4}%`,
                  transition: "opacity 0.5s ease-in-out, width 0.3s ease-out, margin 0.3s ease-out",
                }}
              >
                <source src={currentConfig.mobileVideoSrc} type="video/mp4" />
              </video>
              {/* Mobile poster image - shown when video ends */}
              {currentConfig.mobileImageSrc && (
                <div
                  className="absolute top-0 left-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${currentConfig.mobileImageSrc})`,
                    opacity: videoEnded ? 1 : 0,
                    width: `${100 - scrollProgress * 8}%`,
                    height: '100%',
                    marginLeft: `${scrollProgress * 4}%`,
                    transition: "opacity 0.5s ease-in-out, width 0.3s ease-out, margin 0.3s ease-out",
                  }}
                />
              )}
            </>
          ) : (
            /* Mobile image only */
            currentConfig.mobileImageSrc && (
              <div
                key={`hero-mobile-image-${currentBannerIndex}`}
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${currentConfig.mobileImageSrc})`,
                  width: `${100 - scrollProgress * 8}%`,
                  marginLeft: `${scrollProgress * 4}%`,
                  marginRight: `${scrollProgress * 4}%`,
                  transition: "width 0.3s ease-out, margin 0.3s ease-out",
                }}
              />
            )
          )}
        </div>
      </div>

      {/* Contenido con coordenadas dinámicas */}
      {canShow ? (
        <>
          <HeroContent
            config={currentConfig}
            videoEnded={effectiveVideoEnded}
            positionStyle={desktopPositionStyle}
          />
          <HeroContent
            config={currentConfig}
            videoEnded={effectiveVideoEnded}
            positionStyle={mobilePositionStyle}
            isMobile
          />
        </>
      ) : null}

      {/* NUEVO: Indicadores de carrusel (solo si hay múltiples banners) */}
      {configs.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40 flex gap-2">
          {configs.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBannerIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentBannerIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Ir al banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}