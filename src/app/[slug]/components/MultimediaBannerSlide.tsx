/**
 * Slide individual de banner multimedia
 * Maneja imagen/video con texto posicionado y CTA usando ContentBlocksOverlay
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { MultimediaPageBanner } from '@/services/multimedia-pages.service';
import type { ContentBlock } from '@/types/banner';
import { getCloudinaryUrl } from '@/lib/cloudinary';

export type BannerSlideVariant = 'hero' | 'side' | 'fullscreen';

interface MultimediaBannerSlideProps {
  banner: MultimediaPageBanner;
  isActive: boolean;
  isMobile: boolean;
  variant?: BannerSlideVariant;
  onVideoStart?: () => void;
  onVideoEnd?: () => void;
}

export default function MultimediaBannerSlide({
  banner,
  isActive,
  isMobile,
  variant = 'hero',
  onVideoStart,
  onVideoEnd,
}: MultimediaBannerSlideProps) {
  const [hasPlayedVideo, setHasPlayedVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const imageUrl = isMobile ? banner.mobile_image_url : banner.desktop_image_url;
  const videoUrl = isMobile ? banner.mobile_video_url : banner.desktop_video_url;

  // Parsear content_blocks del JSON
  // Parsear content_blocks del JSON si es string, o usar directamente si es array (preview)
  let contentBlocks: ContentBlock[] = [];
  try {
    if (typeof banner.content_blocks === 'string') {
      contentBlocks = JSON.parse(banner.content_blocks);
    } else if (Array.isArray(banner.content_blocks)) {
      contentBlocks = banner.content_blocks;
    }
  } catch (e) {
    console.error("Error parsing content_blocks for banner:", banner, e);
    contentBlocks = [];
  }

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
    // Para side variant, usar 'original' para no distorsionar con transforms panorámicos
    let transformType: Parameters<typeof getCloudinaryUrl>[1] = 'landing-banner';
    if (variant === 'side') {
      transformType = 'original';
    } else if (isMobile) {
      transformType = 'mobile-banner';
    }
    const optimizedImageUrl = getCloudinaryUrl(imageUrl, transformType);

    mediaContent = (
      <Image
        src={optimizedImageUrl}
        alt={banner.title || banner.name}
        fill
        className={variant === 'side' ? "object-contain object-top" : "object-cover"}
        priority={isActive}
      />
    );
  }

  // Clases del contenedor según variante
  const containerClass = variant === 'hero'
    ? "relative w-full aspect-[828/620] md:aspect-[2520/620] overflow-hidden"
    : "relative w-full h-full overflow-hidden";

  return (
    <div className={containerClass}>
      {/* Fondo - Imagen o Video */}
      {mediaContent}

      {/* Overlay de content_blocks */}
      <ContentBlocksOverlay
        blocks={contentBlocks}
        isMobile={isMobile}
        bannerLinkUrl={banner.link_url}
      />
    </div>
  );
}

/**
 * Componente para renderizar bloques de contenido (reutilizado de DynamicBannerClean)
 */
function ContentBlocksOverlay({
  blocks,
  isMobile,
  bannerLinkUrl,
}: Readonly<{
  blocks: ContentBlock[];
  isMobile?: boolean;
  bannerLinkUrl?: string | null;
}>) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="relative w-full h-full pointer-events-auto">
        {blocks.map((block) => {
          const position = isMobile ? block.position_mobile : block.position_desktop;

          // Configuración del contenedor: usar mobile si existe, sino desktop
          const textAlign = isMobile && block.textAlign_mobile
            ? block.textAlign_mobile
            : block.textAlign || 'left';
          const configuredMaxWidth = isMobile && block.maxWidth_mobile
            ? block.maxWidth_mobile
            : block.maxWidth || '100%';
          const gap = isMobile && block.gap_mobile
            ? block.gap_mobile
            : block.gap || '12px';

          // Estilos del título
          const titleStyles = block.title && {
            fontSize: (isMobile && block.title_mobile?.fontSize) || block.title.fontSize || '2rem',
            fontWeight: (isMobile && block.title_mobile?.fontWeight) || block.title.fontWeight || '700',
            color: (isMobile && block.title_mobile?.color) || block.title.color || '#ffffff',
            lineHeight: (isMobile && block.title_mobile?.lineHeight) || block.title.lineHeight || '1.2',
            textTransform: (isMobile && block.title_mobile?.textTransform) || block.title.textTransform || 'none',
            letterSpacing: (isMobile && block.title_mobile?.letterSpacing) || block.title.letterSpacing || 'normal',
            textShadow: (isMobile && block.title_mobile?.textShadow) || block.title.textShadow || '2px 2px 4px rgba(0,0,0,0.5)',
          };

          // Ajustar transform basado en textAlign para que coincida con dashboard
          let transformX = '-50%'; // Por defecto: centrado
          if (textAlign === 'left') {
            transformX = '0%'; // Izquierda: el punto está en el borde izquierdo
          } else if (textAlign === 'right') {
            transformX = '-100%'; // Derecha: el punto está en el borde derecho
          }

          return (
            <div
              key={block.id}
              className="absolute"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: `translate(${transformX}, -50%)`,
                maxWidth: configuredMaxWidth, // Usar el maxWidth configurado sin límites adicionales
              }}
            >
              <div
                className="flex flex-col"
                style={{
                  gap,
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  hyphens: 'auto',
                  maxWidth: '100%',
                }}
              >
                {/* Título */}
                {block.title && (
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
                )}

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
                    textTransform: (isMobile && block.description_mobile?.textTransform) || block.description.textTransform || 'none',
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
                    textTransform: (isMobile && block.cta_mobile?.textTransform) || block.cta.textTransform || 'none',
                  };
                  // Usar la URL específica del CTA, no la del banner
                  const href = block.cta.link_url || '#';

                  return (
                    <div style={{ textAlign }}>
                      <Link
                        href={href}
                        className="inline-block transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        style={{
                          ...ctaStyles,
                          textDecoration: 'none',
                          textAlign: 'center',
                          whiteSpace: 'pre-line',
                        }}
                      >
                        {block.cta.text}
                      </Link>
                    </div>
                  );
                })()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
