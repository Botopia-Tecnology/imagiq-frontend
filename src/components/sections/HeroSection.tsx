/**
 * 🦸 HERO SECTION - IMAGIQ ECOMMERCE
 * Refactored to use configuration system
 */

"use client";

import { useState, useEffect } from "react";
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
  const { config, loading } = useHeroBanner();
  const { setTextColor } = useHeroContext();
  const [videoEnded, setVideoEnded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Sincronizar color del Hero con el Navbar
  useEffect(() => {
    if (config.textColor) {
      setTextColor(config.textColor);
    }
  }, [config.textColor, setTextColor]);

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
    if (config.showContentOnEnd) {
      setVideoEnded(true);
    }

    // El loop ya está manejado por el atributo loop del video
    // No es necesario reproducir manualmente
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
  const desktopPositionStyle = positionToCSS(config.positionDesktop ?? null);
  const mobilePositionStyle = positionToCSS(config.positionMobile ?? null);

  // Variables para decidir si mostrar el contenido del Hero
  const hasAnyVideo = Boolean(config.videoSrc || config.mobileVideoSrc);
  const showImmediately = !hasAnyVideo; // no hay video -> mostrar siempre
  const canShow = showImmediately || Boolean(config.showContentOnEnd);
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
          {config.videoSrc ? (
            <>
              {/* Desktop video */}
              <video
                className="h-full object-cover"
                autoPlay
                muted
                loop={config.loop}
                playsInline
                preload="metadata"
                onEnded={handleVideoEnd}
                poster={config.imageSrc || undefined}
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
              {config.imageSrc && (
                <div
                  className="absolute top-0 left-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${config.imageSrc})`,
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
            config.imageSrc && (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${config.imageSrc})`,
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
          {config.mobileVideoSrc ? (
            <>
              {/* Mobile video */}
              <video
                className="h-full object-cover"
                autoPlay
                muted
                loop={config.loop}
                playsInline
                preload="metadata"
                onEnded={handleVideoEnd}
                poster={config.mobileImageSrc || undefined}
                style={{
                  opacity: videoEnded ? 0 : 1,
                  width: `${100 - scrollProgress * 8}%`,
                  marginLeft: `${scrollProgress * 4}%`,
                  marginRight: `${scrollProgress * 4}%`,
                  transition: "opacity 0.5s ease-in-out, width 0.3s ease-out, margin 0.3s ease-out",
                }}
              >
                <source src={config.mobileVideoSrc} type="video/mp4" />
              </video>
              {/* Mobile poster image - shown when video ends */}
              {config.mobileImageSrc && (
                <div
                  className="absolute top-0 left-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${config.mobileImageSrc})`,
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
            config.mobileImageSrc && (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${config.mobileImageSrc})`,
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
            config={config}
            videoEnded={effectiveVideoEnded}
            positionStyle={desktopPositionStyle}
          />
          <HeroContent
            config={config}
            videoEnded={effectiveVideoEnded}
            positionStyle={mobilePositionStyle}
            isMobile
          />
        </>
      ) : null}
    </section>
  );
}