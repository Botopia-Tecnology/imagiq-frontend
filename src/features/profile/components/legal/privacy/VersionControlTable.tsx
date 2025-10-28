/**
 * @module VersionControlTable
 * @description Tabla de control de versiones de la política de privacidad
 */

import React from "react";

const VersionControlTable: React.FC = () => {
  const versions = [
    {
      version: "1",
      reviewer: "L&C Team",
      date: "2013",
      approved: "Sí",
      approvalDate: "25/06/2013",
      reason: "Versión inicial aprobada"
    },
    {
      version: "2",
      reviewer: "Lucia Hernández, L&C Team",
      date: "2018",
      approved: "Sí",
      approvalDate: "30/11/2018",
      reason: "Actualización finalidades, tratamiento, responsable, consultas/reclamos"
    },
    {
      version: "3",
      reviewer: "Laura Santos, L&C Team",
      date: "2022",
      approved: "Sí",
      approvalDate: "08/06/2022",
      reason: "Nuevas obligaciones encargados, colaboradores, cumplimiento"
    },
    {
      version: "4",
      reviewer: "Laura Santos, L&C Team",
      date: "17/08/2022",
      approved: "Sí",
      approvalDate: "01/09/2022",
      reason: "Finalidades facturación, derecho tranquilidad, transmisión/transferencia"
    }
  ];

  return (
    <div className="overflow-x-auto">
      <h4 className="text-lg font-bold text-gray-900 mb-3">Tabla de Control de Cambios</h4>
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                Versión
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                Revisado/Responsable
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                Aprobado
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                Fecha Aprobación
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                Razón
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {versions.map((v, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {v.version}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {v.reviewer}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {v.date}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {v.approved}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {v.approvalDate}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {v.reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VersionControlTable;
