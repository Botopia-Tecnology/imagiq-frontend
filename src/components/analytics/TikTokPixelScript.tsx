'use client';

import { useEffect, useState } from 'react';
import { hasMarketingConsent } from '@/lib/consent';

/**
 * TikTok Pixel - First-Party Loading
 *
 * SOLO se carga si el usuario acepta cookies de marketing
 */
export default function TikTokPixelScript() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    const loadTikTokPixel = () => {
      // Verificar consentimiento
      if (!hasMarketingConsent()) {
        console.log('[TikTok Pixel] ❌ No marketing consent, skipping');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const tiktokPixelUrl = `${apiUrl}/api/custommer/analytics/tiktok-pixel.js`;

      // Verificar si ya existe
      if (document.querySelector(`script[src="${tiktokPixelUrl}"]`)) {
        console.log('[TikTok Pixel] ✅ Already loaded');
        return;
      }

      console.log('[TikTok Pixel] 📦 Loading script...');

      // Crear script
      const script = document.createElement('script');
      script.src = tiktokPixelUrl;
      script.async = true;
      script.id = 'tiktok-pixel-bootstrap';

      script.onload = () => console.log('[TikTok Pixel] ✅ Loaded successfully');
      script.onerror = () => console.error('[TikTok Pixel] ❌ Failed to load from', apiUrl);

      document.head.appendChild(script);

      // Noscript fallback
      const noscript = document.createElement('noscript');
      const img = document.createElement('img');
      img.height = 1;
      img.width = 1;
      img.style.display = 'none';
      img.src = `${apiUrl}/api/custommer/analytics/tiktok-pixel/noscript`;
      img.alt = '';
      noscript.appendChild(img);
      document.body.appendChild(noscript);
    };

    // Cargar inmediatamente
    loadTikTokPixel();

    // Escuchar cambios de consentimiento
    const handleConsentChange = () => {
      console.log('[TikTok Pixel] 🔄 Consent changed');
      loadTikTokPixel();
    };

    window.addEventListener('consentChange', handleConsentChange);

    return () => {
      window.removeEventListener('consentChange', handleConsentChange);
      document.getElementById('tiktok-pixel-bootstrap')?.remove();
    };
  }, [mounted]);

  return null;
}
