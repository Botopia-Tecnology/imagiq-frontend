"use client";
import React, { useState } from "react";
import Image from "next/image";

export default function ChatbotButton({ onClick }: { onClick?: () => void }) {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-32 right-10 z-50 flex items-end gap-2">
      {/* Burbuja de mensaje */}
      {showTooltip && (
        <div className="relative bg-white shadow-lg rounded-xl px-3 py-2 max-w-[160px] mb-1 animate-fade-in">
          <p className="text-xs text-[#222] font-medium">
            ¿Dudas? Estoy para ayudarte
          </p>
          {/* Triángulo apuntando al botón */}
          <div className="absolute -right-1.5 bottom-3 w-0 h-0 border-t-6 border-t-transparent border-l-6 border-l-white border-b-6 border-b-transparent"></div>
          {/* Botón de cerrar tooltip */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-600"
            aria-label="Cerrar mensaje"
          >
            ×
          </button>
        </div>
      )}

      {/* Botón con foto de persona */}
      <button
        onClick={onClick}
        className="relative flex items-center justify-center w-14 h-14 bg-white hover:bg-gray-50 shadow-lg rounded-full transition-all duration-200 border-2 border-[#0a2342]"
        aria-label="Abrir chat de ayuda"
        type="button"
      >
        <Image
          src="/images/support-agent.png"
          alt="Agente de soporte"
          width={56}
          height={56}
          className="rounded-full object-cover"
        />
        {/* Indicador verde de "en línea" */}
        <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
      </button>
    </div>
  );
}