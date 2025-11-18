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
        console.log('[Sentry] ❌ No analytics consent, skipping');
        return;
      }

      console.log('[Sentry] 📦 Initializing...');

      // Ejecutar inicialización asíncrona
      void initSentry();
    };

    // Cargar inmediatamente
    loadSentry();

    // Escuchar cambios de consentimiento
    const handleConsentChange = () => {
      console.log('[Sentry] 🔄 Consent changed');
      loadSentry();
    };

    window.addEventListener('consentChange', handleConsentChange);

    return () => {
      window.removeEventListener('consentChange', handleConsentChange);
    };
  }, [mounted]);

  return null;
}
