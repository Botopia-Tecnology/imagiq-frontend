/**
 * Contenido para la sección de Aviso Legal
 */

import Link from "next/link";
import { LEGAL_ROUTES } from "@/constants/routes";
import {
  LegalH2,
  LegalParagraph,
  LegalTable,
  LegalWarning,
  LegalInfoCard,
} from "@/components/legal/LegalComponents";

export function AvisoLegalSection() {
  return (
    <section id="aviso-legal">
      <LegalH2>AVISO LEGAL</LegalH2>
      <LegalParagraph>
        <strong>IMAGIQ S.A.S.</strong>, sociedad debidamente constituida en
        Colombia, identificada con <strong>NIT. 900.565.091-1</strong>, con
        domicilio en la Calle 98 #8-28 Of 204 (Edificio 28), Distrito Capital de
        Bogotá - Colombia (en adelante &ldquo;IMAGIQ&rdquo;) agradece su visita
        a este Portal. El contenido del Portal (el &ldquo;Portal&rdquo;) está
        sujeto a las condiciones aquí expuestas, para lo cual IMAGIQ le
        proporciona la siguiente información de su interés.
      </LegalParagraph>
      <LegalParagraph>
        Las personas que accedan, naveguen o utilicen este Portal (en adelante
        el &ldquo;Usuario&rdquo; o los &ldquo;Usuarios&rdquo;) reconocen haber
        leído, entendido y aceptado los términos y condiciones de uso del mismo,
        así como cumplir con los lineamientos de uso informados, y las demás
        leyes y normativas aplicables. Si el Usuario no está de acuerdo con las
        condiciones de uso y las políticas de IMAGIQ que se señalan en el
        presente documento, le solicitamos abstenerse de utilizar este Portal.
      </LegalParagraph>
      <LegalParagraph>
        Se sugiere imprimir copias de la información necesaria, guardar los
        archivos en su dispositivo y establecer enlaces hacia este servidor en
        documentos propios.
      </LegalParagraph>
    </section>
  );
}

export function CondicionesGeneralesSection() {
  return (
    <section id="condiciones-generales">
      <LegalH2>CONDICIONES GENERALES DE USO</LegalH2>
      <LegalParagraph>
        Este Portal tiene como principal función la comercialización de
        productos tecnológicos y electrónicos. El acceso, navegación o uso del
        Portal otorga la condición de Usuario e implica la aceptación de las
        siguientes políticas, según las mismas le sean aplicables a cada uno de
        los Usuarios:
      </LegalParagraph>

      <LegalInfoCard className="mb-6">
        <LegalTable
          caption="Políticas y documentos legales disponibles en el portal de IMAGIQ"
          headers={["Documento", "Descripción"]}
          rows={[
            {
              cells: ["Aviso Legal", "Hace referencia al presente documento"],
            },
            {
              cells: [
                "Términos y condiciones de uso del Portal",
                <>
                  Disponible en:{" "}
                  <Link
                    href={LEGAL_ROUTES.AVISO_LEGAL}
                    className="text-gray-900 hover:text-gray-600 underline"
                  >
                    {LEGAL_ROUTES.AVISO_LEGAL}
                  </Link>
                </>,
              ],
            },
            {
              cells: [
                "Términos Políticas Generales",
                <>
                  Disponible en:{" "}
                  <Link
                    href={LEGAL_ROUTES.POLITICAS_GENERALES}
                    className="text-gray-900 hover:text-gray-600 underline"
                  >
                    {LEGAL_ROUTES.POLITICAS_GENERALES}
                  </Link>
                </>,
              ],
            },
            {
              cells: [
                "Política de Cookies",
                <>
                  Este Portal se rige por la política de cookies disponible en:{" "}
                  <Link
                    href={LEGAL_ROUTES.POLITICA_COOKIES}
                    className="text-gray-900 hover:text-gray-600 underline"
                  >
                    {LEGAL_ROUTES.POLITICA_COOKIES}
                  </Link>
                  . Los sitios web de terceros referenciados tienen sus propias
                  políticas de protección de datos, las cuales son
                  independientes de IMAGIQ.
                </>,
              ],
            },
            {
              cells: [
                "Política de Tratamiento de Información",
                <>
                  Los Usuarios tienen derecho a conocer, actualizar, rectificar
                  y, cuando sea procedente, suprimir sus datos personales o
                  revocar la autorización para su tratamiento. Para obtener más
                  información, consulte nuestra política completa en:{" "}
                  <Link
                    href={LEGAL_ROUTES.TRATAMIENTO_DATOS_PERSONALES}
                    className="text-gray-900 hover:text-gray-600 underline"
                  >
                    {LEGAL_ROUTES.TRATAMIENTO_DATOS_PERSONALES}
                  </Link>
                </>,
              ],
            },
            {
              cells: [
                "Política de Facturación",
                <>
                  Disponible en:{" "}
                  <Link
                    href={LEGAL_ROUTES.POLITICAS_GENERALES}
                    className="text-gray-900 hover:text-gray-600 underline"
                  >
                    {LEGAL_ROUTES.POLITICAS_GENERALES}
                  </Link>
                </>,
              ],
            },
            {
              cells: [
                "Política de Garantías y Retracto",
                <>
                  Disponible en:{" "}
                  <Link
                    href={LEGAL_ROUTES.POLITICAS_GENERALES}
                    className="text-gray-900 hover:text-gray-600 underline"
                  >
                    {LEGAL_ROUTES.POLITICAS_GENERALES}
                  </Link>
                </>,
              ],
            },
          ]}
        />
      </LegalInfoCard>

      <LegalWarning title="IMPORTANTE">
        El acceso al Portal no supone el inicio de una relación comercial con
        IMAGIQ S.A.S.
      </LegalWarning>
    </section>
  );
}
