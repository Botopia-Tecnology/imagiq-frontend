/**
 * @module PrivacyHeader
 * @description Header para la página de privacidad de Samsung
 */

import React from "react";
import { ArrowLeft } from "lucide-react";

interface PrivacyHeaderProps {
  onBack: () => void;
}

const PrivacyHeader: React.FC<PrivacyHeaderProps> = ({ onBack }) => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 py-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Volver"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Política de Privacidad
            </h1>
            <p className="text-sm text-gray-500">
              Samsung Electronics Colombia S.A.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyHeader;
