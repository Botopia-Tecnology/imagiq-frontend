import { LegalDocumentLayout } from "@/components/legal/LegalDocumentLayout";

const sections = [
  { id: "aviso-legal", title: "Aviso Legal", level: 1 },
  {
    id: "condiciones-generales",
    title: "Condiciones Generales de Uso",
    level: 1,
  },
  { id: "imagiq-sas", title: "IMAGIQ S.A.S.", level: 1 },
  {
    id: "informacion-terceros",
    title: "Información y Sitios Web de Terceros",
    level: 1,
  },
  { id: "contacto", title: "Contacto", level: 1 },
];

export default function AvisoLegalPage() {
  return (
    <LegalDocumentLayout
      title="Aviso Legal"
      sections={sections}
      documentType="Aviso Legal"
      lastUpdated="2025"
    >
      <div className="space-y-8">
        <section id="aviso-legal">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">AVISO LEGAL</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>IMAGIQ S.A.S.</strong>, sociedad debidamente constituida en
            Colombia, identificada con <strong>NIT. 900.565.091-1</strong>, con
            domicilio en la Calle 98 #8-28 Of 204 (Edificio 28), Distrito
            Capital de Bogotá - Colombia (en adelante &ldquo;IMAGIQ&rdquo;)
            agradece su visita a este Portal. El contenido del Portal (el
            &ldquo;Portal&rdquo;) está sujeto a las condiciones aquí expuestas,
            para lo cual IMAGIQ le proporciona la siguiente información de su
            interés.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Las personas que accedan, naveguen o utilicen este Portal (en
            adelante el &ldquo;Usuario&rdquo; o los &ldquo;Usuarios&rdquo;)
            reconocen haber leído, entendido y aceptado los términos y
            condiciones de uso del mismo, así como cumplir con los lineamientos
            de uso informados, y las demás leyes y normativas aplicables. Si el
            Usuario no está de acuerdo con las condiciones de uso y las
            políticas de IMAGIQ que se señalan en el presente documento, le
            solicitamos abstenerse de utilizar este Portal.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Se sugiere imprimir copias de la información necesaria, guardar los
            archivos en su dispositivo y establecer enlaces hacia este servidor
            en documentos propios.
          </p>
        </section>

        <section id="condiciones-generales">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            CONDICIONES GENERALES DE USO
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Este Portal tiene como principal función la comercialización de
            productos tecnológicos y electrónicos. El acceso, navegación o uso
            del Portal otorga la condición de Usuario e implica la aceptación de
            las siguientes políticas, según las mismas le sean aplicables a cada
            uno de los Usuarios:
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <table className="w-full">
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-3 font-semibold text-gray-900">
                    Aviso Legal
                  </td>
                  <td className="py-3 text-gray-700">
                    Hace referencia al presente documento
                  </td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold text-gray-900">
                    Términos y condiciones de uso del Portal
                  </td>
                  <td className="py-3 text-gray-700">
                    Disponible en:{" "}
                    <a
                      href="/soporte/aviso-legal"
                      className="text-gray-900 hover:text-gray-600 underline"
                    >
                      /soporte/aviso-legal
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold text-gray-900">
                    Términos Políticas Generales
                  </td>
                  <td className="py-3 text-gray-700">
                    Disponible en:{" "}
                    <a
                      href="/soporte/politicas-generales"
                      className="text-gray-900 hover:text-gray-600 underline"
                    >
                      /soporte/politicas-generales
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold text-gray-900">
                    Política de Cookies
                  </td>
                  <td className="py-3 text-gray-700">
                    Este Portal se rige por la política de cookies disponible
                    en:{" "}
                    <a
                      href="/soporte/politica-cookies"
                      className="text-gray-900 hover:text-gray-600 underline"
                    >
                      /soporte/politica-cookies
                    </a>
                    . Los sitios web de terceros referenciados tienen sus
                    propias políticas de protección de datos, las cuales son
                    independientes de IMAGIQ.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold text-gray-900">
                    Política de Tratamiento de Información
                  </td>
                  <td className="py-3 text-gray-700">
                    Los Usuarios tienen derecho a conocer, actualizar,
                    rectificar y, cuando sea procedente, suprimir sus datos
                    personales o revocar la autorización para su tratamiento.
                    Para obtener más información, consulte nuestra política
                    completa en:{" "}
                    <a
                      href="/soporte/tratamiento-datos-personales"
                      className="text-gray-900 hover:text-gray-600 underline"
                    >
                      /soporte/tratamiento-datos-personales
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold text-gray-900">
                    Política de Facturación
                  </td>
                  <td className="py-3 text-gray-700">
                    Disponible en:{" "}
                    <a
                      href="/soporte/politicas-generales"
                      className="text-gray-900 hover:text-gray-600 underline"
                    >
                      /soporte/politicas-generales
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold text-gray-900">
                    Política de Garantías y Retracto
                  </td>
                  <td className="py-3 text-gray-700">
                    Disponible en:{" "}
                    <a
                      href="/soporte/politicas-generales"
                      className="text-gray-900 hover:text-gray-600 underline"
                    >
                      /soporte/politicas-generales
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
            <p className="font-semibold text-yellow-900">IMPORTANTE:</p>
            <p className="text-yellow-800">
              El acceso al Portal no supone el inicio de una relación comercial
              con IMAGIQ S.A.S.
            </p>
          </div>
        </section>

        <section id="imagiq-sas">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            IMAGIQ S.A.S.
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                1. Información del Portal
              </h3>
              <p className="text-gray-700 leading-relaxed">
                IMAGIQ obtiene la información del Portal de fuentes confiables,
                pero no garantiza su exactitud, completitud o actualización. Por
                ello, se reserva el derecho de corregir errores, omisiones o
                inexactitudes, y de realizar cambios sin previo aviso. Ofrecemos
                disculpas por cualquier inconveniente que esto pueda causar.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                2. Limitaciones y Restricciones para Usuarios
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                IMAGIQ advierte que existen algunas limitaciones y restricciones
                para los Usuarios de este Portal y otros relacionados. Pedimos
                que sean respetadas las reglas descritas a continuación:
              </p>

              <div className="space-y-4 ml-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    (i) Respeto y protección de los Servicios y Materiales
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    Este Portal contiene información que es propiedad de IMAGIQ
                    y Samsung, sus empresas afiliadas, relacionadas y
                    vinculadas. Han invertido dinero, tiempo y esfuerzos para
                    desarrollarlos, lo cual es reconocido de manera expresa por
                    parte de los Usuarios. Dicha propiedad incluye, pero no se
                    limita, a copyrights, marcas registradas e información sobre
                    tecnología, estos son provistos en forma de textos,
                    gráficos, audio, video, descargas, enlaces y códigos fuente
                    (en adelante &ldquo;Servicios y Materiales&rdquo;). IMAGIQ y
                    Samsung retienen todos los derechos sobre dichos Servicios y
                    Materiales, los cuales son provistos a los Usuarios solo
                    para que puedan hacer un uso correcto del Portal. IMAGIQ no
                    brinda ninguna licencia o derechos de propiedad sobre dichos
                    Servicios y Materiales.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    (ii) Contenido
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    Los contenidos del Portal tienen únicamente una finalidad
                    informativa y en ninguna circunstancia deben usarse ni
                    considerarse como oferta de venta, solicitud de una oferta
                    de compra ni recomendación para realizar cualquier otra
                    operación, salvo que así se indique expresamente. A pesar de
                    que el Usuario puede descargar libremente Servicios y
                    Materiales de este Portal y otros relacionados, IMAGIQ
                    retiene todos los derechos sobre todos los textos y
                    gráficos. El Usuario no tiene derecho de reproducir los
                    mismos excepto para su uso personal.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    (iii) Uso de la información
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    IMAGIQ únicamente será responsable por la información
                    publicada en lo que tenga que ver con el uso del Portal.
                    IMAGIQ no será responsable por el uso que se realice de
                    cualquiera de los Servicios y Materiales o cualquiera otra
                    información publicada en el Portal o sus redes sociales,
                    cuando sea usada con fines diferentes a los previamente
                    mencionados.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="informacion-terceros">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            INFORMACIÓN Y SITIOS WEB DE TERCEROS
          </h2>
          <p className="text-gray-700 leading-relaxed">
            El Portal puede contener enlaces a páginas de terceros. IMAGIQ
            S.A.S. no controla ni respalda dichos contenidos ni es responsable
            de su funcionamiento, accesibilidad, exactitud o actualizaciones.
            Los Usuarios aceptan que IMAGIQ S.A.S. no es responsable de pérdidas
            o daños derivados del uso de contenido de terceros. Los Usuarios
            serán informados en el momento en que ya no se encuentren dentro del
            Portal.
          </p>
        </section>

        <section id="contacto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">CONTACTO</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            En caso de requerir ponerse en contacto con IMAGIQ, ponemos a su
            disposición las siguientes direcciones y mecanismos de contacto:
          </p>
          <div className="bg-gray-50 rounded-lg p-6 space-y-3">
            <div className="flex items-start">
              <span className="font-semibold text-gray-900 min-w-[120px]">
                Correo electrónico:
              </span>
              <a
                href="mailto:PQRSAMCOL@IMAGIQ.CO"
                className="text-gray-900 hover:text-gray-600 underline"
              >
                PQRSAMCOL@IMAGIQ.CO
              </a>
            </div>
            <div className="flex items-start">
              <span className="font-semibold text-gray-900 min-w-[120px]">
                Canales de atención:
              </span>
              <span className="text-gray-700">
                WhatsApp{" "}
                <a
                  href="https://wa.me/573228639389"
                  className="text-gray-900 hover:text-gray-600 underline"
                >
                  +57 322 8639389
                </a>{" "}
                o{" "}
                <a
                  href="tel:+576017441176"
                  className="text-gray-900 hover:text-gray-600 underline"
                >
                  (601) 7441176
                </a>
              </span>
            </div>
            <div className="flex items-start">
              <span className="font-semibold text-gray-900 min-w-[120px]">
                Portal:
              </span>
              <a
                href="https://imagiq.com/"
                className="text-gray-900 hover:text-gray-600 underline"
              >
                https://imagiq.com/
              </a>
            </div>
          </div>
        </section>
      </div>
    </LegalDocumentLayout>
  );
}
