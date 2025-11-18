'use client';

/**
 * 🔐 DEVTOOLS GUARD
 *
 * Componente simplificado que solo bloquea:
 * - Shortcuts de teclado para DevTools (F12, Ctrl+Shift+I, Ctrl+I, etc.)
 * - Click derecho (menú contextual)
 *
 * NO incluye detección automática de DevTools (eliminado para evitar falsos positivos)
 *
 * IMPORTANTE: Este componente debe envolver TODA la app en layout.tsx
 */

import { useEffect, useState } from 'react';
import { enableDevToolsBlocking } from '@/lib/security/devtools/blocker';
import { autoMigrate } from '@/lib/security/encryption/migrator';

export default function DevToolsGuard({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return;

    // Leer configuración desde variables de entorno
    const isProtectionEnabled = process.env.NEXT_PUBLIC_ENABLE_DEVTOOLS_PROTECTION !== 'false';

    // Verificar si ya fue inicializado
    if ((window as Window & { __DEVTOOLS_BLOCKER_INITIALIZED__?: boolean }).__DEVTOOLS_BLOCKER_INITIALIZED__) {
      setIsLoading(false);
      return;
    }

    // Si la protección está deshabilitada, no hacer nada
    if (!isProtectionEnabled) {
      setIsLoading(false);
      return;
    }

    // Configuración del bloqueador (solo bloqueos, sin detección)
    const disableBlocker = enableDevToolsBlocking({
      blockRightClick: true,
      blockTextSelection: false,
      blockCopy: false,
      blockPaste: false,
      blockCut: false,
      blockSave: false,
      blockViewSource: true,
      blockPrint: false,
      showWarning: false,
      debug: false,
    });

    // Ejecutar migración automática de localStorage
    autoMigrate().catch(() => {
      // Silently fail
    });

    // Marcar como inicializado
    (window as Window & { __DEVTOOLS_BLOCKER_INITIALIZED__?: boolean }).__DEVTOOLS_BLOCKER_INITIALIZED__ = true;

    // Marcar como cargado inmediatamente (no hay detección asíncrona)
    setIsLoading(false);

    // Cleanup
    return () => {
      if (disableBlocker) {
        disableBlocker();
      }
    };
  }, []);

  // Mostrar loading mientras se inicializa (solo en producción)
  if (isLoading && process.env.NODE_ENV !== 'development') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600 mb-4"></div>
          <p className="mt-4 text-gray-600">Iniciando seguridad...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
