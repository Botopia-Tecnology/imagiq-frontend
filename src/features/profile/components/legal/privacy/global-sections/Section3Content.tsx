/**
 * @module Section3Content
 * @description ¿Con quién compartimos sus informaciones?
 */

import React from "react";

const Section3Content: React.FC = () => {
  return (
    <div className="space-y-6 text-gray-700">
      <p className="leading-relaxed">
        Samsung puede compartir su información con terceros en las siguientes circunstancias:
      </p>

      <section>
        <h4 className="font-semibold text-gray-900 mb-3">Afiliadas y Subsidiarias</h4>
        <p className="leading-relaxed">
          Compartimos información con empresas afiliadas de Samsung y subsidiarias controladas
          por Samsung Electronics Co., Ltd. para proporcionar servicios integrados y mejorar
          productos.
        </p>
      </section>

      <section>
        <h4 className="font-semibold text-gray-900 mb-3">Proveedores de Servicios</h4>
        <p className="leading-relaxed mb-2">
          Compartimos información con proveedores de servicios de confianza que trabajan en
          nuestro nombre, incluyendo:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Procesamiento de pagos</li>
          <li>Cumplimiento de pedidos y envío</li>
          <li>Análisis de datos</li>
          <li>Servicios de marketing</li>
          <li>Atención al cliente</li>
          <li>Hosting de servidores</li>
        </ul>
      </section>

      <section>
        <h4 className="font-semibold text-gray-900 mb-3">Otros Terceros</h4>
        <p className="leading-relaxed mb-2">
          También podemos compartir información con:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Proveedores de contenido y aplicaciones de terceros</li>
          <li>Redes de publicidad y socios de marketing</li>
          <li>Redes sociales (con su consentimiento)</li>
          <li>Compañías de seguros y garantías extendidas</li>
        </ul>
      </section>

      <section>
        <h4 className="font-semibold text-gray-900 mb-3">Requerimientos Legales</h4>
        <p className="leading-relaxed mb-2">
          Podemos divulgar información personal cuando sea necesario para:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Cumplir con la ley o responder a procesos legales</li>
          <li>Proteger los derechos, propiedad o seguridad de Samsung</li>
          <li>Proteger a nuestros clientes o al público</li>
          <li>Prevenir o detener actividades ilegales o poco éticas</li>
        </ul>
      </section>

      <section>
        <h4 className="font-semibold text-gray-900 mb-3">Transacciones Corporativas</h4>
        <p className="leading-relaxed">
          En caso de fusión, venta de activos de la empresa, financiamiento o adquisición de
          todo o parte de nuestro negocio por otra compañía, podemos compartir información
          personal con dicha compañía.
        </p>
      </section>

      <section className="bg-gray-50 border border-gray-200 p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Con Su Consentimiento</h4>
        <p className="text-sm text-gray-700 leading-relaxed">
          También podemos divulgar información personal con su consentimiento expreso o bajo
          su dirección.
        </p>
      </section>

      <section className="bg-gray-50 border border-gray-200 p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Información Agregada y Anonimizada</h4>
        <p className="text-sm text-gray-700 leading-relaxed">
          Podemos compartir información agregada o anonimizada que no lo identifique
          personalmente con terceros para investigación, marketing, análisis y otros propósitos.
        </p>
      </section>
    </div>
  );
};

export default Section3Content;
