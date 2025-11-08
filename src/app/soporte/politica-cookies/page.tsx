import { LegalDocumentLayout } from "@/components/legal/LegalDocumentLayout";

const sections = [
  { id: "que-son", title: "¿Qué son las Cookies?", level: 1 },
  { id: "autorizacion", title: "Autorización para el Uso", level: 1 },
  { id: "datos-personales", title: "Tratamiento de Datos", level: 1 },
  { id: "tipos", title: "Tipos de Cookies", level: 1 },
  { id: "deshabilitar", title: "Cómo Deshabilitar Cookies", level: 1 },
  { id: "cambios", title: "Cambios en la Política", level: 1 },
];

export default function PoliticaCookiesPage() {
  return (
    <LegalDocumentLayout
      title="Política de Uso de Cookies"
      sections={sections}
      documentType="Política de Cookies"
      lastUpdated="Octubre 2017"
    >
      <div className="space-y-16">
        <section id="que-son">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">¿Qué son las Cookies?</h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            Las cookies se caracterizan por ser información enviada a través de un canal digital (sitio web o
            aplicación) de propiedad de IMAGIQ S.A.S., información que es almacenada en el navegador del usuario, de
            manera que el sitio web o aplicación puede consultar la actividad del navegador o dispositivo del usuario.
          </p>
          <div className="bg-gray-50 border border-gray-200 p-6">
            <h3 className="font-semibold text-black mb-3">Propósito de las Cookies</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 flex-shrink-0"></span>
                <span>Conocer el mercado de interés del usuario</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 flex-shrink-0"></span>
                <span>Facilitar la navegación por contenidos de interés</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 flex-shrink-0"></span>
                <span>Reconocer hábitos de navegación</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 flex-shrink-0"></span>
                <span>Proporcionar una mejor experiencia de usuario</span>
              </li>
            </ul>
          </div>
          <div className="bg-gray-50 border-l-4 border-gray-400 p-6 mt-6">
            <p className="text-gray-800 text-sm">
              <strong>Nota Importante:</strong> Las cookies NO son spam, gusanos informáticos, ni ningún otro tipo de
              virus que pueda dañar los navegadores o dispositivos del usuario.
            </p>
          </div>
        </section>

        <section id="autorizacion">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Información General y Autorización para el Uso de Cookies
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            Para mejorar la experiencia de usuario y la navegación en sus canales digitales, IMAGIQ S.A.S. utiliza
            cookies propias y de terceros.
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
            <div className="flex gap-3">
              <span className="text-yellow-600 font-bold text-lg">⚠</span>
              <div>
                <p className="font-semibold text-yellow-900 mb-1">Autorización Implícita</p>
                <p className="text-yellow-800">
                  Si el usuario continúa navegando a través de los canales digitales de IMAGIQ S.A.S., luego de que se
                  le informa de manera completa sobre el uso de cookies, se entiende la autorización inequívoca para el
                  almacenamiento y utilización de cookies con las finalidades contenidas en esta Política.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="datos-personales">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">Tratamiento de Datos Personales</h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            En caso tal de realizarse labores de tratamiento de datos personales asociadas a la obtención y
            almacenamiento de cookies por parte de IMAGIQ S.A.S., el usuario autoriza su tratamiento para las labores
            identificadas en esta política de cookies.
          </p>
          <div className="bg-gray-50 border border-gray-200 p-6">
            <h4 className="font-semibold text-black mb-4">Derechos del Titular:</h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 flex-shrink-0"></span>
                <span>Conocer, actualizar, rectificar y acceder a su información</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 flex-shrink-0"></span>
                <span>Solicitar prueba de la autorización y revocarla</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 flex-shrink-0"></span>
                <span>Presentar quejas ante la Superintendencia de Industria y Comercio</span>
              </li>
            </ul>
            <div className="mt-6 space-y-2 border-l-2 border-gray-300 pl-4">
              <p className="text-gray-700">
                <strong>Email:</strong>{" "}
                <a href="mailto:DATOS.PERSONALES@IMAGIQ.CO" className="underline hover:text-black">
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
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">Tipos de Cookies</h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            Para la navegación a través de sus canales digitales IMAGIQ S.A.S. utiliza los siguientes tipos de Cookies:
          </p>

          <div className="border border-gray-200 overflow-hidden mb-6">
            <table className="w-full">
              <thead>
                <tr className="bg-black text-white">
                  <th className="px-6 py-4 text-left font-semibold">Tipo de Cookie</th>
                  <th className="px-6 py-4 text-left font-semibold">Descripción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">Cookies Propias</td>
                  <td className="px-6 py-4 text-gray-700">
                    Las que envían los sitios web y/o aplicaciones gestionadas por IMAGIQ S.A.S.
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">Cookies de Terceros</td>
                  <td className="px-6 py-4 text-gray-700">
                    Las que se envían desde un equipo o dominio que no es gestionado por IMAGIQ S.A.S.
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">Cookies de Personalización</td>
                  <td className="px-6 py-4 text-gray-700">
                    Permiten acceder al servicio con características predefinidas según criterios del navegador
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">Cookies de Análisis</td>
                  <td className="px-6 py-4 text-gray-700">
                    Permiten seguir y analizar el comportamiento de los usuarios para mejorar la experiencia
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">Cookies Publicitarias</td>
                  <td className="px-6 py-4 text-gray-700">
                    Permiten mejorar la gestión de espacios publicitarios y desarrollar perfiles específicos
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">Cookies Técnicas</td>
                  <td className="px-6 py-4 text-gray-700">
                    Permiten navegar y usar las opciones o servicios del canal digital
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">Cookies de Seguridad</td>
                  <td className="px-6 py-4 text-gray-700">
                    Permiten autenticar usuarios y proteger datos frente a usos no autorizados
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="deshabilitar">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">Cómo Deshabilitar el Uso de Cookies</h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            Los usuarios pueden inhabilitar, en cualquier tiempo, el uso de cookies desde sus navegadores, así como
            eliminar las cookies ya creadas.
          </p>

          <div className="bg-gray-50 border border-gray-200 p-6 mb-6">
            <h4 className="font-semibold text-black mb-4">Instrucciones:</h4>
            <p className="text-gray-700 mb-4">
              Diríjase a las secciones de opciones o preferencias de los navegadores, ubicadas en la barra de
              herramientas.
            </p>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
            <div className="flex gap-3">
              <span className="text-yellow-600 font-bold text-lg">⚠</span>
              <div>
                <p className="font-semibold text-yellow-900 mb-1">Consecuencias de Inhabilitar Cookies</p>
                <p className="text-yellow-800 mb-4">
                  Inhabilitar las cookies podría comprometer o deshabilitar algunas funcionalidades:
                </p>
                <ul className="space-y-2 text-yellow-800">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>El ingreso sin indicar usuario y contraseña en cada sesión</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>La publicación de comentarios dentro de los sitios web</span>
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
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">Cambios en la Política de Cookies</h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            Para dar cumplimiento a las necesidades normativas, al igual que con las finalidades de brindar una mejor
            experiencia de navegación y un uso seguro de los datos de los usuarios, IMAGIQ S.A.S. se reserva la facultad
            de actualizar esta política de tiempo en tiempo.
          </p>
          <div className="bg-gray-50 border border-gray-200 p-6">
            <p className="text-gray-800">
              La política actualizada podrá consultarse a través de sus canales digitales cada vez que los usuarios
              accedan a los mismos.
            </p>
          </div>

          <div className="bg-black text-white p-8 mt-8 text-center">
            <p className="font-semibold text-lg mb-1">IMAGIQ S.A.S.</p>
            <p className="text-gray-300">NIT 900.565.091-1</p>
            <p className="text-gray-300">Calle 98 #8-28 Of 204, Bogotá D.C., Colombia</p>
            <p className="text-gray-300 mt-4">Código: SAMCOL251017_0005</p>
          </div>
        </section>
      </div>
    </LegalDocumentLayout>
  );
}
