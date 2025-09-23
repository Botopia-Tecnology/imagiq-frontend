import React, { useState, useEffect, useRef, KeyboardEvent } from "react";

/**
 * CookieConsentBar
 * Barra inferior para solicitar consentimiento de cookies.
 * - Aparición automática en la primera visita.
 * - Persistencia en localStorage.
 * - Animación suave de aparición/desaparición.
 * - Accesibilidad y responsive con TailwindCSS.
 */
export interface CookieConsentBarProps {
  /** Mensaje principal de la barra */
  message?: string;
  /** Enlace a la política de cookies/privacidad */
  moreInfoUrl?: string;
}

const LOCAL_STORAGE_KEY = "userConsent";
export type ConsentStatus = "accepted" | "rejected";

const defaultMessage =
  "Utilizamos cookies para mejorar tu experiencia. Puedes aceptar o rechazar el uso de cookies. Más información en nuestra política.";

const CookieConsentBar: React.FC<CookieConsentBarProps> = ({
  message = defaultMessage,
  moreInfoUrl,
}) => {
  const [visible, setVisible] = useState(true); // Mostrar siempre al cargar
  const [animatingOut, setAnimatingOut] = useState(false);
  const [justAccepted, setJustAccepted] = useState<ConsentStatus | null>(null);
  const barRef = useRef<HTMLDialogElement>(null);

  // Eliminar verificación de localStorage para mostrar siempre

  const handleConsent = (status: ConsentStatus) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, status);
    setJustAccepted(status);
    setAnimatingOut(true);
    setTimeout(() => setVisible(false), 400); // Espera la animación
  };

  useEffect(() => {
    if (visible && barRef.current) {
      barRef.current.focus();
    }
  }, [visible]);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Escape") {
      setAnimatingOut(true);
      setTimeout(() => setVisible(false), 400);
    }
  };

  const borderClass =
    justAccepted === "accepted"
      ? "border-t-4 border-green-500"
      : justAccepted === "rejected"
      ? "border-t-4 border-red-500"
      : "";

  if (!visible) return null;

  return (
    <dialog
      ref={barRef}
      aria-label="Consentimiento de cookies"
      role="alertdialog"
      aria-modal="true"
      tabIndex={-1}
      className={`fixed bottom-0 left-0 w-full z-[99] md:z-50 px-4 py-6 md:px-3 md:py-4 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-3 shadow-lg
        bg-black/80 backdrop-blur-sm text-white
        transition-all duration-400 ease-in-out
        ${
          animatingOut
            ? "translate-y-full opacity-0"
            : "translate-y-0 opacity-100 animate-fade-in"
        }
        ${borderClass}
      `}
      style={{ outline: "none" }}
      open
    >
      <span
        className="w-full md:flex-1 text-center md:text-left text-base md:text-base font-medium flex flex-col md:flex-row items-center gap-4 md:gap-2"
        id="cookie-consent-message"
      >
        <span className="flex justify-center md:justify-start w-full md:w-auto mb-3 md:mb-0">
          <svg
            width="22"
            height="22"
            fill="currentColor"
            className="inline-block text-yellow-300"
            aria-hidden="true"
          >
            <circle
              cx="11"
              cy="11"
              r="10"
              stroke="white"
              strokeWidth="2"
              fill="yellow"
            />
          </svg>
        </span>
        <span className="w-full md:w-auto leading-relaxed">
          {message}
          {moreInfoUrl && (
            <a
              href={moreInfoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block md:inline underline ml-0 md:ml-2 mt-3 md:mt-0 text-blue-300 hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Más información sobre cookies y privacidad"
            >
              Más información
            </a>
          )}
        </span>
      </span>
      <div className="w-full md:w-auto flex flex-col md:flex-row gap-3 md:gap-2 mt-3 md:mt-0 items-center">
        <button
          type="button"
          className="w-full md:w-auto px-6 py-3 md:px-4 md:py-2 rounded bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition font-semibold text-base flex items-center justify-center gap-2"
          aria-label="Aceptar cookies"
          onClick={() => handleConsent("accepted")}
          onKeyDown={handleKeyDown}
        >
          <svg
            width="18"
            height="18"
            fill="currentColor"
            className="inline-block text-white"
            aria-hidden="true"
          >
            <path
              d="M6 10l3 3 6-6"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          Aceptar
        </button>
        <button
          type="button"
          className="w-full md:w-auto px-6 py-3 md:px-4 md:py-2 rounded bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition font-semibold text-base flex items-center justify-center gap-2"
          aria-label="Rechazar cookies"
          onClick={() => handleConsent("rejected")}
        >
          <svg
            width="18"
            height="18"
            fill="currentColor"
            className="inline-block text-white"
            aria-hidden="true"
          >
            <path
              d="M6 6l6 6M6 12L12 6"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          Rechazar
        </button>
      </div>
    </dialog>
  );
};

export default CookieConsentBar;