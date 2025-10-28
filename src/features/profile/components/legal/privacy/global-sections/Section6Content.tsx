/**
 * @module Section6Content
 * @description ¿Cuáles son sus derechos?
 */

import React from "react";

const Section6Content: React.FC = () => {
  return (
    <div className="space-y-6 text-gray-700">
      <p className="leading-relaxed">
        Dependiendo de su ubicación, puede tener ciertos derechos con respecto a su información
        personal bajo las leyes aplicables de protección de datos.
      </p>

      <section>
        <h4 className="font-semibold text-gray-900 mb-3">Sus Derechos Incluyen</h4>

        <div className="space-y-3">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-semibold text-gray-900 mb-1">Derecho de Acceso</h5>
            <p className="text-sm text-gray-700">
              Solicitar acceso a la información personal que tenemos sobre usted.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-semibold text-gray-900 mb-1">Derecho de Rectificación</h5>
            <p className="text-sm text-gray-700">
              Solicitar que corrijamos información personal inexacta o incompleta.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-semibold text-gray-900 mb-1">Derecho de Supresión</h5>
            <p className="text-sm text-gray-700">
              Solicitar que eliminemos su información personal en ciertas circunstancias.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-semibold text-gray-900 mb-1">Derecho a Limitar el Tratamiento</h5>
            <p className="text-sm text-gray-700">
              Solicitar que limitemos el procesamiento de su información personal.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-semibold text-gray-900 mb-1">Derecho de Portabilidad</h5>
            <p className="text-sm text-gray-700">
              Solicitar una copia de su información personal en un formato estructurado y
              de uso común.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-semibold text-gray-900 mb-1">Derecho de Oposición</h5>
            <p className="text-sm text-gray-700">
              Oponerse al procesamiento de su información personal para ciertos fines.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-semibold text-gray-900 mb-1">Derecho a Retirar el Consentimiento</h5>
            <p className="text-sm text-gray-700">
              Retirar su consentimiento en cualquier momento cuando el procesamiento se
              base en el consentimiento.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
        <h4 className="font-semibold text-blue-900 mb-2">Cómo Ejercer Sus Derechos</h4>
        <p className="text-sm text-blue-800 leading-relaxed mb-2">
          Para ejercer cualquiera de estos derechos, puede contactarnos a través de:
        </p>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Portal de Privacidad: <span className="font-mono">sdapla.privacy.samsung.com</span></li>
          <li>• Correo: tusdatos.co@samsung.com</li>
          <li>• Teléfono: (1) 6001272 o #726</li>
        </ul>
      </section>

      <section className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-semibold text-yellow-900 mb-2">Nota Importante</h4>
        <p className="text-sm text-yellow-800 leading-relaxed">
          Algunos derechos pueden estar sujetos a limitaciones según las leyes aplicables.
          Responderemos a su solicitud dentro de los plazos establecidos por la ley.
        </p>
      </section>
    </div>
  );
};

export default Section6Content;
