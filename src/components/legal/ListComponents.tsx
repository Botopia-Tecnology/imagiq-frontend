/**
 * Componentes de listas y cards para documentos legales
 */

import React from "react";
import { LegalNumberedCardProps } from "./types";

export const LegalList: React.FC<{
  items: React.ReactNode[];
  className?: string;
}> = ({ items, className = "" }) => (
  <ul className={`space-y-3 text-gray-700 ${className}`}>
    {items.map((item, index) => {
      // Generate a stable key from content if it's a string, otherwise use index with prefix
      const itemKey =
        typeof item === "string"
          ? item.substring(0, 30).replaceAll(/\s+/g, "-")
          : `item-${index}`;

      return (
        <li key={itemKey} className="flex items-start gap-3">
          <span
            className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      );
    })}
  </ul>
);

export const LegalNumberedCard: React.FC<LegalNumberedCardProps> = ({
  number,
  title,
  children,
}) => (
  <div className="border border-gray-200 p-6">
    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold mb-4">
      {number}
    </div>
    <h3 className="text-lg font-semibold text-black mb-2">{title}</h3>
    <div className="text-gray-700 text-sm">{children}</div>
  </div>
);
