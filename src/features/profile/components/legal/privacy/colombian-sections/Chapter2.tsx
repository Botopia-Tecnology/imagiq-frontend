/**
 * @module Chapter2
 * @description Capítulo 2: Tratamiento de Información Personal
 */

import React from "react";

const Chapter2: React.FC = () => {
  return (
    <section>
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        CAPÍTULO 2: TRATAMIENTO DE INFORMACIÓN PERSONAL
      </h3>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">
            2.2 Finalidades de Recolección de Información
          </h4>

          <div className="space-y-4">
            <div className="border-l-2 border-gray-300 pl-4">
              <h5 className="font-semibold text-gray-900 mb-2">
                Recurso Humano
              </h5>
              <p className="text-sm text-gray-700 leading-relaxed">
                Gestión de nómina, formación y capacitación, seguridad y salud en el trabajo,
                selección de personal, evaluación de desempeño.
              </p>
            </div>

            <div className="border-l-2 border-gray-300 pl-4">
              <h5 className="font-semibold text-gray-900 mb-2">
                Usuarios Finales
              </h5>
              <p className="text-sm text-gray-700 leading-relaxed">
                Facturación y entrega de productos, servicios post-venta, garantías, marketing
                y publicidad, eventos de la marca.
              </p>
            </div>

            <div className="border-l-2 border-gray-300 pl-4">
              <h5 className="font-semibold text-gray-900 mb-2">
                Finalidades Comunes
              </h5>
              <p className="text-sm text-gray-700 leading-relaxed">
                Cumplimiento de contratos, prevención de fraude y lavado de activos, seguridad
                mediante CCTV, gestión de PQR.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-2">2.3 Tipos de Datos Recolectados</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              "Datos de identificación",
              "Datos biométricos",
              "Datos de ubicación",
              "Datos de salud",
              "Datos financieros",
              "Datos socioeconómicos",
              "Datos educativos",
              "Antecedentes judiciales"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-black rounded-full" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-2">2.7.1 Autorización para Menores de Edad</h4>
          <p className="leading-relaxed text-sm">
            Samsung puede recolectar datos de niños, niñas y adolescentes cuando representantes
            legales autorizan para actividades pedagógicas, visitas a centros de servicio o
            compra de productos. Se respetan principios de libertad y finalidad.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Chapter2;
