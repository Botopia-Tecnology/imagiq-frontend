import { Metadata } from "next";
import { LegalDocumentLayout } from "@/components/legal/LegalDocumentLayout";

export const metadata: Metadata = {
  title: "Política de Uso de Cookies - IMAGIQ",
  description:
    "Información sobre el uso de cookies y tecnologías de seguimiento en IMAGIQ",
  robots: "index, follow",
};

const sections = [
  { id: "que-son", title: "¿Qué son las Cookies?", level: 1 },
  { id: "autorizacion", title: "Autorización para el Uso", level: 1 },
  { id: "datos-personales", title: "Tratamiento de Datos", level: 1 },
  { id: "tipos", title: "Tipos de Cookies", level: 1 },
  { id: "servicios-terceros", title: "Servicios de Terceros", level: 1 },
  { id: "deshabilitar", title: "Cómo Deshabilitar Cookies", level: 1 },
  { id: "cambios", title: "Cambios en la Política", level: 1 },
];

export default function PoliticaCookiesPage() {
  return (
    <LegalDocumentLayout
      title="Política de Uso de Cookies"
      sections={sections}
      documentType="Política de Cookies"
      lastUpdated="9 de Noviembre de 2025"
    >
      <div className="space-y-16">
        <section id="que-son">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            ¿Qué son las Cookies?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            Las cookies se caracterizan por ser información enviada a través de
            un canal digital (sitio web o aplicación) de propiedad de IMAGIQ
            S.A.S., información que es almacenada en el navegador del usuario,
            de manera que el sitio web o aplicación puede consultar la actividad
            del navegador o dispositivo del usuario.
          </p>
          <div className="bg-gray-50 border border-gray-200 p-6">
            <h3 className="font-semibold text-black mb-3">
              Propósito de las Cookies
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                <span>Conocer el mercado de interés del usuario</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                <span>Facilitar la navegación por contenidos de interés</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                <span>Reconocer hábitos de navegación</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                <span>Proporcionar una mejor experiencia de usuario</span>
              </li>
            </ul>
          </div>
          <div className="bg-gray-50 border-l-4 border-gray-400 p-6 mt-6">
            <p className="text-gray-800 text-sm">
              <strong>Nota Importante:</strong> Las cookies NO son spam, gusanos
              informáticos, ni ningún otro tipo de virus que pueda dañar los
              navegadores o dispositivos del usuario.
            </p>
          </div>
        </section>

        <section id="autorizacion">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Información General y Autorización para el Uso de Cookies
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            Para mejorar la experiencia de usuario y la navegación en sus
            canales digitales, IMAGIQ S.A.S. utiliza cookies propias y de
            terceros.
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
            <div className="flex gap-3">
              <span className="text-yellow-600 font-bold text-lg">⚠</span>
              <div>
                <p className="font-semibold text-yellow-900 mb-1">
                  Autorización Implícita
                </p>
                <p className="text-yellow-800">
                  Si el usuario continúa navegando a través de los canales
                  digitales de IMAGIQ S.A.S., luego de que se le informa de
                  manera completa sobre el uso de cookies, se entiende la
                  autorización inequívoca para el almacenamiento y utilización
                  de cookies con las finalidades contenidas en esta Política.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="datos-personales">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Tratamiento de Datos Personales
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            En caso tal de realizarse labores de tratamiento de datos personales
            asociadas a la obtención y almacenamiento de cookies por parte de
            IMAGIQ S.A.S., el usuario autoriza su tratamiento para las labores
            identificadas en esta política de cookies.
          </p>
          <div className="bg-gray-50 border border-gray-200 p-6">
            <h4 className="font-semibold text-black mb-4">
              Derechos del Titular:
            </h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                <span>
                  Conocer, actualizar, rectificar y acceder a su información
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                <span>Solicitar prueba de la autorización y revocarla</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                <span>
                  Presentar quejas ante la Superintendencia de Industria y
                  Comercio
                </span>
              </li>
            </ul>
            <div className="mt-6 space-y-2 border-l-2 border-gray-300 pl-4">
              <p className="text-gray-700">
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:DATOS.PERSONALES@IMAGIQ.CO"
                  className="underline hover:text-black"
                >
                  DATOS.PERSONALES@IMAGIQ.CO
                </a>
              </p>
              <p className="text-gray-700">
                <strong>Dirección:</strong> Calle 98 # 8-28 oficina 204, Bogotá
              </p>
            </div>
          </div>
        </section>

        <section id="tipos">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Tipos de Cookies
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            Para la navegación a través de sus canales digitales IMAGIQ S.A.S.
            utiliza los siguientes tipos de Cookies:
          </p>

          <div className="border border-gray-200 overflow-hidden mb-6">
            <table className="w-full">
              <caption className="sr-only">
                Tipos de cookies utilizadas por IMAGIQ
              </caption>
              <thead>
                <tr className="bg-black text-white">
                  <th scope="col" className="px-6 py-4 text-left font-semibold">
                    Tipo de Cookie
                  </th>
                  <th scope="col" className="px-6 py-4 text-left font-semibold">
                    Descripción
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">
                    Cookies Propias
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    Las que envían los sitios web y/o aplicaciones gestionadas
                    por IMAGIQ S.A.S.
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">
                    Cookies de Terceros
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    Las que se envían desde un equipo o dominio que no es
                    gestionado por IMAGIQ S.A.S.
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">
                    Cookies de Personalización
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    Permiten acceder al servicio con características
                    predefinidas según criterios del navegador
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">
                    Cookies de Análisis
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    Permiten seguir y analizar el comportamiento de los usuarios
                    para mejorar la experiencia
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">
                    Cookies Publicitarias
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    Permiten mejorar la gestión de espacios publicitarios y
                    desarrollar perfiles específicos
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">
                    Cookies Técnicas
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    Permiten navegar y usar las opciones o servicios del canal
                    digital
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">
                    Cookies de Seguridad
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    Permiten autenticar usuarios y proteger datos frente a usos
                    no autorizados
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="servicios-terceros">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Servicios de Terceros Utilizados
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            IMAGIQ S.A.S. utiliza los siguientes servicios de terceros para
            análisis y publicidad. Estos servicios solo se activan si el usuario
            acepta el uso de cookies en nuestro banner de consentimiento.
          </p>

          <div className="space-y-8">
            <div className="border-l-2 border-gray-300 pl-6">
              <h3 className="text-xl font-semibold text-black mb-4">
                Cookies de Análisis y Monitoreo
              </h3>

              <div className="space-y-6">
                <div className="bg-gray-50 border border-gray-200 p-6">
                  <h4 className="font-semibold text-black mb-3">Microsoft Clarity</h4>
                  <p className="text-gray-700 mb-3">
                    Servicio de análisis de comportamiento que proporciona mapas
                    de calor y grabaciones de sesión para mejorar la experiencia
                    del usuario.
                  </p>
                  <div className="bg-white border-l-4 border-gray-400 p-4 mb-3">
                    <p className="text-sm text-gray-700">
                      <strong>ID del Proyecto:</strong> tnnqbxjgre
                    </p>
                  </div>
                  <a
                    href="https://privacy.microsoft.com/privacystatement"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-600 underline text-sm font-medium"
                  >
                    Ver Política de Privacidad de Microsoft →
                  </a>
                </div>

                <div className="bg-gray-50 border border-gray-200 p-6">
                  <h4 className="font-semibold text-black mb-3">Sentry</h4>
                  <p className="text-gray-700 mb-3">
                    Plataforma de monitoreo de errores y rendimiento que ayuda a identificar
                    y resolver problemas técnicos en tiempo real para garantizar la mejor
                    experiencia de usuario posible.
                  </p>
                  <div className="bg-white border-l-4 border-gray-400 p-4 mb-3">
                    <p className="text-sm text-gray-700 mb-1">
                      <strong>DSN:</strong> Configurado para el proyecto IMAGIQ
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Datos recopilados:</strong> Información de errores técnicos, rendimiento de la aplicación y contexto del navegador (sin incluir datos personales sensibles)
                    </p>
                  </div>
                  <a
                    href="https://sentry.io/privacy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-600 underline text-sm font-medium"
                  >
                    Ver Política de Privacidad de Sentry →
                  </a>
                </div>
              </div>
            </div>

            <div className="border-l-2 border-gray-300 pl-6">
              <h3 className="text-xl font-semibold text-black mb-4">
                Cookies de Publicidad y Marketing
              </h3>

              <div className="space-y-6">
                <div className="bg-gray-50 border border-gray-200 p-6">
                  <h4 className="font-semibold text-black mb-3">Google Tag Manager</h4>
                  <p className="text-gray-700 mb-3">
                    Plataforma de gestión de etiquetas que permite administrar y
                    desplegar etiquetas de marketing sin modificar el código.
                  </p>
                  <div className="bg-white border-l-4 border-gray-400 p-4 mb-3">
                    <p className="text-sm text-gray-700">
                      <strong>ID del Contenedor:</strong> GTM-MS5J6DQT
                    </p>
                  </div>
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-600 underline text-sm font-medium"
                  >
                    Ver Política de Privacidad de Google →
                  </a>
                </div>

                <div className="bg-gray-50 border border-gray-200 p-6">
                  <h4 className="font-semibold text-black mb-3">Meta Pixel (Facebook Pixel)</h4>
                  <p className="text-gray-700 mb-3">
                    Herramienta de análisis que ayuda a medir la efectividad de
                    la publicidad mediante el seguimiento de las acciones que
                    realizan los usuarios.
                  </p>
                  <div className="bg-white border-l-4 border-gray-400 p-4 mb-3">
                    <p className="text-sm text-gray-700">
                      <strong>ID del Pixel:</strong> 25730530136536207
                    </p>
                  </div>
                  <a
                    href="https://www.facebook.com/privacy/policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-600 underline text-sm font-medium"
                  >
                    Ver Política de Privacidad de Meta →
                  </a>
                </div>

                <div className="bg-gray-50 border border-gray-200 p-6">
                  <h4 className="font-semibold text-black mb-3">TikTok Pixel</h4>
                  <p className="text-gray-700 mb-3">
                    Código de seguimiento que ayuda a medir el rendimiento de las
                    campañas publicitarias y optimizar los anuncios en TikTok.
                  </p>
                  <div className="bg-white border-l-4 border-gray-400 p-4 mb-3">
                    <p className="text-sm text-gray-700">
                      <strong>ID del Pixel:</strong> Pendiente por configurar
                    </p>
                  </div>
                  <a
                    href="https://www.tiktok.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-600 underline text-sm font-medium"
                  >
                    Ver Política de Privacidad de TikTok →
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
              <div className="flex gap-3">
                <span className="text-yellow-600 font-bold text-lg">⚠</span>
                <div>
                  <p className="font-semibold text-yellow-900 mb-1">
                    Control de Consentimiento
                  </p>
                  <p className="text-yellow-800 mb-3">
                    Todos estos servicios de cookies solo se cargan si el usuario acepta
                    explícitamente su uso a través de nuestro banner
                    de consentimiento. El usuario puede rechazar el uso de estas
                    cookies sin afectar las funcionalidades básicas del sitio.
                  </p>
                  <p className="font-semibold text-yellow-900 mb-1 mt-4">
                    Tracking Analítico Server-Side (Sin Cookies)
                  </p>
                  <p className="text-yellow-800">
                    Adicionalmente, IMAGIQ S.A.S. utiliza tecnologías de tracking analítico
                    server-side (CAPI - Conversions API) que funcionan INDEPENDIENTEMENTE
                    del consentimiento de cookies. Cuando el usuario rechaza cookies, estos
                    sistemas SOLO envían datos agregados y anonimizados que NO constituyen
                    datos personales según la Ley 1581 de 2012.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mt-6">
              <h4 className="font-semibold text-blue-900 mb-4">
                📊 Tracking Analítico Server-Side (CAPI)
              </h4>
              <p className="text-blue-800 mb-4">
                IMAGIQ S.A.S. utiliza APIs server-side (Meta Conversions API y TikTok Events API)
                para enviar eventos analíticos a nuestros servidores, que luego son transmitidos
                a plataformas de publicidad para análisis agregado.
              </p>
              <div className="bg-white border-l-4 border-blue-400 p-4 mb-4">
                <p className="font-semibold text-blue-900 mb-2">
                  Modo de Operación Según Consentimiento:
                </p>
                <div className="space-y-3 text-blue-800 text-sm">
                  <div>
                    <p className="font-semibold">✅ Si acepta cookies:</p>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• Se envían datos completos (email hasheado, teléfono hasheado)</li>
                      <li>• Se incluyen cookies de Facebook (_fbp, _fbc)</li>
                      <li>• Atribución precisa de anuncios</li>
                      <li>• Personalización de ofertas</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold">❌ Si rechaza cookies:</p>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• Solo se envían datos agregados y anonimizados</li>
                      <li>• NO se incluye email, teléfono, nombre</li>
                      <li>• NO se incluyen cookies de rastreo</li>
                      <li>• Solo: tipo de evento, valor de transacción, moneda</li>
                      <li>• IP anonimizada (último octeto = 0)</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="bg-white border-l-4 border-green-400 p-4">
                <p className="text-green-900 text-sm">
                  <strong>Base Legal:</strong> Los datos anonimizados NO son considerados
                  datos personales según la Ley 1581 de 2012, por lo tanto NO requieren
                  consentimiento. Solo se utilizan para análisis agregado de tendencias
                  sin identificar individuos.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-6">
              <h4 className="font-semibold text-black mb-4">
                Cookies Necesarias (Siempre Activas)
              </h4>
              <p className="text-gray-700 mb-4">
                Adicionalmente, utilizamos cookies técnicas esenciales que son
                necesarias para el funcionamiento básico del sitio web:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                  <span>Gestión de sesión de usuario</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                  <span>Carrito de compras</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                  <span>Autenticación y seguridad</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                  <span>Preferencias de consentimiento de cookies</span>
                </li>
              </ul>
              <div className="bg-gray-50 border-l-4 border-gray-400 p-4 mt-4">
                <p className="text-gray-800 text-sm">
                  <strong>Nota:</strong> Estas cookies no requieren consentimiento ya que son
                  estrictamente necesarias para proporcionar el servicio solicitado.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="deshabilitar">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Cómo Deshabilitar el Uso de Cookies
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            Los usuarios pueden inhabilitar, en cualquier tiempo, el uso de
            cookies desde sus navegadores, así como eliminar las cookies ya
            creadas.
          </p>

          <div className="bg-gray-50 border border-gray-200 p-6 mb-6">
            <h4 className="font-semibold text-black mb-4">Instrucciones:</h4>
            <p className="text-gray-700 mb-4">
              Diríjase a las secciones de opciones o preferencias de los
              navegadores, ubicadas en la barra de herramientas.
            </p>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
            <div className="flex gap-3">
              <span className="text-yellow-600 font-bold text-lg">⚠</span>
              <div>
                <p className="font-semibold text-yellow-900 mb-1">
                  Consecuencias de Inhabilitar Cookies
                </p>
                <p className="text-yellow-800 mb-4">
                  Inhabilitar las cookies podría comprometer o deshabilitar
                  algunas funcionalidades:
                </p>
                <ul className="space-y-2 text-yellow-800">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>
                      El ingreso sin indicar usuario y contraseña en cada sesión
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>
                      La publicación de comentarios dentro de los sitios web
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>El acceso al contenido sin restricción</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>La seguridad en el uso de la información</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>La agilidad de los servicios de los sitios web</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="cambios">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Cambios en la Política de Cookies
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            Para dar cumplimiento a las necesidades normativas, al igual que con
            las finalidades de brindar una mejor experiencia de navegación y un
            uso seguro de los datos de los usuarios, IMAGIQ S.A.S. se reserva la
            facultad de actualizar esta política de tiempo en tiempo.
          </p>
          <div className="bg-gray-50 border border-gray-200 p-6">
            <p className="text-gray-800">
              La política actualizada podrá consultarse a través de sus canales
              digitales cada vez que los usuarios accedan a los mismos.
            </p>
          </div>

          <div className="bg-black text-white p-8 mt-8 text-center">
            <p className="font-semibold text-lg mb-1">IMAGIQ S.A.S.</p>
            <p className="text-gray-300">NIT 900.565.091-1</p>
            <p className="text-gray-300">
              Calle 98 #8-28 Of 204, Bogotá D.C., Colombia
            </p>
            <p className="text-gray-300 mt-4">Código: SAMCOL251017_0005</p>
          </div>
        </section>
      </div>
    </LegalDocumentLayout>
  );
}
