'use client';

import ClarityScript from './ClarityScript';
import GTMScript from './GTMScript';
import MetaPixelScript from './MetaPixelScript';
import TikTokPixelScript from './TikTokPixelScript';

/**
 * Componente contenedor para todos los scripts de analytics
 *
 * Este componente agrupa todos los servicios de analytics y marketing:
 *
 * **Analytics:**
 * - Microsoft Clarity (mapas de calor y grabaciones de sesión)
 *
 * **Marketing:**
 * - Google Tag Manager (gestión de tags y eventos)
 * - Meta Pixel (tracking de conversiones de Facebook)
 * - TikTok Pixel (tracking de conversiones de TikTok)
 *
 * **Sistema de Consentimiento:**
 * - Todos los scripts verifican el consentimiento del usuario antes de cargar
 * - Analytics: requiere `analytics: true` en el consentimiento
 * - Marketing: requiere `ads: true` en el consentimiento
 *
 * IMPORTANTE:
 * - Debe colocarse dentro del <body> del layout
 * - Los scripts se cargan de forma asíncrona y first-party
 * - No expone ninguna credencial en el frontend
 * - Todos los Project IDs viven en el backend
 * - Solo se cargan si el usuario acepta cookies en el banner de consentimiento
 *
 * @example
 * ```tsx
 * // En app/layout.tsx
 * <body>
 *   <AnalyticsScripts />
 *   {children}
 * </body>
 * ```
 */
export default function AnalyticsScripts() {
  return (
    <>
      {/* Analytics - requiere consentimiento de analytics */}
      <ClarityScript />

      {/* Marketing - requiere consentimiento de publicidad */}
      <GTMScript />
      <MetaPixelScript />
      <TikTokPixelScript />
    </>
  );
}
