import { Metadata } from "next";
import { LegalDocumentLayout } from "@/components/legal/LegalDocumentLayout";

export const metadata: Metadata = {
  title: "Política de Tratamiento de Datos Personales - IMAGIQ",
  description:
    "Política general de tratamiento y protección de datos personales según Ley 1581 de 2012",
  robots: "index, follow",
};

const sections = [
  { id: "introduccion", title: "Introducción", level: 1 },
  { id: "objetivo", title: "Objetivo", level: 1 },
  { id: "alcance", title: "Alcance", level: 1 },
  { id: "definiciones", title: "Definiciones", level: 1 },
  { id: "principios", title: "Principios", level: 1 },
  { id: "tratamiento", title: "Tratamiento y Finalidad", level: 1 },
  { id: "derechos", title: "Derechos de los Titulares", level: 1 },
  { id: "deberes", title: "Deberes de la Empresa", level: 1 },
  { id: "autorizacion", title: "Autorización", level: 1 },
  { id: "transferencias", title: "Transferencias", level: 1 },
  { id: "procedimiento", title: "Procedimiento", level: 1 },
  { id: "seguridad", title: "Seguridad", level: 1 },
];

export default function TratamientoDatosPage() {
  return (
    <LegalDocumentLayout
      title="Política General de Tratamiento de Datos Personales"
      sections={sections}
      documentType="Política de Datos Personales"
      lastUpdated="9 de Noviembre de 2025"
    >
      <div className="space-y-16">
        <section id="introduccion">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Introducción
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            La Constitución Política de Colombia consagra en su Art. 15 el
            Derecho Fundamental que tienen todas las personas a &ldquo;su
            intimidad personal y familiar y a su buen nombre, y el Estado debe
            respetarlos y hacerlos respetar&rdquo;.
          </p>
          <div className="bg-gray-50 border border-gray-200 p-6">
            <p className="text-gray-800 mb-3">
              <strong>Marco Legal:</strong>
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                <span>Constitución Política de Colombia - Art. 15</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                <span>
                  Ley 1581 de 2012 - Ley de protección de datos personales
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                <span>Decreto 1377 de 2013</span>
              </li>
            </ul>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mt-6">
            <div className="flex gap-3">
              <span className="text-yellow-600 font-bold text-lg">⚠</span>
              <div>
                <p className="font-semibold text-yellow-900 mb-1">
                  Compromiso IMAGIQ
                </p>
                <p className="text-yellow-800">
                  IMAGIQ S.A.S. está comprometida con el cumplimiento de la
                  regulación en materia de Protección de Datos Personales, así
                  como con el respeto de los derechos de los Titulares de la
                  información.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="objetivo">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Objetivo
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            El objetivo de la presente Política es, junto con las medidas
            técnicas, humanas y administrativas implementadas, garantizar el
            adecuado cumplimiento de la Ley de Protección de Datos Personales
            aplicable, así como la definición de los lineamientos para la
            atención de consultas y reclamos de los Titulares de los Datos
            Personales.
          </p>
        </section>

        <section id="alcance">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Alcance
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            Esta Política es de obligatorio y estricto cumplimiento por parte de
            La Empresa, sus directores, administradores, colaboradores y los
            demás terceros quienes la representan o actúan por ella.
          </p>
          <div className="bg-gray-50 border-l-4 border-gray-400 p-6">
            <p className="text-gray-800">
              Todos los Colaboradores de La Empresa, deben observar, respetar,
              cumplir y hacer cumplir esta Política en el desarrollo de sus
              funciones.
            </p>
          </div>
        </section>

        <section id="definiciones">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Definiciones
          </h2>
          <div className="border border-gray-200 overflow-hidden">
            <table className="w-full">
              <caption className="sr-only">
                Definiciones sobre tratamiento de datos personales
              </caption>
              <thead>
                <tr className="bg-black text-white">
                  <th scope="col" className="px-6 py-4 text-left font-semibold">
                    Término
                  </th>
                  <th scope="col" className="px-6 py-4 text-left font-semibold">
                    Definición
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">
                    Autorización
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    Consentimiento previo, expreso e informado del Titular del
                    dato para llevar a cabo el Tratamiento
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">
                    Base de Datos
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    Conjunto organizado de Datos Personales que sean objeto de
                    Tratamiento
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">
                    Dato Personal
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    Cualquier información vinculada o que pueda asociarse a una
                    o varias personas naturales
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">
                    Dato Sensible
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    Dato que afecta la intimidad o cuyo uso indebido puede
                    generar discriminación
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">
                    Titular
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    Persona natural cuyos datos personales sean objeto de
                    Tratamiento
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">
                    Tratamiento
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    Operaciones sobre Datos Personales: recolección,
                    almacenamiento, uso, circulación, etc.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="principios">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Principios para el Tratamiento de Datos Personales
          </h2>
          <div className="space-y-6">
            <div className="bg-gray-50 p-6">
              <h3 className="font-semibold text-black mb-2">
                1. Principio de Libertad
              </h3>
              <p className="text-gray-700">
                La recolección de datos sólo puede ejercerse con autorización
                previa, expresa e informada del Titular, salvo norma legal en
                contrario.
              </p>
            </div>
            <div className="bg-gray-50 p-6">
              <h3 className="font-semibold text-black mb-2">
                2. Principio de Finalidad
              </h3>
              <p className="text-gray-700">
                El Tratamiento debe obedecer a una finalidad legítima de acuerdo
                con la Constitución y la Ley, la cual debe ser informada al
                Titular.
              </p>
            </div>
            <div className="bg-gray-50 p-6">
              <h3 className="font-semibold text-black mb-2">
                3. Principio de Veracidad o Calidad
              </h3>
              <p className="text-gray-700">
                La información debe ser veraz, completa, exacta, actualizada,
                comprobable y comprensible. Se prohíbe el Tratamiento de datos
                parciales o incompletos.
              </p>
            </div>
            <div className="bg-gray-50 p-6">
              <h3 className="font-semibold text-black mb-2">
                4. Principio de Transparencia
              </h3>
              <p className="text-gray-700">
                Debe garantizarse el derecho del Titular a obtener información
                sin restricciones sobre la existencia de datos que le
                conciernan.
              </p>
            </div>
            <div className="bg-gray-50 p-6">
              <h3 className="font-semibold text-black mb-2">
                5. Principio de Seguridad
              </h3>
              <p className="text-gray-700">
                Se deben adoptar medidas técnicas, humanas y administrativas
                para otorgar seguridad a los Datos Personales.
              </p>
            </div>
            <div className="bg-gray-50 p-6">
              <h3 className="font-semibold text-black mb-2">
                6. Principio de Confidencialidad
              </h3>
              <p className="text-gray-700">
                Todas las personas que intervengan en el Tratamiento están
                obligadas a garantizar la reserva de la información.
              </p>
            </div>
          </div>
        </section>

        <section id="tratamiento">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Tratamiento y Finalidad
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            La Empresa realizará el Tratamiento de los Datos Personales de
            acuerdo con las condiciones establecidas por el Titular, la ley o
            las entidades públicas para el cumplimiento de las actividades
            propias de su objeto social.
          </p>
          <div className="bg-gray-50 border border-gray-200 p-6">
            <h4 className="font-semibold text-black mb-4">
              Finalidades del Tratamiento incluyen:
            </h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                <span>
                  Ejercer el derecho de conocer al Titular con quien se propone
                  entablar relaciones
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                <span>Desarrollar actividades comerciales y de mercadeo</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                <span>
                  Implementar estrategias de relacionamiento con clientes y
                  proveedores
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                <span>
                  Gestionar consultas, solicitudes, peticiones, quejas y
                  reclamos
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                <span>Realizar encuestas de satisfacción</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                <span>
                  Llevar a cabo análisis estadísticos, facturación y cobranzas
                </span>
              </li>
            </ul>
          </div>
        </section>

        <section id="derechos">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Derechos de los Titulares
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            Los Titulares de los Datos personales tienen los siguientes
            derechos:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 p-6">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">
                Conocer y Actualizar
              </h3>
              <p className="text-gray-700 text-sm">
                Conocer, actualizar y rectificar sus Datos Personales frente a
                los Responsables del Tratamiento
              </p>
            </div>
            <div className="border border-gray-200 p-6">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">
                Solicitar Prueba
              </h3>
              <p className="text-gray-700 text-sm">
                Solicitar prueba de la autorización otorgada a La Empresa
              </p>
            </div>
            <div className="border border-gray-200 p-6">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">
                Ser Informado
              </h3>
              <p className="text-gray-700 text-sm">
                Ser informado del uso que se ha dado a sus Datos Personales
              </p>
            </div>
            <div className="border border-gray-200 p-6">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">
                Presentar Quejas
              </h3>
              <p className="text-gray-700 text-sm">
                Presentar quejas ante la Superintendencia de Industria y
                Comercio
              </p>
            </div>
            <div className="border border-gray-200 p-6">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold mb-4">
                5
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">
                Revocar Autorización
              </h3>
              <p className="text-gray-700 text-sm">
                Revocar la autorización y/o solicitar la supresión del dato
              </p>
            </div>
            <div className="border border-gray-200 p-6">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold mb-4">
                6
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">
                Acceso Gratuito
              </h3>
              <p className="text-gray-700 text-sm">
                Acceder en forma gratuita a sus Datos Personales objeto de
                Tratamiento
              </p>
            </div>
          </div>
        </section>

        <section id="deberes">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Deberes de la Empresa
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-50 p-6">
              <h3 className="font-semibold text-black mb-2">
                Respecto del Titular
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                  <span>
                    Garantizar el pleno y efectivo ejercicio de los derechos
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                  <span>
                    Solicitar y conservar copia de la Autorización otorgada
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                  <span>
                    Informar de manera clara sobre la finalidad del Tratamiento
                  </span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6">
              <h3 className="font-semibold text-black mb-2">
                Respecto de la Calidad y Seguridad
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                  <span>
                    Observar los principios de veracidad, calidad, seguridad y
                    confidencialidad
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                  <span>
                    Conservar la información bajo condiciones de seguridad
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                  <span>
                    Actualizar y rectificar los Datos Personales cuando sea
                    necesario
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="autorizacion">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Autorización
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            Los obligados a cumplir esta política deberán obtener del Titular su
            autorización previa, expresa e informada para recolectar y tratar
            sus Datos Personales.
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
            <div className="flex gap-3">
              <span className="text-yellow-600 font-bold text-lg">⚠</span>
              <div>
                <p className="font-semibold text-yellow-900 mb-1">
                  Información Previa
                </p>
                <p className="text-yellow-800">
                  Para obtener la autorización, es necesario informar al Titular
                  de manera clara y expresa sobre: el Tratamiento, la finalidad,
                  el carácter facultativo de la respuesta, los derechos que le
                  asisten, y la identificación del responsable.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="transferencias">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Transferencias y Transmisiones
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-6">
              <h3 className="font-semibold text-black mb-3">Transferencias</h3>
              <p className="text-gray-700">
                La Empresa podrá realizar transferencias de datos a otros
                Responsables cuando esté autorizado por el Titular, la ley o un
                mandato administrativo o judicial.
              </p>
            </div>
            <div className="bg-gray-50 p-6">
              <h3 className="font-semibold text-black mb-3">Transmisiones</h3>
              <p className="text-gray-700">
                La Empresa podrá enviar o transmitir datos a Encargados ubicados
                dentro o fuera del país cuando cuente con autorización o exista
                un contrato de transmisión.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
            <h3 className="font-semibold text-black mb-4 text-lg">
              Transferencias Internacionales de Datos
            </h3>
            <p className="text-gray-700 mb-4">
              IMAGIQ S.A.S. utiliza servicios de terceros para análisis y
              publicidad (Microsoft Clarity, Google Tag Manager, Meta Pixel,
              TikTok Pixel) cuyos servidores pueden estar ubicados en{" "}
              <strong>Estados Unidos</strong> u otros países fuera de Colombia.
            </p>
            <p className="text-gray-700 mb-4">
              Al aceptar nuestras políticas de cookies, el usuario autoriza
              expresamente la{" "}
              <strong>transferencia internacional de sus datos</strong> a estos
              terceros, quienes han certificado cumplir con estándares de
              protección de datos equivalentes a los establecidos en la
              legislación colombiana (Ley 1581 de 2012).
            </p>
            <div className="bg-white border border-blue-200 p-4 mt-4">
              <h4 className="font-semibold text-black mb-3">
                Servicios de Terceros que Procesan Datos Internacionalmente:
              </h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>
                    <strong>Microsoft Clarity</strong> (Estados Unidos) -
                    Análisis de comportamiento
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>
                    <strong>Google Tag Manager</strong> (Estados Unidos) -
                    Gestión de etiquetas
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>
                    <strong>Meta Pixel</strong> (Estados Unidos) - Tracking de
                    conversiones Facebook/Instagram
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>
                    <strong>TikTok Pixel</strong> (Estados Unidos/China) -
                    Tracking de conversiones TikTok
                  </span>
                </li>
              </ul>
              <p className="text-sm text-gray-600 mt-4 italic">
                Estos servicios solo se activan si el usuario otorga
                consentimiento explícito a través de nuestro banner de cookies.
                El usuario puede ejercer sus derechos de acceso, rectificación,
                cancelación y oposición contactando a{" "}
                <a
                  href="mailto:DATOS.PERSONALES@IMAGIQ.CO"
                  className="underline text-blue-600 hover:text-blue-800"
                >
                  DATOS.PERSONALES@IMAGIQ.CO
                </a>
              </p>
            </div>
          </div>
        </section>

        <section id="procedimiento">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Procedimiento para Ejercer Derechos
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            Para el ejercicio pleno y efectivo de los derechos, IMAGIQ S.A.S.
            dispone del siguiente canal:
          </p>
          <div className="border border-gray-200 p-6 mb-6">
            <div className="space-y-3">
              <p className="text-gray-700">
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:DATOS.PERSONALES@IMAGIQ.CO"
                  className="underline hover:text-black"
                >
                  DATOS.PERSONALES@IMAGIQ.CO
                </a>
              </p>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 p-6">
            <h4 className="font-semibold text-black mb-4">
              El reclamo debe contener:
            </h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                <span>Nombre e identificación del Titular</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                <span>Descripción precisa de los hechos</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                <span>Dirección física o electrónica para respuesta</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                <span>Documentos y pruebas pertinentes</span>
              </li>
            </ul>
          </div>
        </section>

        <section id="seguridad">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Políticas de Seguridad de la Información
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            La Empresa adoptará las medidas técnicas, administrativas y humanas
            necesarias para procurar la seguridad de los Datos Personales,
            protegiendo la confidencialidad, integridad y acceso.
          </p>
          <div className="bg-gray-50 border border-gray-200 p-6">
            <p className="text-gray-800">
              Se han implementado protocolos de seguridad de obligatorio
              cumplimiento para todo el Personal que tenga acceso a estos datos
              y/o a los sistemas de información.
            </p>
          </div>

          <div className="bg-black text-white p-8 mt-8 text-center">
            <p className="font-semibold text-lg mb-1">IMAGIQ S.A.S.</p>
            <p className="text-gray-300">NIT 900.565.091-1</p>
            <p className="text-gray-300">
              Calle 98 #8-28 Of 204, Bogotá D.C., Colombia
            </p>
            <p className="text-gray-300 mt-2">
              Email: DATOS.PERSONALES@IMAGIQ.CO
            </p>
            <p className="text-gray-300 mt-4">Código: SAMCOL251017_0005</p>
          </div>
        </section>
      </div>
    </LegalDocumentLayout>
  );
}
