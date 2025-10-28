/**
 * @module Section9Content
 * @description Cookies, beacons y tecnologías similares
 */

import React from "react";

const Section9Content: React.FC = () => {
  return (
    <div className="space-y-6 text-gray-700">
      <p className="leading-relaxed">
        Samsung y nuestros socios utilizamos cookies, píxeles, web beacons y otras tecnologías
        similares para operar y mejorar nuestros sitios web y servicios, así como para
        publicidad.
      </p>

      <section>
        <h4 className="font-semibold text-gray-900 mb-3">¿Qué son las Cookies?</h4>
        <p className="leading-relaxed">
          Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando
          visita un sitio web. Permiten que el sitio web reconozca su dispositivo y recuerde
          información sobre su visita.
        </p>
      </section>

      <section>
        <h4 className="font-semibold text-gray-900 mb-3">Tipos de Cookies que Usamos</h4>

        <div className="space-y-3">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-semibold text-blue-900 mb-1">Cookies Esenciales</h5>
            <p className="text-sm text-blue-800">
              Necesarias para que el sitio web funcione correctamente. No pueden desactivarse
              en nuestros sistemas.
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h5 className="font-semibold text-green-900 mb-1">Cookies de Rendimiento</h5>
            <p className="text-sm text-green-800">
              Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web
              recopilando y reportando información de manera anónima.
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h5 className="font-semibold text-purple-900 mb-1">Cookies Funcionales</h5>
            <p className="text-sm text-purple-800">
              Permiten que el sitio web proporcione funcionalidad mejorada y personalización.
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h5 className="font-semibold text-yellow-900 mb-1">Cookies de Publicidad</h5>
            <p className="text-sm text-yellow-800">
              Se utilizan para mostrar anuncios relevantes para usted y sus intereses.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h4 className="font-semibold text-gray-900 mb-3">Otras Tecnologías</h4>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>
            <strong>Web Beacons:</strong> Pequeñas imágenes gráficas que nos permiten rastrear
            si ha visitado una página web particular o abierto un correo electrónico.
          </li>
          <li>
            <strong>Píxeles:</strong> Código incrustado en un sitio web o correo electrónico
            que permite rastrear actividad.
          </li>
          <li>
            <strong>SDK (Software Development Kits):</strong> Código de terceros integrado en
            aplicaciones para recopilar información.
          </li>
        </ul>
      </section>

      <section className="bg-indigo-50 p-4 rounded-lg">
        <h4 className="font-semibold text-indigo-900 mb-2">Control de Cookies</h4>
        <p className="text-sm text-indigo-800 leading-relaxed mb-2">
          Puede controlar y administrar cookies de varias maneras:
        </p>
        <ul className="text-sm text-indigo-800 space-y-1">
          <li>• Configuración del navegador: La mayoría de navegadores le permiten rechazar cookies</li>
          <li>• Configuración de dispositivos móviles: Ajustes de publicidad y privacidad</li>
          <li>• Herramientas de preferencias de cookies en nuestro sitio web</li>
        </ul>
      </section>

      <section className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Más Información</h4>
        <p className="text-sm text-gray-700 leading-relaxed">
          Para obtener más detalles sobre cómo usamos cookies, visite nuestra{" "}
          <a
            href="https://www.samsung.com/co/info/privacy/cookies/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Política de Cookies
          </a>
          .
        </p>
      </section>
    </div>
  );
};

export default Section9Content;
