"use client";

import { useEffect, useState, useRef } from "react";

interface UseStickyUntilElementOptions {
  targetSelector: string;
  offset?: number;
}

/**
 * Hook personalizado para hacer un elemento sticky hasta que alcance otro elemento objetivo
 * @param targetSelector - Selector CSS del elemento objetivo donde debe dejar de ser sticky
 * @param offset - Offset adicional en píxeles (default: 100)
 * @returns {object} - { containerRef, isSticky }
 */
export function useStickyUntilElement({ 
  targetSelector, 
  offset = 100 
}: UseStickyUntilElementOptions) {
  const [isSticky, setIsSticky] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const targetElement = document.querySelector(targetSelector);
      
      if (!targetElement) {
        setIsSticky(true);
        return;
      }
      
      const targetRect = targetElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Si el elemento objetivo ya pasó el viewport (está arriba), dejar de ser sticky
      if (targetRect.top < windowHeight - offset) {
        setIsSticky(false);
      } else {
        setIsSticky(true);
      }
    };

    // Throttle scroll events para mejor performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [targetSelector, offset]);

  return { containerRef, isSticky };
}
