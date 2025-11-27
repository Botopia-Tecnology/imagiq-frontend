/**
 * Slide individual de banner multimedia
 * Maneja imagen/video con texto posicionado y CTA
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { MultimediaPageBanner } from '@/services/multimedia-pages.service';

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
              className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4"
              style={{ color: banner.color_font }}
            >
              {banner.title}
            </h2>
          )}
          
          {banner.description && (
            <p 
              className="text-base md:text-xl lg:text-2xl mb-6 max-w-2xl mx-auto"
              style={{ color: banner.color_font }}
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
