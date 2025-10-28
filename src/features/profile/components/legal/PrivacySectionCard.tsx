/**
 * @module PrivacySectionCard
 * @description Tarjeta de sección de privacidad con contenido colapsable
 */

import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface PrivacySectionCardProps {
  title: string;
  icon: React.ElementType;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const PrivacySectionCard: React.FC<PrivacySectionCardProps> = ({
  title,
  icon: Icon,
  isExpanded,
  onToggle,
  children,
}) => {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-gray-700" />
          </div>
          <h3 className="font-bold text-gray-900 text-left">{title}</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
};

export default PrivacySectionCard;
