/**
 * @module Chapter3
 * @description Capítulo 3: Derechos de Titulares y Hábeas Data
 */

import React from "react";

const Chapter3: React.FC = () => {
  return (
    <section>
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        CAPÍTULO 3: DERECHOS DE TITULARES Y HÁBEAS DATA
      </h3>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">3.10 Derechos del Titular</h4>
          <p className="mb-3">El Derecho de Hábeas Data permite solicitar:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Acceso a datos personales</li>
            <li>Actualización de datos incompletos</li>
            <li>Rectificación de datos errados</li>
            <li>Supresión de bases de datos</li>
            <li>Revocación de autorización</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border-l-3 border-yellow-600 p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Derecho a la Tranquilidad</h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            Samsung solo contactará en horarios nocturnos o fines de semana en casos excepcionales.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">3.13 Canales Habilitados</h4>
          <div className="space-y-2">
            <div className="border border-gray-200 rounded-lg p-3">
              <p className="font-semibold text-sm mb-1">Portal de Privacidad</p>
              <a href="https://sdapla.privacy.samsung.com/privacy/co/anonymous/checkAccount.do" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                sdapla.privacy.samsung.com/privacy/co
              </a>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <p className="font-semibold text-sm mb-1">Correo Electrónico</p>
              <a href="mailto:tusdatos.co@samsung.com" className="text-xs text-blue-600 hover:underline">
                tusdatos.co@samsung.com
              </a>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <p className="font-semibold text-sm mb-1">Teléfonos</p>
              <p className="text-xs">Fijo: (1) 6001272 | Celular: #726 | Gratuita: 01 8000 112 112</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Chapter3;
