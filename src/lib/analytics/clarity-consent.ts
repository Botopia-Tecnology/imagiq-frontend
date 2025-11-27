/**
 * Clarity Recording Consent Management
 *
 * Maneja el envío del consentimiento de grabación al backend
 */

const DEBUG_MODE = process.env.NODE_ENV === "development";

/**
 * Envía el consentimiento de grabación de Clarity al backend
 *
 * @param consent - true para permitir grabación, false para denegar
 * @returns Promise con el resultado del envío
 */
export async function sendClarityConsentToBackend(consent: boolean): Promise<boolean> {
  try {
    if (DEBUG_MODE) {
      console.log("[Clarity Consent] 📤 Sending consent to backend:", consent);
    }

    // Endpoint del backend para guardar el consentimiento
    const response = await fetch('/api/custommer/analytics/consent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clarity_recording: consent,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status ${response.status}`);
    }

    const data = await response.json();

    if (DEBUG_MODE) {
      console.log("[Clarity Consent] ✅ Consent sent successfully:", data);
    }

    return true;
  } catch (error) {
    // Solo mostrar error en producción
    if (process.env.NODE_ENV === "production") {
      console.error("[Clarity Consent] ❌ Failed to send consent to backend:", error);
    } else {
      console.warn("[Clarity Consent] ⚠️ Backend not available (development mode)");
    }

    return false;
  }
}

/**
 * Guarda el consentimiento localmente y lo envía al backend
 *
 * @param consent - true para permitir grabación, false para denegar
 */
export function saveClarityConsent(consent: boolean): void {
  // Guardar en localStorage
  const consentData = {
    clarity_recording: consent,
    timestamp: new Date().toISOString(),
    version: "1.0",
  };

  try {
    localStorage.setItem("clarity_consent", JSON.stringify(consentData));

    if (DEBUG_MODE) {
      console.log("[Clarity Consent] 💾 Saved locally:", consentData);
    }

    // Enviar al backend
    sendClarityConsentToBackend(consent);
  } catch (error) {
    console.error("[Clarity Consent] ❌ Failed to save consent locally:", error);
  }
}

/**
 * Obtiene el consentimiento guardado localmente
 *
 * @returns El estado del consentimiento o null si no existe
 */
export function getClarityConsent(): boolean | null {
  try {
    const stored = localStorage.getItem("clarity_consent");
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    return parsed.clarity_recording ?? null;
  } catch (error) {
    console.error("[Clarity Consent] ❌ Failed to read consent:", error);
    return null;
  }
}

/**
 * Inicializa el consentimiento de Clarity
 * Por defecto, está habilitado para grabar todas las sesiones
 */
export function initializeClarityConsent(): void {
  const existingConsent = getClarityConsent();

  // Si no hay consentimiento previo, establecer como habilitado por defecto
  if (existingConsent === null) {
    if (DEBUG_MODE) {
      console.log("[Clarity Consent] 🔧 Initializing with recording enabled by default");
    }
    saveClarityConsent(true);
  }
}
