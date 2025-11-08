import Link from "next/link";
import { Metadata } from "next";
import { LegalDocumentLayout } from "@/components/legal/LegalDocumentLayout";

export const metadata: Metadata = {
  title: "Términos y Condiciones 0% Interés Davivienda - IMAGIQ",
  description:
    "Términos de la promoción 0% interés con tarjetas Davivienda en productos Samsung Galaxy",
  robots: "index, follow",
};

const sections = [
  { id: "identificacion", title: "Identificación de la Promoción", level: 1 },
  { id: "vigencia", title: "Vigencia", level: 1 },
  { id: "tiendas", title: "Tiendas Participantes", level: 1 },
  { id: "productos", title: "Productos Participantes", level: 1 },
  { id: "tarjetas", title: "Tarjetas de Crédito Participantes", level: 1 },
  { id: "condiciones", title: "Condiciones de la Promoción", level: 1 },
  { id: "exclusiones", title: "Exclusiones", level: 1 },
  { id: "terminos", title: "Términos y Condiciones Generales", level: 1 },
];

export default function TyCDaviviendaPage() {
  return (
    <LegalDocumentLayout
      title="Términos y Condiciones - 0% de Interés Davivienda"
      sections={sections}
      documentType="Términos y Condiciones"
      lastUpdated="Octubre 2025"
    >
      <div className="space-y-16">
        <section id="identificacion">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Identificación de la Promoción
          </h2>
          <div className="bg-gray-50 border border-gray-200 p-8 space-y-4">
            <h3 className="text-xl font-semibold text-black">
              Promoción: 0% de Interés con Tarjetas de Crédito Davivienda
            </h3>
            <div className="grid gap-3 text-gray-700">
              <div className="flex">
                <span className="font-semibold min-w-[140px]">Vigencia:</span>
                <span>Del 1 de octubre de 2025 al 31 de diciembre de 2025</span>
              </div>
              <div className="flex">
                <span className="font-semibold min-w-[140px]">
                  Organizador:
                </span>
                <span>IMAGIQ S.A.S. - NIT 900.565.091-1</span>
              </div>
              <div className="flex">
                <span className="font-semibold min-w-[140px]">
                  Aliado Financiero:
                </span>
                <span>Banco Davivienda S.A.</span>
              </div>
            </div>
          </div>
        </section>

        <section id="vigencia">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Vigencia
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            La promoción de 0% de interés estará vigente desde el{" "}
            <strong>1 de octubre de 2025</strong> hasta el{" "}
            <strong>31 de diciembre de 2025</strong>, aplicable a compras
            realizadas tanto en tiendas físicas como en el sitio web oficial de
            IMAGIQ.
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
            <div className="flex gap-3">
              <span className="text-yellow-600 font-bold text-lg">⚠</span>
              <div>
                <p className="font-semibold text-yellow-900 mb-1">Importante</p>
                <p className="text-yellow-800">
                  La promoción aplica únicamente durante el período indicado y
                  está sujeta a disponibilidad de productos y cupo de crédito
                  del cliente.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="tiendas">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Tiendas Participantes
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            Esta promoción está disponible en los siguientes canales de venta de
            IMAGIQ:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 p-6 hover:border-gray-400 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    Tienda Virtual
                  </h3>
                  <Link
                    href="https://imagiq.com"
                    className="text-gray-900 hover:text-gray-600 underline font-medium"
                  >
                    www.imagiq.com
                  </Link>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 p-6 hover:border-gray-400 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    Tiendas Físicas
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Todas las tiendas físicas autorizadas de IMAGIQ a nivel
                    nacional. Para conocer ubicaciones, visite nuestro sitio web
                    o contacte al servicio al cliente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="productos">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Productos Participantes
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            La promoción de 0% de interés aplica exclusivamente para los
            siguientes productos de la línea Samsung Galaxy:
          </p>

          <div className="border border-gray-200 overflow-hidden">
            <table className="w-full">
              <caption className="sr-only">
                Productos participantes en la promoción 0% interés Davivienda
              </caption>
              <thead>
                <tr className="bg-black text-white">
                  <th scope="col" className="px-6 py-4 text-left font-semibold">
                    Categoría
                  </th>
                  <th scope="col" className="px-6 py-4 text-left font-semibold">
                    Productos Incluidos
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">
                    Smartphones
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    Galaxy S Series, Galaxy Z Fold Series, Galaxy Z Flip Series,
                    Galaxy A Series
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">
                    Tablets
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    Galaxy Tab S Series, Galaxy Tab A Series
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">
                    Wearables
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    Galaxy Watch Series, Galaxy Buds Series
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-black">
                    Accesorios
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    Accesorios oficiales Samsung seleccionados (sujeto a
                    disponibilidad)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 border-l-4 border-gray-400 p-6 mt-6">
            <p className="text-gray-800 text-sm">
              <strong>Nota:</strong> Los productos específicos participantes
              pueden variar según disponibilidad. Consulte en tienda o en el
              sitio web los modelos exactos incluidos en la promoción.
            </p>
          </div>
        </section>

        <section id="tarjetas">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Tarjetas de Crédito Participantes
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            La promoción de 0% de interés aplica únicamente para las siguientes
            tarjetas de crédito Davivienda:
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-linear-to-br from-gray-800 to-black text-white p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-8 bg-white/20 rounded"></div>
                <h3 className="text-xl font-bold">Visa</h3>
              </div>
              <p className="text-gray-200 text-sm">
                Todas las modalidades Davivienda
              </p>
            </div>

            <div className="bg-linear-to-br from-gray-700 to-gray-900 text-white p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-8 bg-white/20 rounded"></div>
                <h3 className="text-xl font-bold">Mastercard</h3>
              </div>
              <p className="text-gray-200 text-sm">
                Todas las modalidades Davivienda
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 p-6">
            <h4 className="font-semibold text-black mb-4">
              Requisitos para aplicar a la promoción:
            </h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                <span>
                  Ser titular de una tarjeta de crédito Davivienda Visa o
                  Mastercard
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                <span>
                  Contar con cupo disponible suficiente para la compra
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                <span>
                  Realizar la compra durante el período de vigencia de la
                  promoción
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                <span>La tarjeta debe estar al día en sus pagos</span>
              </li>
            </ul>
          </div>
        </section>

        <section id="condiciones">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Condiciones de la Promoción
          </h2>

          <div className="space-y-8">
            <div className="border-l-2 border-gray-300 pl-6">
              <h3 className="text-xl font-semibold text-black mb-3">
                Plazos disponibles
              </h3>
              <p className="text-gray-700 mb-4">
                La promoción de 0% de interés está disponible en los siguientes
                plazos:
              </p>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="px-5 py-2 bg-gray-100 text-black font-medium border border-gray-300">
                  3 meses
                </span>
                <span className="px-5 py-2 bg-gray-100 text-black font-medium border border-gray-300">
                  6 meses
                </span>
                <span className="px-5 py-2 bg-gray-100 text-black font-medium border border-gray-300">
                  9 meses
                </span>
                <span className="px-5 py-2 bg-gray-100 text-black font-medium border border-gray-300">
                  12 meses
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Los plazos disponibles pueden variar según el monto de la compra
                y el producto seleccionado.
              </p>
            </div>

            <div className="border-l-2 border-gray-300 pl-6">
              <h3 className="text-xl font-semibold text-black mb-3">
                Monto mínimo de compra
              </h3>
              <p className="text-gray-700">
                No se establece monto mínimo de compra para acceder a la
                promoción, sujeto a aprobación del cupo de crédito por parte de
                Davivienda.
              </p>
            </div>

            <div className="border-l-2 border-gray-300 pl-6">
              <h3 className="text-xl font-semibold text-black mb-3">
                Aplicación del beneficio
              </h3>
              <p className="text-gray-700 mb-3">
                El beneficio de 0% de interés se aplicará automáticamente al
                momento de realizar la compra con las tarjetas de crédito
                participantes y seleccionar uno de los plazos disponibles.
              </p>
              <p className="text-gray-700">
                El cliente no pagará intereses corrientes durante el plazo de la
                financiación, únicamente el valor del producto dividido en las
                cuotas mensuales correspondientes.
              </p>
            </div>

            <div className="border-l-2 border-gray-300 pl-6">
              <h3 className="text-xl font-semibold text-black mb-3">
                Combinación con otras promociones
              </h3>
              <p className="text-gray-700">
                Esta promoción no es acumulable con otros descuentos o
                promociones especiales, salvo que se indique expresamente lo
                contrario.
              </p>
            </div>
          </div>
        </section>

        <section id="exclusiones">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Exclusiones
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            Las siguientes situaciones están excluidas de la promoción:
          </p>

          <div className="bg-gray-50 border border-gray-300 p-6">
            <ul className="space-y-4 text-gray-800">
              <li className="flex items-start gap-3">
                <span className="text-xl font-bold text-gray-400 shrink-0">
                  ✗
                </span>
                <span>
                  Compras realizadas fuera del período de vigencia establecido
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl font-bold text-gray-400 shrink-0">
                  ✗
                </span>
                <span>
                  Productos no incluidos en la lista de productos participantes
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl font-bold text-gray-400 shrink-0">
                  ✗
                </span>
                <span>
                  Tarjetas de crédito diferentes a las especificadas en estos
                  términos y condiciones
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl font-bold text-gray-400 shrink-0">
                  ✗
                </span>
                <span>
                  Compras realizadas en establecimientos no autorizados por
                  IMAGIQ
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl font-bold text-gray-400 shrink-0">
                  ✗
                </span>
                <span>
                  Clientes con tarjetas de crédito en mora o con restricciones
                  crediticias
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl font-bold text-gray-400 shrink-0">
                  ✗
                </span>
                <span>
                  Productos de segunda mano, reacondicionados o exhibición
                  (salvo mención expresa)
                </span>
              </li>
            </ul>
          </div>
        </section>

        <section id="terminos">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Términos y Condiciones Generales
          </h2>

          <div className="space-y-6">
            {[
              {
                num: "1",
                title: "Responsabilidad del cliente",
                content:
                  "El cliente es responsable de verificar que su compra cumple con todos los requisitos de la promoción antes de finalizar la transacción. IMAGIQ no se hace responsable por la no aplicación del beneficio cuando el cliente no cumple con las condiciones establecidas.",
              },
              {
                num: "2",
                title: "Aprobación crediticia",
                content:
                  "La aprobación de la compra a crédito está sujeta a las políticas y condiciones de Banco Davivienda S.A. IMAGIQ no tiene injerencia en las decisiones crediticias del banco emisor de la tarjeta.",
              },
              {
                num: "3",
                title: "Modificaciones",
                content:
                  "IMAGIQ se reserva el derecho de modificar, suspender o cancelar esta promoción en cualquier momento, previa notificación a través de los canales oficiales. Las compras realizadas antes de cualquier modificación mantendrán las condiciones vigentes al momento de la transacción.",
              },
              {
                num: "4",
                title: "Devoluciones y garantías",
                content:
                  "Las devoluciones y garantías de productos adquiridos bajo esta promoción se rigen por las políticas generales de IMAGIQ y las establecidas por Samsung. El cliente deberá ponerse en contacto con el banco emisor para gestionar la reversión de los pagos en caso de devolución del producto.",
              },
              {
                num: "5",
                title: "Información y contacto",
                content: null,
              },
              {
                num: "6",
                title: "Aceptación de términos",
                content:
                  "Al realizar una compra bajo esta promoción, el cliente acepta expresamente todos los términos y condiciones aquí establecidos, así como las políticas generales de IMAGIQ y las condiciones del contrato de tarjeta de crédito con Davivienda.",
              },
            ].map((item) => (
              <div key={item.num} className="bg-gray-50 p-6">
                <h3 className="font-semibold text-black mb-3">
                  {item.num}. {item.title}
                </h3>
                {item.num === "5" ? (
                  <div>
                    <p className="text-gray-700 mb-4">
                      Para consultas sobre esta promoción, el cliente puede
                      contactar a IMAGIQ a través de:
                    </p>
                    <div className="space-y-2 text-gray-700 pl-4 border-l-2 border-gray-300">
                      <p>
                        <strong>Email:</strong>{" "}
                        <a
                          href="mailto:PQRSAMCOL@IMAGIQ.CO"
                          className="underline hover:text-black"
                        >
                          PQRSAMCOL@IMAGIQ.CO
                        </a>
                      </p>
                      <p>
                        <strong>WhatsApp:</strong>{" "}
                        <a
                          href="https://wa.me/573228639389"
                          className="underline hover:text-black"
                        >
                          +57 322 8639389
                        </a>
                      </p>
                      <p>
                        <strong>Teléfono:</strong>{" "}
                        <a
                          href="tel:+576017441176"
                          className="underline hover:text-black"
                        >
                          (601) 7441176
                        </a>
                      </p>
                      <p>
                        <strong>Sitio web:</strong>{" "}
                        <a
                          href="https://imagiq.com"
                          className="underline hover:text-black"
                        >
                          www.imagiq.com
                        </a>
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700">{item.content}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </LegalDocumentLayout>
  );
}
