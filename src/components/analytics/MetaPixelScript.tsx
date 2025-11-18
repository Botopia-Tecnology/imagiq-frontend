'use client';

import { useEffect, useState } from 'react';
import { hasMarketingConsent } from '@/lib/consent';

/**
 * Meta Pixel (Facebook) - First-Party Loading
 *
 * SOLO se carga si el usuario acepta cookies de marketing
 */
export default function MetaPixelScript() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    const loadMetaPixel = () => {
      // Verificar consentimiento
      if (!hasMarketingConsent()) {
        console.log('[Meta Pixel] ❌ No marketing consent, skipping');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const metaPixelUrl = `${apiUrl}/api/custommer/analytics/meta-pixel.js`;

      // Verificar si ya existe
      if (document.querySelector(`script[src="${metaPixelUrl}"]`)) {
        console.log('[Meta Pixel] ✅ Already loaded');
        return;
      }

      console.log('[Meta Pixel] 📦 Loading script...');

      // Crear script
      const script = document.createElement('script');
      script.src = metaPixelUrl;
      script.async = true;
      script.id = 'meta-pixel-bootstrap';

      script.onload = () => console.log('[Meta Pixel] ✅ Loaded successfully');
      script.onerror = () => console.error('[Meta Pixel] ❌ Failed to load from', apiUrl);

      document.head.appendChild(script);

      // Noscript fallback
      const noscript = document.createElement('noscript');
      const img = document.createElement('img');
      img.height = 1;
      img.width = 1;
      img.style.display = 'none';
      img.src = `${apiUrl}/api/custommer/analytics/meta-pixel/noscript`;
      img.alt = '';
      noscript.appendChild(img);
      document.body.appendChild(noscript);
    };

    // Cargar inmediatamente
    loadMetaPixel();

    // Escuchar cambios de consentimiento
    const handleConsentChange = () => {
      console.log('[Meta Pixel] 🔄 Consent changed');
      loadMetaPixel();
    };

    window.addEventListener('consentChange', handleConsentChange);

    return () => {
      window.removeEventListener('consentChange', handleConsentChange);
      document.getElementById('meta-pixel-bootstrap')?.remove();
    };
  }, [mounted]);

  return null;
}
