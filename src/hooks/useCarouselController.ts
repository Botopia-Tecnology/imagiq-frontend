"use client";

/**
 * Hook para controlar carruseles de banners
 *
 * Gestiona:
 * - Navegación automática entre items
 * - Timers con cleanup
 * - Tracking opcional de videos reproducidos
 * - Control manual de navegación
 */

import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Configuración del item del carrusel
 */
export interface CarouselItem {
  hasVideo: boolean;
  index: number;
}

/**
 * Configuración del controlador de carrusel
 */
export interface CarouselControllerConfig {
  /** Total de items en el carrusel */
  itemsCount: number;
  /** Duración en ms para mostrar cada item (default: 5000) */
  displayDuration?: number;
  /** Si debe trackear videos reproducidos para no repetirlos (default: false) */
  trackPlayedVideos?: boolean;
  /** Si debe reproducir automáticamente (default: true) */
  autoPlay?: boolean;
}

/**
 * Valor de retorno del hook
 */
export interface CarouselControllerReturn {
  /** Índice del item actualmente visible */
  currentIndex: number;
  /** Avanzar al siguiente item */
  goToNext: () => void;
  /** Retroceder al item anterior */
  goToPrevious: () => void;
  /** Ir a un índice específico */
  goToIndex: (index: number) => void;
  /** Handler para cuando un video termina */
  handleVideoEnd: () => void;
  /** Verificar si un video ya fue reproducido */
  isVideoPlayed: (index: number) => boolean;
  /** Resetear tracking de videos reproducidos */
  resetPlayedVideos: () => void;
}

const DEFAULT_DISPLAY_DURATION = 5000; // 5 segundos

/**
 * Hook para controlar un carrusel de items
 *
 * @param config - Configuración del carrusel
 * @returns Funciones y estado del carrusel
 *
 * @example
 * const controller = useCarouselController({
 *   itemsCount: banners.length,
 *   displayDuration: 5000,
 *   trackPlayedVideos: true
 * });
 */
export function useCarouselController(config: CarouselControllerConfig): CarouselControllerReturn {
  const {
    itemsCount,
    displayDuration = DEFAULT_DISPLAY_DURATION,
    trackPlayedVideos = false,
    autoPlay = true,
  } = config;

  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const playedVideosRef = useRef<Set<number>>(new Set());

  /**
   * Limpiar timer actual
   */
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /**
   * Avanzar al siguiente item (con loop)
   */
  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return nextIndex >= itemsCount ? 0 : nextIndex;
    });
  }, [itemsCount]);

  /**
   * Retroceder al item anterior (con loop)
   */
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const prevIdx = prevIndex - 1;
      return prevIdx < 0 ? itemsCount - 1 : prevIdx;
    });
  }, [itemsCount]);

  /**
   * Ir a un índice específico
   */
  const goToIndex = useCallback((index: number) => {
    if (index >= 0 && index < itemsCount) {
      setCurrentIndex(index);
    }
  }, [itemsCount]);

  /**
   * Handler cuando un video termina de reproducirse
   */
  const handleVideoEnd = useCallback(() => {
    if (itemsCount <= 1) return;

    // Marcar video como reproducido si tracking está habilitado
    if (trackPlayedVideos) {
      playedVideosRef.current.add(currentIndex);
    }

    // Esperar displayDuration antes de avanzar
    clearTimer();
    timerRef.current = setTimeout(() => {
      goToNext();
    }, displayDuration);
  }, [currentIndex, displayDuration, goToNext, itemsCount, trackPlayedVideos, clearTimer]);

  /**
   * Verificar si un video ya fue reproducido
   */
  const isVideoPlayed = useCallback((index: number): boolean => {
    return playedVideosRef.current.has(index);
  }, []);

  /**
   * Resetear tracking de videos reproducidos
   */
  const resetPlayedVideos = useCallback(() => {
    playedVideosRef.current.clear();
  }, []);

  /**
   * Efecto para gestionar el autoplay del carrusel
   */
  useEffect(() => {
    // Si no hay items o solo hay uno, no hacer nada
    if (itemsCount <= 1 || !autoPlay) {
      clearTimer();
      return;
    }

    // Este efecto se ejecuta cada vez que cambia el currentIndex
    // No establecemos timer aquí porque depende de si el item tiene video
    // El timer se establece desde el componente cuando:
    // 1. No hay video (inmediatamente)
    // 2. El video termina (en handleVideoEnd)

    return () => {
      clearTimer();
    };
  }, [currentIndex, itemsCount, autoPlay, clearTimer]);

  return {
    currentIndex,
    goToNext,
    goToPrevious,
    goToIndex,
    handleVideoEnd,
    isVideoPlayed,
    resetPlayedVideos,
  };
}
