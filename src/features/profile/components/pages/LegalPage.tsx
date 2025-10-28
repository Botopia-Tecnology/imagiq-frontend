"use client";

/**
 * @module LegalPage
 * @description Página de documentación legal (Términos y Condiciones / Privacidad)
 */

import React, { useEffect, useRef } from "react";
import { ArrowLeft, FileText, Shield } from "lucide-react";

interface LegalPageProps {
  onBack: () => void;
  documentType?: string;
}

const LegalPage: React.FC<LegalPageProps> = ({
  onBack,
  documentType = "terms",
}) => {
  const pageRef = useRef<HTMLDivElement>(null);
  const title =
    documentType === "terms"
      ? "Términos y Condiciones"
      : "Política de Privacidad";
  const HeaderIcon = documentType === "terms" ? FileText : Shield;

  // Reset scroll to top when component mounts or documentType changes
  useEffect(() => {
    if (pageRef.current) {
      pageRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [documentType]);

  return (
    <div ref={pageRef} className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Volver"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <HeaderIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{title}</h1>
                <p className="text-sm text-gray-500">Samsung Colombia</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {documentType === "terms" ? (
          <>
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-900">
                <strong>Información importante:</strong> Esta sección está en
                desarrollo. Los términos y condiciones se mostrarán
                próximamente.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-xl">
              <p className="text-sm text-purple-900">
                <strong>Protección de Datos:</strong> Samsung Electronics
                Colombia S.A. se compromete con el tratamiento legal y legítimo
                de tus datos personales. A continuación encontrarás información
                detallada sobre cómo recopilamos, utilizamos y protegemos tu
                información.
              </p>
            </div>

            {/* Privacy Content */}
          </>
        )}
      </div>
    </div>
  );
};

export default LegalPage;
