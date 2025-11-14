'use client';

import { useEffect, useState } from 'react';
import { hasAnalyticsConsent } from '@/lib/consent';
import { initSentry } from '@/lib/sentry/client';

/**
 * Componente que carga Sentry de forma first-party
 *
 * - No requiere variables de entorno en el frontend (excepto API_URL)
 * - El DSN vive solo en el backend
 * - Soporta consentimiento a través del sistema de consent
 * - Totalmente first-party para evitar ad-blockers
 * - SOLO SE CARGA SI EL USUARIO ACEPTA COOKIES DE ANALYTICS
 * - Usa tunnel para enviar eventos a través del backend
 *
 * Características:
 * - ✅ Error tracking
 * - ✅ Performance monitoring
 * - ✅ Session replay
 * - ✅ Respeta consentimiento
 * - ✅ No expone credenciales
 *
 * @example
 * ```tsx
 * // En app/layout.tsx
 * import SentryScript from '@/components/analytics/SentryScript';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <head>
 *         <SentryScript />
 *       </head>
 *       <body>{children}</body>
 *     </html>
 *   );
 * }
 * ```
 */
export default function SentryScript() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Solo ejecutar en el cliente después de montar
    if (!mounted) return;
    if (globalThis.window === undefined) return;

    // ✅ VERIFICAR CONSENTIMIENTO DE ANALYTICS
    if (!hasAnalyticsConsent()) {
      console.log('[Sentry] No analytics consent, skipping load');
      return;
    }

    // Inicializar Sentry (función async)
    console.log('[Sentry] Consent granted, initializing...');

    // Ejecutar la inicialización asíncrona
    void initSentry();

    // Escuchar cambios en el consentimiento
    const handleConsentChange = () => {
      console.log('[Sentry] Consent changed, checking...');
      if (hasAnalyticsConsent()) {
        void initSentry();
      }
    };

    globalThis.window.addEventListener('consentChange', handleConsentChange);

    return () => {
      globalThis.window.removeEventListener('consentChange', handleConsentChange);
    };
  }, [mounted]);

  // Este componente no renderiza nada visible
  return null;
}
