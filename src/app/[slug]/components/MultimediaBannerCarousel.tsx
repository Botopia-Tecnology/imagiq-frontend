/**
 * Carrusel de banners multimedia
 * Auto-advance cada 5 segundos, maneja videos y responsive
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import MultimediaBannerSlide from './MultimediaBannerSlide';
import type { BannerSlideVariant } from './MultimediaBannerSlide';
import type { MultimediaPageBanner } from '@/services/multimedia-pages.service';

interface MultimediaBannerCarouselProps {
  banners: MultimediaPageBanner[];
  variant?: BannerSlideVariant;
}

export default function MultimediaBannerCarousel({ banners, variant = 'hero' }: MultimediaBannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-advance cada 5 segundos
  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length, isPaused]);

  const handleVideoStart = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleVideoEnd = useCallback(() => {
    setIsPaused(false);
  }, []);

  if (banners.length === 0) {
    return null;
  }

  const isHero = variant === 'hero';

  return (
    <section className={isHero ? "relative w-full px-4 md:px-6 lg:px-8 pt-15 md:pt-8 lg:pt-15" : "relative w-full h-full"}>
      {/* Container que ocupa todo el ancho respetando los márgenes */}
      <div className={isHero ? "relative w-full mx-auto overflow-hidden rounded-3xl" : "relative w-full h-full overflow-hidden rounded-2xl"}>
        <div className={isHero ? "relative w-full" : "relative w-full h-full"}>
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`transition-opacity duration-500 ${
                index === currentIndex
                  ? 'opacity-100 relative z-10'
                  : 'opacity-0 absolute inset-0 pointer-events-none z-0'
              }${isHero ? '' : ' h-full'}`}
            >
              <MultimediaBannerSlide
                banner={banner}
                isActive={index === currentIndex}
                isMobile={isMobile}
                variant={variant}
                onVideoStart={handleVideoStart}
                onVideoEnd={handleVideoEnd}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Indicadores (opcional - puntos) */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
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
