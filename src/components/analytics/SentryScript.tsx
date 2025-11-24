'use client';

import { useEffect, useState } from 'react';
import { hasAnalyticsConsent } from '@/lib/consent';
import { initSentry } from '@/lib/sentry/client';

/**
 * Sentry - First-Party Loading
 *
 * SOLO se carga si el usuario acepta cookies de analytics
 */
export default function SentryScript() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    const loadSentry = () => {
      // Verificar consentimiento
      if (!hasAnalyticsConsent()) {
        return;
      }

      // Ejecutar inicialización asíncrona
      void initSentry();
    };

    // Cargar inmediatamente
    loadSentry();

    // Escuchar cambios de consentimiento
    const handleConsentChange = () => {
      loadSentry();
    };

    window.addEventListener('consentChange', handleConsentChange);

    return () => {
      window.removeEventListener('consentChange', handleConsentChange);
    };
  }, [mounted]);

  return null;
}
