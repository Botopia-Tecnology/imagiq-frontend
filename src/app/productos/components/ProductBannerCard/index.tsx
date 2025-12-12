/**
 * PRODUCT BANNER CARD - IMAGIQ ECOMMERCE
 *
 * Banner que se integra en el grid de productos
 * Ocupa 1 columna de ancho y toda la fila en altura
 * Se muestra cada 15 productos
 * Soporta carrusel si recibe múltiples banners
 */

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { parsePosition, positionToCSS, parseTextStyles } from "@/utils/bannerCoordinates";
import type { Banner, ContentBlock } from "@/types/banner";
import { BannerMedia } from "./BannerMedia";
import { BannerContent } from "./BannerContent";
import { ContentBlockRenderer } from "@/components/banners/ContentBlockRenderer";
import { useCarouselController } from "@/hooks/useCarouselController";
import { useDeviceType } from "@/components/responsive";

interface ProductBannerCardProps {
  config: Banner | Banner[];
}

export function ProductBannerCard({ config }: Readonly<ProductBannerCardProps>) {
  // Normalizar config a array
  const configs = Array.isArray(config) ? config : [config];
  const isCarousel = configs.length > 1;

  // Carousel controller (solo si hay múltiples banners)
  const controller = useCarouselController({
    itemsCount: configs.length,
    displayDuration: 5000, // 5 segundos por banner
    autoPlay: isCarousel,
  });

  const [videoEnded, setVideoEnded] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Banner actual basado en el índice del carrusel
  const currentBanner = configs[controller.currentIndex];

  // Calcular si debe mostrar contenido inmediatamente
  const hasVideo = Boolean(currentBanner.desktop_video_url);
  const showImmediately = !hasVideo;
  const effectiveVideoEnded = showImmediately || videoEnded;

  // Device detection para mobile
  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';

  // Parsear content_blocks si existe
  let contentBlocks: ContentBlock[] = [];
  if (currentBanner.content_blocks) {
    try {
      contentBlocks = typeof currentBanner.content_blocks === 'string'
        ? JSON.parse(currentBanner.content_blocks)
        : currentBanner.content_blocks;
    } catch (e) {
      console.error('Error parsing content_blocks:', e);
    }
  }

  // Sistema legacy - solo si NO hay content_blocks
  const hasLegacyContent = !contentBlocks.length && (currentBanner['title'] || currentBanner['description'] || currentBanner['cta']);
  const position = parsePosition(currentBanner['position_desktop']);
  const positionStyle = positionToCSS(position);
  const textStyles = parseTextStyles(currentBanner['text_styles']);

  const handleVideoEnd = () => {
    setVideoEnded(true);
    if (isCarousel) {
      controller.handleVideoEnd();
    }
  };

  const goToNext = controller.goToNext;

  // Auto-advance para banners sin video
  useEffect(() => {
    if (!isCarousel) return;

    // Limpiar timer anterior
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Si el banner actual no tiene video, iniciar timer para avanzar
    if (!hasVideo) {
      timerRef.current = setTimeout(() => {
        goToNext();
        setVideoEnded(false); // Reset para el siguiente banner
      }, 5000);
    }

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isCarousel, hasVideo, controller.currentIndex, goToNext]);

  return (
    <div className="relative w-full max-w-md mx-auto aspect-[9/16] overflow-hidden rounded-lg bg-gray-100 group shadow-sm hover:shadow-lg transition-shadow">
      {/* Media de fondo con transición de slide */}
      <div 
        className="relative w-full h-full transition-transform duration-500 ease-in-out"
        style={{
          transform: isCarousel ? `translateX(-${controller.currentIndex * 100}%)` : 'translateX(0)',
        }}
      >
        <div className="flex w-full h-full">
          {configs.map((banner, index) => (
            <div 
              key={banner.id} 
              className="relative w-full h-full flex-shrink-0"
              style={{ width: '100%' }}
            >
              <BannerMedia
                videoUrl={banner.desktop_video_url}
                imageUrl={banner.desktop_image_url}
                videoEnded={index === controller.currentIndex ? videoEnded : false}
                onVideoEnd={index === controller.currentIndex ? handleVideoEnd : undefined}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Overlay de hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

      {/* Contenido del banner - Sistema de content_blocks */}
      {contentBlocks.length > 0 && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          {contentBlocks.map((block) => (
            <ContentBlockRenderer
              key={block.id}
              block={block}
              isMobile={false}
              videoEnded={effectiveVideoEnded}
              scale={0.41}
              centerContent={true}
            />
          ))}
        </div>
      )}

      {/* Contenido del banner - Sistema legacy (solo si no hay content_blocks) */}
      {hasLegacyContent && (
        <BannerContent
          title={currentBanner['title'] ?? null}
          description={currentBanner['description'] ?? null}
          cta={currentBanner['cta'] ?? null}
          linkUrl={currentBanner.link_url ?? null}
          colorFont={currentBanner['color_font'] ?? "#ffffff"}
          positionStyle={positionStyle}
          isVisible={effectiveVideoEnded}
          textStyles={textStyles}
        />
      )}

      {/* Overlay clickeable si no tiene CTA pero tiene link */}
      {currentBanner.link_url && !currentBanner['cta'] && (
        <Link
          href={currentBanner.link_url}
          className="absolute inset-0 z-20"
          aria-label={currentBanner['title'] || "Ver más"}
        />
      )}

      {/* Indicadores de carrusel (solo si hay múltiples banners) */}
      {isCarousel && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
          {configs.map((banner, index) => (
            <button
              key={`indicator-${banner.id}-${index}`}
              onClick={() => controller.goToIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === controller.currentIndex
                  ? "bg-white w-6"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Ir al banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}


