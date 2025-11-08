"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MessageCircle } from "lucide-react";

export default function ChatbotButton({
  onClick,
}: Readonly<{ onClick?: () => void }>) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Mostrar tooltip después de 2 segundos (menos intrusivo)
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Ocultar tooltip automáticamente después de 5 segundos
  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => setShowTooltip(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  return (
    <div
      className="fixed right-6 z-50 flex items-end gap-3"
      style={{
        bottom:
          "calc(max(1.5rem, env(safe-area-inset-bottom, 1.5rem)) + 170px)",
      }}
    >
      {/* Burbuja de mensaje mejorada */}
      {showTooltip && (
        <div className="relative bg-white shadow-xl rounded-2xl px-4 py-3 max-w-[180px] mb-1 animate-fade-in border border-gray-100">
          <p className="text-sm text-gray-800 font-medium leading-tight">
            ¿Dudas? Estoy aquí para ayudarte 👋
          </p>
          {/* Triángulo apuntando al botón */}
          <div className="absolute -right-2 bottom-4 w-0 h-0 border-t-[8px] border-t-transparent border-l-[8px] border-l-white border-b-[8px] border-b-transparent"></div>
          {/* Botón de cerrar tooltip mejorado */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="absolute -top-2 -right-2 w-5 h-5 bg-gray-700 hover:bg-gray-800 rounded-full flex items-center justify-center text-xs text-white shadow-md transition-colors"
            aria-label="Cerrar mensaje"
          >
            ×
          </button>
        </div>
      )}

      {/* Botón con foto de persona o icono de fallback */}
      <button
        onClick={onClick}
        className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-xl rounded-full transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white"
        aria-label="Abrir chat de ayuda"
        type="button"
      >
        {!imageError ? (
          <Image
            src="/images/support-agent.png"
            alt="Agente de soporte"
            width={64}
            height={64}
            className="rounded-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <MessageCircle className="w-7 h-7 text-white" />
        )}
        {/* Indicador verde de "en línea" mejorado */}
        <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
      </button>
    </div>
  );
}
