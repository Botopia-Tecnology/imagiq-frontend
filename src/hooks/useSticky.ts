/**
 * Hook personalizado para manejar el comportamiento sticky del sidebar de filtros
 * - Detecta cuando el sidebar debe volverse sticky basado en el scroll
 * - Maneja los límites de activación y desactivación
 * - Calcula dinámicamente la altura máxima disponible
 */

"use client";

import { useState, useEffect, useCallback, RefObject } from "react";

interface UseStickyOptions {
  /**
   * Referencia al contenedor del sidebar
   */
  sidebarRef: RefObject<HTMLElement>;

  /**
   * Referencia al contenedor de productos
   */
  productsRef: RefObject<HTMLElement>;

  /**
   * Offset desde el top de la página para iniciar el sticky (por defecto 120px para navbar)
   */
  topOffset?: number;

  /**
   * Offset adicional para el final del sticky (por defecto 80px)
   */
  bottomOffset?: number;

  /**
   * Si está habilitado el comportamiento sticky
   */
  enabled?: boolean;
}

interface StickyState {
  /**
   * Si el sidebar está en modo sticky
   */
  isSticky: boolean;

  /**
   * Altura máxima disponible para el sidebar sticky
   */
  maxHeight: number;

  /**
   * Offset top dinámico para el posicionamiento
   */
  topOffset: number;

  /**
   * Si debe mostrar sombra (indicador visual de sticky)
   */
  showShadow: boolean;
}

export function useSticky({
  sidebarRef,
  productsRef,
  topOffset = 120,
  bottomOffset = 80,
  enabled = true,
}: UseStickyOptions): StickyState {
  const [stickyState, setStickyState] = useState<StickyState>({
    isSticky: false,
    maxHeight: 0,
    topOffset,
    showShadow: false,
  });

  const calculateStickyState = useCallback(() => {
    if (!enabled || !sidebarRef.current || !productsRef.current) {
      return {
        isSticky: false,
        maxHeight: 0,
        topOffset,
        showShadow: false,
      };
    }

    const sidebar = sidebarRef.current;
    const productsContainer = productsRef.current;
    const sidebarRect = sidebar.getBoundingClientRect();
    const productsRect = productsContainer.getBoundingClientRect();

    // Obtener dimensiones de ventana
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;

    // Calcular posiciones absolutas
    const sidebarTop = sidebarRect.top + scrollY;
    const productsTop = productsRect.top + scrollY;
    const productsBottom = productsTop + productsRect.height;

    // Determinar si debe estar sticky
    const shouldBeSticky =
      scrollY + topOffset > sidebarTop && // Ha pasado el punto de activación
      scrollY + topOffset < productsBottom - bottomOffset; // No ha pasado el final de productos

    // Calcular altura máxima disponible
    const availableHeight = windowHeight - topOffset - bottomOffset;
    const maxHeight = Math.max(400, availableHeight);

    // Mostrar sombra cuando está sticky y hay scroll
    const showShadow = shouldBeSticky && scrollY > sidebarTop + 50;

    return {
      isSticky: shouldBeSticky,
      maxHeight,
      topOffset,
      showShadow,
    };
  }, [enabled, sidebarRef, productsRef, topOffset, bottomOffset]);

  const handleScroll = useCallback(() => {
    const newState = calculateStickyState();
    setStickyState(newState);
  }, [calculateStickyState]);

  const handleResize = useCallback(() => {
    const newState = calculateStickyState();
    setStickyState(newState);
  }, [calculateStickyState]);

  useEffect(() => {
    if (!enabled) {
      setStickyState({
        isSticky: false,
        maxHeight: 0,
        topOffset,
        showShadow: false,
      });
      return;
    }

    // Calcular estado inicial
    const initialState = calculateStickyState();
    setStickyState(initialState);

    // Throttle function para optimizar performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Event listeners
    window.addEventListener("scroll", throttledHandleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [enabled, handleScroll, handleResize, calculateStickyState, topOffset]);

  return stickyState;
}

/**
 * Hook simplificado para obtener las clases CSS del sticky
 */
export function useStickyClasses({
  isSticky,
  showShadow,
  topOffset,
  maxHeight,
}: StickyState): {
  containerClasses: string;
  wrapperClasses: string;
  style: React.CSSProperties;
} {
  const containerClasses = `
    transition-all duration-300 ease-in-out
    ${isSticky ? 'sticky z-40' : 'static'}
    ${showShadow ? 'shadow-sm' : ''}
  `.trim().replace(/\s+/g, ' ');

  const wrapperClasses = `
    ${isSticky ? '' : ''}
  `.trim().replace(/\s+/g, ' ');

  const style: React.CSSProperties = isSticky
    ? {
        top: `${topOffset}px`,
        maxHeight: `${maxHeight}px`,
        overflowY: 'auto' as const,
      }
    : {};

  return {
    containerClasses,
    wrapperClasses,
    style,
  };
}

export type { UseStickyOptions, StickyState };