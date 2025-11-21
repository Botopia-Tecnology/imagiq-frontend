"use client";

/**
 * Banner Dinámico con Carrusel
 *
 * Componente reutilizable para mostrar banners del API con soporte para:
 * - Carrusel automático de múltiples banners
 * - Videos y/o imágenes (desktop y mobile)
 * - Animaciones fade + slide suaves
 * - Posicionamiento dinámico de contenido
 * - Indicadores de navegación
 */

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useDynamicBanner } from '@/hooks/useDynamicBanner';
import { useCarouselController } from '@/hooks/useCarouselController';
import { parsePosition, parseTextStyles } from '@/utils/bannerCoordinates';
import type { Banner, BannerPosition, BannerTextStyles } from '@/types/banner';

type CSS = React.CSSProperties;

/**
 * Props del componente principal
 */
interface DynamicBannerProps {
  placement: string;
  className?: string;
  showOverlay?: boolean;
  children?: React.ReactNode;
  displayDuration?: number;
  trackPlayedVideos?: boolean;
}

/**
 * Props del contenido del banner
 */
interface BannerContentProps {
  title: string | null;
  description: string | null;
  cta: string | null;
  color: string;
  positionStyle?: CSS;
  isMobile?: boolean;
  textStyles?: BannerTextStyles | null;
  videoEnded: boolean;
  linkUrl: string | null;
}

/**
 * Convierte una BannerPosition parseada a estilos CSS porcentuales simples
 */
const positionToPercentCSS = (position: BannerPosition | null): CSS => {
  if (!position) {
    return { left: '50%', top: '50%' };
  }
  return { left: `${position.x}%`, top: `${position.y}%` };
};

/**
 * Carga una imagen de forma asíncrona
 */
async function loadImage(src?: string): Promise<HTMLImageElement | null> {
  if (!src) return null;
  const img = new Image();
  return new Promise<HTMLImageElement | null>((res) => {
    img.onload = () => res(img);
    img.onerror = () => res(null);
    img.src = src;
  });
}

/**
 * Skeleton de carga
 */
function BannerSkeleton() {
  return (
    <div className="relative w-full min-h-[400px] bg-gray-200 animate-pulse">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-gray-400">Cargando banner...</div>
      </div>
    </div>
  );
}

/**
 * Contenido del banner (título, descripción, CTA)
 * Con animación de reveal cuando el video termina (igual que HeroSection)
 */
function BannerContent({
  title,
  description,
  cta,
  color,
  positionStyle,
  isMobile,
  textStyles,
  videoEnded,
  linkUrl
}: Readonly<BannerContentProps>) {
  const final: CSS = {
    color,
    transform: 'translate(-50%, -50%)',
    opacity: videoEnded ? 1 : 0,
    transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s",
    pointerEvents: videoEnded ? "auto" : "none",
  };
  if (positionStyle) Object.assign(final, positionStyle);
  if (isMobile && !positionStyle?.left) final.left = '50%';

  const content = (
    <div
      className={`absolute max-w-2xl px-6 ${
        isMobile
          ? 'md:hidden flex flex-col items-center text-center'
          : 'hidden md:block'
      }`}
      style={final}
    >
      {title && (
        <h2
          className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4"
          style={textStyles?.title || {}}
        >
          {title}
        </h2>
      )}
      {description && (
        <p
          className="text-base md:text-xl lg:text-2xl mb-4 md:mb-6"
          style={textStyles?.description || {}}
        >
          {description}
        </p>
      )}
      {cta && linkUrl && (
        <Link
          href={linkUrl}
          className="inline-block px-6 py-2.5 rounded-full font-semibold text-sm md:text-base transition-all duration-300 hover:scale-105"
          style={{
            borderWidth: '2px',
            borderColor: color,
            backgroundColor: 'transparent',
            ...(textStyles?.cta || {})
          }}
        >
          {cta}
        </Link>
      )}
    </div>
  );

  return content;
}

/**
 * Componente principal de banner dinámico con carrusel
 */
export default function DynamicBannerClean({
  placement,
  className = '',
  showOverlay = false,
  children,
  displayDuration = 5000,
  trackPlayedVideos = false,
}: Readonly<DynamicBannerProps>) {
  const { banners, loading } = useDynamicBanner(placement);
  const controller = useCarouselController({
    itemsCount: banners.length,
    displayDuration,
    trackPlayedVideos,
  });

  const desktopRef = useRef<HTMLDivElement | null>(null);
  const mobileRef = useRef<HTMLDivElement | null>(null);
  const [deskStyle, setDeskStyle] = useState<CSS | undefined>();
  const [mobStyle, setMobStyle] = useState<CSS | undefined>();

  /**
   * Calcula la posición exacta del contenido basado en el media actual
   */
  const compute = async (
    position: BannerPosition | null,
    wrapper?: HTMLDivElement | null,
    mediaSrc?: string
  ): Promise<CSS | undefined> => {
    if (!wrapper || !position) return undefined;
    const wrapRect = wrapper.getBoundingClientRect();
    const lPct = position.x;
    const tPct = position.y;

    // Intentar con video primero
    const video = wrapper.querySelector('video');
    if (video instanceof HTMLVideoElement) {
      const r = video.getBoundingClientRect();
      return {
        left: `${r.left - wrapRect.left + (lPct / 100) * r.width}px`,
        top: `${r.top - wrapRect.top + (tPct / 100) * r.height}px`
      };
    }

    // Intentar con imagen existente
    const imgEl = wrapper.querySelector('img');
    if (imgEl instanceof HTMLImageElement && imgEl.naturalWidth && imgEl.naturalHeight) {
      const r = imgEl.getBoundingClientRect();
      return {
        left: `${r.left - wrapRect.left + (lPct / 100) * r.width}px`,
        top: `${r.top - wrapRect.top + (tPct / 100) * r.height}px`
      };
    }

    // Calcular basado en dimensiones de la imagen cargada
    if (mediaSrc) {
      const loaded = await loadImage(mediaSrc);
      if (loaded?.naturalWidth && loaded?.naturalHeight) {
        const cW = wrapRect.width;
        const cH = wrapRect.height;
        const iA = loaded.naturalWidth / loaded.naturalHeight;
        const cA = cW / cH;
        const displayW = iA > cA ? cW : cH * iA;
        const displayH = iA > cA ? cW / iA : cH;
        const offL = (cW - displayW) / 2;
        const offT = (cH - displayH) / 2;
        return {
          left: `${offL + (lPct / 100) * displayW}px`,
          top: `${offT + (tPct / 100) * displayH}px`
        };
      }
    }

    // Fallback a porcentajes
    return { left: `${lPct}%`, top: `${tPct}%` };
  };

  /**
   * Efecto para calcular posiciones del banner actual
   */
  useEffect(() => {
    let mounted = true;
    const currentBanner = banners[controller.currentIndex];

    const run = async () => {
      if (!currentBanner) return;

      const desktopPosition = parsePosition(currentBanner.position_desktop);
      const mobilePosition = parsePosition(currentBanner.position_mobile);

      const d = await compute(
        desktopPosition,
        desktopRef.current,
        (currentBanner.desktop_video_url || currentBanner.desktop_image_url) ?? undefined
      );
      const m = await compute(
        mobilePosition,
        mobileRef.current,
        (currentBanner.mobile_video_url || currentBanner.mobile_image_url) ?? undefined
      );

      if (!mounted) return;
      setDeskStyle(d);
      setMobStyle(m);
    };

    run();
    const onRes = () => run();
    window.addEventListener('resize', onRes);
    return () => {
      mounted = false;
      window.removeEventListener('resize', onRes);
    };
  }, [banners, controller.currentIndex]);

  /**
   * Efecto para manejar timers de banners sin video
   */
  useEffect(() => {
    if (banners.length <= 1) return;

    const currentBanner = banners[controller.currentIndex];
    const hasVideo = Boolean(
      currentBanner?.desktop_video_url || currentBanner?.mobile_video_url
    );

    // Si no tiene video, avanzar automáticamente después del displayDuration
    if (!hasVideo) {
      const timer = setTimeout(() => {
        controller.goToNext();
      }, displayDuration);

      return () => clearTimeout(timer);
    }
  }, [banners, controller, displayDuration]);

  // Renderizar skeleton mientras carga
  if (loading) return <BannerSkeleton />;

  // Renderizar children si no hay banners
  if (banners.length === 0) return <>{children || null}</>;

  const currentBanner = banners[controller.currentIndex];
  if (!currentBanner) return <>{children || null}</>;

  const content = (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <div className="relative max-w-[1440px] mx-auto min-h-[700px] md:min-h-[500px] lg:min-h-[800px] rounded-lg overflow-hidden">
        {showOverlay && <div className="absolute inset-0 bg-black/30 z-10" />}

        {/* Todos los banners en posición absoluta con transición fade + slide */}
        {banners.map((banner, index) => {
          const isActive = index === controller.currentIndex;
          const desktopPosition = parsePosition(banner.position_desktop);
          const mobilePosition = parsePosition(banner.position_mobile);
          const bannerTextStyles = parseTextStyles(banner.text_styles);

          // Renderizar media desktop
          let bannerDesktopMedia: React.ReactNode = null;
          if (banner.desktop_video_url) {
            bannerDesktopMedia = (
              <video
                autoPlay={isActive}
                muted
                playsInline
                preload="metadata"
                poster={banner.desktop_image_url || undefined}
                className="w-full h-full object-contain"
                onEnded={isActive ? controller.handleVideoEnd : undefined}
                key={`desktop-video-${banner.id}-${index}`}
              >
                <source src={banner.desktop_video_url} type="video/mp4" />
              </video>
            );
          } else if (banner.desktop_image_url) {
            bannerDesktopMedia = (
              <div
                className="w-full h-full bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${banner.desktop_image_url})` }}
                key={`desktop-image-${banner.id}-${index}`}
              />
            );
          }

          // Renderizar media mobile
          let bannerMobileMedia: React.ReactNode = null;
          if (banner.mobile_video_url) {
            bannerMobileMedia = (
              <video
                autoPlay={isActive}
                muted
                playsInline
                preload="metadata"
                poster={banner.mobile_image_url || undefined}
                className="w-full h-full object-contain"
                onEnded={isActive ? controller.handleVideoEnd : undefined}
                key={`mobile-video-${banner.id}-${index}`}
              >
                <source src={banner.mobile_video_url} type="video/mp4" />
              </video>
            );
          } else if (banner.mobile_image_url) {
            bannerMobileMedia = (
              <div
                className="w-full h-full bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${banner.mobile_image_url})` }}
                key={`mobile-image-${banner.id}-${index}`}
              />
            );
          }

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
              <div
                ref={isActive ? desktopRef : null}
                className="hidden md:block absolute inset-0"
              >
                {bannerDesktopMedia}
              </div>

              <div
                ref={isActive ? mobileRef : null}
                className="block md:hidden absolute inset-0"
              >
                {bannerMobileMedia}
              </div>

              <div className="absolute inset-0 z-20">
                <BannerContent
                  title={banner.title}
                  description={banner.description}
                  cta={banner.cta}
                  color={banner.color_font}
                  positionStyle={
                    isActive && deskStyle
                      ? deskStyle
                      : positionToPercentCSS(desktopPosition)
                  }
                  textStyles={bannerTextStyles}
                  videoEnded={true}
                  linkUrl={banner.link_url}
                />
                <BannerContent
                  title={banner.title}
                  description={banner.description}
                  cta={banner.cta}
                  color={banner.color_font}
                  positionStyle={
                    isActive && mobStyle
                      ? mobStyle
                      : positionToPercentCSS(mobilePosition)
                  }
                  isMobile
                  textStyles={bannerTextStyles}
                  videoEnded={true}
                  linkUrl={banner.link_url}
                />
              </div>
            </div>
          );
        })}

        {/* Indicadores de carrusel (solo si hay múltiples banners) */}
        {banners.length > 1 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
            {banners.map((_: Banner, index: number) => (
              <button
                key={index}
                onClick={() => controller.goToIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === controller.currentIndex
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Ir al banner ${index + 1}`}
              />
            ))}
          </div>
        )}

        <div className="pointer-events-none px-4 md:px-6 lg:px-8 xl:px-12 py-6 md:py-8" />
      </div>
    </div>
  );

  return currentBanner.link_url ? (
    <Link href={currentBanner.link_url} className="block">
      {content}
    </Link>
  ) : content;
}
