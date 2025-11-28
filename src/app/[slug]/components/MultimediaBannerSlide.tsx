/**
 * Slide individual de banner multimedia
 * Maneja imagen/video con texto posicionado y CTA
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { MultimediaPageBanner } from '@/services/multimedia-pages.service';

// Tipos para text_styles
interface BannerTextStyles {
  title: {
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
  };
  description: {
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
  };
  cta: {
    fontSize: string;
    fontWeight: string;
    padding: string;
    borderWidth: string;
  };
}

// Estilos por defecto si no hay text_styles personalizados
const DEFAULT_TEXT_STYLES: BannerTextStyles = {
  title: {
    fontSize: "clamp(2rem, 5vw, 4rem)",
    fontWeight: "700",
    lineHeight: "1.2"
  },
  description: {
    fontSize: "clamp(1rem, 2vw, 1.5rem)",
    fontWeight: "400",
    lineHeight: "1.5"
  },
  cta: {
    fontSize: "1rem",
    fontWeight: "600",
    padding: "0.75rem 2rem",
    borderWidth: "2px"
  }
};

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

  // Parsear text_styles si existe, sino usar defaults
  const textStyles: BannerTextStyles = banner.text_styles
    ? (banner.text_styles as BannerTextStyles)
    : DEFAULT_TEXT_STYLES;

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

  const textStyle = {
    color: banner.color_font,
    left: `${position.x}%`,
    top: `${position.y}%`,
    transform: 'translate(-50%, -50%)',
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Fondo - Imagen o Video */}
      {videoUrl && !hasPlayedVideo ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-contain"
          muted
          playsInline
          onEnded={handleVideoEnd}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : imageUrl ? (
        <Image
          src={imageUrl}
          alt={banner.title || banner.name}
          fill
          className="object-contain"
          priority={isActive}
          sizes="100vw"
        />
      ) : null}

      {/* Overlay de texto y CTA */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="absolute pointer-events-auto text-center px-4 md:px-8"
          style={textStyle}
        >
          {banner.title && (
            <h2
              className="font-bold mb-4"
              style={{
                color: banner.color_font,
                fontSize: textStyles.title.fontSize,
                fontWeight: textStyles.title.fontWeight,
                lineHeight: textStyles.title.lineHeight
              }}
            >
              {banner.title}
            </h2>
          )}

          {banner.description && (
            <p
              className="mb-6 max-w-2xl mx-auto"
              style={{
                color: banner.color_font,
                fontSize: textStyles.description.fontSize,
                fontWeight: textStyles.description.fontWeight,
                lineHeight: textStyles.description.lineHeight
              }}
            >
              {banner.description}
            </p>
          )}

          {banner.cta && banner.link_url && (
            <Link
              href={banner.link_url}
              className="inline-block rounded-full transition-all hover:scale-105 active:scale-95"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)', // Safari support
                border: `${textStyles.cta.borderWidth} solid ${banner.color_font}`,
                color: banner.color_font,
                fontSize: textStyles.cta.fontSize,
                fontWeight: textStyles.cta.fontWeight,
                padding: textStyles.cta.padding
              }}
            >
              {banner.cta}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
