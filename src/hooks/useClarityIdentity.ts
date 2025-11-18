/**
 * Hook para identificación automática de usuarios en Clarity
 *
 * Se sincroniza automáticamente con el estado de autenticación:
 * - Identifica al usuario cuando inicia sesión
 * - Re-identifica en cada cambio de ruta
 * - Limpia la identificación al cerrar sesión
 */

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthContext } from '@/features/auth/context';
import { identifyUserInClarity, reidentifyUserOnNavigation } from '@/lib/analytics/clarity-identify';
import { hasAnalyticsConsent } from '@/lib/consent';

export function useClarityIdentity() {
  const { user, isAuthenticated } = useAuthContext();
  const pathname = usePathname();

  // Identificar usuario cuando se autentica
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    if (!hasAnalyticsConsent()) return;

    // Esperar a que Clarity esté disponible
    const checkClarityAndIdentify = () => {
      if (typeof window !== 'undefined' && window.clarity) {
        identifyUserInClarity(user);
      } else {
        // Reintentar después de 1 segundo
        setTimeout(checkClarityAndIdentify, 1000);
      }
    };

    checkClarityAndIdentify();
  }, [user, isAuthenticated]);

  // Re-identificar en cada cambio de ruta para tracking de navegación
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    if (!hasAnalyticsConsent()) return;

    if (typeof window !== 'undefined' && window.clarity) {
      reidentifyUserOnNavigation(user, pathname);
    }
  }, [pathname, user, isAuthenticated]);

  // Escuchar cambios de consentimiento
  useEffect(() => {
    const handleConsentChange = () => {
      if (!isAuthenticated || !user) return;

      if (hasAnalyticsConsent()) {
        // Re-identificar cuando se otorga consentimiento
        if (typeof window !== 'undefined' && window.clarity) {
          identifyUserInClarity(user);
        }
      }
    };

    window.addEventListener('consentChange', handleConsentChange);

    return () => {
      window.removeEventListener('consentChange', handleConsentChange);
    };
  }, [user, isAuthenticated]);
}
