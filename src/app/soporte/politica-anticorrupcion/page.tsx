import { LegalDocumentLayout } from "@/components/legal/LegalDocumentLayout";

const sections = [
  { id: "introduccion", title: "Introducción", level: 1 },
  { id: "alcance", title: "Alcance", level: 1 },
  { id: "principios", title: "Principios Básicos", level: 1 },
  { id: "regalos", title: "Regalos y Hospitalidad", level: 1 },
  { id: "donaciones", title: "Donaciones y Patrocinios", level: 1 },
  { id: "conflictos", title: "Conflictos de Intereses", level: 1 },
  { id: "registros", title: "Libros de Registros", level: 1 },
  { id: "responsabilidades", title: "Roles y Responsabilidades", level: 1 },
  { id: "capacitaciones", title: "Capacitaciones", level: 1 },
  { id: "comunicacion", title: "Comunicación y Denuncia", level: 1 },
  { id: "controles", title: "Controles Financieros", level: 1 },
  { id: "sanciones", title: "Acciones Disciplinarias", level: 1 },
];

export default function PoliticaAnticorrupcionPage() {
  return (
    <LegalDocumentLayout
      title="Política Anticorrupción y Soborno Samsung"
      sections={sections}
      documentType="Política Anticorrupción"
      lastUpdated="Agosto 2023"
    >
      <div className="space-y-16">
        <section id="introduccion">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">Introducción</h2>
          <div className="bg-gray-50 border border-gray-200 p-6 mb-6">
            <p className="text-gray-800 mb-3">
              <strong>Código:</strong> SAMCOL-COM-PL007
            </p>
            <p className="text-gray-800 mb-3">
              <strong>Versión:</strong> 003
            </p>
            <p className="text-gray-800">
              <strong>Fecha:</strong> Agosto de 2023
            </p>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-6">
            <div className="flex gap-3">
              <span className="text-yellow-600 font-bold text-lg">⚠</span>
              <div>
                <p className="font-semibold text-yellow-900 mb-1">Política de Cero Tolerancia</p>
                <p className="text-yellow-800">
                  SAMSUNG tiene una política de Cero Tolerancia contra la corrupción y el soborno, y no ignora ni pasa
                  por alto deliberadamente ningún acto de corrupción.
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-black mb-4">Propósito</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Asegurar que todos los accionistas, colaboradores, proveedores, clientes, aliados estratégicos y demás
            partes interesadas cumplan con:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-gray-800 to-black text-white p-6">
              <h4 className="font-semibold mb-2">PTEE</h4>
              <p className="text-gray-200 text-sm">
                Programa de Transparencia y Ética Empresarial – Soborno Transnacional
              </p>
              <p className="text-gray-300 text-xs mt-2">Resolución 100-006261 del 2 de octubre de 2020</p>
            </div>
            <div className="bg-gradient-to-br from-gray-700 to-gray-900 text-white p-6">
              <h4 className="font-semibold mb-2">FCPA</h4>
              <p className="text-gray-200 text-sm">Foreign Corrupt Practices Act</p>
              <p className="text-gray-300 text-xs mt-2">Ley de Prácticas Corruptas en el Extranjero (EE.UU.)</p>
            </div>
          </div>
        </section>

        <section id="alcance">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">Alcance</h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            La política anticorrupción y sobornos debe ser aplicada por todos los Colaboradores, miembros de la Alta
            Dirección, asociados, y administradores de SAMSUNG, de manera que en su actuar se reflejen los principios
            propios de la empresa.
          </p>
          <div className="bg-gray-50 border-l-4 border-gray-400 p-6">
            <p className="text-gray-800">
              Esta política aplica a todas las contrapartes que en virtud de un contrato establecen una relación
              comercial o laboral con SAMSUNG.
            </p>
          </div>
        </section>

        <section id="principios">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">Principios Básicos</h2>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6">
              <h3 className="font-semibold text-black mb-3">Cumplimiento de Leyes, Políticas y Directrices</h3>
              <p className="text-gray-700 mb-3">
                Las Contrapartes son responsables de cumplir con todas las leyes aplicables contra la corrupción y el
                soborno.
              </p>
              <div className="border-l-2 border-gray-300 pl-4">
                <p className="text-gray-700 mb-2">
                  <strong>Leyes nacionales aplicables:</strong>
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                    <span>Ley 1778 de 2016 - combate a la corrupción y el soborno</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                    <span>Ley 1573 de 2012 - Convención contra el cohecho</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 p-6">
              <h3 className="font-semibold text-black mb-3">Actividades Prohibidas</h3>
              <div className="space-y-3 text-gray-800">
                <div className="flex items-start gap-3">
                  <span className="text-xl font-bold text-gray-400 shrink-0">✗</span>
                  <span>
                    Ofrecer, prometer, entregar, aceptar y autorizar una ventaja indebida de cualquier valor
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl font-bold text-gray-400 shrink-0">✗</span>
                  <span>Realizar pagos a funcionarios del gobierno para agilizar servicios (pagos de facilitación)</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl font-bold text-gray-400 shrink-0">✗</span>
                  <span>Solicitar a entidades gubernamentales acciones ilegales o abuso de autoridad</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl font-bold text-gray-400 shrink-0">✗</span>
                  <span>Promover conflictos de interés en la contratación o vinculación laboral/comercial</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="regalos">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">Regalos, Hospitalidad y Otros Beneficios</h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            Brindar regalos u hospitalidad para cumplir un propósito comercial legítimo o mantener una relación
            comercial es permisible si se cumplen todos los siguientes principios:
          </p>

          <div className="border border-gray-200 overflow-hidden mb-6">
            <table className="w-full">
              <thead>
                <tr className="bg-black text-white">
                  <th className="px-6 py-4 text-left font-semibold">Condición</th>
                  <th className="px-6 py-4 text-left font-semibold">Descripción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">Funcionarios Gubernamentales</td>
                  <td className="px-6 py-4 text-gray-700">
                    No se entregan obsequios ni hospitalidad a funcionarios públicos
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">Valor Razonable</td>
                  <td className="px-6 py-4 text-gray-700">
                    El valor debe ser razonable y no excesivo, considerando la cultura y prácticas de la industria
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">Transparencia</td>
                  <td className="px-6 py-4 text-gray-700">Los obsequios se entregan de forma transparente y abierta</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">Acompañamiento</td>
                  <td className="px-6 py-4 text-gray-700">
                    Los colaboradores de Samsung deben acompañar a la contraparte al ofrecer hospitalidad
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
            <div className="flex gap-3">
              <span className="text-yellow-600 font-bold text-lg">⚠</span>
              <div>
                <p className="font-semibold text-yellow-900 mb-1">Principio General</p>
                <p className="text-yellow-800">
                  Como principio, está prohibido recibir obsequios, por lo tanto, deben ser cortésmente rechazados. Solo
                  se puede aceptar un obsequio si tiene un valor insignificante y es un artículo promocional.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="donaciones">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">Donaciones, Contribuciones y Patrocinios</h2>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6">
              <h3 className="font-semibold text-black mb-3">Donaciones Políticas</h3>
              <p className="text-gray-700">
                Las contribuciones a partidos políticos, movimientos políticos o sus grupos de apoyo están
                <strong> prohibidas</strong> de acuerdo con los principios éticos de SAMSUNG S.A.
              </p>
            </div>

            <div className="bg-gray-50 p-6">
              <h3 className="font-semibold text-black mb-3">Donaciones, Aportes y Patrocinios Permitidos</h3>
              <p className="text-gray-700 mb-4">
                Para SAMSUNG está permitido hacer donaciones humanitarias legítimas, contribuciones o patrocinios a
                instituciones y organizaciones creíbles. Sin embargo, se debe considerar:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                  <span>
                    No podrán utilizarse como medio para ejercer influencia o presión indebida en la toma de decisiones
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                  <span>Deben ser transparentes, justos, rigurosos y consistentes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                  <span>Seguir el procedimiento respectivo de la empresa</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="conflictos">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">Conflictos de Intereses</h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            Mediante la incorporación de directrices para el manejo de conflictos de interés se enuncian aquellas
            circunstancias donde se puedan llegar a contraponer los intereses de las contrapartes; así como los
            principios y valores expresados en el Código de conducta.
          </p>
          <div className="bg-gray-50 border border-gray-200 p-6">
            <p className="text-gray-800 mb-4">
              <strong>Definición:</strong> La situación en virtud de la cual una persona debido a su actividad se
              enfrenta a distintas alternativas de conducta, o puede incidir en la adopción de alguna conducta, con
              relación a intereses incompatibles.
            </p>
            <p className="text-gray-700">
              Las contrapartes deben informar aquellas situaciones que contengan un Conflicto de Interés tan pronto sean
              percibidas y antes de tomar cualquier decisión.
            </p>
          </div>
        </section>

        <section id="registros">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">Libros de Registros</h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            Es política de SAMSUNG registrar y mantener con precisión todo tipo de pagos y gastos en relación a las
            premisas establecidas en los libros y registros contables.
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
            <div className="flex gap-3">
              <span className="text-yellow-600 font-bold text-lg">⚠</span>
              <div>
                <p className="font-semibold text-yellow-900 mb-1">Prohibición</p>
                <p className="text-yellow-800">
                  Está estrictamente prohibido ocultar o revelar información y/o documentación contable que vaya en
                  contravención de la presente política.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="responsabilidades">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">Roles y Responsabilidades</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 p-6">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Alta Dirección</h3>
              <p className="text-gray-700 text-sm">
                Responsables de implementar los procedimientos y sistemas de control para el cumplimiento de la política
              </p>
            </div>

            <div className="border border-gray-200 p-6">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Oficial de Cumplimiento</h3>
              <p className="text-gray-700 text-sm">
                Autoridad y responsabilidad para prevenir, detectar y dar respuesta a la Política Anticorrupción
              </p>
            </div>

            <div className="border border-gray-200 p-6">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Risk Management</h3>
              <p className="text-gray-700 text-sm">
                Evaluar la calidad y eficiencia del sistema y procedimientos de seguimiento y control
              </p>
            </div>

            <div className="border border-gray-200 p-6">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Colaboradores</h3>
              <p className="text-gray-700 text-sm">
                Conocer y cumplir con el Manual de Ética, PTEE y todos los procedimientos relacionados
              </p>
            </div>
          </div>
        </section>

        <section id="capacitaciones">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">Capacitaciones</h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            Con el fin de asegurar que contrapartes conozcan y comprendan las reglas de esta política, SAMSUNG a través
            del Oficial de Cumplimiento, promoverá capacitaciones anticorrupción, una (1) vez al año.
          </p>
        </section>

        <section id="comunicacion">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">Comunicación y Denuncia</h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            Toda Contraparte que tenga conocimiento o sospechas justificadas del incumplimiento de la presente política,
            deberá denunciar por los siguientes canales:
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-3">Email Local</h3>
              <a href="mailto:compliance.co@samsung.com" className="text-gray-900 hover:text-gray-600 underline">
                compliance.co@samsung.com
              </a>
            </div>

            <div className="border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-3">Email Regional</h3>
              <a href="mailto:compliancela@samsung.com" className="text-gray-900 hover:text-gray-600 underline">
                compliancela@samsung.com
              </a>
            </div>

            <div className="border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-3">Línea Telefónica</h3>
              <p className="text-gray-700">01 800-9136740</p>
            </div>

            <div className="border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-3">Página Web Global</h3>
              <p className="text-gray-700 text-sm break-all">seccompliance.net</p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 p-6">
            <h4 className="font-semibold text-black mb-3">Política de No Represalias</h4>
            <p className="text-gray-700">
              Cualquier persona que, de buena fe, informe posibles incumplimientos a esta política no puede ser objeto
              de represalias, reprimendas o cualquier otro acto adverso o discriminatorio.
            </p>
          </div>
        </section>

        <section id="controles">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">Controles Financieros</h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            Los controles financieros se refieren a los sistemas de gestión y procesos que implementa SAMSUNG para
            gestionar de manera correcta las transacciones financieras.
          </p>
          <div className="bg-gray-50 border border-gray-200 p-6">
            <h4 className="font-semibold text-black mb-4">Controles Implementados:</h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                <span>Separación de funciones en iniciación y aprobación de pagos</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                <span>Proceso de aprobación virtual a través del portal único (Knox Portal)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                <span>Necesidad de dos o más aprobaciones virtuales para pagos</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                <span>Niveles de aprobación según el monto de la transacción</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                <span>Auditorías financieras periódicas</span>
              </li>
            </ul>
          </div>
        </section>

        <section id="sanciones">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">Acciones Disciplinarias y Sanciones</h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            La violación de esta política, lineamientos y leyes establecidas contra la corrupción y el soborno serán
            motivo de medidas disciplinarias.
          </p>

          <div className="border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-black text-white">
                  <th className="px-6 py-4 text-left font-semibold">Tipo de Falta</th>
                  <th className="px-6 py-4 text-left font-semibold">Sanción</th>
                  <th className="px-6 py-4 text-left font-semibold">Descripción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">Leve</td>
                  <td className="px-6 py-4 text-gray-700">Amonestación verbal o escrita</td>
                  <td className="px-6 py-4 text-gray-700">
                    Advertencia de poder ser calificada como grave si la conducta persiste
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">Moderada</td>
                  <td className="px-6 py-4 text-gray-700">Sanción temporal contractual</td>
                  <td className="px-6 py-4 text-gray-700">
                    Suspensión temporal, multas o cláusula penal según contrato
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">Grave</td>
                  <td className="px-6 py-4 text-gray-700">Desvinculación comercial</td>
                  <td className="px-6 py-4 text-gray-700">
                    Terminación contractual sin perjuicio de multas y/o sanciones
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-black text-white p-8 mt-8 text-center">
            <p className="font-semibold text-lg mb-1">SAMSUNG ELECTRONICS COLOMBIA S.A.</p>
            <p className="text-gray-300">Política Anticorrupción y Soborno</p>
            <p className="text-gray-300 mt-4">Código: SAMCOL-COM-PL007</p>
            <p className="text-gray-300">Versión: 003 - Agosto 2023</p>
          </div>
        </section>
      </div>
    </LegalDocumentLayout>
  );
}
