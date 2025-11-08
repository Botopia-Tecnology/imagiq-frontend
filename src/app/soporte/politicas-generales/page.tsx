import { LegalDocumentLayout } from "@/components/legal/LegalDocumentLayout";

const sections = [
  { id: "introduccion", title: "Introducción", level: 1 },
  { id: "etica", title: "Ética de los Negocios", level: 1 },
  { id: "anticorrupcion", title: "Anticorrupción y Soborno", level: 1 },
  { id: "datos", title: "Datos Personales", level: 1 },
  { id: "confidencialidad", title: "Confidencialidad", level: 1 },
  { id: "sagrilaft", title: "Sistema SAGRILAFT", level: 1 },
  { id: "compras", title: "Compras y Contratación", level: 1 },
  { id: "facturacion", title: "Facturación", level: 1 },
  { id: "contacto", title: "Canales de Comunicación", level: 1 },
];

export default function PoliticasGeneralesPage() {
  return (
    <LegalDocumentLayout
      title="Políticas Generales IMAGIQ"
      sections={sections}
      documentType="Políticas Corporativas"
      lastUpdated="Octubre 2017"
    >
      <div className="space-y-16">
        <section id="introduccion">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">Introducción</h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            IMAGIQ S.A.S. lleva a cabo sus negocios asumiendo su responsabilidad como ciudadano corporativo y
            cumpliendo con las leyes anticorrupción para mantener los principios comerciales de cumplir con los
            estándares legales y éticos y mantener una cultura organizacional transparente.
          </p>
          <div className="bg-gray-50 border border-gray-200 p-6">
            <p className="text-gray-800">
              <strong>NIT:</strong> 900.565.091-1
            </p>
            <p className="text-gray-800 mt-2">
              <strong>Código de Documento:</strong> SAMCOL251017_0005
            </p>
          </div>
        </section>

        <section id="etica">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">Ética de los Negocios</h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            Las conductas de IMAGIQ S.A.S. se rigen por los siguientes principios comerciales:
          </p>
          <div className="border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-black text-white">
                  <th className="px-6 py-4 text-left font-semibold">#</th>
                  <th className="px-6 py-4 text-left font-semibold">Principio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">1</td>
                  <td className="px-6 py-4 text-gray-700">Conformidad con las leyes y estándares éticos</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">2</td>
                  <td className="px-6 py-4 text-gray-700">Cultura organizacional sana/ética</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">3</td>
                  <td className="px-6 py-4 text-gray-700">Respeto a clientes, accionistas y colaboradores</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">4</td>
                  <td className="px-6 py-4 text-gray-700">Preocupación por medio ambiente, salud y seguridad</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">5</td>
                  <td className="px-6 py-4 text-gray-700">Compañía socialmente responsable</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="anticorrupcion">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">Anticorrupción y Soborno</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-6">
            <div className="flex gap-3">
              <span className="text-yellow-600 font-bold text-lg">⚠</span>
              <div>
                <p className="font-semibold text-yellow-900 mb-1">Política de Cero Tolerancia</p>
                <p className="text-yellow-800">
                  IMAGIQ S.A.S. tiene una política de Cero Tolerancia contra la corrupción y el soborno, y no ignora ni
                  pasa por alto deliberadamente ningún acto de corrupción.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-gray-800 to-black text-white p-6">
              <h3 className="text-xl font-bold mb-2">PTEE</h3>
              <p className="text-gray-200 text-sm">
                Programa de Transparencia y Ética Empresarial – Soborno Transnacional
              </p>
              <p className="text-gray-300 text-xs mt-2">Resolución 100-006261 del 2 de octubre de 2020</p>
            </div>
            <div className="bg-gradient-to-br from-gray-700 to-gray-900 text-white p-6">
              <h3 className="text-xl font-bold mb-2">FCPA</h3>
              <p className="text-gray-200 text-sm">Ley de Prácticas Corruptas en el Extranjero (EE.UU.)</p>
              <p className="text-gray-300 text-xs mt-2">Foreign Corrupt Practices Act</p>
            </div>
          </div>
        </section>

        <section id="datos">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">Datos Personales</h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            IMAGIQ S.A.S. sabe que la privacidad es muy importante. Queremos garantizar que usted comprenda cómo
            recopilamos y usamos su información personal.
          </p>
          <div className="border border-gray-200 p-6">
            <div className="space-y-3">
              <p className="text-gray-700">
                <strong>Email:</strong>{" "}
                <a href="mailto:DATOS.PERSONALES@IMAGIQ.CO" className="underline hover:text-black">
                  DATOS.PERSONALES@IMAGIQ.CO
                </a>
              </p>
              <p className="text-gray-700">
                <strong>Web:</strong>{" "}
                <a href="https://imagiq.com/politica-general/" className="underline hover:text-black">
                  imagiq.com/politica-general/
                </a>
              </p>
            </div>
          </div>
        </section>

        <section id="confidencialidad">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">Confidencialidad</h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            Toda la información intercambiada es confidencial y privilegiada, quedando sometida al deber de secreto
            comercial y confidencialidad.
          </p>
          <div className="bg-gray-50 border-l-4 border-gray-400 p-6">
            <p className="text-gray-800 mb-3">
              <strong>Información Confidencial incluye:</strong>
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 flex-shrink-0"></span>
                <span>Datos, imágenes, códigos, precios</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 flex-shrink-0"></span>
                <span>Información estratégica y estados financieros</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 flex-shrink-0"></span>
                <span>Listas de clientes y planes comerciales</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 flex-shrink-0"></span>
                <span>Información relacionada con procesos y tecnologías</span>
              </li>
            </ul>
            <p className="text-gray-600 text-sm mt-4">
              <strong>Vigencia:</strong> 10 años a partir de la terminación de la relación comercial
            </p>
          </div>
        </section>

        <section id="sagrilaft">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Sistema SAGRILAFT
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            Sistema de Autocontrol y Gestión del Riesgo Integral de Lavado de Activos y Financiación del Terrorismo.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-gray-200 p-6">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Prevención</h3>
              <p className="text-gray-700 text-sm">
                Evitar que la compañía sea objeto de uso para lavado de activos
              </p>
            </div>
            <div className="border border-gray-200 p-6">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Detección</h3>
              <p className="text-gray-700 text-sm">Identificar actividades sospechosas relacionadas</p>
            </div>
            <div className="border border-gray-200 p-6">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Control</h3>
              <p className="text-gray-700 text-sm">Gestión mediante controles y procedimientos</p>
            </div>
          </div>
        </section>

        <section id="compras">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Procedimiento de Compras y Contratación
          </h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-6">
            <div className="flex gap-3">
              <span className="text-yellow-600 font-bold text-lg">⚠</span>
              <div>
                <p className="font-semibold text-yellow-900 mb-1">Importante</p>
                <p className="text-yellow-800">
                  Sin orden de compra y/o Contrato según el caso, IMAGIQ S.A.S. no pagará el servicio.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-50 p-6">
              <h3 className="font-semibold text-black mb-2">Canales Autorizados</h3>
              <p className="text-gray-700">
                Todo proceso de cotización, selección, ejecución y facturación debe realizarse por canales corporativos
                autorizados.
              </p>
            </div>
            <div className="bg-gray-50 p-6">
              <h3 className="font-semibold text-black mb-2">Autorización Formal</h3>
              <p className="text-gray-700">
                Todas las actividades deben contar con previa autorización formal por escrito de IMAGIQ S.A.S.
              </p>
            </div>
            <div className="bg-gray-50 p-6">
              <h3 className="font-semibold text-black mb-2">Prohibición de Acuerdos Verbales</h3>
              <p className="text-gray-700">
                IMAGIQ S.A.S. no hará ningún pago en relación con acuerdos verbales o correos electrónicos no oficiales.
              </p>
            </div>
          </div>
        </section>

        <section id="facturacion">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">Política de Facturación</h2>
          <div className="border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-black text-white">
                  <th className="px-6 py-4 text-left font-semibold">Aspecto</th>
                  <th className="px-6 py-4 text-left font-semibold">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">Términos de Pago</td>
                  <td className="px-6 py-4 text-gray-700">Pagos únicamente los días viernes</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">Envío de Facturas</td>
                  <td className="px-6 py-4 text-gray-700">
                    efacturaproveedor@imagiq.co
                    <br />
                    900565091@factureinbox.co
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">Endoso</td>
                  <td className="px-6 py-4 text-gray-700">Las facturas no serán endosadas a terceros</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="contacto">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">Canales de Comunicación</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-3">Asuntos Legales</h3>
              <a href="mailto:legal@imagiq.co" className="text-gray-900 hover:text-gray-600 underline">
                legal@imagiq.co
              </a>
            </div>
            <div className="border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-3">Cumplimiento y SAGRILAFT</h3>
              <div className="space-y-1">
                <p className="text-gray-700">c.garcia@imagiq.co</p>
                <p className="text-gray-700">l.cortes@imagiq.co</p>
                <p className="text-gray-700">(601) 7441176</p>
              </div>
            </div>
            <div className="border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-3">Datos Personales</h3>
              <a href="mailto:pqrsamcol@imagiq.co" className="text-gray-900 hover:text-gray-600 underline">
                pqrsamcol@imagiq.co
              </a>
            </div>
            <div className="border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-3">Notificaciones</h3>
              <a href="mailto:jrojas@imagiq.co" className="text-gray-900 hover:text-gray-600 underline">
                jrojas@imagiq.co
              </a>
            </div>
          </div>

          <div className="bg-black text-white p-8 text-center">
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
