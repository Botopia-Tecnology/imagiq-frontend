'use client';

import { useEffect, useState } from 'react';
import { hasAnalyticsConsent } from '@/lib/consent';

/**
 * Componente que carga Microsoft Clarity de forma first-party
 *
 * - No requiere variables de entorno en el frontend
 * - El Project ID vive solo en el backend
 * - Soporta consentimiento a través del header x-analytics-consent
 * - Totalmente first-party para evitar ad-blockers
 * - SOLO SE CARGA SI EL USUARIO ACEPTA COOKIES DE ANALYTICS
 *
 * IMPORTANTE: Este componente carga el script de Clarity de forma dinámica
 * ejecutando el código JavaScript que viene del backend, el cual contiene
 * la inicialización completa de Clarity con el Project ID.
 */
export default function ClarityScript() {
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
      console.debug('[Clarity] No analytics consent, skipping load');
      return;
    }

    // Prevenir múltiples cargas
    if (globalThis.window.clarity) {
      console.debug('[Clarity] Already initialized');
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const clarityUrl = `${apiUrl}/api/custommer/analytics/clarity.js`;

    // Verificar si ya existe el script
    const existingScript = document.querySelector(
      `script[src="${clarityUrl}"]`
    );
    if (existingScript) {
      console.debug('[Clarity] Script already exists in DOM');
      return;
    }

    // Crear y cargar el script de forma dinámica
    const script = document.createElement('script');
    script.src = clarityUrl;
    script.async = true;
    script.id = 'clarity-bootstrap';

    script.onload = () => {
      console.debug('[Clarity] Script loaded successfully');
      if (globalThis.window?.clarity) {
        console.debug('[Clarity] window.clarity is now available');
      }
    };

    script.onerror = () => {
      console.warn(
        '[Clarity] Failed to load from backend. Ensure the API is running at:',
        apiUrl
      );
    };

    // Insertar el script en el head
    document.head.appendChild(script);

    // Cleanup: remover el script cuando el componente se desmonte
    return () => {
      const scriptToRemove = document.getElementById('clarity-bootstrap');
      scriptToRemove?.remove();
    };
  }, [mounted]);

  // Este componente no renderiza nada visible
  return null;
}
