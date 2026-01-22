/**
 * Hook para identificación automática de usuarios en Clarity
 *
 * Se sincroniza automáticamente con el estado de autenticación:
 * - Identifica al usuario UNA SOLA VEZ cuando inicia sesión
 * - Registra cambios de página SIN re-identificar (usa set() en lugar de identify())
 * - Resetea el estado al cerrar sesión
 *
 * IMPORTANTE: La re-identificación múltiple causa fragmentación de sesiones en Clarity.
 * Por eso solo identificamos UNA VEZ y usamos set() para actualizaciones.
 */

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/features/auth/context";
import {
  identifyUserInClarity,
  trackPageView,
  resetIdentificationState,
  isUserIdentified,
} from "@/lib/analytics/clarity-identify";
import { waitForClarity } from "@/lib/analytics/clarity-debug";

export function useClarityIdentity() {
  const { user, isAuthenticated } = useAuthContext();
  const pathname = usePathname();
  const previousAuthState = useRef<boolean>(false);

  // Detectar logout para resetear estado de identificación
  useEffect(() => {
    if (previousAuthState.current && !isAuthenticated) {
      // Usuario cerró sesión
      resetIdentificationState();
    }
    previousAuthState.current = isAuthenticated;
  }, [isAuthenticated]);

  // Identificar usuario UNA SOLA VEZ cuando se autentica
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Si ya está identificado, no volver a identificar
    if (isUserIdentified()) {
      return;
    }

    // Esperar a que Clarity esté disponible y luego identificar
    const identifyUser = async () => {
      try {
        await waitForClarity(10, 1000); // Esperar hasta 10 segundos
        identifyUserInClarity(user);
      } catch {
        // Error silencioso - Clarity no es crítico para la aplicación
      }
    };

    identifyUser();
  }, [user, isAuthenticated]);

  // Registrar cambios de página SIN re-identificar
  // Usar set() para actualizar la página actual sin fragmentar la sesión
  useEffect(() => {
    if (typeof window === "undefined" || !window.clarity) return;

    // Registrar la página visitada (funciona para usuarios autenticados y anónimos)
    trackPageView(pathname);
  }, [pathname]);
}
