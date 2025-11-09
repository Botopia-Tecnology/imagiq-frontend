"use client";

import React, { useState, useEffect } from "react";
import { getConsent, saveConsent, initConsentAPI } from "@/lib/consent";
import { saveLocationPermission } from "@/lib/consent/location";
import { Cookie, X, ChevronDown } from "lucide-react";

/**
 * CookieConsentBar - Sistema Unificado de Consentimiento
 *
 * Barra superior para solicitar consentimiento de cookies Y ubicación
 * según las políticas de privacidad de IMAGIQ SAS (Colombia).
 *
 * Flujo unificado:
 * 1. Al ACEPTAR: Guarda cookies + ubicación, solicita geolocalización
 * 2. Al RECHAZAR: Solo guarda rechazo de cookies, NO guarda rechazo de ubicación
 * 3. Si se rechaza: El banner volverá a aparecer en futuras visitas
 *
 * Características:
 * - Aparición automática en la primera visita
 * - Persistencia en localStorage con namespace 'imagiq_consent'
 * - Categorización: Analytics (Clarity) y Marketing (GTM, Meta, TikTok)
 * - Solicitud de geolocalización integrada
 * - Animación suave de aparición/desaparición
 * - Diseño limpio y moderno
 * - Expandible para mostrar más información
 * - Expone API global: window.getConsent()
 *
 * UX optimizado para maximizar aceptación:
 * - Solo 2 botones principales: Aceptar / Rechazar
 * - CTA principal destacado (botón negro)
 * - Información expandible opcional
 */
export interface CookieConsentBarProps {
  /** Mensaje principal de la barra */
  message?: string;
  /** Enlace a la política de cookies/privacidad */
  moreInfoUrl?: string;
  /** Mostrar automáticamente si no hay consentimiento */
  autoShow?: boolean;
}

const defaultMessage = "Recomendaciones y ofertas exclusivas según tu zona.";

const CookieConsentBar: React.FC<CookieConsentBarProps> = ({
  message = defaultMessage,
  moreInfoUrl = "/soporte/politica-cookies",
  autoShow = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Inicializa API global y chequea consentimiento al montar
  useEffect(() => {
    // Inicializar API global window.getConsent()
    initConsentAPI();

    if (!autoShow) return;

    // Verificar si ya existe consentimiento
    const consent = getConsent();
    if (!consent) {
      // Pequeño delay antes de mostrar para mejor UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [autoShow]);

  // Maneja la decisión de aceptar
  const handleAccept = async () => {
    // Guardar consentimiento de cookies
    saveConsent({ analytics: true, ads: true });

    // TAMBIÉN guardar consentimiento de ubicación
    saveLocationPermission(true);

    // Solicitar ubicación del navegador
    if (typeof window !== "undefined" && navigator.geolocation) {
      try {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Guardar ubicación en localStorage
            const locationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: Date.now(),
            };
            localStorage.setItem(
              "imagiq_user_location",
              JSON.stringify(locationData)
            );
            console.debug("[Location] Obtained and saved:", locationData);
          },
          (error) => {
            console.debug(
              "[Location] Error obtaining location:",
              error.message
            );
            // Aunque falle, ya guardamos el consentimiento
          }
        );
      } catch (error) {
        console.debug("[Location] Geolocation not available");
      }
    }

    setIsVisible(false);
  };

  // Maneja la decisión de rechazar
  const handleReject = () => {
    // Solo guardar rechazo de cookies
    saveConsent({ analytics: false, ads: false });

    // NO guardar rechazo de ubicación (para volver a preguntar)
    // Limpiar cualquier rechazo previo de ubicación
    localStorage.removeItem("imagiq_location_rejected");

    setIsVisible(false);
  };

  // Cerrar sin decidir (mostrar más tarde)
  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[99999] bg-white border-b border-gray-200 shadow-md transition-all duration-500 ease-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          {/* Icon */}
          <Cookie className="h-6 w-6 text-black flex-shrink-0" />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-base font-semibold text-black">{message}</p>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-600 hover:text-black transition-colors"
                aria-label={isExpanded ? "Contraer" : "Expandir"}
              >
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {!isExpanded && (
              <p className="text-xs text-gray-600">
                ¡Actívalas y aprovecha tu experiencia al máximo!
              </p>
            )}

            {isExpanded && (
              <div className="text-xs text-gray-600 space-y-2 mt-2">
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <p className="font-medium text-gray-900">📍 Tu ubicación:</p>
                  <ul className="ml-4 space-y-0.5 mt-1">
                    <li className="flex items-start gap-1.5">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Envío gratis en productos cerca de ti</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Ofertas exclusivas de tiendas en tu zona</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Entrega el mismo día si estás cerca</span>
                    </li>
                  </ul>

                  <p className="font-medium text-gray-900 pt-2">
                    🍪 Cookies que usamos:
                  </p>

                  <div>
                    <p className="font-semibold text-gray-800">
                      Análisis (opcional):
                    </p>
                    <ul className="ml-4 space-y-0.5 mt-1">
                      <li className="flex items-start gap-1.5">
                        <span className="text-gray-600 mt-0.5">•</span>
                        <span>
                          <strong>Microsoft Clarity:</strong> Mapas de calor y
                          grabaciones de sesión
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">
                      Marketing (opcional):
                    </p>
                    <ul className="ml-4 space-y-0.5 mt-1">
                      <li className="flex items-start gap-1.5">
                        <span className="text-gray-600 mt-0.5">•</span>
                        <span>
                          <strong>Google Tag Manager:</strong> Gestión de
                          etiquetas
                        </span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-gray-600 mt-0.5">•</span>
                        <span>
                          <strong>Meta Pixel:</strong> Tracking de conversiones
                          Facebook
                        </span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-gray-600 mt-0.5">•</span>
                        <span>
                          <strong>TikTok Pixel:</strong> Tracking de
                          conversiones TikTok
                        </span>
                      </li>
                    </ul>
                  </div>

                  <p className="text-gray-500 italic pt-1">
                    Las cookies necesarias (sesión, carrito) siempre están
                    activas.
                  </p>
                </div>

                {moreInfoUrl && (
                  <a
                    href={moreInfoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline font-medium"
                  >
                    Ver política de cookies completa
                    <svg
                      width="12"
                      height="12"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z" />
                      <path d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z" />
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={handleReject}
              className="text-sm text-gray-600 hover:text-black px-4 py-2 rounded transition-colors"
            >
              Rechazar
            </button>
            <button
              onClick={handleAccept}
              className="text-sm bg-black text-white hover:bg-gray-800 font-semibold rounded-lg px-6 py-2 transition-colors"
            >
              Aceptar
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
};

export default CookieConsentBar;
