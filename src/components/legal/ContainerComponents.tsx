/**
 * Componentes de contenedores para documentos legales
 */

import React from "react";
import {
  LegalComponentProps,
  LegalWarningProps,
  LegalHighlightProps,
} from "./types";

export const LegalInfoCard: React.FC<LegalComponentProps> = ({
  children,
  className = "",
}) => (
  <div className={`bg-gray-50 border border-gray-200 p-6 ${className}`}>
    {children}
  </div>
);

export const LegalWarning: React.FC<LegalWarningProps> = ({
  title,
  children,
}) => (
  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
    <div className="flex gap-3">
      <span className="text-yellow-600 font-bold text-lg" aria-hidden="true">
        ⚠
      </span>
      <div>
        {title && <p className="font-semibold text-yellow-900 mb-1">{title}</p>}
        <div className="text-yellow-800">{children}</div>
      </div>
    </div>
  </div>
);

export const LegalHighlight: React.FC<LegalHighlightProps> = ({
  children,
  variant = "gray",
}) => (
  <div
    className={`border-l-4 p-6 ${
      variant === "yellow"
        ? "border-yellow-500 bg-yellow-50"
        : "border-gray-400 bg-gray-50"
    }`}
  >
    <div className="text-gray-800">{children}</div>
  </div>
);
