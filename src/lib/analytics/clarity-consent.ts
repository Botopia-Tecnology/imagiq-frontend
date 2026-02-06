/**
 * Clarity Recording Consent Management
 *
 * Maneja el envío del consentimiento de grabación al backend
 */

/**
 * Envía el consentimiento de grabación de Clarity al backend
 */
export async function sendClarityConsentToBackend(consent: boolean): Promise<boolean> {
  try {
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

    await response.json();
    return true;
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      console.error("[Clarity Consent] Failed to send consent to backend:", error);
    } else {
      console.warn("[Clarity Consent] Backend not available (development mode)");
    }

    return false;
  }
}

/**
 * Guarda el consentimiento localmente y lo envía al backend
 */
export function saveClarityConsent(consent: boolean): void {
  const consentData = {
    clarity_recording: consent,
    timestamp: new Date().toISOString(),
    version: "1.0",
  };

  try {
    localStorage.setItem("clarity_consent", JSON.stringify(consentData));
    sendClarityConsentToBackend(consent);
  } catch (error) {
    console.error("[Clarity Consent] Failed to save consent locally:", error);
  }
}

/**
 * Obtiene el consentimiento guardado localmente
 */
export function getClarityConsent(): boolean | null {
  try {
    const stored = localStorage.getItem("clarity_consent");
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    return parsed.clarity_recording ?? null;
  } catch (error) {
    console.error("[Clarity Consent] Failed to read consent:", error);
    return null;
  }
}

/**
 * Inicializa el consentimiento de Clarity
 * Por defecto, está habilitado para grabar todas las sesiones
 */
export function initializeClarityConsent(): void {
  const existingConsent = getClarityConsent();

  if (existingConsent === null) {
    saveClarityConsent(true);
  }
}
