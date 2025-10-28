/**
 * @module Section5Content
 * @description ¿A dónde enviamos sus datos?
 */

import React from "react";

const Section5Content: React.FC = () => {
  return (
    <div className="space-y-6 text-gray-700">
      <p className="leading-relaxed">
        Samsung es una empresa global. Su información personal puede ser almacenada y procesada
        en cualquier país donde tengamos instalaciones o donde contratemos proveedores de
        servicios.
      </p>

      <section>
        <h4 className="font-semibold text-gray-900 mb-3">Transferencias Internacionales</h4>
        <p className="leading-relaxed mb-2">
          Al utilizar nuestros productos y servicios, usted reconoce que su información puede
          ser transferida a países fuera de su país de residencia, incluyendo:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Corea del Sur (sede global de Samsung Electronics)</li>
          <li>Estados Unidos</li>
          <li>Países de la Unión Europea</li>
          <li>Otros países donde Samsung opera</li>
        </ul>
      </section>

      <section className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Protecciones para Transferencias</h4>
        <p className="text-sm text-blue-800 leading-relaxed">
          Cuando transferimos información personal a otros países, implementamos salvaguardas
          apropiadas, incluyendo cláusulas contractuales estándar, certificaciones y otros
          mecanismos de transferencia aprobados para proteger su información de acuerdo con
          esta Política de Privacidad.
        </p>
      </section>

      <section className="bg-purple-50 p-4 rounded-lg">
        <h4 className="font-semibold text-purple-900 mb-2">Países con Nivel Adecuado</h4>
        <p className="text-sm text-purple-800 leading-relaxed">
          Samsung solo realiza transferencias internacionales a países que cuentan con niveles
          adecuados de protección de datos según las autoridades competentes, o mediante
          mecanismos que garanticen el mismo nivel de protección.
        </p>
      </section>
    </div>
  );
};

export default Section5Content;
