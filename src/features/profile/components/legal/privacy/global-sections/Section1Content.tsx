/**
 * @module Section1Content
 * @description ¿Cuáles son las informaciones recopiladas?
 */

import React from "react";

const Section1Content: React.FC = () => {
  return (
    <div className="space-y-6 text-gray-700">
      <section>
        <h4 className="font-semibold text-gray-900 mb-3">Información Proporcionada Directamente</h4>
        <p className="leading-relaxed mb-2">Samsung solicita:</p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Nombre, fecha de nacimiento, teléfono, correo electrónico, dirección</li>
          <li>Información de pago y envío para pedidos</li>
          <li>Información para verificación de identidad</li>
          <li>Contactos para compartir archivos y mensajes</li>
        </ul>
      </section>

      <section>
        <h4 className="font-semibold text-gray-900 mb-3">Información Sobre Uso de Servicios</h4>
        <p className="leading-relaxed mb-3">
          Se recopila mediante software en dispositivos:
        </p>

        <div className="space-y-4">
          <div className="border-l-2 border-gray-300 pl-4">
            <h5 className="font-semibold text-gray-900 mb-2">Información del Dispositivo</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Modelo hardware y software</li>
              <li>• Sistema operativo y versión</li>
              <li>• Número IMEI</li>
              <li>• Identificadores exclusivos del dispositivo</li>
              <li>• MCC (Código de País Dispositivo Móvil)</li>
              <li>• Dirección MAC e IP</li>
              <li>• IDs únicos, ID de publicidad</li>
              <li>• Para Smart TV: PSID, TIFA (Identificador Tizen)</li>
              <li>• Número de serie y teléfono</li>
              <li>• Cookies, píxeles y tecnologías similares</li>
            </ul>
          </div>

          <div className="border-l-2 border-gray-300 pl-4">
            <h5 className="font-semibold text-gray-900 mb-2">Información de Log/Sesión</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Información diagnóstica y técnica</li>
              <li>• Tiempo y duración de uso</li>
              <li>• Servicios instalados</li>
              <li>• Términos de búsqueda</li>
              <li>• Errores reportados</li>
            </ul>
          </div>

          <div className="border-l-2 border-gray-300 pl-4">
            <h5 className="font-semibold text-gray-900 mb-2">Información de Localización</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Puntos de acceso Wi-Fi y torres celulares</li>
              <li>• Con consentimiento: señal GPS</li>
              <li>• Código postal e ubicación inferida de IP</li>
            </ul>
          </div>

          <div className="border-l-2 border-gray-300 pl-4">
            <h5 className="font-semibold text-gray-900 mb-2">Información de Voz</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Grabaciones de mandos de voz</li>
              <li>• Grabaciones de contacto con Atención al Cliente</li>
              <li>• Protegidas por política separada de Bixby</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h4 className="font-semibold text-gray-900 mb-3">
          Fuentes Públicas y Comercialmente Disponibles
        </h4>
        <p className="leading-relaxed">
          Samsung obtiene información de fuentes públicas, datos comercialmente disponibles y
          redes sociales. Esta información se combina para entender mejor las necesidades e
          intereses de los usuarios.
        </p>
      </section>

      <section>
        <h4 className="font-semibold text-gray-900 mb-3">Servicios de Analítica de Terceros</h4>
        <p className="leading-relaxed mb-2">
          Samsung utiliza Google Analytics y Adobe Analytics para:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Analizar uso de servicios</li>
          <li>Mejorar servicios</li>
          <li>Información divulgada o recopilada directamente por proveedores</li>
        </ul>
        <div className="mt-3 text-sm">
          <p className="mb-1">
            <strong>Google Analytics:</strong>{" "}
            <a
              href="http://www.google.com/analytics/learn/privacy.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Política de Privacidad
            </a>
          </p>
        </div>
      </section>

      <section className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Sus Opciones</h4>
        <p className="text-sm leading-relaxed">
          Puede optar por no entregar información solicitada. En algunos casos, esto puede limitar
          el acceso a ciertos servicios. Por ejemplo, el servicio &quot;Buscar mi Teléfono&quot; requiere
          datos de dispositivo y localización. Puede desactivarlo en:{" "}
          <span className="font-mono text-xs bg-white px-2 py-1 rounded">
            Configuración &gt; Biometría y Seguridad &gt; Buscar mi Teléfono
          </span>
        </p>
      </section>
    </div>
  );
};

export default Section1Content;
