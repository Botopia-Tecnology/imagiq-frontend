/**
 * @module CategorySection
 * @description Sección de categoría para agrupar documentos legales
 */

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { DocumentCategory } from "../../types/legal";
import DocumentCard from "./DocumentCard";

interface CategorySectionProps {
  category: DocumentCategory;
  onDocumentClick: (url: string) => void;
  defaultExpanded?: boolean;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  onDocumentClick,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const IconComponent = category.icon;

  return (
    <div className="mb-6">
      <button
        onClick={toggleExpanded}
        className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:bg-black transition-colors">
            <IconComponent className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-gray-900">{category.name}</h3>
            <p className="text-sm text-gray-500">
              {category.documents.length}{" "}
              {category.documents.length === 1 ? "documento" : "documentos"}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-600 group-hover:text-black transition-colors" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600 group-hover:text-black transition-colors" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-2">
          <div className="bg-white rounded-xl p-2">
            <div className="flex flex-col gap-2">
              {category.documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onClick={onDocumentClick}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySection;
