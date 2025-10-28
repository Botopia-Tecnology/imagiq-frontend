/**
 * @module Section4Content
 * @description ¿Cómo mantenemos sus informaciones protegidas?
 */

import React from "react";

const Section4Content: React.FC = () => {
  return (
    <div className="space-y-6 text-gray-700">
      <p className="leading-relaxed">
        Samsung se toma en serio la seguridad de su información personal y utiliza medidas
        técnicas y administrativas razonables para protegerla contra pérdida, mal uso y acceso
        no autorizado.
      </p>

      <section>
        <h4 className="font-semibold text-gray-900 mb-3">Medidas de Seguridad Técnicas</h4>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Encriptación de datos en tránsito y en reposo</li>
          <li>Firewalls y sistemas de detección de intrusiones</li>
          <li>Controles de acceso y autenticación</li>
          <li>Monitoreo de seguridad continuo</li>
          <li>Pruebas de seguridad regulares</li>
        </ul>
      </section>

      <section>
        <h4 className="font-semibold text-gray-900 mb-3">Medidas Administrativas</h4>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Capacitación de empleados en protección de datos</li>
          <li>Políticas de seguridad de la información</li>
          <li>Controles de acceso basados en necesidad de conocer</li>
          <li>Acuerdos de confidencialidad con empleados y contratistas</li>
        </ul>
      </section>

      <section className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
        <h4 className="font-semibold text-yellow-900 mb-2">Responsabilidad del Usuario</h4>
        <p className="text-sm text-yellow-800 leading-relaxed">
          Aunque implementamos medidas de seguridad, ningún sistema es completamente seguro.
          Le recomendamos proteger su información manteniendo sus contraseñas seguras, no
          compartiendo su información de cuenta, y notificándonos de cualquier acceso no
          autorizado.
        </p>
      </section>
    </div>
  );
};

export default Section4Content;
