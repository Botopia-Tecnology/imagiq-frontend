/**
 * @module Section8Content
 * @description ¿Qué servicios usamos de terceros?
 */

import React from "react";

const Section8Content: React.FC = () => {
  return (
    <div className="space-y-6 text-gray-700">
      <p className="leading-relaxed">
        Nuestros servicios pueden contener enlaces a sitios web, productos y servicios de
        terceros. También podemos usar o ofrecer productos o servicios de terceros.
      </p>

      <section>
        <h4 className="font-semibold text-gray-900 mb-3">Servicios de Terceros</h4>
        <p className="leading-relaxed mb-2">
          Algunos servicios de terceros comúnmente integrados incluyen:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Redes sociales (Facebook, Twitter, Instagram)</li>
          <li>Servicios de mapas y ubicación</li>
          <li>Servicios de pago y procesamiento de transacciones</li>
          <li>Servicios de almacenamiento en la nube</li>
          <li>Servicios de análisis y publicidad</li>
          <li>Aplicaciones y contenido de desarrolladores externos</li>
        </ul>
      </section>

      <section className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
        <h4 className="font-semibold text-yellow-900 mb-2">Privacidad de Terceros</h4>
        <p className="text-sm text-yellow-800 leading-relaxed">
          La información recopilada por terceros está sujeta a sus propias políticas de
          privacidad, no a esta Política de Privacidad de Samsung. No somos responsables
          de las prácticas de privacidad de terceros.
        </p>
      </section>

      <section className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Su Responsabilidad</h4>
        <p className="text-sm text-blue-800 leading-relaxed">
          Le recomendamos revisar las políticas de privacidad de cualquier servicio de terceros
          antes de proporcionar su información personal. Samsung no es responsable de las
          prácticas de privacidad de terceros.
        </p>
      </section>

      <section>
        <h4 className="font-semibold text-gray-900 mb-3">Aplicaciones de la Galaxy Store</h4>
        <p className="leading-relaxed">
          Las aplicaciones disponibles en Galaxy Store son desarrolladas por Samsung o por
          terceros. Cada aplicación tiene su propia política de privacidad que describe cómo
          la aplicación recopila y usa su información. Por favor, revise la política de
          privacidad de cada aplicación antes de descargarla o usarla.
        </p>
      </section>
    </div>
  );
};

export default Section8Content;
