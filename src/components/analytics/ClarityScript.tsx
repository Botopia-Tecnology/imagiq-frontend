'use client';

import Script from 'next/script';

/**
 * Componente que carga Microsoft Clarity de forma first-party
 *
 * - No requiere variables de entorno en el frontend
 * - El Project ID vive solo en el backend
 * - Soporta consentimiento a través del header x-analytics-consent
 * - Totalmente first-party para evitar ad-blockers
 */
export default function ClarityScript() {
  // Obtener la URL base del API desde variables de entorno
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  return (
    <Script
      src={`${apiUrl}/api/analytics/clarity.js`}
      strategy="afterInteractive"
      id="clarity-bootstrap"
    />
  );
}
