/**
 * @module LegalSection
 * @description Legal information section for profile page - Samsung style
 */

import React from "react";
import { FileText, Shield, Info, Database } from "lucide-react";
import MenuItem from "./MenuItem";

interface LegalSectionProps {
  onTermsClick: () => void;
  onPrivacyClick: () => void;
  onRelevantInfoClick: () => void;
  onDataProcessingClick: () => void;
}

export const LegalSection: React.FC<LegalSectionProps> = ({
  onTermsClick,
  onPrivacyClick,
  onRelevantInfoClick,
  onDataProcessingClick,
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 px-2">
        Más Información
      </h2>
      <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden">
        <MenuItem
          icon={FileText}
          label="Términos y Condiciones"
          onClick={onTermsClick}
        />
        <MenuItem
          icon={Shield}
          label="Política de Privacidad"
          onClick={onPrivacyClick}
        />
        <MenuItem
          icon={Info}
          label="Información Relevante"
          onClick={onRelevantInfoClick}
        />
        <MenuItem
          icon={Database}
          label="Autorización para Tratamiento de Datos"
          onClick={onDataProcessingClick}
        />
      </div>
    </div>
  );
};

LegalSection.displayName = "LegalSection";

export default LegalSection;
