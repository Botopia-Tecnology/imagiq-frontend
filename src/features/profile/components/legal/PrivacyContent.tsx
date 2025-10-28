"use client";

/**
 * @module PrivacyContent
 * @description Contenido de la Política de Privacidad de Samsung Colombia
 */

import React, { useState } from "react";
import { Phone, Globe, Mail } from "lucide-react";
import PrivacySectionCard from "./PrivacySectionCard";
import IntroSection from "./privacy-sections/IntroSection";
import { PRIVACY_SECTIONS, DATA_TYPES, USER_RIGHTS } from "../../constants/privacyData";

const PrivacyContent: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>("intro");

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case "intro":
        return <IntroSection />;

      case "info-collection":
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Tipos de Datos Recopilados:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DATA_TYPES.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded mt-4">
              <h4 className="font-semibold text-purple-900 mb-2">Medios de Recolección</h4>
              <p className="text-sm text-purple-800">
                Formularios web y físicos, páginas web, aplicativos móviles, sistemas de control de ingreso,
                correos electrónicos, chat, cámaras de videovigilancia, cookies, centros de servicio técnico
                y Samsung Account.
              </p>
            </div>
          </div>
        );

      case "use":
        return (
          <div className="space-y-3">
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-gray-900 mb-2">Gestión de Usuarios Finales</h4>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Facturación y entrega de productos</li>
                <li>Servicios postventa y garantías</li>
                <li>Mercadeo y eventos de la marca</li>
              </ul>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-gray-900 mb-2">Finalidades Comunes</h4>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Cumplimiento de contratos comerciales</li>
                <li>Prevención de fraude y lavado de activos</li>
                <li>Control de seguridad mediante CCTV</li>
              </ul>
            </div>
          </div>
        );

      case "rights":
        return (
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              Como titular de datos personales, usted tiene los siguientes derechos fundamentales (Hábeas Data):
            </p>
            <div className="space-y-3">
              {USER_RIGHTS.map((right, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-900 mb-1">{right.title}</h5>
                  <p className="text-sm text-gray-600">{right.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mt-4">
              <h4 className="font-semibold text-yellow-900 mb-2">Derecho a la Tranquilidad</h4>
              <p className="text-sm text-yellow-800">
                Samsung solo contactará en horarios nocturnos o fines de semana en casos excepcionales.
              </p>
            </div>
          </div>
        );

      case "sharing":
        return (
          <div className="space-y-3">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h5 className="font-semibold text-indigo-900 mb-2">Transmisión Nacional</h5>
              <p className="text-sm text-indigo-800">
                Los datos pueden ser transmitidos a terceros con relación contractual a nivel nacional.
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h5 className="font-semibold text-purple-900 mb-2">Transferencias Internacionales</h5>
              <p className="text-sm text-purple-800">
                Samsung realiza transferencias a países con niveles adecuados de protección.
              </p>
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 mb-3">Canales para Ejercer sus Derechos</h4>
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <h5 className="font-semibold text-gray-900">Portal de Privacidad</h5>
                </div>
                <a
                  href="https://sdapla.privacy.samsung.com/privacy/co/anonymous/checkAccount.do"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline block mb-2"
                >
                  sdapla.privacy.samsung.com/privacy/co
                </a>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <h5 className="font-semibold text-gray-900">Correo</h5>
                </div>
                <a href="mailto:tusdatos.co@samsung.com" className="text-sm text-blue-600 hover:underline">
                  tusdatos.co@samsung.com
                </a>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <h5 className="font-semibold text-gray-900">Teléfonos</h5>
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>Fijo Bogotá: (1) 6001272</li>
                  <li>Celular: #726</li>
                  <li>Línea gratuita: 01 8000 112 112</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      {PRIVACY_SECTIONS.map((section) => (
        <PrivacySectionCard
          key={section.id}
          title={section.title}
          icon={section.icon}
          isExpanded={expandedSection === section.id}
          onToggle={() => toggleSection(section.id)}
        >
          {renderSectionContent(section.id)}
        </PrivacySectionCard>
      ))}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm text-blue-900">
          <strong>Última actualización:</strong> 1 de septiembre de 2022
        </p>
        <p className="text-xs text-blue-700 mt-2">
          Aprobado por: Steve JY Son, Representante Legal Samsung Electronics Colombia S.A.
        </p>
      </div>
    </div>
  );
};

export default PrivacyContent;
