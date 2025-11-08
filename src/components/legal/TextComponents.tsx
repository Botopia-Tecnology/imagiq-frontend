/**
 * Componentes de texto para documentos legales
 */

import React from "react";
import { LegalComponentProps, LegalHeadingProps } from "./types";

export const LegalParagraph: React.FC<LegalComponentProps> = ({
  children,
  className = "",
}) => (
  <p className={`text-gray-700 leading-relaxed mb-4 ${className}`}>
    {children}
  </p>
);

export const LegalH2: React.FC<LegalHeadingProps> = ({ children, id }) => (
  <h2 id={id} className="text-3xl font-bold text-black mb-6 tracking-tight">
    {children}
  </h2>
);

export const LegalH3: React.FC<LegalHeadingProps> = ({ children, id }) => (
  <h3 id={id} className="text-xl font-semibold text-black mb-4">
    {children}
  </h3>
);

export const LegalH4: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <h4 className="text-lg font-semibold text-black mb-3">{children}</h4>;
