import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Hook personalizado para controlar navbar fijo en scroll - VERSIÓN ANTI-FLICKER
 * Implementa debounce, histeresis amplia y transiciones controladas
 *
 * @param thresholdShow - Scroll hacia abajo para mostrar navbar fijo (default: 150px)
 * @param thresholdHide - Scroll hacia arriba para ocultar navbar fijo (default: 50px)
 * @param isActive - Si el hook debe estar activo (default: true)
 * @returns showNavbar - Boolean que indica si mostrar el navbar fijo
 */
export function useScrollNavbar(
  thresholdShow: number = 150,
  thresholdHide: number = 50,
  isActive: boolean = true
) {
  const [showNavbar, setShowNavbar] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const currentShowNavbar = useRef(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const isScrollingDown = useRef(false);

  useEffect(() => {
    currentShowNavbar.current = showNavbar;
  }, [showNavbar]);

  // Función debounced para cambio de estado (previene toggles rápidos)
  const debouncedSetShowNavbar = useCallback((shouldShow: boolean) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (shouldShow !== currentShowNavbar.current) {
        setShowNavbar(shouldShow);
      }
    }, 50); // Debounce de 50ms para suavizar cambios
  }, []);

  useEffect(() => {
    // Protección SSR
    if (typeof window === "undefined" || !isActive) return;

    /**
     * Handler ultra-optimizado de scroll con múltiples capas anti-flicker:
     * 1. Histeresis amplia (150px/50px = 100px de zona buffer)
     * 2. Debounce para evitar cambios rápidos
     * 3. Detección de dirección de scroll
     * 4. RequestAnimationFrame para performance
     */
    const handleScroll = () => {
      if (ticking.current) return;

      ticking.current = true;

      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const scrollDirection = scrollY > lastScrollY.current ? "down" : "up";
        isScrollingDown.current = scrollDirection === "down";

        let shouldShow = currentShowNavbar.current;

        // Lógica mejorada con zona de amortiguación más amplia
        if (scrollDirection === "down" && scrollY > thresholdShow) {
          // Scroll hacia abajo y superamos umbral alto -> mostrar navbar fijo
          shouldShow = true;
        } else if (scrollDirection === "up" && scrollY < thresholdHide) {
          // Scroll hacia arriba y bajamos del umbral bajo -> ocultar navbar fijo
          shouldShow = false;
        } else if (scrollY < 20) {
          // Muy cerca del top -> siempre ocultar
          shouldShow = false;
        }
        // En zona intermedia (50px-150px) mantener estado actual (sin cambios)

        // Usar debounce para aplicar cambio suavemente
        debouncedSetShowNavbar(shouldShow);

        lastScrollY.current = scrollY;
        ticking.current = false;
      });
    };

    // Listener con passive para no bloquear el scroll
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Inicialización: verificar posición inicial sin debounce
    const initialScrollY = window.scrollY;
    if (initialScrollY > thresholdShow) {
      setShowNavbar(true);
    } else if (initialScrollY < thresholdHide) {
      setShowNavbar(false);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [thresholdShow, thresholdHide, isActive, debouncedSetShowNavbar]);

  return showNavbar;
}
