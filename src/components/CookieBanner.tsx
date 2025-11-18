"use client";

import React, { useState, useEffect } from "react";
import { Cookie, X, ChevronDown } from "lucide-react";

/**
 * CookieBanner - Sistema de Consentimiento de Cookies SIMPLIFICADO
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
 */

const STORAGE_KEY = "imagiq_consent";
const CONSENT_VERSION = "2.0";

interface ConsentState {
  analytics: boolean;  // Clarity, Sentry
  marketing: boolean;  // GTM, Meta Pixel, TikTok Pixel
  timestamp: number;
  version: string;
}

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Montar componente
  useEffect(() => {
    setMounted(true);
    console.log("🍪 [CookieBanner] Component mounted");
  }, []);

  // Verificar si debe mostrarse
  useEffect(() => {
    if (!mounted) return;
    if (typeof window === "undefined") return;

    console.log("🍪 [CookieBanner] Checking if should show...");

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      console.log("🍪 [CookieBanner] localStorage value:", stored);

      if (!stored) {
        console.log("🍪 [CookieBanner] ✅ No consent found - WILL SHOW BANNER");
        // Mostrar banner inmediatamente (sin delay)
        setShow(true);
      } else {
        const parsed = JSON.parse(stored) as ConsentState;
        console.log("🍪 [CookieBanner] ❌ Consent exists:", parsed);
        setShow(false);
      }
    } catch (error) {
      console.error("🍪 [CookieBanner] Error reading consent:", error);
      // En caso de error, mostrar banner
      setShow(true);
    }
  }, [mounted]);

  const saveConsent = (analytics: boolean, marketing: boolean) => {
    const consent: ConsentState = {
      analytics,
      marketing,
      timestamp: Date.now(),
      version: CONSENT_VERSION,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    console.log("🍪 [CookieBanner] Consent saved:", consent);

    // Disparar evento para que los scripts reaccionen
    window.dispatchEvent(
      new CustomEvent("consentChange", { detail: consent })
    );

    // Forzar reload para que los scripts se carguen
    setTimeout(() => {
      console.log("🍪 [CookieBanner] Reloading page to apply consent...");
      window.location.reload();
    }, 500);
  };

  const handleAccept = () => {
    console.log("🍪 [CookieBanner] User ACCEPTED");
    saveConsent(true, true);
    setShow(false);
  };

  const handleReject = () => {
    console.log("🍪 [CookieBanner] User REJECTED");
    saveConsent(false, false);
    setShow(false);
  };

  const handleClose = () => {
    console.log("🍪 [CookieBanner] User CLOSED (will show again later)");
    setShow(false);
  };

  // No renderizar hasta que esté montado y deba mostrarse
  if (!mounted || !show) {
    return null;
  }

  console.log("🍪 [CookieBanner] RENDERING BANNER");

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
              <p className="text-base font-bold text-black">
                🎁 ¡Desbloquea ofertas exclusivas y beneficios únicos!
              </p>
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
              <p className="text-sm text-gray-700 font-medium">
                ✨ Acepta cookies y recibe{" "}
                <span className="text-blue-600 font-bold">promociones personalizadas</span>,{" "}
                <span className="text-green-600 font-bold">descuentos especiales</span> y{" "}
                <span className="text-purple-600 font-bold">acceso anticipado</span> a lanzamientos Samsung.
              </p>
            )}

            {expanded && (
              <div className="text-sm space-y-3 mt-3">
                {/* Beneficios de aceptar */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                  <p className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-xl">🎯</span>
                    ¿Qué ganas al aceptar?
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-gray-700">
                        <strong className="text-blue-600">Ofertas personalizadas</strong> según tus productos favoritos
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-gray-700">
                        <strong className="text-purple-600">Descuentos exclusivos</strong> solo para ti
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-gray-700">
                        <strong className="text-green-600">Acceso anticipado</strong> a nuevos Galaxy y promociones limitadas
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-gray-700">
                        <strong className="text-orange-600">Recomendaciones inteligentes</strong> de productos Samsung
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Cookies técnicas */}
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <p className="font-semibold text-gray-900 text-xs">
                    🍪 Tecnologías que usamos:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="bg-white rounded p-2 border border-gray-200">
                      <p className="font-semibold text-gray-800">📊 Análisis</p>
                      <p className="text-gray-600 text-xs mt-1">
                        Microsoft Clarity, Sentry - Mejoran la experiencia del sitio
                      </p>
                    </div>
                    <div className="bg-white rounded p-2 border border-gray-200">
                      <p className="font-semibold text-gray-800">📢 Marketing</p>
                      <p className="text-gray-600 text-xs mt-1">
                        Google Tag Manager, Meta, TikTok - Ofertas personalizadas
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded p-2 mt-2">
                    <p className="font-semibold text-blue-900 text-xs flex items-center gap-1">
                      <span>🔒</span> Tu privacidad es importante
                    </p>
                    <p className="text-xs text-blue-800 mt-1">
                      Aunque rechaces cookies, seguiremos mejorando el sitio con datos anónimos (sin identificarte).
                      Cumplimos con la <strong>Ley 1581/2012 de Colombia</strong>.
                    </p>
                  </div>

                  <a
                    href="/soporte/politica-cookies"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline font-semibold text-xs mt-2"
                  >
                    📖 Ver política de cookies completa →
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={handleReject}
              className="text-sm text-gray-600 hover:text-black px-4 py-2 rounded transition-colors border border-gray-300"
            >
              Rechazar
            </button>
            <button
              onClick={handleAccept}
              className="text-sm bg-black text-white hover:bg-gray-800 font-semibold rounded-lg px-6 py-2 transition-colors"
            >
              Aceptar Todo
            </button>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-black transition-colors p-1.5 rounded hover:bg-gray-100"
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
