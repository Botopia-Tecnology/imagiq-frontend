/**
 * Slide individual de banner multimedia
 * Maneja imagen/video con texto posicionado y CTA
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { MultimediaPageBanner } from '@/services/multimedia-pages.service';
import type { BannerTextStyles, TextBox, CTABox } from '@/types/banner';
import { getCloudinaryUrl } from '@/lib/cloudinary';

interface MultimediaBannerSlideProps {
  banner: MultimediaPageBanner;
  isActive: boolean;
  isMobile: boolean;
  onVideoStart?: () => void;
  onVideoEnd?: () => void;
}

export default function MultimediaBannerSlide({
  banner,
  isActive,
  isMobile,
  onVideoStart,
  onVideoEnd,
}: MultimediaBannerSlideProps) {
  const [hasPlayedVideo, setHasPlayedVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const imageUrl = isMobile ? banner.mobile_image_url : banner.desktop_image_url;
  const videoUrl = isMobile ? banner.mobile_video_url : banner.desktop_video_url;
  const position = isMobile ? banner.position_mobile : banner.position_desktop;
  const textStyles = banner.text_styles as BannerTextStyles | null;
  
  // Calcular alineación de texto basado en posición
  const getTextAlign = () => {
    if (position.x <= 33) return 'left';
    if (position.x >= 66) return 'right';
    return 'center';
  };
  
  // Parsear cajas de contenido del JSON
  const titleBoxes: TextBox[] = banner.title_boxes ? JSON.parse(banner.title_boxes) : [];
  const descriptionBoxes: TextBox[] = banner.description_boxes ? JSON.parse(banner.description_boxes) : [];
  const ctaBoxes: CTABox[] = banner.cta_boxes ? JSON.parse(banner.cta_boxes) : [];
  
  // Determinar si usar sistema nuevo (cajas) o legacy (title/description/cta)
  const useNewSystem = titleBoxes.length > 0 || descriptionBoxes.length > 0 || ctaBoxes.length > 0;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl || !isActive) return;

    // Solo reproducir si no se ha reproducido antes
    if (!hasPlayedVideo) {
      video.play().then(() => {
        onVideoStart?.();
      }).catch(console.error);
    }
  }, [isActive, videoUrl, hasPlayedVideo, onVideoStart]);

  const handleVideoEnd = () => {
    setHasPlayedVideo(true);
    onVideoEnd?.();
  };

  // Renderizar media apropiado
  const shouldShowVideo = videoUrl && !hasPlayedVideo;

  let mediaContent: React.ReactNode = null;
  if (shouldShowVideo) {
    // Optimizar poster del video si hay imagen disponible
    const optimizedPoster = imageUrl
      ? getCloudinaryUrl(imageUrl, isMobile ? 'mobile-banner' : 'landing-banner')
      : undefined;

    mediaContent = (
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        playsInline
        poster={optimizedPoster}
        onEnded={handleVideoEnd}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    );
  } else if (imageUrl) {
    // Aplicar optimizaciones de Cloudinary para landing pages
    const optimizedImageUrl = getCloudinaryUrl(
      imageUrl,
      isMobile ? 'mobile-banner' : 'landing-banner'
    );

    mediaContent = (
      <Image
        src={optimizedImageUrl}
        alt={banner.title || banner.name}
        fill
        className="object-cover"
        priority={isActive}
      />
    );
  }

  return (
    <div className="relative w-full aspect-[1260/310] overflow-hidden">
      {/* Fondo - Imagen o Video */}
      {mediaContent}

      {/* Sistema NUEVO: Renderizar cajas de contenido si existen */}
      {useNewSystem ? (
        <>
          {/* Title Boxes */}
          {titleBoxes.map((box) => {
            const pos = isMobile ? box.position_mobile : box.position_desktop;
            return (
              <div
                key={box.id}
                className="absolute pointer-events-auto"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(0, 0)',
                  color: box.styles?.color || banner.color_font,
                  fontSize: box.styles?.fontSize || '2rem',
                  fontWeight: box.styles?.fontWeight || '700',
                  lineHeight: box.styles?.lineHeight || '1.2',
                  textAlign: box.styles?.textAlign || 'left',
                  textTransform: box.styles?.textTransform || 'none',
                  letterSpacing: box.styles?.letterSpacing,
                  textShadow: box.styles?.textShadow || '0 2px 4px rgba(0,0,0,0.3)',
                  maxWidth: box.styles?.maxWidth,
                  whiteSpace: box.styles?.whiteSpace || 'pre-line',
                }}
              >
                {box.text}
              </div>
            );
          })}

          {/* Description Boxes */}
          {descriptionBoxes.map((box) => {
            const pos = isMobile ? box.position_mobile : box.position_desktop;
            return (
              <div
                key={box.id}
                className="absolute pointer-events-auto"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(0, 0)',
                  color: box.styles?.color || banner.color_font,
                  fontSize: box.styles?.fontSize || '1.25rem',
                  fontWeight: box.styles?.fontWeight || '400',
                  lineHeight: box.styles?.lineHeight || '1.5',
                  textAlign: box.styles?.textAlign || 'left',
                  textTransform: box.styles?.textTransform || 'none',
                  letterSpacing: box.styles?.letterSpacing,
                  textShadow: box.styles?.textShadow || '0 1px 2px rgba(0,0,0,0.2)',
                  maxWidth: box.styles?.maxWidth,
                  whiteSpace: box.styles?.whiteSpace || 'pre-line',
                }}
              >
                {box.text}
              </div>
            );
          })}

          {/* CTA Boxes */}
          {ctaBoxes.map((box) => {
            const pos = isMobile ? box.position_mobile : box.position_desktop;
            return (
              <Link
                key={box.id}
                href={box.link_url || '#'}
                className="absolute pointer-events-auto inline-block transition-transform hover:scale-105 active:scale-95"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(0, 0)',
                  fontSize: box.styles?.fontSize || '1rem',
                  fontWeight: box.styles?.fontWeight || '600',
                  backgroundColor: box.styles?.backgroundColor || banner.color_font,
                  color: box.styles?.color || '#000000',
                  padding: box.styles?.padding || '12px 24px',
                  borderRadius: box.styles?.borderRadius || '8px',
                  borderWidth: box.styles?.borderWidth || '0',
                  borderColor: box.styles?.borderColor,
                  textAlign: box.styles?.textAlign || 'center',
                  textTransform: box.styles?.textTransform || 'none',
                  letterSpacing: box.styles?.letterSpacing,
                  boxShadow: box.styles?.boxShadow || '0 2px 8px rgba(0,0,0,0.2)',
                  transition: box.styles?.transition || 'all 0.2s ease',
                }}
              >
                {box.text}
              </Link>
            );
          })}
        </>
      ) : (
        /* Sistema LEGACY: Renderizar title/description/cta tradicional */
        <div
          className="absolute pointer-events-auto max-w-2xl"
          style={{
            color: banner.color_font,
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: 'translate(-50%, -50%)',
            textAlign: getTextAlign(),
          }}
        >
          {banner.title && (
            <h2 
              className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4"
              style={{
                color: banner.color_font,
                ...textStyles?.title,
              }}
            >
              {banner.title}
            </h2>
          )}
        
          {banner.description && (
            <p 
              className="text-base md:text-xl lg:text-2xl mb-6"
              style={{
                color: banner.color_font,
                ...textStyles?.description,
              }}
            >
              {banner.description}
            </p>
          )}

        {banner.cta && banner.link_url && (
          <Link
            href={banner.link_url}
            className="inline-block px-8 py-3 rounded-full font-semibold text-base md:text-lg transition-transform hover:scale-105 active:scale-95"
            style={{
              backgroundColor: banner.color_font,
              color: '#000000',
              ...textStyles?.cta,
            }}
          >
            {banner.cta}
          </Link>
        )}
        </div>
      )}
    </div>
  );
}
