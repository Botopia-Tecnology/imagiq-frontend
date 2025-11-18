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
                    Beneficios al aceptar cookies:
                  </p>
                  <ul className="space-y-2.5">
                    <li className="text-gray-700">
                      <strong className="text-gray-900">Ofertas personalizadas</strong> según tus productos favoritos y búsquedas
                    </li>
                    <li className="text-gray-700">
                      <strong className="text-gray-900">Descuentos exclusivos</strong> y promociones en tiendas de tu zona
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
