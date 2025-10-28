/**
 * @module Section2Content
 * @description ¿Cómo utilizamos sus informaciones?
 */

import React from "react";

const Section2Content: React.FC = () => {
  return (
    <div className="space-y-6 text-gray-700">
      <p className="leading-relaxed font-semibold text-gray-900">
        Samsung usa su información para:
      </p>

      <section>
        <h4 className="font-semibold text-gray-900 mb-3">Registro y Configuración</h4>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Registrar usuarios y dispositivos</li>
          <li>Registrar en servicios Samsung</li>
        </ul>
      </section>

      <section>
        <h4 className="font-semibold text-gray-900 mb-3">Prestación de Servicios</h4>
        <div className="space-y-2">
          <p className="leading-relaxed">Ofrecer servicios solicitados, incluyendo:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Contenido personalizado según actividades previas</li>
            <li>Publicidad y promociones personalizadas en servicios, sitios terceros y redes sociales</li>
            <li>Marketing directo por correo, notificaciones push, mensajes de texto (con consentimiento)</li>
          </ul>
        </div>
      </section>

      <section>
        <h4 className="font-semibold text-gray-900 mb-3">Operación y Mejora</h4>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Operar, evaluar y mejorar el negocio</li>
          <li>Desarrollo de nuevos productos y servicios</li>
          <li>Mejora de productos y servicios existentes</li>
          <li>Análisis de base de clientes</li>
          <li>Estudios de mercado y encuestas de opinión</li>
          <li>Agregación y anonimización de datos</li>
        </ul>
      </section>

      <section>
        <h4 className="font-semibold text-gray-900 mb-3">Mantenimiento y Soporte</h4>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Actualizaciones de software</li>
          <li>Servicios de mantenimiento</li>
          <li>Soporte a dispositivos</li>
          <li>Atención al cliente en garantía</li>
        </ul>
      </section>

      <section>
        <h4 className="font-semibold text-gray-900 mb-3">Seguridad y Fraude</h4>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Garantizar seguridad de productos</li>
          <li>Evitar fraude en productos sin garantía</li>
          <li>Verificación de dispositivos para reparaciones</li>
          <li>Recolección de IMEI y número de serie</li>
        </ul>
      </section>

      <section>
        <h4 className="font-semibold text-gray-900 mb-3">Protección de Derechos</h4>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Proteger derechos e intereses de Samsung y afiliados</li>
          <li>Protección de propiedad y seguridad</li>
          <li>Responder solicitudes y consultas sobre información personal</li>
        </ul>
      </section>

      <section>
        <h4 className="font-semibold text-gray-900 mb-3">Prevención de Delitos</h4>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Proteger, identificar y prevenir fraude y robos</li>
          <li>Prevenir otras actividades delictivas</li>
        </ul>
      </section>

      <section>
        <h4 className="font-semibold text-gray-900 mb-3">Cumplimiento Legal</h4>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Cumplir obligaciones legalmente aplicables</li>
          <li>Cumplir estándares del sector</li>
          <li>Cumplir políticas propias de Samsung</li>
        </ul>
      </section>

      <section className="bg-gray-50 border border-gray-200 p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Análisis de Dispositivos Defectuosos</h4>
        <p className="text-sm text-gray-700 leading-relaxed">
          Samsung garantiza la eliminación de datos personales antes de realizar análisis de
          dispositivos defectuosos.
        </p>
      </section>

      <section className="bg-gray-50 border border-gray-200 p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Combinación de Información</h4>
        <p className="text-sm text-gray-700 leading-relaxed">
          Samsung puede usar y combinar información de servicios, dispositivos u otras fuentes.
          Por ejemplo, los detalles de su cuenta Samsung pueden utilizarse para múltiples servicios,
          proporcionando contenido personalizado.
        </p>
      </section>

      <section className="bg-yellow-50 border border-yellow-600 p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Anuncios No Dirigidos</h4>
        <p className="text-sm text-gray-700 leading-relaxed mb-2">
          La opción sobre anuncios dirigidos/personalizados no afecta si recibe anuncios genéricos,
          básicos o contextuales (no dirigidos).
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          Para dispositivos móviles, la información para anuncios no dirigidos incluye: información
          de aplicación, información de dispositivo e identificadores (IP, ID publicidad).
        </p>
      </section>
    </div>
  );
};

export default Section2Content;
