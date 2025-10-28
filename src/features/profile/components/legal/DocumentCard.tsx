/**
 * @module DocumentCard
 * @description Tarjeta para mostrar un documento legal PDF
 */

import React from "react";
import { FileText, ExternalLink, Calendar } from "lucide-react";
import { LegalDocument } from "../../types/legal";

interface DocumentCardProps {
  document: LegalDocument;
  onClick: (url: string) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, onClick }) => {
  const handleClick = () => {
    onClick(document.url);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      return `${day}/${month}/${year}`;
    } catch {
      return null;
    }
  };

  const validFromDate = formatDate(document.validFrom);
  const validUntilDate = formatDate(document.validUntil);

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-black transition-all group"
    >
      <div className="flex items-start gap-3 flex-1 text-left">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-black transition-colors">
          <FileText className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1 line-clamp-2">
            {document.title}
          </h3>
          {(validFromDate || validUntilDate) && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <Calendar className="w-3 h-3" />
              {validFromDate && validUntilDate && (
                <span>
                  {validFromDate} - {validUntilDate}
                </span>
              )}
              {validFromDate && !validUntilDate && (
                <span>Desde {validFromDate}</span>
              )}
            </div>
          )}
        </div>
      </div>
      <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors flex-shrink-0" />
    </button>
  );
};

export default DocumentCard;
