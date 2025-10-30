'use client';

import ClarityScript from './ClarityScript';
import GTMScript from './GTMScript';
import MetaPixelScript from './MetaPixelScript';

/**
 * Componente contenedor para todos los scripts de analytics
 *
 * Este componente agrupa todos los servicios de analytics:
 * - Microsoft Clarity (mapas de calor y grabaciones de sesión)
 * - Google Tag Manager (gestión de tags y eventos)
 * - Meta Pixel (tracking de conversiones de Facebook)
 *
 * IMPORTANTE:
 * - Debe colocarse dentro del <body> del layout
 * - Los scripts se cargan de forma asíncrona y first-party
 * - No expone ninguna credencial en el frontend
 * - Todos los Project IDs viven en el backend
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
      <ClarityScript />
      <GTMScript />
      <MetaPixelScript />
    </>
  );
}
