'use client';

import { useEffect, useState } from 'react';
import { hasMarketingConsent } from '@/lib/consent';

/**
 * Google Tag Manager - First-Party Loading
 *
 * SOLO se carga si el usuario acepta cookies de marketing
 */
export default function GTMScript() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    const loadGTM = () => {
      // Verificar consentimiento
      if (!hasMarketingConsent()) {
        console.log('[GTM] ❌ No marketing consent, skipping');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const gtmUrl = `${apiUrl}/api/custommer/analytics/gtm.js`;

      // Verificar si ya existe
      if (document.querySelector(`script[src="${gtmUrl}"]`)) {
        console.log('[GTM] ✅ Already loaded');
        return;
      }

      console.log('[GTM] 📦 Loading script...');

      // Crear script
      const script = document.createElement('script');
      script.src = gtmUrl;
      script.async = true;
      script.id = 'gtm-bootstrap';

      script.onload = () => console.log('[GTM] ✅ Loaded successfully');
      script.onerror = () => console.error('[GTM] ❌ Failed to load from', apiUrl);

      document.head.appendChild(script);

      // Noscript fallback
      const noscript = document.createElement('noscript');
      const iframe = document.createElement('iframe');
      iframe.src = `${apiUrl}/api/custommer/analytics/gtm/noscript`;
      iframe.height = '0';
      iframe.width = '0';
      iframe.style.display = 'none';
      iframe.style.visibility = 'hidden';
      noscript.appendChild(iframe);
      document.body.appendChild(noscript);
    };

    // Cargar inmediatamente
    loadGTM();

    // Escuchar cambios de consentimiento
    const handleConsentChange = () => {
      console.log('[GTM] 🔄 Consent changed');
      loadGTM();
    };

    window.addEventListener('consentChange', handleConsentChange);

    return () => {
      window.removeEventListener('consentChange', handleConsentChange);
      document.getElementById('gtm-bootstrap')?.remove();
    };
  }, [mounted]);

  return null;
}
