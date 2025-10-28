/**
 * @module IntroSection
 * @description Sección de introducción de la política de privacidad
 */

import React from "react";

const IntroSection: React.FC = () => {
  return (
    <div className="space-y-4">
      <p className="text-gray-700 leading-relaxed">
        Samsung Electronics Colombia S.A. se compromete con el tratamiento legal
        y legítimo de datos personales, asegurando confidencialidad, integridad
        y disponibilidad conforme a la normativa colombiana de protección de
        datos.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <h4 className="font-semibold text-blue-900 mb-2">
          Responsable del Tratamiento
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            <strong>Empresa:</strong> Samsung Electronics Colombia S.A.
          </li>
          <li>
            <strong>NIT:</strong> 830.028.931-5
          </li>
          <li>
            <strong>Domicilio:</strong> Carrera 7 No. 113-43 Of. 607, Torre
            Samsung, Bogotá
          </li>
          <li>
            <strong>Teléfono:</strong> (1) 4870707
          </li>
          <li>
            <strong>Correo:</strong> tusdatos.co@samsung.com
          </li>
        </ul>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">
          Cumplimiento Normativo
        </h4>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li>Artículos 15 y 20 de la Constitución Política</li>
          <li>Ley 1581 de 2012</li>
          <li>Capítulo 25 del Decreto 1074 de 2015</li>
          <li>
            Disposiciones de la Superintendencia de Industria y Comercio
          </li>
        </ul>
      </div>
    </div>
  );
};

export default IntroSection;
