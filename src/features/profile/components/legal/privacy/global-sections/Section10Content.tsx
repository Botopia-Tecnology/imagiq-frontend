/**
 * @module Section10Content
 * @description Póngase en contacto con nosotros
 */

import React from "react";
import { Mail, Phone, Globe, MapPin } from "lucide-react";

const Section10Content: React.FC = () => {
  return (
    <div className="space-y-6 text-gray-700">
      <p className="leading-relaxed">
        Si tiene preguntas sobre esta Política de Privacidad o sobre nuestras prácticas de
        privacidad, o si desea ejercer sus derechos, puede contactarnos a través de los
        siguientes canales:
      </p>

      <section className="space-y-3">
        <h4 className="font-semibold text-gray-900 mb-3">Canales de Contacto</h4>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Globe className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h5 className="font-semibold text-gray-900 mb-1">Portal de Privacidad</h5>
              <a
                href="https://sdapla.privacy.samsung.com/privacy/co/anonymous/checkAccount.do"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline break-all"
              >
                sdapla.privacy.samsung.com/privacy/co/anonymous/checkAccount.do
              </a>
              <p className="text-xs text-gray-600 mt-1">
                Portal para consultas, actualizaciones y solicitudes de supresión de datos
              </p>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h5 className="font-semibold text-gray-900 mb-1">Correo Electrónico</h5>
              <a
                href="mailto:tusdatos.co@samsung.com"
                className="text-sm text-blue-600 hover:underline"
              >
                tusdatos.co@samsung.com
              </a>
              <p className="text-xs text-gray-600 mt-1">
                Envíe sus consultas, solicitudes o reclamos sobre privacidad
              </p>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h5 className="font-semibold text-gray-900 mb-2">Líneas Telefónicas</h5>
              <div className="space-y-1 text-sm">
                <p><strong>Fijo Bogotá:</strong> (1) 6001272</p>
                <p><strong>Celular:</strong> #726</p>
                <p><strong>Línea Gratuita Nacional:</strong> 01 8000 112 112</p>
                <p><strong>Oficina Principal:</strong> (1) 4870707</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <h5 className="font-semibold text-gray-900 mb-1">Dirección Física</h5>
              <p className="text-sm text-gray-700">
                Samsung Electronics Colombia S.A.<br />
                Carrera 7 No. 113-43 Of. 607, Torre Samsung<br />
                Bogotá, Colombia
              </p>
              <p className="text-sm text-gray-700 mt-2">
                <strong>NIT:</strong> 830.028.931-5
              </p>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Globe className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <h5 className="font-semibold text-gray-900 mb-1">Formulario Web</h5>
              <a
                href="https://contactus.samsung.com/customer/contactus/formmail/mail/MailQuestionGeneralNew.jsp?siteId=27"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline break-all"
              >
                Formulario de contacto Samsung Colombia
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
        <h4 className="font-semibold text-blue-900 mb-2">Tiempos de Respuesta</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Consultas:</strong> Máximo 10 días hábiles</li>
          <li>• <strong>Reclamos:</strong> Máximo 15 días hábiles</li>
          <li>• <strong>Solicitudes de Derechos:</strong> Según plazos legales aplicables</li>
        </ul>
      </section>

      <section className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Comité de Protección de Datos Personales</h4>
        <p className="text-sm text-gray-700 leading-relaxed">
          Samsung cuenta con un Comité de Protección de Datos Personales conformado por las
          áreas legal, servicio, recursos humanos, online business y mercadeo, encargado de
          velar por el cumplimiento de esta política y el Programa Integral de Datos Personales.
        </p>
      </section>
    </div>
  );
};

export default Section10Content;
