/**
 * @module LegalSection
 * @description Sección de información legal del perfil
 */

import React from "react";
import { FileText, Shield, ChevronRight } from "lucide-react";

interface LegalSectionProps {
  onTermsClick: () => void;
  onPrivacyClick: () => void;
}

const LegalSection: React.FC<LegalSectionProps> = ({
  onTermsClick,
  onPrivacyClick,
}) => {
  return (
    <div className="py-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Documentación Legal
      </h2>
      <div className="space-y-2">
        {/* Términos y Condiciones */}
        <button
          onClick={onTermsClick}
          className="w-full flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-black transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-black transition-colors">
              <FileText className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
            </div>
            <div className="text-left">
              <span className="font-semibold text-gray-900 block">
                Términos y Condiciones
              </span>
              <span className="text-xs text-gray-500">
                Promociones, productos y servicios
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
        </button>

        {/* Política de Privacidad */}
        <button
          onClick={onPrivacyClick}
          className="w-full flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-black transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-black transition-colors">
              <Shield className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
            </div>
            <div className="text-left">
              <span className="font-semibold text-gray-900 block">
                Política de Privacidad
              </span>
              <span className="text-xs text-gray-500">
                Protección de datos personales
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
        </button>
      </div>
    </div>
  );
};

export default LegalSection;
