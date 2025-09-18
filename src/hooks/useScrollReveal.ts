"use client";

/**
 * useScrollReveal - Hook personalizado para animar la aparición de componentes al hacer scroll (lazy load + reveal).
 *
 * Características:
 * - Usa IntersectionObserver para detectar cuando el elemento entra en el viewport.
 * - Dispara una animación de entrada usando Framer Motion solo la primera vez que el elemento es visible.
 * - Permite configurar la dirección del slide, duración y offset para disparar la animación antes de que el elemento sea completamente visible.
 * - Optimizado para rendimiento: desconecta el observer tras la primera revelación.
 * - Genérico: soporta cualquier tipo de elemento HTML.
 *
 * @template T Tipo de elemento HTML (por defecto HTMLDivElement)
 * @param options.offset Margen en px para disparar la animación antes de que el elemento sea completamente visible (default: 0)
 * @param options.duration Duración de la animación en ms (default: 600)
 * @param options.direction Dirección del slide: 'up', 'down', 'left', 'right' (default: 'up')
 * @returns {
 *   ref: RefObject<T> - Ref para asignar al componente animado
 *   isRevealed: boolean - Estado si el elemento ya fue revelado
 *   motionProps: {
 *     initial: TargetAndTransition - Props iniciales para Framer Motion
 *     animate: TargetAndTransition | undefined - Props de animación para Framer Motion
 *     transition: object - Configuración de transición para Framer Motion
 *   }
 * }
 *
 * Ejemplo de uso:
 *
 * import { motion } from "framer-motion";
 * import { useScrollReveal } from "@/hooks/useScrollReveal";
 *
 * function MiComponente() {
 *   const reveal = useScrollReveal<HTMLDivElement>({ offset: 80, duration: 700, direction: "up" });
 *   return (
 *     <motion.div ref={reveal.ref} {...reveal.motionProps}>
 *       // Contenido animado
 *     </motion.div>
 *   );
 * }
 */

import { useRef, useEffect, useState, RefObject } from "react";
import { TargetAndTransition } from "framer-motion";

export type ScrollRevealOptions = {
  /** Margen en px para disparar la animación antes de que el elemento sea completamente visible */
  offset?: number;
  /** Duración de la animación en ms */
  duration?: number;
  /** Dirección del slide: 'up', 'down', 'left', 'right' */
  direction?: "up" | "down" | "left" | "right";
};

// Ajuste: hook genérico para tipo de elemento
export type ScrollRevealResult<T extends HTMLElement> = {
  ref: React.RefObject<T>;
  isRevealed: boolean;
  motionProps: {
    initial: TargetAndTransition;
    animate: TargetAndTransition | undefined;
    transition: object;
  };
};

/**
 * Hook para animar la aparición de un componente al hacer scroll (lazy load + reveal).
 * Usa IntersectionObserver y Framer Motion.
 *
 * @param options Configuración de offset, duración y dirección.
 * @returns ref para asignar al componente y props para Framer Motion.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
): ScrollRevealResult<T> {
  const { offset = 0, duration = 600, direction = "up" } = options;
  const ref = useRef<T>(null!);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let observer: IntersectionObserver | null = null;
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer?.disconnect();
        }
      },
      {
        root: null,
        rootMargin: `0px 0px -${offset}px 0px`,
        threshold: 0.1,
      }
    );
    observer.observe(node);
    return () => {
      observer?.disconnect();
    };
  }, [offset]);

  const getSlide = (): TargetAndTransition => {
    switch (direction) {
      case "down":
        return { y: -40 };
      case "left":
        return { x: 40 };
      case "right":
        return { x: -40 };
      default:
        return { y: 40 };
    }
  };

  return {
    ref,
    isRevealed,
    motionProps: {
      initial: { opacity: 0, ...getSlide() },
      animate: isRevealed ? { opacity: 1, x: 0, y: 0 } : undefined,
      transition: { duration: duration / 1000, ease: "easeOut" },
    },
  };
}
