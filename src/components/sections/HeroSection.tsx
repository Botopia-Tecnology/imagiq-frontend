/**
 * 🦸 HERO SECTION - IMAGIQ ECOMMERCE
 * Refactored to use configuration system
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { useHeroBanner } from "@/hooks/useHeroBanner";
import { useHeroContext } from "@/contexts/HeroContext";
import { positionToCSS, parseTextStyles } from "@/utils/bannerCoordinates";
import Link from "next/link";
import type { HeroBannerConfig, ContentBlock } from "@/types/banner";

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
            color: "#ffffff",
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
            color: "#ffffff",
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
            color: "#ffffff",
            borderWidth: '2px',
            borderColor: "#ffffff",
            ...(config.textStyles?.cta || {}),
          }}
        >
          {config.ctaText}
        </Link>
      )}
    </div>
  );
}

/**
 * Componente para renderizar bloques de contenido con configuración desktop/mobile
 */
function ContentBlocksOverlay({
  blocks,
  isMobile,
  videoEnded,
}: Readonly<{
  blocks: ContentBlock[];
  isMobile?: boolean;
  videoEnded: boolean;
}>) {
  const visibilityClass = isMobile ? 'md:hidden' : 'hidden md:block';

  return (
    <>
      {blocks.map((block) => {
        const position = isMobile ? block.position_mobile : block.position_desktop;
        
        // Configuración del contenedor
        const textAlign = isMobile && block.textAlign_mobile 
          ? block.textAlign_mobile 
          : block.textAlign || 'left';
        const gap = isMobile && block.gap_mobile 
          ? block.gap_mobile 
          : block.gap || '12px';

        return (
          <div
            key={block.id}
            className={`absolute z-10 ${visibilityClass}`}
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: 'translate(-50%, -50%)',
              opacity: videoEnded ? 1 : 0,
              transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s",
              pointerEvents: videoEnded ? "auto" : "none",
            }}
          >
            <div
              className="flex flex-col"
              style={{ gap }}
            >
              {/* Título */}
              {block.title && (() => {
                const titleStyles = {
                  fontSize: (isMobile && block.title_mobile?.fontSize) || block.title.fontSize || '2rem',
                  fontWeight: (isMobile && block.title_mobile?.fontWeight) || block.title.fontWeight || '700',
                  color: (isMobile && block.title_mobile?.color) || block.title.color || '#ffffff',
                  lineHeight: (isMobile && block.title_mobile?.lineHeight) || block.title.lineHeight || '1.2',
                  textTransform: (isMobile && block.title_mobile?.textTransform) || block.title.textTransform || 'none',
                  letterSpacing: (isMobile && block.title_mobile?.letterSpacing) || block.title.letterSpacing || 'normal',
                  textShadow: (isMobile && block.title_mobile?.textShadow) || block.title.textShadow || '2px 2px 4px rgba(0,0,0,0.5)',
                };
                return (
                  <h2
                    style={{
                      ...titleStyles,
                      margin: 0,
                      whiteSpace: 'pre-line',
                      textAlign,
                    }}
                  >
                    {block.title.text}
                  </h2>
                );
              })()}

              {/* Subtítulo */}
              {block.subtitle && (() => {
                const subtitleStyles = {
                  fontSize: (isMobile && block.subtitle_mobile?.fontSize) || block.subtitle.fontSize || '1.5rem',
                  fontWeight: (isMobile && block.subtitle_mobile?.fontWeight) || block.subtitle.fontWeight || '600',
                  color: (isMobile && block.subtitle_mobile?.color) || block.subtitle.color || '#ffffff',
                  lineHeight: (isMobile && block.subtitle_mobile?.lineHeight) || block.subtitle.lineHeight || '1.3',
                  textTransform: (isMobile && block.subtitle_mobile?.textTransform) || block.subtitle.textTransform || 'none',
                };
                return (
                  <h3
                    style={{
                      ...subtitleStyles,
                      margin: 0,
                      whiteSpace: 'pre-line',
                      textAlign,
                    }}
                  >
                    {block.subtitle.text}
                  </h3>
                );
              })()}

              {/* Descripción */}
              {block.description && (() => {
                const descriptionStyles = {
                  fontSize: (isMobile && block.description_mobile?.fontSize) || block.description.fontSize || '1rem',
                  fontWeight: (isMobile && block.description_mobile?.fontWeight) || block.description.fontWeight || '400',
                  color: (isMobile && block.description_mobile?.color) || block.description.color || '#ffffff',
                  lineHeight: (isMobile && block.description_mobile?.lineHeight) || block.description.lineHeight || '1.5',
                };
                return (
                  <p
                    style={{
                      ...descriptionStyles,
                      margin: 0,
                      whiteSpace: 'pre-line',
                      textAlign,
                    }}
                  >
                    {block.description.text}
                  </p>
                );
              })()}

              {/* CTA */}
              {block.cta && (() => {
                const ctaStyles = {
                  fontSize: (isMobile && block.cta_mobile?.fontSize) || block.cta.fontSize || '1rem',
                  fontWeight: (isMobile && block.cta_mobile?.fontWeight) || block.cta.fontWeight || '600',
                  backgroundColor: (isMobile && block.cta_mobile?.backgroundColor) || block.cta.backgroundColor || '#ffffff',
                  color: (isMobile && block.cta_mobile?.color) || block.cta.color || '#000000',
                  padding: (isMobile && block.cta_mobile?.padding) || block.cta.padding || '12px 24px',
                  borderRadius: (isMobile && block.cta_mobile?.borderRadius) || block.cta.borderRadius || '8px',
                  border: (isMobile && block.cta_mobile?.border) || block.cta.border || 'none',
                  // Efecto glassmorphism
                  backdropFilter: (isMobile && block.cta_mobile?.backdropFilter) || block.cta.backdropFilter,
                  boxShadow: (isMobile && block.cta_mobile?.boxShadow) || block.cta.boxShadow,
                };
                return (
                  <div style={{ textAlign }}>
                    <a
                      href={block.cta.link_url || '#'}
                      className="inline-block transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      style={{
                        ...ctaStyles,
                        textDecoration: 'none',
                        textAlign: 'center',
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {block.cta.text}
                    </a>
                  </div>
                );
              })()}
            </div>
          </div>
        );
      })}
    </>
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

  // NUEVO: Trackear qué videos ya se reprodujeron (para no reproducirlos de nuevo en el loop)
  const playedVideosRef = useRef<Set<number>>(new Set());

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
      // Marcar este video como reproducido
      playedVideosRef.current.add(currentBannerIndex);

      timerRef.current = setTimeout(() => {
        goToNextBanner();
      }, BANNER_DISPLAY_DURATION);
    }
  };

  // NUEVO: Reiniciar videoEnded cuando cambia el banner
  useEffect(() => {
    setVideoEnded(false);
  }, [currentBannerIndex]);

  // Sincronizar color del header con el banner actual
  useEffect(() => {
    if (currentConfig?.colorFont) {
      setTextColor(currentConfig.colorFont);
    }
  }, [currentConfig?.colorFont, setTextColor]);

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
    const videoAlreadyPlayed = playedVideosRef.current.has(currentBannerIndex);

    // Si no tiene video O si el video ya se reprodujo antes, solo mostrar por 5 segundos
    if (!hasVideo || videoAlreadyPlayed) {
      timerRef.current = setTimeout(() => {
        goToNextBanner();
      }, BANNER_DISPLAY_DURATION);
    }
    // Si tiene video y no se ha reproducido, el timer se establecerá en handleVideoEnd

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBannerIndex, configs.length]);

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
      {/* Todos los banners en posición absoluta con transición fade + slide */}
      {configs.map((config, index) => {
        const isActive = index === currentBannerIndex;
        const videoAlreadyPlayed = playedVideosRef.current.has(index);
        const bannerVideoEnded = isActive ? videoEnded : false;
        const hasAnyVideoBanner = Boolean(config.videoSrc || config.mobileVideoSrc);
        const showImmediatelyBanner = !hasAnyVideoBanner;
        const canShowBanner = showImmediatelyBanner || Boolean(config.showContentOnEnd);
        // Si el video ya se reprodujo antes, mostrar contenido inmediatamente
        const effectiveVideoEndedBanner = showImmediatelyBanner || videoAlreadyPlayed ? true : bannerVideoEnded;
        const desktopPositionStyleBanner = positionToCSS(config.positionDesktop ?? null);
        const mobilePositionStyleBanner = positionToCSS(config.positionMobile ?? null);

        // Si el video ya se reprodujo, mostrar solo la imagen
        const shouldShowVideoDesktop = config.videoSrc && !videoAlreadyPlayed && isActive;
        const shouldShowVideoMobile = config.mobileVideoSrc && !videoAlreadyPlayed && isActive;

        // Parsear content_blocks si existe
        let contentBlocks: ContentBlock[] = [];
        if (config.content_blocks) {
          try {
            contentBlocks = typeof config.content_blocks === 'string' 
              ? JSON.parse(config.content_blocks) 
              : config.content_blocks;
          } catch (e) {
            console.error('Error parsing content_blocks:', e);
          }
        }
        const hasContentBlocks = contentBlocks.length > 0;

        return (
          <div
            key={index}
            className="absolute inset-0 transition-all duration-700 ease-in-out"
            style={{
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'translateX(0)' : 'translateX(-30px)',
              pointerEvents: isActive ? 'auto' : 'none',
              zIndex: isActive ? 1 : 0
            }}
          >
            {/* Desktop media */}
            <div className="hidden md:block absolute inset-0">
              {shouldShowVideoDesktop ? (
                <>
                  {/* Desktop video */}
                  <video
                    key={`hero-desktop-video-${index}`}
                    className="h-full object-cover"
                    autoPlay={isActive}
                    muted
                    loop={config.loop}
                    playsInline
                    preload="metadata"
                    onEnded={isActive ? handleVideoEnd : undefined}
                    poster={config.imageSrc || undefined}
                    style={{
                      opacity: bannerVideoEnded ? 0 : 1,
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
                        opacity: bannerVideoEnded ? 1 : 0,
                        width: `${100 - scrollProgress * 8}%`,
                        height: '100%',
                        marginLeft: `${scrollProgress * 4}%`,
                        transition: "opacity 0.5s ease-in-out, width 0.3s ease-out, margin 0.3s ease-out",
                      }}
                    />
                  )}
                </>
              ) : (
                /* Desktop image only (o video ya reproducido) */
                config.imageSrc && (
                  <div
                    key={`hero-desktop-image-${index}`}
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
              {shouldShowVideoMobile ? (
                <>
                  {/* Mobile video */}
                  <video
                    key={`hero-mobile-video-${index}`}
                    className="h-full object-cover"
                    autoPlay={isActive}
                    muted
                    loop={config.loop}
                    playsInline
                    preload="metadata"
                    onEnded={isActive ? handleVideoEnd : undefined}
                    poster={config.mobileImageSrc || undefined}
                    style={{
                      opacity: bannerVideoEnded ? 0 : 1,
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
                        opacity: bannerVideoEnded ? 1 : 0,
                        width: `${100 - scrollProgress * 8}%`,
                        height: '100%',
                        marginLeft: `${scrollProgress * 4}%`,
                        transition: "opacity 0.5s ease-in-out, width 0.3s ease-out, margin 0.3s ease-out",
                      }}
                    />
                  )}
                </>
              ) : (
                /* Mobile image only (o video ya reproducido) */
                config.mobileImageSrc && (
                  <div
                    key={`hero-mobile-image-${index}`}
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

            {/* Contenido específico de este banner */}
            {(canShowBanner || videoAlreadyPlayed) && (
              hasContentBlocks ? (
                <>
                  <ContentBlocksOverlay
                    blocks={contentBlocks}
                    isMobile={false}
                    videoEnded={effectiveVideoEndedBanner}
                  />
                  <ContentBlocksOverlay
                    blocks={contentBlocks}
                    isMobile={true}
                    videoEnded={effectiveVideoEndedBanner}
                  />
                </>
              ) : (
                <>
                  <HeroContent
                    config={config}
                    videoEnded={effectiveVideoEndedBanner}
                    positionStyle={desktopPositionStyleBanner}
                  />
                  <HeroContent
                    config={config}
                    videoEnded={effectiveVideoEndedBanner}
                    positionStyle={mobilePositionStyleBanner}
                    isMobile
                  />
                </>
              )
            )}
          </div>
        );
      })}

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