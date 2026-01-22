/**
 * Clarity User Identification
 *
 * Implementación del Identify API de Microsoft Clarity para tracking cross-device
 * Documentación: https://learn.microsoft.com/en-us/clarity/setup-and-installation/identify-api
 *
 * Características:
 * - Custom User ID hasheado automáticamente por Clarity
 * - Custom Session ID persistente para mantener continuidad de sesión
 * - Custom Page ID para identificar páginas únicas
 * - Friendly Name para visualización en dashboard
 *
 * IMPORTANTE: El sessionId se inicializa UNA VEZ al cargar la página y se mantiene
 * durante toda la sesión del navegador para evitar fragmentación de grabaciones.
 */

import { User } from "@/types/user";

// El tipo de window.clarity está declarado en @/lib/clarity.ts

const SESSION_STORAGE_KEY = "clarity_session_id";

// Flag para rastrear si el usuario ya fue identificado en esta sesión
let userIdentified = false;

/**
 * Inicializa el sessionId al cargar la página
 * DEBE llamarse lo antes posible (en ClarityScript) para asegurar
 * que el sessionId exista ANTES de cualquier identificación
 */
export function initializeSessionId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    const existingSessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (existingSessionId) {
      return existingSessionId;
    }

    // Crear nuevo session ID solo si no existe
    const newSessionId = generateSessionId();
    sessionStorage.setItem(SESSION_STORAGE_KEY, newSessionId);
    return newSessionId;
  } catch {
    // Fallback si sessionStorage no está disponible
    return generateSessionId();
  }
}

/**
 * Obtiene el sessionId persistente (nunca genera uno nuevo después de la inicialización)
 */
export function getSessionId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    const sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (sessionId) {
      return sessionId;
    }
    // Si por alguna razón no existe, inicializarlo
    return initializeSessionId();
  } catch {
    return "";
  }
}

/**
 * Identifica al usuario en Clarity - SE LLAMA SOLO UNA VEZ por sesión
 *
 * @param user - Objeto de usuario autenticado
 * @param forceReidentify - Forzar re-identificación (usar con precaución)
 *
 * Clarity hashea automáticamente el customUserId en el cliente antes de enviarlo a sus servidores
 */
export function identifyUserInClarity(
  user: User,
  forceReidentify: boolean = false
): void {
  // Verificar que Clarity esté cargado
  if (typeof window === "undefined" || !window.clarity) {
    return;
  }

  // Evitar re-identificación múltiple (causa fragmentación de sesiones)
  if (userIdentified && !forceReidentify) {
    // Solo actualizar metadatos sin re-identificar
    updateUserMetadata(user);
    return;
  }

  // Validar que el usuario tenga al menos un email
  if (!user?.email) {
    return;
  }

  // Preparar datos - SIEMPRE usar el sessionId persistente
  const customUserId = user.email;
  const customSessionId = getSessionId(); // Usar sessionId existente, NUNCA generar uno nuevo
  const friendlyName = user.nombre && user.apellido
    ? `${user.nombre} ${user.apellido}`.trim()
    : user.email.split('@')[0];

  try {
    // Llamar al API de Clarity - SOLO UNA VEZ por sesión
    window.clarity(
      "identify",
      customUserId,
      customSessionId,
      undefined, // No usar pageId para evitar fragmentación
      friendlyName
    );

    // Marcar como identificado para evitar re-identificaciones
    userIdentified = true;

    // Enviar metadatos adicionales con set()
    updateUserMetadata(user);
  } catch {
    // Error silencioso - no es crítico para la aplicación
  }
}

/**
 * Actualiza metadatos del usuario SIN re-identificar
 * Usar esto para actualizar información sin fragmentar la sesión
 */
export function updateUserMetadata(user: User): void {
  if (typeof window === "undefined" || !window.clarity) {
    return;
  }

  try {
    if (user.id) {
      window.clarity("set", "userId", user.id);
    }
    if (user.email) {
      window.clarity("set", "userEmail", user.email);
    }
    if (user.nombre || user.apellido) {
      const friendlyName = `${user.nombre || ""} ${user.apellido || ""}`.trim();
      window.clarity("set", "userName", friendlyName);
    }
  } catch {
    // Error silencioso - no es crítico
  }
}

/**
 * Resetea el estado de identificación (usar al cerrar sesión)
 */
export function resetIdentificationState(): void {
  userIdentified = false;
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
 * Registra un evento de página visitada SIN re-identificar
 * Usar para tracking de navegación sin fragmentar sesión
 */
export function trackPageView(pathname: string): void {
  if (typeof window === "undefined" || !window.clarity) {
    return;
  }

  try {
    // Usar set() para registrar la página actual sin re-identificar
    const sanitizedPath = pathname.replaceAll("/", "-").replace(/^-/, "") || "home";
    window.clarity("set", "currentPage", sanitizedPath);
    window.clarity("set", "lastPageView", new Date().toISOString());
  } catch {
    // Error silencioso - no es crítico
  }
}

/**
 * Verifica si el usuario ya fue identificado en esta sesión
 */
export function isUserIdentified(): boolean {
  return userIdentified;
}
