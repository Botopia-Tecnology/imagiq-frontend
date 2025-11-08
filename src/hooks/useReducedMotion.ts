'use client';

import { useEffect, useState } from 'react';

/**
 * Hook para detectar si el usuario prefiere movimiento reducido
 * Respeta la configuración de accesibilidad del sistema operativo
 * @returns true si el usuario prefiere movimiento reducido
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Verificar si el navegador soporta matchMedia
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Establecer el valor inicial
    setPrefersReducedMotion(mediaQuery.matches);

    // Función para actualizar cuando cambia la preferencia
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setPrefersReducedMotion(event.matches);
    };

    // Escuchar cambios en la preferencia
    // Usar addEventListener si está disponible, sino usar el método legacy
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback para navegadores antiguos
      mediaQuery.addListener(handleChange as (this: MediaQueryList, ev: MediaQueryListEvent) => void);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange as (this: MediaQueryList, ev: MediaQueryListEvent) => void);
      }
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Obtiene la duración de animación ajustada según las preferencias del usuario
 * @param normalDuration Duración normal en segundos
 * @param reducedDuration Duración reducida en segundos (por defecto 0.01 para casi instantáneo)
 * @returns Duración apropiada según las preferencias del usuario
 */
export function useAnimationDuration(
  normalDuration: number,
  reducedDuration: number = 0.01
): number {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? reducedDuration : normalDuration;
}
