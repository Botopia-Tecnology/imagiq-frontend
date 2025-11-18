'use client';

/**
 * 🔐 SECURITY INITIALIZER
 *
 * Componente que fuerza la inicialización del sistema de seguridad
 * ANTES de que React se hydrate completamente.
 *
 * Este componente DEBE ser el primer hijo del body en layout.tsx
 */

import { useLayoutEffect, useRef } from 'react';
import { initializeSecurity } from '@/lib/security';

interface SecurityInitializerProps {
  children: React.ReactNode;
}

export default function SecurityInitializer({ children }: SecurityInitializerProps) {
  // Flag para evitar doble inicialización
  const initializedRef = useRef(false);

  // useLayoutEffect se ejecuta ANTES del primer paint (más temprano que useEffect)
  useLayoutEffect(() => {
    if (initializedRef.current) {
      return;
    }

    initializeSecurity();
    initializedRef.current = true;
  }, []); // Solo una vez

  // Renderizar children directamente
  return <>{children}</>;
}
