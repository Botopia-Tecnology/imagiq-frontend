"use client";

import React, { useState, useEffect } from "react";
import { Cookie, X, ChevronDown } from "lucide-react";
import { saveLocationPermission } from "@/lib/consent/location";

/**
 * CookieBanner - Sistema de Consentimiento de Cookies y Ubicación ULTRA-PROTEGIDO
 *
 * ESTRATEGIA DE TRACKING DUAL:
 *
 * 1. CLIENT-SIDE (requiere consentimiento):
 *    - Google Tag Manager (GTM)
 *    - Meta Pixel (Facebook)
 *    - TikTok Pixel
 *    - Microsoft Clarity
 *    - Sentry
 *
 * 2. SERVER-SIDE (siempre activo):
 *    - Meta CAPI (Conversions API)
 *    - TikTok Events API
 *    - Modo FULL si hay consentimiento (con PII hasheado)
 *    - Modo ANONYMOUS si NO hay consentimiento (sin PII, IP anonimizada)
 *
 * Base legal Colombia (Ley 1581/2012):
 * - Datos anonimizados NO requieren consentimiento
 * - Tracking client-side SÍ requiere consentimiento
 *
 * PROTECCIÓN ANTI-REAPARICIÓN:
 * - Triple verificación: localStorage + sessionStorage + cookie
 * - Detección de manipulación de storage
 * - Timestamp de aceptación para auditoría
 * - Sistema de "accepted" vs "rejected" explícito
 */

const STORAGE_KEY = "imagiq_consent";
const CONSENT_VERSION = "2.0";
const SESSION_KEY = "imagiq_consent_session";
const COOKIE_NAME = "imagiq_consent_backup";

// Estados posibles del consentimiento
type ConsentDecision = "accepted" | "rejected" | "pending";

interface ConsentState {
  analytics: boolean; // Clarity, Sentry
  marketing: boolean; // GTM, Meta Pixel, TikTok Pixel
  decision: ConsentDecision; // Estado explícito de la decisión
  timestamp: number;
  version: string;
}

/**
 * Lee el consentimiento de TODAS las fuentes con protección
 */
function getConsentFromAllSources(): ConsentState | null {
  if (typeof window === "undefined") return null;

  try {
    // 1. Intentar leer de localStorage (fuente principal)
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as ConsentState;
      // Validar estructura completa
      if (
        typeof parsed.analytics === "boolean" &&
        typeof parsed.marketing === "boolean" &&
        typeof parsed.decision === "string" &&
        typeof parsed.timestamp === "number" &&
        parsed.decision !== "pending"
      ) {
        return parsed;
      }
    }

    // 2. Intentar leer de sessionStorage (backup de sesión)
    const sessionStored = sessionStorage.getItem(SESSION_KEY);
    if (sessionStored) {
      const parsed = JSON.parse(sessionStored) as ConsentState;
      if (parsed.decision !== "pending") {
        // Restaurar a localStorage si se perdió
        localStorage.setItem(STORAGE_KEY, sessionStored);
        return parsed;
      }
    }

    // 3. Intentar leer de cookie (último recurso)
    const cookieValue = getCookie(COOKIE_NAME);
    if (cookieValue) {
      const parsed = JSON.parse(decodeURIComponent(cookieValue)) as ConsentState;
      if (parsed.decision !== "pending") {
        // Restaurar a localStorage y sessionStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(parsed));
        return parsed;
      }
    }

    return null;
  } catch (error) {
    console.error("🍪 [CookieBanner] Error reading consent:", error);
    return null;
  }
}

/**
 * Guarda el consentimiento en TODAS las fuentes (triple protección)
 */
function saveConsentToAllSources(
  analytics: boolean,
  marketing: boolean,
  decision: ConsentDecision
): void {
  const consent: ConsentState = {
    analytics,
    marketing,
    decision,
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  };

  const serialized = JSON.stringify(consent);

  // 1. Guardar en localStorage (principal)
  localStorage.setItem(STORAGE_KEY, serialized);

  // 2. Guardar en sessionStorage (backup de sesión)
  sessionStorage.setItem(SESSION_KEY, serialized);

  // 3. Guardar en cookie (backup permanente, expira en 365 días)
  setCookie(COOKIE_NAME, encodeURIComponent(serialized), 365);

  // Disparar evento para que los scripts reaccionen
  window.dispatchEvent(new CustomEvent("consentChange", { detail: consent }));
}

/**
 * Helpers para cookies
 */
function setCookie(name: string, value: string, days: number): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Montar componente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Verificar si debe mostrarse CON PROTECCIÓN ANTI-REAPARICIÓN
  useEffect(() => {
    if (!mounted) return;
    if (typeof window === "undefined") return;

    const consent = getConsentFromAllSources();

    if (!consent) {
      setShow(true);
      return;
    }

    // Verificar que la decisión sea explícita (no pending)
    if (consent.decision === "accepted") {
      setShow(false);
    } else if (consent.decision === "rejected") {
      // Si rechazó, mostrar nuevamente para darle oportunidad de cambiar de opinión
      setShow(true);
    } else {
      // Decisión inválida o pending, mostrar banner
      setShow(true);
    }
  }, [mounted]);

  const handleAccept = async () => {
    // 1. Guardar consentimiento de cookies en TODAS las fuentes
    saveConsentToAllSources(true, true, "accepted");

    // 2. Guardar consentimiento de ubicación
    saveLocationPermission(true);

    // 3. Solicitar ubicación del navegador
    if (typeof window !== "undefined" && navigator.geolocation) {
      try {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const locationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: Date.now(),
            };
            localStorage.setItem("imagiq_user_location", JSON.stringify(locationData));
          },
          (_error) => {
            // User denied location or error occurred - consent already saved
          }
        );
      } catch {
        // Geolocation not available
      }
    }

    // 4. Ocultar banner
    setShow(false);
  };

  const handleReject = () => {
    // Guardar rechazo explícito (NO guardar en ubicación para volver a preguntar)
    saveConsentToAllSources(false, false, "rejected");

    // Ocultar banner temporalmente (volverá a aparecer en próxima visita)
    setShow(false);
  };

  const handleClose = () => {
    // Solo ocultar visualmente, NO guardar nada
    // El banner volverá a aparecer en la próxima navegación/recarga
    setShow(false);
  };

  // No renderizar hasta que esté montado y deba mostrarse
  if (!mounted || !show) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[99999] bg-white border-b-2 border-gray-300 shadow-lg"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999999,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          {/* Icon */}
          <Cookie className="h-6 w-6 text-black flex-shrink-0" />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-lg font-bold text-black">
                Desbloquea ofertas exclusivas para ti
              </h2>
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-gray-600 hover:text-black transition-colors"
                aria-label={expanded ? "Contraer" : "Expandir"}
              >
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-200 ${
                    expanded ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {!expanded && (
              <p className="text-sm text-gray-600 leading-relaxed">
                Recibe promociones personalizadas, descuentos en tiendas cercanas y acceso anticipado a lanzamientos Samsung.
              </p>
            )}

            {expanded && (
              <div className="text-sm space-y-4 mt-3">
                {/* Beneficios de aceptar */}
                <div className="border-l-2 border-gray-900 pl-4 py-2">
                  <p className="font-semibold text-gray-900 mb-3">
                    Beneficios al aceptar cookies y ubicación:
                  </p>
                  <ul className="space-y-2.5">
                    <li className="text-gray-700">
                      <strong className="text-gray-900">Ofertas cerca de ti</strong> basadas en tu ubicación actual
                    </li>
                    <li className="text-gray-700">
                      <strong className="text-gray-900">Promociones personalizadas</strong> según tus productos favoritos
                    </li>
                    <li className="text-gray-700">
                      <strong className="text-gray-900">Envío gratis</strong> en productos de tiendas cercanas
                    </li>
                    <li className="text-gray-700">
                      <strong className="text-gray-900">Acceso anticipado</strong> a lanzamientos de nuevos Galaxy
                    </li>
                    <li className="text-gray-700">
                      <strong className="text-gray-900">Experiencia mejorada</strong> con recomendaciones inteligentes
                    </li>
                  </ul>
                </div>

                {/* Información legal y técnica */}
                <div className="border border-gray-200 rounded p-4 space-y-3 bg-gray-50">
                  <div>
                    <p className="font-semibold text-gray-900 mb-2 text-xs">
                      Tecnologías que utilizamos:
                    </p>
                    <div className="space-y-1.5 text-xs text-gray-600">
                      <p>
                        <strong className="text-gray-900">Análisis:</strong> Microsoft Clarity y Sentry para mejorar la experiencia del sitio y detectar errores.
                      </p>
                      <p>
                        <strong className="text-gray-900">Marketing:</strong> Google Analytics, Meta (Facebook) y TikTok para mostrarte ofertas relevantes y medir el rendimiento de nuestras campañas.
                      </p>
                      <p>
                        <strong className="text-gray-900">Ubicación:</strong> Geolocalización del navegador para ofrecerte productos de tiendas cercanas.
                      </p>
                    </div>
                  </div>

                  <div className="border-l-2 border-gray-400 pl-3 py-1">
                    <p className="font-semibold text-gray-900 text-xs mb-1">
                      Protección de datos
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Cumplimos con la <strong className="text-gray-900">Ley 1581/2012 de Protección de Datos Personales de Colombia</strong>.
                      Si rechazas cookies, seguiremos recopilando datos anónimos y agregados (sin identificarte)
                      para mejorar nuestro servicio. Tus datos personales solo se procesan con tu consentimiento expreso
                      y nunca se venden a terceros.
                    </p>
                  </div>

                  <a
                    href="/soporte/politica-cookies"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-gray-900 hover:text-black underline font-medium text-xs"
                  >
                    Ver política de cookies completa →
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleReject}
              className="text-sm text-gray-700 hover:text-gray-900 font-medium px-4 py-2 rounded-lg transition-colors border border-gray-300 hover:border-gray-400 bg-white"
            >
              Rechazar
            </button>
            <button
              onClick={handleAccept}
              className="text-sm bg-black text-white hover:bg-gray-800 font-semibold rounded-lg px-6 py-2 transition-all shadow-sm hover:shadow-md"
            >
              Aceptar
            </button>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-gray-100 hidden sm:block"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
