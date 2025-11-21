"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useDynamicBanner } from '@/hooks/useDynamicBanner';
import { parsePosition, parseTextStyles } from '@/utils/bannerCoordinates';
import type { Banner, BannerPosition, BannerTextStyles } from '@/types/banner';

type CSS = React.CSSProperties;

/**
 * Convierte una BannerPosition parseada a estilos CSS porcentuales simples
 * (usado como fallback cuando no se puede calcular la posición exacta)
 */
const positionToPercentCSS = (position: BannerPosition | null): CSS => {
  if (!position) {
    return { left: '50%', top: '50%' };
  }
  return { left: `${position.x}%`, top: `${position.y}%` };
};

async function loadImage(src?: string) {
  if (!src) return null;
  const img = new Image();
  return new Promise<HTMLImageElement | null>((res) => {
    img.onload = () => res(img);
    img.onerror = () => res(null);
    img.src = src;
  });
}

interface DynamicBannerProps {
  placement: string;
  className?: string;
  showOverlay?: boolean;
  children?: React.ReactNode;
}

function BannerSkeleton() {
  return (
    <div className="relative w-full min-h-[400px] bg-gray-200 animate-pulse">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-gray-400">Cargando banner...</div>
      </div>
    </div>
  );
}

interface BannerContentProps {
  title: string | null;
  description: string | null;
  cta: string | null;
  color: string;
  positionStyle?: CSS;
  isMobile?: boolean;
  textStyles?: BannerTextStyles | null;
}

function BannerContent({ title, description, cta, color, positionStyle, isMobile, textStyles }: Readonly<BannerContentProps>) {
  const final: CSS = { color, transform: 'translate(-50%, -50%)' };
  if (positionStyle) Object.assign(final, positionStyle);
  if (isMobile && !positionStyle?.left) final.left = '50%';
  return (
    <div className={`absolute max-w-2xl px-6 ${isMobile ? 'md:hidden flex flex-col items-center text-center' : 'hidden md:block'}`} style={final}>
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
      {cta && (
        <button 
          className="px-6 py-2.5 rounded-full font-semibold text-sm md:text-base transition-all duration-300 hover:scale-105" 
          style={{ 
            borderWidth: '2px', 
            borderColor: color, 
            backgroundColor: 'transparent',
            ...(textStyles?.cta || {})
          }}
        >
          {cta}
        </button>
      )}
    </div>
  );
}

export default function DynamicBannerClean({ placement, className = '', showOverlay = false, children }: Readonly<DynamicBannerProps>) {
  const { banners, loading } = useDynamicBanner(placement);
  const desktopRef = useRef<HTMLDivElement | null>(null);
  const mobileRef = useRef<HTMLDivElement | null>(null);
  const [deskStyle, setDeskStyle] = useState<CSS | undefined>();
  const [mobStyle, setMobStyle] = useState<CSS | undefined>();

  // NUEVO: Estados para el carrusel
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const desktopVideoRef = useRef<HTMLVideoElement | null>(null);
  const mobileVideoRef = useRef<HTMLVideoElement | null>(null);

  // NUEVO: Constante de tiempo para mostrar banner (5 segundos)
  // Este tiempo se usa para banners sin video Y después de que termine un video
  const BANNER_DISPLAY_DURATION = 5000;

  // NUEVO: Banner actualmente visible
  const currentBanner = banners[currentBannerIndex] || null;

  // NUEVO: Función para avanzar al siguiente banner (con loop)
  const goToNextBanner = () => {
    setCurrentBannerIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      // Si llegamos al final, volver al inicio (loop)
      return nextIndex >= banners.length ? 0 : nextIndex;
    });
  };

  // NUEVO: Handler cuando termina un video
  const handleVideoEnd = () => {
    // Solo aplicar si hay múltiples banners
    if (banners.length > 1) {
      // Esperar BANNER_DISPLAY_DURATION adicionales después de que termine el video
      timerRef.current = setTimeout(() => {
        goToNextBanner();
      }, BANNER_DISPLAY_DURATION);
    }
  };

  const compute = async (position: BannerPosition | null, wrapper?: HTMLDivElement | null, mediaSrc?: string) => {
    if (!wrapper || !position) return undefined;
    const wrapRect = wrapper.getBoundingClientRect();
    const lPct = position.x;
    const tPct = position.y;

    const video = wrapper.querySelector('video');
    if (video instanceof HTMLVideoElement) {
      const r = video.getBoundingClientRect();
      return { left: `${r.left - wrapRect.left + (lPct / 100) * r.width}px`, top: `${r.top - wrapRect.top + (tPct / 100) * r.height}px` };
    }

    const imgEl = wrapper.querySelector('img');
    if (imgEl instanceof HTMLImageElement && imgEl.naturalWidth && imgEl.naturalHeight) {
      const r = imgEl.getBoundingClientRect();
      return { left: `${r.left - wrapRect.left + (lPct / 100) * r.width}px`, top: `${r.top - wrapRect.top + (tPct / 100) * r.height}px` };
    }

    if (mediaSrc) {
      const loaded = await loadImage(mediaSrc);
      if (loaded?.naturalWidth && loaded?.naturalHeight) {
        const cW = wrapRect.width, cH = wrapRect.height;
        const iA = loaded.naturalWidth / loaded.naturalHeight, cA = cW / cH;
        const displayW = iA > cA ? cW : cH * iA;
        const displayH = iA > cA ? cW / iA : cH;
        const offL = (cW - displayW) / 2, offT = (cH - displayH) / 2;
        return { left: `${offL + (lPct / 100) * displayW}px`, top: `${offT + (tPct / 100) * displayH}px` };
      }
    }

    return { left: `${lPct}%`, top: `${tPct}%` };
  };

  // NUEVO: Efecto para gestionar el carrusel automático
  useEffect(() => {
    // Si no hay banners o solo hay uno, no necesitamos carrusel
    if (banners.length <= 1) {
      // Limpiar cualquier timer existente
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Limpiar timer anterior si existe
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const currentBannerData = banners[currentBannerIndex];
    const hasVideo = Boolean(currentBannerData?.desktop_video_url || currentBannerData?.mobile_video_url);

    // Si no tiene video, mostrar por BANNER_DISPLAY_DURATION
    if (!hasVideo) {
      timerRef.current = setTimeout(() => {
        goToNextBanner();
      }, BANNER_DISPLAY_DURATION);
    }
    // Si tiene video, el timer se establecerá en handleVideoEnd

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBannerIndex, banners.length]);

  // Efecto para calcular posiciones del banner actual
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!currentBanner) return;

      // Parsear posiciones del nuevo sistema
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
    return () => { mounted = false; window.removeEventListener('resize', onRes); };
  }, [currentBanner]);

  if (loading) return <BannerSkeleton />;
  if (!currentBanner) return <>{children || null}</>;

  const content = (
    <div className={`relative w-full ${className}`}>
      <div className="relative max-w-[1440px] mx-auto min-h-[700px] md:min-h-[500px] lg:min-h-[800px] rounded-lg overflow-hidden">
        {showOverlay && <div className="absolute inset-0 bg-black/30 z-10" />}

        {/* Todos los banners en posición absoluta con transición fade + slide */}
        {banners.map((banner, index) => {
          const isActive = index === currentBannerIndex;
          const desktopPosition = parsePosition(banner.position_desktop);
          const mobilePosition = parsePosition(banner.position_mobile);
          const bannerTextStyles = parseTextStyles(banner.text_styles);

          let bannerDesktopMedia: React.ReactNode = null;
          if (banner.desktop_video_url) {
            bannerDesktopMedia = (
              <video
                ref={isActive ? desktopVideoRef : null}
                autoPlay={isActive}
                muted
                playsInline
                preload="metadata"
                poster={banner.desktop_image_url || undefined}
                className="w-full h-full object-contain"
                onEnded={isActive ? handleVideoEnd : undefined}
                key={`desktop-video-${index}`}
              >
                <source src={banner.desktop_video_url} type="video/mp4" />
              </video>
            );
          } else if (banner.desktop_image_url) {
            bannerDesktopMedia = (
              <div
                className="w-full h-full bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${banner.desktop_image_url})` }}
                key={`desktop-image-${index}`}
              />
            );
          }

          let bannerMobileMedia: React.ReactNode = null;
          if (banner.mobile_video_url) {
            bannerMobileMedia = (
              <video
                ref={isActive ? mobileVideoRef : null}
                autoPlay={isActive}
                muted
                playsInline
                preload="metadata"
                poster={banner.mobile_image_url || undefined}
                className="w-full h-full object-contain"
                onEnded={isActive ? handleVideoEnd : undefined}
                key={`mobile-video-${index}`}
              >
                <source src={banner.mobile_video_url} type="video/mp4" />
              </video>
            );
          } else if (banner.mobile_image_url) {
            bannerMobileMedia = (
              <div
                className="w-full h-full bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${banner.mobile_image_url})` }}
                key={`mobile-image-${index}`}
              />
            );
          }

          return (
            <div
              key={banner.id}
              className="absolute inset-0 transition-all duration-700 ease-in-out"
              style={{
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'translateX(0)' : 'translateX(-30px)',
                pointerEvents: isActive ? 'auto' : 'none',
                zIndex: isActive ? 1 : 0
              }}
            >
              <div ref={isActive ? desktopRef : null} className="hidden md:block absolute inset-0">
                {bannerDesktopMedia}
              </div>

              <div ref={isActive ? mobileRef : null} className="block md:hidden absolute inset-0">
                {bannerMobileMedia}
              </div>

              <div className="absolute inset-0 z-20">
                <BannerContent
                  title={banner.title}
                  description={banner.description}
                  cta={banner.cta}
                  color={banner.color_font}
                  positionStyle={isActive && deskStyle ? deskStyle : positionToPercentCSS(desktopPosition)}
                  textStyles={bannerTextStyles}
                />
                <BannerContent
                  title={banner.title}
                  description={banner.description}
                  cta={banner.cta}
                  color={banner.color_font}
                  positionStyle={isActive && mobStyle ? mobStyle : positionToPercentCSS(mobilePosition)}
                  isMobile
                  textStyles={bannerTextStyles}
                />
              </div>
            </div>
          );
        })}

        {/* NUEVO: Indicadores de carrusel (solo si hay múltiples banners) */}
        {banners.length > 1 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
            {banners.map((_: Banner, index: number) => (
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

        <div className="pointer-events-none px-4 md:px-6 lg:px-8 xl:px-12 py-6 md:py-8" />
      </div>
    </div>
  );

  return currentBanner.link_url ? <Link href={currentBanner.link_url} className="block">{content}</Link> : content;
}
