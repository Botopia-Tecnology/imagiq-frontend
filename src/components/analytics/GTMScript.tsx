'use client';

import { useEffect, useState } from 'react';

/**
 * Componente que carga Google Tag Manager de forma first-party
 *
 * - No requiere variables de entorno en el frontend
 * - El Container ID vive solo en el backend
 * - Soporta consentimiento a través del header x-analytics-consent
 * - Totalmente first-party para evitar ad-blockers
 *
 * IMPORTANTE: Este componente carga el script de GTM de forma dinámica
 * ejecutando el código JavaScript que viene del backend.
 */
export default function GTMScript() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Solo ejecutar en el cliente después de montar
    if (!mounted) return;
    if (globalThis.window === undefined) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const gtmUrl = `${apiUrl}/api/custommer/analytics/gtm.js`;

    // Verificar si ya existe el script
    const existingScript = document.querySelector(`script[src="${gtmUrl}"]`);
    if (existingScript) {
      console.debug('[GTM] Script already exists in DOM');
      return;
    }

    // Crear y cargar el script de forma dinámica
    const script = document.createElement('script');
    script.src = gtmUrl;
    script.async = true;
    script.id = 'gtm-bootstrap';

    script.onload = () => {
      console.debug('[GTM] Script loaded successfully');
    };

    script.onerror = () => {
      console.warn(
        '[GTM] Failed to load from backend. Ensure the API is running at:',
        apiUrl
      );
    };

    // Insertar el script en el head
    document.head.appendChild(script);

    // Agregar noscript fallback para GTM
    const noscript = document.createElement('noscript');
    const iframe = document.createElement('iframe');
    iframe.src = `${apiUrl}/api/custommer/analytics/gtm/noscript`;
    iframe.height = '0';
    iframe.width = '0';
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';
    noscript.appendChild(iframe);
    document.body.appendChild(noscript);

    // Cleanup
    return () => {
      const scriptToRemove = document.getElementById('gtm-bootstrap');
      scriptToRemove?.remove();
      noscript?.remove();
    };
  }, [mounted]);

  // Este componente no renderiza nada visible
  return null;
}
