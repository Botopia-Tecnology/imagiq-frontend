/**
 * Clarity User Identification
 *
 * Implementación del Identify API de Microsoft Clarity para tracking cross-device
 * Documentación: https://learn.microsoft.com/en-us/clarity/setup-and-installation/identify-api
 *
 * Características:
 * - Custom User ID hasheado automáticamente por Clarity
 * - Custom Session ID para tracking de sesiones específicas
 * - Custom Page ID para identificar páginas únicas
 * - Friendly Name para visualización en dashboard
 * - Se ejecuta solo si hay consentimiento de analytics
 */

import { hasAnalyticsConsent } from "@/lib/consent";
import { User } from "@/types/user";
import {
  logIdentificationSuccess,
  logIdentificationError,
  waitForClarity,
} from "./clarity-debug";

// El tipo de window.clarity está declarado en @/lib/clarity.ts

const DEBUG_MODE = process.env.NODE_ENV === "development";

/**
 * Identifica al usuario en Clarity
 *
 * @param user - Objeto de usuario autenticado
 * @param sessionId - ID de sesión opcional (generado automáticamente si no se proporciona)
 * @param pageId - ID de página opcional
 *
 * Clarity hashea automáticamente el customUserId en el cliente antes de enviarlo a sus servidores
 */
export function identifyUserInClarity(
  user: User,
  sessionId?: string,
  pageId?: string
): void {
  // Verificar consentimiento
  if (!hasAnalyticsConsent()) {
    if (DEBUG_MODE) {
      console.log(
        "[Clarity Identity] ❌ No analytics consent, skipping user identification"
      );
    }
    return;
  }

  // Verificar que Clarity esté cargado
  if (typeof window === "undefined" || !window.clarity) {
    if (DEBUG_MODE) {
      console.warn(
        "[Clarity Identity] ⚠️ Clarity not loaded yet, skipping identification"
      );
    }
    return;
  }

  // Validar datos del usuario
  if (!user.email || !user.nombre || !user.apellido) {
    console.error("[Clarity Identity] ❌ Invalid user data:", {
      hasEmail: !!user.email,
      hasNombre: !!user.nombre,
      hasApellido: !!user.apellido,
    });
    return;
  }

  // Preparar datos
  const customUserId = user.email; // Email como identificador único
  const customSessionId = sessionId || generateSessionId();
  const customPageId = pageId || undefined;
  const friendlyName = `${user.nombre} ${user.apellido}`.trim();

  try {
    // Llamar al API de Clarity
    window.clarity(
      "identify",
      customUserId,
      customSessionId,
      customPageId,
      friendlyName
    );

    if (DEBUG_MODE) {
      logIdentificationSuccess(customUserId, customSessionId, friendlyName);
    }

    // También enviar metadatos adicionales
    window.clarity("set", "userId", user.id);
    window.clarity("set", "userEmail", customUserId);
    window.clarity("set", "userName", friendlyName);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logIdentificationError(err, {
      userId: customUserId,
      sessionId: customSessionId,
      friendlyName,
    });
  }
}

/**
 * Genera un session ID único
 * Formato: imagiq-session-{timestamp}-{random}
 */
function generateSessionId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `imagiq-session-${timestamp}-${random}`;
}

/**
 * Genera un page ID único basado en la ruta actual
 * Formato: imagiq-page-{route}-{timestamp}
 */
export function generatePageId(pathname: string): string {
  const sanitizedPath =
    pathname.replace(/\//g, "-").replace(/^-/, "") || "home";
  const timestamp = Date.now();
  return `imagiq-page-${sanitizedPath}-${timestamp}`;
}

/**
 * Identifica al usuario con page ID personalizado
 */
export function identifyUserWithPageId(user: User, pathname: string): void {
  const pageId = generatePageId(pathname);
  identifyUserInClarity(user, undefined, pageId);
}

/**
 * Re-identifica al usuario en cada cambio de ruta
 * Útil para tracking de navegación cross-page
 */
export function reidentifyUserOnNavigation(user: User, pathname: string): void {
  if (!hasAnalyticsConsent()) return;

  // Usar el mismo session ID pero actualizar el page ID
  const sessionId = getOrCreateSessionId();
  const pageId = generatePageId(pathname);

  identifyUserInClarity(user, sessionId, pageId);
}

/**
 * Obtiene o crea un session ID persistente para la sesión del navegador
 */
function getOrCreateSessionId(): string {
  const STORAGE_KEY = "clarity_session_id";

  try {
    // Intentar obtener session ID existente
    const existingSessionId = sessionStorage.getItem(STORAGE_KEY);
    if (existingSessionId) {
      return existingSessionId;
    }

    // Crear nuevo session ID
    const newSessionId = generateSessionId();
    sessionStorage.setItem(STORAGE_KEY, newSessionId);
    return newSessionId;
  } catch {
    // Fallback si sessionStorage no está disponible
    return generateSessionId();
  }
}
