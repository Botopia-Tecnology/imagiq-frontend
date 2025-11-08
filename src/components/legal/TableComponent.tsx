/**
 * Componente de tabla accesible para documentos legales
 */

import React from "react";
import { LegalTableProps } from "./types";

export const LegalTable: React.FC<LegalTableProps> = ({
  caption,
  headers,
  rows,
  className = "",
}) => (
  <div className={`border border-gray-200 overflow-hidden ${className}`}>
    <table className="w-full">
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr className="bg-black text-white">
          {headers.map((header) => (
            <th
              key={header}
              scope="col"
              className="px-6 py-4 text-left font-semibold"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {rows.map((row, rowIndex) => {
          // Use id if provided, otherwise generate from first cell content if it's a string
          const firstCell = row.cells[0];
          const rowKey =
            row.id ||
            (typeof firstCell === "string" ? firstCell : `row-${rowIndex}`);

          return (
            <tr key={rowKey} className="hover:bg-gray-50 transition-colors">
              {row.cells.map((cell, cellIndex) => (
                <td
                  key={`${rowKey}-${cellIndex}`}
                  className={`px-6 py-4 ${
                    cellIndex === 0
                      ? "font-semibold text-black"
                      : "text-gray-700"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);
