/**
 * @module Chapter45
 * @description Capítulos 4 y 5: Transmisiones/Transferencias y Disposiciones Finales
 */

import React from "react";

const Chapter45: React.FC = () => {
  return (
    <>
      <section>
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          CAPÍTULO 4: TRANSMISIONES Y TRANSFERENCIAS DE DATOS
        </h3>
        <div className="space-y-4">
          <div className="border-l-2 border-gray-300 pl-4">
            <h5 className="font-semibold text-gray-900 mb-2">Transmisión Nacional</h5>
            <p className="text-sm text-gray-700 leading-relaxed">
              Los datos pueden ser transmitidos a terceros con relación contractual a nivel nacional.
            </p>
          </div>
          <div className="border-l-2 border-gray-300 pl-4">
            <h5 className="font-semibold text-gray-900 mb-2">Transferencias Internacionales</h5>
            <p className="text-sm text-gray-700 leading-relaxed">
              Samsung realiza transferencias solo a países con niveles adecuados de protección.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          CAPÍTULO 5: DISPOSICIONES FINALES
        </h3>
        <p className="leading-relaxed">
          El Comité de Protección de Datos Personales responde consultas y reclamos. Vela por
          cumplimiento del Programa Integral de Datos Personales según Manual Interno.
        </p>
        <div className="mt-4 bg-gray-50 border border-gray-200 p-4">
          <p className="text-sm text-gray-900">
            <strong>Representante Legal:</strong> Steve JY Son
          </p>
          <p className="text-sm text-gray-900 mt-1">
            <strong>Última actualización:</strong> 1 de septiembre de 2022
          </p>
        </div>
      </section>
    </>
  );
};

export default Chapter45;
