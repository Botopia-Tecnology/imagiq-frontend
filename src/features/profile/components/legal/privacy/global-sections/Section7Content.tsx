/**
 * @module Section7Content
 * @description ¿Cuánto tiempo mantenemos sus informaciones?
 */

import React from "react";

const Section7Content: React.FC = () => {
  return (
    <div className="space-y-6 text-gray-700">
      <p className="leading-relaxed">
        Conservamos su información personal durante el tiempo necesario para cumplir con los
        propósitos para los cuales fue recopilada, incluidos los requisitos legales, contables
        o de informes.
      </p>

      <section>
        <h4 className="font-semibold text-gray-900 mb-3">Criterios de Retención</h4>
        <p className="leading-relaxed mb-2">
          El período de retención depende de varios factores, incluyendo:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>La naturaleza y categoría de la información</li>
          <li>El propósito para el cual se recopiló</li>
          <li>Requisitos legales y regulatorios aplicables</li>
          <li>Necesidades comerciales legítimas</li>
          <li>Plazos de prescripción legal</li>
        </ul>
      </section>

      <section className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Información de Cuenta</h4>
        <p className="text-sm text-blue-800 leading-relaxed">
          Mantenemos la información de su cuenta Samsung mientras su cuenta permanezca activa
          o según sea necesario para proporcionarle servicios. Si solicita eliminar su cuenta,
          eliminaremos o anonimizaremos su información personal, sujeto a requisitos legales
          de retención.
        </p>
      </section>

      <section className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-semibold text-green-900 mb-2">Información de Garantía y Servicio</h4>
        <p className="text-sm text-green-800 leading-relaxed">
          Conservamos información relacionada con garantías, reparaciones y servicio técnico
          durante el período de garantía y períodos adicionales requeridos por ley.
        </p>
      </section>

      <section className="bg-purple-50 p-4 rounded-lg">
        <h4 className="font-semibold text-purple-900 mb-2">Datos de Auditoría y Cumplimiento</h4>
        <p className="text-sm text-purple-800 leading-relaxed">
          Cierta información puede conservarse por períodos más largos cuando sea necesario
          para auditorías, cumplimiento legal, prevención de fraude o resolución de disputas.
        </p>
      </section>

      <section className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
        <h4 className="font-semibold text-yellow-900 mb-2">Eliminación Segura</h4>
        <p className="text-sm text-yellow-800 leading-relaxed">
          Cuando ya no necesitemos su información personal, la eliminaremos o anonimizaremos
          de manera segura utilizando métodos que impidan la recuperación o reconstrucción
          de la información.
        </p>
      </section>
    </div>
  );
};

export default Section7Content;
