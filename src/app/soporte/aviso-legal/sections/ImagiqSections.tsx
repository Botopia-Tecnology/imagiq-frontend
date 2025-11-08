/**
 * Contenido para las secciones de IMAGIQ SAS y terceros
 */

import {
  LegalH2,
  LegalH3,
  LegalH4,
  LegalParagraph,
} from "@/components/legal/LegalComponents";

export function ImagiqSasSection() {
  return (
    <section id="imagiq-sas">
      <LegalH2>IMAGIQ S.A.S.</LegalH2>

      <div className="space-y-4">
        <div>
          <LegalH3>1. Información del Portal</LegalH3>
          <LegalParagraph>
            IMAGIQ obtiene la información del Portal de fuentes confiables, pero
            no garantiza su exactitud, completitud o actualización. Por ello, se
            reserva el derecho de corregir errores, omisiones o inexactitudes, y
            de realizar cambios sin previo aviso. Ofrecemos disculpas por
            cualquier inconveniente que esto pueda causar.
          </LegalParagraph>
        </div>

        <div>
          <LegalH3>2. Limitaciones y Restricciones para Usuarios</LegalH3>
          <LegalParagraph className="mb-3">
            IMAGIQ advierte que existen algunas limitaciones y restricciones
            para los Usuarios de este Portal y otros relacionados. Pedimos que
            sean respetadas las reglas descritas a continuación:
          </LegalParagraph>

          <div className="space-y-4 ml-4">
            <div>
              <LegalH4>
                (i) Respeto y protección de los Servicios y Materiales
              </LegalH4>
              <LegalParagraph>
                Este Portal contiene información que es propiedad de IMAGIQ y
                Samsung, sus empresas afiliadas, relacionadas y vinculadas. Han
                invertido dinero, tiempo y esfuerzos para desarrollarlos, lo
                cual es reconocido de manera expresa por parte de los Usuarios.
                Dicha propiedad incluye, pero no se limita, a copyrights, marcas
                registradas e información sobre tecnología, estos son provistos
                en forma de textos, gráficos, audio, video, descargas, enlaces y
                códigos fuente (en adelante &ldquo;Servicios y
                Materiales&rdquo;). IMAGIQ y Samsung retienen todos los derechos
                sobre dichos Servicios y Materiales, los cuales son provistos a
                los Usuarios solo para que puedan hacer un uso correcto del
                Portal. IMAGIQ no brinda ninguna licencia o derechos de
                propiedad sobre dichos Servicios y Materiales.
              </LegalParagraph>
            </div>

            <div>
              <LegalH4>(ii) Contenido</LegalH4>
              <LegalParagraph>
                Los contenidos del Portal tienen únicamente una finalidad
                informativa y en ninguna circunstancia deben usarse ni
                considerarse como oferta de venta, solicitud de una oferta de
                compra ni recomendación para realizar cualquier otra operación,
                salvo que así se indique expresamente. A pesar de que el Usuario
                puede descargar libremente Servicios y Materiales de este Portal
                y otros relacionados, IMAGIQ retiene todos los derechos sobre
                todos los textos y gráficos. El Usuario no tiene derecho de
                reproducir los mismos excepto para su uso personal.
              </LegalParagraph>
            </div>

            <div>
              <LegalH4>(iii) Uso de la información</LegalH4>
              <LegalParagraph>
                IMAGIQ únicamente será responsable por la información publicada
                en lo que tenga que ver con el uso del Portal. IMAGIQ no será
                responsable por el uso que se realice de cualquiera de los
                Servicios y Materiales o cualquiera otra información publicada
                en el Portal o sus redes sociales, cuando sea usada con fines
                diferentes a los previamente mencionados.
              </LegalParagraph>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function InformacionTercerosSection() {
  return (
    <section id="informacion-terceros">
      <LegalH2>INFORMACIÓN Y SITIOS WEB DE TERCEROS</LegalH2>
      <LegalParagraph>
        El Portal puede contener enlaces a páginas de terceros. IMAGIQ S.A.S. no
        controla ni respalda dichos contenidos ni es responsable de su
        funcionamiento, accesibilidad, exactitud o actualizaciones. Los Usuarios
        aceptan que IMAGIQ S.A.S. no es responsable de pérdidas o daños
        derivados del uso de contenido de terceros. Los Usuarios serán
        informados en el momento en que ya no se encuentren dentro del Portal.
      </LegalParagraph>
    </section>
  );
}
