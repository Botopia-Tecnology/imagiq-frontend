/**
 * Componentes de información de contacto y footer para documentos legales
 */

import React from "react";
import { LegalContactItem, LegalDocumentFooterProps } from "./types";

export const LegalContactInfo: React.FC<{ items: LegalContactItem[] }> = ({
  items,
}) => (
  <div className="space-y-3">
    {items.map((item) => (
      <div key={item.label} className="flex items-start">
        <span className="font-semibold text-gray-900 min-w-[140px]">
          {item.label}:
        </span>
        <span className="text-gray-700">{item.value}</span>
      </div>
    ))}
  </div>
);

export const LegalDocumentFooter: React.FC<LegalDocumentFooterProps> = ({
  code,
  version,
  date,
}) => (
  <div className="bg-black text-white p-8 text-center">
    <p className="font-semibold text-lg mb-1">IMAGIQ S.A.S.</p>
    <p className="text-gray-300">NIT 900.565.091-1</p>
    <p className="text-gray-300">
      Calle 98 #8-28 Of 204, Bogotá D.C., Colombia
    </p>
    {(code || version || date) && (
      <div className="text-gray-300 mt-4">
        {code && <p>Código: {code}</p>}
        {version && <p>Versión: {version}</p>}
        {date && <p>Fecha: {date}</p>}
      </div>
    )}
  </div>
);
