import { useState, useRef, useCallback } from 'react';

interface UseCartHoverReturn {
  isOpen: boolean;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  closePopover: () => void;
}

export function useCartHover(
  openDelay = 200,
  closeDelay = 100
): UseCartHoverReturn {
  const [isOpen, setIsOpen] = useState(false);
  const openTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback(() => {
    // Cancelar cualquier timer de cierre pendiente
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    // Iniciar timer de apertura
    openTimeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, openDelay);
  }, [openDelay]);

  const handleMouseLeave = useCallback(() => {
    // Cancelar cualquier timer de apertura pendiente
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }

    // Iniciar timer de cierre
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, closeDelay);
  }, [closeDelay]);

  const closePopover = useCallback(() => {
    // Cancelar timers pendientes
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    // Cerrar inmediatamente
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    handleMouseEnter,
    handleMouseLeave,
    closePopover,
  };
}
