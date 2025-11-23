/**
 * Clarity Debug Utilities
 *
 * Utilidades para debugging y monitoreo de Microsoft Clarity
 * Permite verificar el estado de la integración y solucionar problemas
 */

export interface ClarityDebugInfo {
  isLoaded: boolean;
  isInitialized: boolean;
  hasConsent: boolean;
  projectId: string | null;
  sessionId: string | null;
  userId: string | null;
  errors: string[];
}

/**
 * Obtiene información detallada del estado de Clarity
 */
export function getClarityDebugInfo(): ClarityDebugInfo {
  const info: ClarityDebugInfo = {
    isLoaded: false,
    isInitialized: false,
    hasConsent: false,
    projectId: null,
    sessionId: null,
    userId: null,
    errors: [],
  };

  try {
    // Verificar si window está disponible
    if (typeof window === "undefined") {
      info.errors.push("Window object not available (SSR context)");
      return info;
    }

    // Verificar si Clarity está cargado
    info.isLoaded = "clarity" in window && typeof window.clarity === "function";

    if (!info.isLoaded) {
      info.errors.push("Clarity script not loaded");
      return info;
    }

    // Verificar si está inicializado
    info.isInitialized = window.clarity !== undefined;

    // Intentar obtener información de sessionStorage
    try {
      const sessionId = sessionStorage.getItem("clarity_session_id");
      if (sessionId) {
        info.sessionId = sessionId;
      }
    } catch (error) {
      info.errors.push(`SessionStorage error: ${String(error)}`);
    }

    // Verificar consentimiento
    try {
      const consent = localStorage.getItem("consent");
      if (consent) {
        const consentData = JSON.parse(consent);
        info.hasConsent = consentData.analytics === true;
      }
    } catch (error) {
      info.errors.push(`Consent check error: ${String(error)}`);
    }
  } catch (error) {
    info.errors.push(`General error: ${String(error)}`);
  }

  return info;
}

/**
 * Imprime el estado de Clarity en la consola
 */
export function logClarityStatus(): void {
  const info = getClarityDebugInfo();

  console.group("🔍 Clarity Debug Info");
  console.log("✅ Loaded:", info.isLoaded);
  console.log("✅ Initialized:", info.isInitialized);
  console.log("📊 Has Consent:", info.hasConsent);
  console.log("🔑 Session ID:", info.sessionId || "Not set");
  console.log("👤 User ID:", info.userId || "Not identified");

  if (info.errors.length > 0) {
    console.group("❌ Errors:");
    info.errors.forEach((error) => console.error(error));
    console.groupEnd();
  }

  console.groupEnd();
}

/**
 * Verifica si Clarity está listo para recibir comandos
 */
export function isClarityReady(): boolean {
  if (typeof window === "undefined") return false;
  return "clarity" in window && typeof window.clarity === "function";
}

/**
 * Espera a que Clarity esté listo
 * @param maxAttempts - Número máximo de intentos (default: 10)
 * @param delayMs - Delay entre intentos en ms (default: 500)
 * @returns Promise que se resuelve cuando Clarity está listo o rechaza si timeout
 */
export function waitForClarity(
  maxAttempts: number = 10,
  delayMs: number = 500
): Promise<void> {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const checkClarity = () => {
      attempts++;

      if (isClarityReady()) {
        console.log(
          "[Clarity Debug] ✅ Clarity ready after",
          attempts,
          "attempts"
        );
        resolve();
        return;
      }

      if (attempts >= maxAttempts) {
        const error = `Clarity not ready after ${maxAttempts} attempts`;
        // Solo mostrar error en producción, warning en desarrollo
        if (process.env.NODE_ENV === "production") {
          console.error("[Clarity Debug] ❌", error);
          reject(new Error(error));
        } else {
          console.warn(
            "[Clarity Debug] ⚠️",
            error,
            "(backend may not be running)"
          );
          // En desarrollo, resolver en lugar de rechazar para no romper la app
          resolve();
        }
        return;
      }

      setTimeout(checkClarity, delayMs);
    };

    checkClarity();
  });
}

/**
 * Registra un evento de identificación exitosa
 */
export function logIdentificationSuccess(
  userId: string,
  sessionId: string,
  friendlyName: string
): void {
  console.group("🎯 Clarity User Identified");
  console.log("📧 User ID:", userId);
  console.log("🔑 Session ID:", sessionId);
  console.log("👤 Friendly Name:", friendlyName);
  console.log("⏰ Timestamp:", new Date().toISOString());
  console.groupEnd();
}

/**
 * Registra un error de identificación
 */
export function logIdentificationError(
  error: Error,
  context: Record<string, string>
): void {
  console.group("❌ Clarity Identification Failed");
  console.error("Error:", error.message);
  console.log("Context:", context);
  console.log("⏰ Timestamp:", new Date().toISOString());
  console.groupEnd();
}

/**
 * Modo de desarrollo: expone funciones de debug en window
 */
export function enableDebugMode(): void {
  if (typeof window === "undefined") return;

  // Agregar utilidades de debug a window de forma segura
  (window as unknown as Record<string, unknown>).clarityDebug = {
    getInfo: getClarityDebugInfo,
    logStatus: logClarityStatus,
    isReady: isClarityReady,
    waitForClarity,
  };

  console.log("🔧 Clarity Debug Mode enabled. Use window.clarityDebug");
}
