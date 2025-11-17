"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useDynamicBanner } from '@/hooks/useDynamicBanner';
import { parsePosition, positionToCSS } from '@/utils/bannerCoordinates';
import type { BannerPosition } from '@/types/banner';

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
}

function BannerContent({ title, description, cta, color, positionStyle, isMobile }: Readonly<BannerContentProps>) {
  const final: CSS = { color, transform: 'translate(-50%, -50%)' };
  if (positionStyle) Object.assign(final, positionStyle);
  if (isMobile && !positionStyle?.left) final.left = '50%';
  return (
    <div className={`absolute max-w-2xl px-6 ${isMobile ? 'md:hidden flex flex-col items-center text-center' : 'hidden md:block'}`} style={final}>
      {title && <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4">{title}</h2>}
      {description && <p className="text-base md:text-xl lg:text-2xl mb-4 md:mb-6">{description}</p>}
      {cta && (
        <button className="px-6 py-2.5 rounded-full font-semibold text-sm md:text-base transition-all duration-300 hover:scale-105" style={{ borderWidth: '2px', borderColor: color, backgroundColor: 'transparent' }}>
          {cta}
        </button>
      )}
    </div>
  );
}

export default function DynamicBannerClean({ placement, className = '', showOverlay = false, children }: Readonly<DynamicBannerProps>) {
  const { banner, loading } = useDynamicBanner(placement);
  const desktopRef = useRef<HTMLDivElement | null>(null);
  const mobileRef = useRef<HTMLDivElement | null>(null);
  const [deskStyle, setDeskStyle] = useState<CSS | undefined>();
  const [mobStyle, setMobStyle] = useState<CSS | undefined>();

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

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!banner) return;
      
      // Parsear posiciones del nuevo sistema
      const desktopPosition = parsePosition(banner.position_desktop);
      const mobilePosition = parsePosition(banner.position_mobile);
      
      const d = await compute(
        desktopPosition,
        desktopRef.current,
        (banner.desktop_video_url || banner.desktop_image_url) ?? undefined
      );
      const m = await compute(
        mobilePosition,
        mobileRef.current,
        (banner.mobile_video_url || banner.mobile_image_url) ?? undefined
      );
      
      if (!mounted) return;
      setDeskStyle(d);
      setMobStyle(m);
    };
    run();
    const onRes = () => run();
    window.addEventListener('resize', onRes);
    return () => { mounted = false; window.removeEventListener('resize', onRes); };
  }, [banner]);

  if (loading) return <BannerSkeleton />;
  if (!banner) return <>{children || null}</>;
  // prepare media nodes to avoid nested ternary expressions in JSX
  let desktopMedia: React.ReactNode = null;
  if (banner.desktop_video_url) {
    desktopMedia = (
      <video autoPlay muted loop playsInline preload="metadata" poster={banner.desktop_image_url || undefined} className="w-full h-full object-contain">
        <source src={banner.desktop_video_url} type="video/mp4" />
      </video>
    );
  } else if (banner.desktop_image_url) {
    desktopMedia = (
      <div className="w-full h-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${banner.desktop_image_url})` }} />
    );
  }

  let mobileMedia: React.ReactNode = null;
  if (banner.mobile_video_url) {
    mobileMedia = (
      <video autoPlay muted loop playsInline preload="metadata" poster={banner.mobile_image_url || undefined} className="w-full h-full object-contain">
        <source src={banner.mobile_video_url} type="video/mp4" />
      </video>
    );
  } else if (banner.mobile_image_url) {
    mobileMedia = (
      <div className="w-full h-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${banner.mobile_image_url})` }} />
    );
  }

  const content = (
    <div className={`relative w-full ${className}`}>
      <div className="relative max-w-[1440px] mx-auto min-h-[700px] md:min-h-[500px] lg:min-h-[800px] rounded-lg overflow-hidden">
        {showOverlay && <div className="absolute inset-0 bg-black/30 z-10" />}

        <div ref={desktopRef} className="hidden md:block absolute inset-0">
          {desktopMedia}
        </div>

        <div ref={mobileRef} className="block md:hidden absolute inset-0">
          {mobileMedia}
        </div>

        <div className="absolute inset-0 z-20">
          <BannerContent 
            title={banner.title} 
            description={banner.description} 
            cta={banner.cta} 
            color={banner.color_font} 
            positionStyle={deskStyle ?? positionToPercentCSS(parsePosition(banner.position_desktop))} 
          />
          <BannerContent 
            title={banner.title} 
            description={banner.description} 
            cta={banner.cta} 
            color={banner.color_font} 
            positionStyle={mobStyle ?? positionToPercentCSS(parsePosition(banner.position_mobile))} 
            isMobile 
          />
        </div>

        <div className="pointer-events-none px-4 md:px-6 lg:px-8 xl:px-12 py-6 md:py-8" />
      </div>
    </div>
  );

  return banner.link_url ? <Link href={banner.link_url} className="block">{content}</Link> : content;
}
