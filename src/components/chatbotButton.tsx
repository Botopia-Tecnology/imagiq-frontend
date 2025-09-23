import React from "react";

export default function ChatbotButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-10 z-50 flex items-center justify-center w-16 h-16 bg-[#0a2342] hover:bg-[#143362] shadow-lg rounded-full transition-all duration-200"
      aria-label="Abrir chat de ayuda"
      type="button"
    >
      {/* Icono de mensaje grande y centrado */}
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
        <rect
          x="5"
          y="8"
          width="28"
          height="18"
          rx="6"
          fill="white"
        />
        <rect
          x="10"
          y="15"
          width="18"
          height="2.8"
          rx="1.4"
          fill="#0a2342"
        />
        <rect
          x="10"
          y="19.5"
          width="12"
          height="2.8"
          rx="1.4"
          fill="#0a2342"
        />
        {/* Triángulo de "punta" de mensaje */}
        <polygon
          points="19,26 23,30 19,28 15,30"
          fill="white"
        />
        {/* Destello arriba a la derecha */}
        <g>
          <path
            d="M32 10 l1.5 -3 l1.5 3"
            stroke="#fff"
            strokeWidth="1.2"
            fill="none"
          />
          <circle cx="34" cy="7" r="0.9" fill="#fff" />
        </g>
      </svg>
    </button>
  );
}