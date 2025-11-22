import { Metadata } from "next";
import { LegalDocumentLayout } from "@/components/legal/LegalDocumentLayout";
import { dispositivosUsados } from "./dispositivos-usados-data";

export const metadata: Metadata = {
  title: "Términos y Condiciones - Entrego y Estreno - IMAGIQ",
  description:
    "Términos y condiciones de la promoción Entrego y Estreno para compras en imagiq.com y puntos de venta iMagiQ S.A.S",
  robots: "index, follow",
};

const sections = [
  { id: "identificacion", title: "Identificación de la Promoción", level: 1 },
  { id: "consideraciones", title: "Consideraciones Previas", level: 1 },
  { id: "condiciones-especificas", title: "Condiciones Específicas", level: 1 },
  { id: "condiciones-generales", title: "Condiciones Generales", level: 1 },
  { id: "anexo", title: "Anexo 1 - Equipos Usados Aplicables", level: 1 },
];

export default function TyCEntregoEstrenoPage() {
  return (
    <LegalDocumentLayout
      title="Términos y Condiciones - Entrego y Estreno"
      sections={sections}
      documentType="Términos y Condiciones"
      lastUpdated="Noviembre 2025"
    >
      <div className="space-y-16">
        <section id="identificacion">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Identificación de la Promoción
          </h2>
          <div className="bg-gray-50 border border-gray-200 p-8 space-y-4">
            <h3 className="text-xl font-semibold text-black">
              Promoción: Entrego y estreno para compras en imagiq.com y puntos
              de venta iMagiQ S.A.S
            </h3>
            <div className="grid gap-3 text-gray-700">
              <div className="flex">
                <span className="font-semibold min-w-[180px]">
                  Nombre de la Promoción:
                </span>
                <span>
                  Entrego y estreno para compras en imagiq.com y puntos de
                  venta iMagiQ S.A.S (la &quot;PROMOCIÓN&quot;)
                </span>
              </div>
              <div className="flex">
                <span className="font-semibold min-w-[180px]">
                  Vigencia de la Promoción:
                </span>
                <span>
                  Desde el día 15 de noviembre de 2025 hasta el día 30 de
                  noviembre de 2025, o hasta agotar existencias, lo que ocurra
                  primero
                </span>
              </div>
              <div className="flex">
                <span className="font-semibold min-w-[180px]">
                  Territorio aplicable:
                </span>
                <span>PROMOCIÓN válida a nivel nacional</span>
              </div>
              <div className="flex">
                <span className="font-semibold min-w-[180px]">
                  Canales aplicables:
                </span>
                <span>
                  PROMOCIÓN válida en canales online de las Tiendas Autorizadas
                  Participantes
                </span>
              </div>
            </div>
          </div>
        </section>

        <section id="consideraciones">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Consideraciones Previas
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            Este documento fija los términos, condiciones y restricciones a los
            que se sujetarán las personas (&quot;CLIENTE&quot; y, en conjunto, los
            &quot;CLIENTES&quot;) que participen en la PROMOCIÓN (en adelante &quot;T&C&quot;). La
            participación en la PROMOCIÓN y la aceptación del beneficio
            otorgado por SAMSUNG implica el conocimiento y aceptación total e
            incondicional de los presentes T&C.
          </p>
          <div className="bg-grey-50 border-l-4 border-black-500 p-6">
            <div className="flex gap-3">
              <span className="text-grey-600 font-bold text-lg">ℹ</span>
              <div>
                <p className="font-semibold text-blue-black mb-1">
                  Información importante
                </p>
                <p className="text-black-800">
                  Los T&C podrán consultarse en{" "}
                  <a
                    href="https://imagiq.com"
                    className="underline hover:text-blue-600"
                  >
                    imagiq.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="condiciones-especificas">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Condiciones Específicas de la Promoción
          </h2>

          <div className="space-y-12">
            {/* I. Objeto */}
            <div className="border-l-4 border-gray-300 pl-6">
              <h3 className="text-2xl font-semibold text-black mb-4">
                I. Objeto
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Por la compra de un (1) producto Samsung de la categoría
                &quot;Dispositivos Móviles&quot; disponible en las Tiendas Autorizadas
                Participantes al momento de la compra (el &quot;PRODUCTO&quot;), el
                CLIENTE podrá entregar a ASSURANT un (1) equipo usado de su
                propiedad que corresponda con alguna de las referencias y marcas
                indicadas en el pop-up de entrego y estreno o en el Anexo 1
                (&quot;Equipo Usado&quot;).
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                En caso de cumplir con los requisitos del numeral 6 de este
                punto III, el CLIENTE recibirá una oferta por su Equipo Usado
                y, si la acepta, el dinero será transferido a su cuenta bancaria
                (el &quot;BENEFICIO&quot;). El valor de la oferta dependerá del estado del
                Equipo Usado.
              </p>
              <div className="bg-gray-50 border-l-4 border-black p-6 mt-4">
                <p className="text-black font-semibold">
                  Todo lo anterior está sujeto al cumplimiento de los requisitos
                  y condiciones establecidas en estos T&C.
                </p>
              </div>
            </div>

            {/* II. Tiendas Autorizadas Participantes */}
            <div className="border-l-4 border-gray-300 pl-6">
              <h3 className="text-2xl font-semibold text-black mb-4">
                II. Tiendas Autorizadas Participantes
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Las Tiendas Autorizadas Participantes de la PROMOCIÓN son las
                siguientes:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { num: "1", name: "imagiq.com" },
                  { num: "2", name: "Samsung Store Calle 116, Bogotá" },
                  { num: "3", name: "Samsung Store CC Fontanar, Chía" },
                  { num: "4", name: "Samsung Store CC Hayuelos, Bogotá" },
                  { num: "5", name: "Samsung Store CC Mallplaza, Bogotá" },
                  { num: "6", name: "Samsung Store CC Centro Mayor, Bogotá" },
                  { num: "7", name: "Samsung Store CC Parque La Colina, Bogotá" },
                  { num: "8", name: "Samsung Store CC Santafe, Bogotá" },
                  { num: "9", name: "Samsung Store CC Unicentro, Bogotá" },
                  { num: "10", name: "Samsung Store CC Multiplaza, Bogotá" },
                  { num: "11", name: "Samsung Store CC Plaza Imperial, Bogotá" },
                  { num: "12", name: "Samsung Store CC Plaza Central, Bogotá" },
                  { num: "13", name: "Samsung Store CC Andino, Bogotá" },
                  { num: "14", name: "Samsung Store CC Nuestro Bogota, Bogotá" },
                  { num: "15", name: "Samsung Store CC Tintal Plaza, Bogotá" },
                  { num: "16", name: "Samsung Store CC Gran Plaza Bosa, Bogotá" },
                  { num: "17", name: "Samsung Store CC Salitre Plaza, Bogotá" },
                  { num: "18", name: "Samsung Store CC Gran Plaza Soacha, Soacha" },
                  { num: "19", name: "Samsung Store CC Cacique, Bucaramanga" },
                  { num: "20", name: "Samsung Store CC Caracolí, Bucaramanga" },
                  { num: "21", name: "Samsung Store CC Jardin Plaza, Cali" },
                  { num: "22", name: "Samsung Store CC Unicentro, Cali" },
                  { num: "23", name: "Samsung Store CC Chipichape, Cali" },
                  { num: "24", name: "Samsung Store CC Mall Plaza, Cali" },
                  { num: "25", name: "Samsung Store CC La Herradura, Tulua" },
                  { num: "26", name: "Samsung Store CC Unicentro, Palmira" },
                  { num: "27", name: "Samsung Store CC Jardin Plaza, Cúcuta" },
                  { num: "28", name: "Samsung Store CC La Estación, Ibagué" },
                  { num: "29", name: "Samsung Store CC Fundadores, Manizales" },
                  { num: "30", name: "Samsung Store CC Alamedas, Montería" },
                  { num: "31", name: "Samsung Store CC Nuestro, Montería" },
                  { num: "32", name: "Samsung Store CC Único, Pasto" },
                  { num: "33", name: "Samsung Store CC Unicentro, Pasto" },
                  {
                    num: "34",
                    name: "Samsung Store CC Gran Plaza San Antonio, Pitalito",
                  },
                  { num: "35", name: "Samsung Store CC Campanario, Popayán" },
                  { num: "36", name: "Samsung Store CC Guacarí, Sincelejo" },
                  {
                    num: "37",
                    name: "Samsung Store CC Primavera Urbana, Villavicencio",
                  },
                  {
                    num: "38",
                    name: "Samsung Store CC Gran Plaza Alcaraván, Yopal",
                  },
                ].map((tienda) => (
                  <div
                    key={tienda.num}
                    className="flex items-start gap-3 p-3 border border-gray-200 hover:border-gray-400 transition-colors"
                  >
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                      {tienda.num}
                    </div>
                    <span className="text-gray-700 text-sm pt-1">
                      {tienda.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* III. Productos y Unidades */}
            <div className="border-l-4 border-gray-300 pl-6">
              <h3 className="text-2xl font-semibold text-black mb-4">
                III. Productos y Unidades
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Los productos (en adelante, &quot;PRODUCTOS&quot;) son los detallados en
                las Tiendas Autorizadas Participantes en la categoría
                &quot;Dispositivos Móviles&quot;. A continuación se detallan las
                referencias de productos participantes con su respectivo bono de
                recambio:
              </p>

              <div className="bg-gray-50 border-l-4 border-black p-6 mb-6">
                <div className="flex gap-3">
                  <span className="text-black font-bold text-lg">⚠</span>
                  <div>
                    <p className="font-semibold text-black mb-1">
                      Importante
                    </p>
                    <p className="text-gray-700">
                      Los bonos de recambio varían según el producto adquirido.
                      Revise cuidadosamente la tabla a continuación para conocer
                      el bono aplicable.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabla de productos COMPLETA */}
              <div className="border border-gray-200 overflow-x-auto">
                <table className="w-full text-sm">
                  <caption className="sr-only">
                    Productos participantes en la promoción Entrego y Estreno
                  </caption>
                  <thead>
                    <tr className="bg-black text-white">
                      <th
                        scope="col"
                        className="px-4 py-3 text-left font-semibold"
                      >
                        Referencia Producto
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left font-semibold"
                      >
                        Producto
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left font-semibold"
                      >
                        Bono Recambio
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {/* TODAS LAS FILAS DEL PDF - Galaxy Fold7 5G 16GB 1TB */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-F966BDBUA</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Fold7 5G 16GB 1TB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.000.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-F966BZKUA</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Fold7 5G 16GB 1TB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.000.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-F966BDBUCOO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Fold7 5G 16GB 1TB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.000.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-F966BZKUCOO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Fold7 5G 16GB 1TB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.000.000</td>
                    </tr>

                    {/* Galaxy Fold7 5G 12GB 512GB */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-F966BDBKA</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Fold7 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.000.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-F966BZKKA</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Fold7 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.000.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-F966BZSKA</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Fold7 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.000.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-F966BDBKCOO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Fold7 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.000.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-F966BZKKCOO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Fold7 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.000.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-F966BZSKCOO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Fold7 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.000.000</td>
                    </tr>

                    {/* Galaxy Fold7 5G 12GB 256GB */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-F966BDBJA</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Fold7 5G 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.000.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-F966BZKJA</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Fold7 5G 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.000.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-F966BZSJA</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Fold7 5G 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.000.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-F966BDBJCOO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Fold7 5G 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.000.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-F966BZKJCOO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Fold7 5G 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.000.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-F966BZSJCOO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Fold7 5G 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.000.000</td>
                    </tr>

                    {/* Galaxy Z Flip7 5G 12GB 512GB */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-F766BDBKB</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Z Flip7 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 700.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-F766BZKKB</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Z Flip7 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 700.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-F766BZRKB</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Z Flip7 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 700.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-F766BDBKCOO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Z Flip7 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 700.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-F766BZKKCOO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Z Flip7 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 700.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-F766BZRKCOO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Z Flip7 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 700.000</td>
                    </tr>

                    {/* Galaxy Z Flip7 5G 12GB 256GB */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-F766BDBJB</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Z Flip7 5G 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 700.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-F766BZKJB</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Z Flip7 5G 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 700.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-F766BZRJB</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Z Flip7 5G 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 700.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-F766BDBJCOO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Z Flip7 5G 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 700.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-F766BZKJCOO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Z Flip7 5G 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 700.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-F766BZRJCOO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Z Flip7 5G 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 700.000</td>
                    </tr>

                    {/* Galaxy Z Flip7 FE 5G 8GB 256GB */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-F761BZKKCOO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Z Flip7 FE 5G 8GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 500.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-F761BZWKCOO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Z Flip7 FE 5G 8GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 500.000</td>
                    </tr>

                    {/* Galaxy Z Flip7 FE 5G 8GB 128GB */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-F761BZKJCOO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Z Flip7 FE 5G 8GB 128GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 500.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-F761BZWJCOO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Z Flip7 FE 5G 8GB 128GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 500.000</td>
                    </tr>

                    {/* Galaxy S25 Ultra 5G 12GB 512GB */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-S938BZBKL</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 Ultra 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.200.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-S938BZKKL</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 Ultra 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.200.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-S938BZSKL</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 Ultra 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.200.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-S938BZTKL</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 Ultra 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.200.000</td>
                    </tr>

                    {/* Galaxy S25 Ultra 5G 12GB 256GB */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-S938BZKJL</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 Ultra 5G 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.200.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-S938BZSJL</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 Ultra 5G 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.200.000</td>
                    </tr>

                    {/* Galaxy S25+ 5G 12GB 512GB */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-S936BLBKL</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25+ 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 800.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-S936BZSKK</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25+ 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 800.000</td>
                    </tr>

                    {/* Galaxy S25+ 5G 12GB 256GB */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-S936BLGJL</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25+ 5G 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 800.000</td>
                    </tr>

                    {/* Galaxy S25 Ultra 5G 12GB 1TB */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S938BZKULTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 Ultra 5G 12GB 1TB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.200.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S938BZSULTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 Ultra 5G 12GB 1TB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.200.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S938BZBULTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 Ultra 5G 12GB 1TB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.200.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S938BZBKLTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 Ultra 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.200.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S938BZKKLTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 Ultra 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.200.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S938BZSKLTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 Ultra 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.200.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S938BZTKLTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 Ultra 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.200.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S938BZBJLTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 Ultra 5G 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.200.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S938BZKJLTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 Ultra 5G 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.200.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S938BZSJLTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 Ultra 5G 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.200.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S938BZTJLTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 Ultra 5G 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.200.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S936BDBKLTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25+ 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 800.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S936BLBKLTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25+ 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 800.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S936BLGKLTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25+ 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 800.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S936BZSKLTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25+ 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 800.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S936BDBJLTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25+ 5G 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 800.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S936BLBJLTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25+ 5G 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 800.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S936BLGJLTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25+ 5G 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 800.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S936BZSJLTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25+ 5G 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 800.000</td>
                    </tr>

                    {/* Galaxy S25 5G 12GB 512GB */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-S931BZSUA</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 800.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-S931BDBUA</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 800.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-S931BLGUA</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 800.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-S931BLBUA</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 800.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-S931BZSUB</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 800.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-S931BLGUB</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 800.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S931BDBULTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 800.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S931BLBULTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 800.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S931BLGULTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 800.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S931BZSULTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 5G 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 800.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S931BDBKLTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 5G 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 800.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S931BLBKLTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 5G 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 800.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S931BLGKLTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 5G 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 800.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S931BZSKLTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 5G 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 800.000</td>
                    </tr>

                    {/* Galaxy S25 FE 8GB 512GB */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-S731BZWPL</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 FE 8GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 300.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-S731BLBPL</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 FE 8GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 300.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-S731BDBPL</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 FE 8GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 300.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-S731BZKPL</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 FE 8GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 300.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S731BZWPLTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 FE 8GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 300.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S731BLBPLTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 FE 8GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 300.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S731BDBPLTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 FE 8GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 300.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S731BZKPLTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 FE 8GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 300.000</td>
                    </tr>

                    {/* Galaxy S25 FE 8GB 256GB */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-S731BZWKL</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 FE 8GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 300.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-S731BLBKL</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 FE 8GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 300.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-S731BDBKL</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 FE 8GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 300.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-S731BZKKL</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 FE 8GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 300.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S731BZWKLTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 FE 8GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 300.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S731BLBKLTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 FE 8GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 300.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S731BDBKLTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 FE 8GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 300.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-S731BZKKLTC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy S25 FE 8GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 300.000</td>
                    </tr>

                    {/* Galaxy Tab S11 Ultra 12GB 512GB */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-X930NZAHCOO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Tab S11 Ultra 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.000.000</td>
                    </tr>

                    {/* Galaxy Tab S11 Ultra 12GB 256GB */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-X930NZADCOO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Tab S11 Ultra 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 1.000.000</td>
                    </tr>

                    {/* Galaxy Tab S11 12GB 512GB */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-X730NZAKCOO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Tab S11 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 600.000</td>
                    </tr>

                    {/* Galaxy Tab S11 12GB 256GB */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-X730NZAHCOO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Tab S11 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 600.000</td>
                    </tr>

                    {/* Galaxy Tab S10+ 12GB 512GB */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-X820NZAHC</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Tab S10+ 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 800.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-X820NZAHCOO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Tab S10+ 12GB 512GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 800.000</td>
                    </tr>

                    {/* Galaxy Tab S10+ 12GB 256GB */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-X820NZAD1</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Tab S10+ 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 800.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-X820NZADCOO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Tab S10+ 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 800.000</td>
                    </tr>

                    {/* Galaxy Tab S10 FE+ WIFI 12GB 256GB */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-X620NLBECOO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Tab S10 FE+ WIFI 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 400.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-X620NZAECOO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Tab S10 FE+ WIFI 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 400.000</td>
                    </tr>

                    {/* Galaxy Tab S10 FE+ WIFI 8GB 128GB */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-X620NZAACOO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Tab S10 FE+ WIFI 8GB 128GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 400.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-X620NLBACOO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Tab S10 FE+ WIFI 8GB 128GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 400.000</td>
                    </tr>

                    {/* Galaxy Tab S10 FE WIFI 12GB 256GB */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-X520NLBECOO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Tab S10 FE WIFI 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 300.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-X520NZAECOO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Tab S10 FE WIFI 12GB 256GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 300.000</td>
                    </tr>

                    {/* Galaxy Tab S10 FE WIFI 8GB 128GB */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-X520NLBACOO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Tab S10 FE WIFI 8GB 128GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 300.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-X520NZAACOO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Tab S10 FE WIFI 8GB 128GB</td>
                      <td className="px-4 py-2 text-gray-700">$ 300.000</td>
                    </tr>

                    {/* Galaxy Watch Ultra 47mm */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-L705FZA1C</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Watch Ultra 47mm</td>
                      <td className="px-4 py-2 text-gray-700">$ 300.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-L705FZB1C</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Watch Ultra 47mm</td>
                      <td className="px-4 py-2 text-gray-700">$ 300.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-L705FZA1COO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Watch Ultra 47mm</td>
                      <td className="px-4 py-2 text-gray-700">$ 300.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-L705FZB1COO</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Watch Ultra 47mm</td>
                      <td className="px-4 py-2 text-gray-700">$ 300.000</td>
                    </tr>

                    {/* Galaxy Watch8 46mm Classic */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-L500NZKAL</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Watch8 46mm Classic</td>
                      <td className="px-4 py-2 text-gray-700">$ 250.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-L500NZKALTA</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Watch8 46mm Classic</td>
                      <td className="px-4 py-2 text-gray-700">$ 250.000</td>
                    </tr>

                    {/* Galaxy Watch8 44mm */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-L330NDAAL</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Watch8 44mm</td>
                      <td className="px-4 py-2 text-gray-700">$ 150.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-L330NZSAL</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Watch8 44mm</td>
                      <td className="px-4 py-2 text-gray-700">$ 150.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-L330NDAALTA</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Watch8 44mm</td>
                      <td className="px-4 py-2 text-gray-700">$ 150.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-L330NZSALTA</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Watch8 44mm</td>
                      <td className="px-4 py-2 text-gray-700">$ 150.000</td>
                    </tr>

                    {/* Galaxy Watch8 40mm */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-L320NDAAL</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Watch8 40mm</td>
                      <td className="px-4 py-2 text-gray-700">$ 150.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">F-SM-L320NZSAL</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Watch8 40mm</td>
                      <td className="px-4 py-2 text-gray-700">$ 150.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-L320NZSALTA</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Watch8 40mm</td>
                      <td className="px-4 py-2 text-gray-700">$ 150.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700">SM-L320NDAALTA</td>
                      <td className="px-4 py-2 text-gray-700">Galaxy Watch8 40mm</td>
                      <td className="px-4 py-2 text-gray-700">$ 150.000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* IV. Clientes */}
            <div className="border-l-4 border-gray-300 pl-6">
              <h3 className="text-2xl font-semibold text-black mb-4">
                IV. Clientes
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Se entenderán por CLIENTES de la PROMOCIÓN las personas
                naturales mayores de 18 años.
              </p>
            </div>

            {/* V. Mecánica */}
            <div className="border-l-4 border-gray-300 pl-6">
              <h3 className="text-2xl font-semibold text-black mb-4">
                V. Mecánica
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Los CLIENTES podrán acceder a la PROMOCIÓN por medio de las
                Tiendas Autorizadas Participantes y adquiriendo el PRODUCTO
                dentro de las fechas de vigencia, pagando con cualquier medio
                autorizado por cada Tienda Autorizada Participante.
              </p>

              <p className="text-gray-700 font-semibold mb-4">
                Para acceder a la PROMOCIÓN, el CLIENTE deberá seguir la
                siguiente mecánica:
              </p>

              <div className="space-y-4 mb-8">
                {[
                  {
                    letter: "a",
                    text: "Ingresar al canal online de la Tienda Autorizada Participante a la cual tenga acceso.",
                  },
                  {
                    letter: "b",
                    text: 'Seleccionar el PRODUCTO que desea adquirir y hacer clic en "comprar ahora".',
                  },
                  {
                    letter: "c",
                    text: 'Elegir las características del PRODUCTO según su preferencia, bajar hasta el aviso &quot;Estreno y Entrego&quot; y seleccionar la opción &quot;Sí&quot; para iniciar el proceso.',
                  },
                  {
                    letter: "d",
                    text: "Automáticamente, la página mostrará un pop-up donde el CLIENTE deberá seleccionar el tipo de Equipo Usado que entregará, indicar sus características y visualizar el monto máximo (no vinculante) que podría recibir, en caso de que ASSURANT realice una oferta. Además, deberá responder una serie de preguntas para determinar el estado del equipo usado e ingresar el número IMEI de quince (15) dígitos, aceptar las políticas del plan de recambio y continuar con la compra.",
                  },
                  {
                    letter: "e",
                    text: 'En este momento, se realizará un bono de retoma previo por medio de un correo con un código QR (&quot;COTIZACIÓN&quot;) donde se indicará al CLIENTE el valor de retoma de acuerdo con las características del equipo.',
                  },
                ].map((item) => (
                  <div key={item.letter} className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                      {item.letter}
                    </div>
                    <p className="text-gray-700 pt-1">{item.text}</p>
                  </div>
                ))}
              </div>

              {/* Apartado 1: Pago y recogida en tienda */}
              <div className="bg-gray-50 border-l-4 border-black p-6 mb-6">
                <h4 className="font-semibold text-black mb-4 text-lg">
                  **Apartado 1: Pago y recogida en tienda – Si el cliente
                  decide realizar el pago en la tienda:
                </h4>
                <div className="space-y-3">
                  {[
                    {
                      letter: "a",
                      text: "El CLIENTE deberá acercarse a la Tienda Autorizada Participante de su elección donde presentará la COTIZACIÓN con el valor de retoma estimado que fue generado en el canal online.",
                    },
                    {
                      letter: "b",
                      text: "En el momento que está en la tienda, el CLIENTE dará al asesor su equipo con el IMEI correspondiente y la COTIZACIÓN con el valor de retoma estimado donde se verá la información del equipo en el estado comunicado por el CLIENTE, el IMEI relacionado y las condiciones que informó.",
                    },
                    {
                      letter: "c",
                      text: "El asesor, procederá a hacer la evaluación del equipo por medio de la plataforma de ASSURANT conectando el equipo y respondiendo las preguntas indicadas.",
                    },
                    {
                      letter: "d",
                      text: "Finalizado el proceso de evaluación, el asesor ACEPTARÁ o RECHAZARÁ la COTIZACIÓN correspondiente al resultado de esta. En caso de ser ACEPTADA el bono será descontado del valor total de la FACTURA de venta. En caso de ser RECHAZADA se ofrecerá un nuevo valor de retoma al CLIENTE si cumple con los REQUISITOS MÍNIMOS y el bono será descontado del valor total de la FACTURA de venta.",
                    },
                    {
                      letter: "e",
                      text: "El CLIENTE paga el valor después de IVA (19%) de su factura por el medio de pago preferido y se llevará el equipo comprado.",
                    },
                  ].map((item) => (
                    <div key={item.letter} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                        {item.letter}
                      </div>
                      <p className="text-gray-700 text-sm pt-0.5">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Apartado 2: Pago en línea y recogida en tienda */}
              <div className="bg-gray-50 border-l-4 border-black p-6">
                <h4 className="font-semibold text-black mb-4 text-lg">
                  **Apartado 2: Pago en línea y recogida en tienda – Si el
                  cliente decide realizar el pago en línea y recoger su equipo
                  en tienda:
                </h4>
                <div className="space-y-3">
                  {[
                    {
                      letter: "a",
                      text: "El CLIENTE realizará el proceso de pago con cualquier medio de pago escogido por la totalidad del valor del equipo comprado.",
                    },
                    {
                      letter: "b",
                      text: "El CLIENTE deberá acercarse a la Tienda Autorizada Participante de su elección donde presentará la COTIZACIÓN con el valor de retoma estimado que fue generado en el canal online.",
                    },
                    {
                      letter: "c",
                      text: "En el momento que está en la tienda, el CLIENTE dará al asesor su equipo con el IMEI correspondiente y la COTIZACIÓN con el valor de retoma estimado donde se verá la información del equipo en el estado comunicado por el CLIENTE, el IMEI relacionado y las condiciones que informó.",
                    },
                    {
                      letter: "d",
                      text: "El asesor, procederá a hacer la evaluación del equipo por medio de la plataforma de ASSURANT conectando el equipo y respondiendo las preguntas indicadas.",
                    },
                    {
                      letter: "e",
                      text: "Finalizado el proceso de evaluación, el asesor ACEPTARÁ o RECHAZARÁ la COTIZACIÓN correspondiente al resultado de esta. En caso de ser ACEPTADA el bono será transferido por medio de una transferencia bancaria al CLIENTE a una cuenta de su elección (si no es día hábil, esta transferencia será el primer día hábil consiguiente a la fecha de venta). En caso de ser RECHAZADA se ofrecerá un nuevo valor de retoma al CLIENTE si cumple con los REQUISITOS MÍNIMOS, y el bono será transferido por medio de una transferencia bancaria al CLIENTE a una cuenta de su elección (si no es día hábil, esta transferencia será el primer día hábil consiguiente a la fecha de venta).",
                    },
                    {
                      letter: "f",
                      text: "El CLIENTE recibe su equipo mostrando el comprobante de venta.",
                    },
                  ].map((item) => (
                    <div key={item.letter} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                        {item.letter}
                      </div>
                      <p className="text-gray-700 text-sm pt-0.5">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* VI. Condiciones especiales del BENEFICIO */}
            <div className="border-l-4 border-gray-300 pl-6">
              <h3 className="text-2xl font-semibold text-black mb-4">
                VI. Condiciones especiales del BENEFICIO
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                El BENEFICIO tendrá las siguientes condiciones especiales:
              </p>

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 border-l-2 border-gray-400">
                  <p className="text-gray-800 mb-2">
                    <strong>a.</strong> El BENEFICIO es acumulable con las
                    promociones vigentes que así lo establezcan.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 border-l-2 border-gray-400">
                  <p className="text-gray-800 mb-4">
                    <strong>b.</strong> ASSURANT reconocerá el BENEFICIO siempre
                    y cuando el Equipo Usado cumpla con las siguientes
                    condiciones:
                  </p>
                  <ul className="space-y-3 ml-6">
                    {[
                      {
                        num: "i",
                        text: "El Equipo Usado debe estar incluido en el listado de marcas y modelos previsto en el pop-up de las Tiendas Autorizantes Participantes y/o en el Anexo 1 de estos T&C.",
                      },
                      {
                        num: "ii",
                        text: "Debe poder encenderse, funcionar normalmente y realizar una llamada.",
                      },
                      {
                        num: "iii",
                        text: "No debe estar dañado al punto que afecte su funcionalidad esperada o con grabados o personalizaciones.",
                      },
                      {
                        num: "iv",
                        text: "El Equipo Usado debe ser enviado a ASSURANT restaurado a modo de fábrica, sin contenido, información o datos personales. En caso de contener información, el CLIENTE autoriza a IMAGIQ S.A.S a eliminarla para poder evaluar el estado del equipo.",
                      },
                      {
                        num: "v",
                        text: "El Equipo Usado no debe tener cuentas asociadas (ej. Find My iPhone, iCloud, etc.), ni claves de acceso, bloqueos u otros.",
                      },
                      {
                        num: "vi",
                        text: 'El Equipo Usado no puede estar reportado en "listas negras" de equipos con IMEI bloqueados (ej. imeicolombia, GSMA, etc.).',
                      },
                      {
                        num: "vii",
                        text: "El IMEI informado en la Tienda Autorizada Participante debe coincidir con el del Equipo Usado entregado a ASSURANT.",
                      },
                    ].map((item) => (
                      <li key={item.num} className="text-gray-700">
                        <strong>{item.num}.</strong> {item.text}
                      </li>
                    ))}
                  </ul>
                </div>

                {[
                  {
                    letter: "c",
                    text: "En caso de cumplir con las condiciones anteriores y aceptar la oferta de ASSURANT, si el cliente realiza el proceso en tienda física se hará un descuento inmediato en su factura de compra.",
                  },
                  {
                    letter: "d",
                    text: "El BONO SAMSUNG tiene un máximo de una (1) redención por compra.",
                  },
                  {
                    letter: "e",
                    text: "La información requerida para recibir el BENEFICIO deberá ser únicamente del CLIENTE que participa en la PROMOCIÓN.",
                  },
                  {
                    letter: "f",
                    text: "No se aceptarán cuentas bancarias de terceros ni documentación incompleta.",
                  },
                  {
                    letter: "g",
                    text: "El BENEFICIO será determinado por el asesor de las Tiendas Autorizantes Participantes según el estado del Equipo Usado.",
                  },
                  {
                    letter: "h",
                    text: "Si el Equipo Usado no es funcional o no cumple con las condiciones establecidas, no resultará aplicable el BENEFICIO y el equipo será devuelto al CLIENTE de manera inmediata.",
                  },
                  {
                    letter: "i",
                    text: "El BENEFICIO no aplica si el CLIENTE ejerce su derecho de retracto sobre el PRODUCTO.",
                  },
                  {
                    letter: "j",
                    text: "Esta PROMOCIÓN solo será acumulable con otras promociones que expresamente lo indiquen.",
                  },
                ].map((item) => (
                  <div key={item.letter} className="bg-gray-50 p-6 border-l-2 border-gray-400">
                    <p className="text-gray-800">
                      <strong>{item.letter}.</strong> {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="condiciones-generales">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Condiciones Generales de la Promoción
          </h2>

          <div className="space-y-6">
            {[
              {
                num: "I",
                title: "Aceptación de los Términos y Condiciones",
                content:
                  "Al momento de adquirir la PROMOCIÓN, el CLIENTE estará aceptando en su totalidad todo lo indicado en estos T&C.",
              },
              {
                num: "II",
                title: "Determinación de precios y puntos de venta",
                content:
                  'Cada Tienda Autorizada Participante podrá determinar, a su discreción, los precios de los PRODUCTOS y los puntos de venta en los cuales podrá accederse a la PROMOCIÓN, teniendo en cuenta el territorio aplicable descrito en la Sección I "Identificación de la Promoción" de estos T&C.',
              },
              {
                num: "III",
                title: "Condiciones de entrega",
                content:
                  "Cada Tienda Autorizada Participante podrá determinar, a su discreción, la totalidad de las condiciones de modo, tiempo y lugar de envío y entrega de los PRODUCTOS y/o BENEFICIOS, según corresponda.",
              },
              {
                num: "IV",
                title: "Disponibilidad de unidades y referencias",
                content:
                  "Las unidades y referencias disponibles corresponden únicamente a las indicadas en este documento. En caso de agotarse antes de las fechas indicadas, la PROMOCIÓN finalizará.",
              },
              {
                num: "V",
                title: "Garantía de los PRODUCTOS y/o BENEFICIOS",
                content:
                  "La garantía aplicable será la de calidad otorgada por SAMSUNG para cada PRODUCTO y/o BENEFICIO, siempre que SAMSUNG sea el productor de éstos. Si el PRODUCTO o BENEFICIO pertenece a otro productor, aplicará la garantía definida por dicho fabricante.",
              },
              {
                num: "VI",
                title: "Derecho de retracto",
                content:
                  "Si el CLIENTE hace uso del derecho de retracto respecto al PRODUCTO adquirido, y siempre que este sea objeto de retracto, deberá devolver el PRODUCTO junto con el BENEFICIO (si ya fue entregado). Las condiciones de retracto aplicarán conforme a la ley y las indicaciones establecidas por cada Tienda Autorizada Participante. No opera el derecho de retracto, a pesar de que la compra se inicia online, la compra se finaliza a través de las Tiendas Autorizadas Participantes físicas en donde el cliente va a tener contacto directo con el producto pudiendo decidir, si continua o no con el proceso de compra.",
              },
              {
                num: "VII",
                title: "Restricciones de canje del BENEFICIO",
                content:
                  "El BENEFICIO no es canjeable por dinero en efectivo, abonos a cuentas bancarias, tarjetas de crédito o débito, ni por ningún otro tipo de transacción o beneficio diferente a lo descrito en los presentes T&C.",
              },
              {
                num: "VIII",
                title: "Modificaciones de los T&C",
                content:
                  "IMAGIQ se reserva el derecho de modificar, aclarar o adicionar estos T&C en cualquier momento y por cualquier motivo. Las actualizaciones se publicarán en https://www.imagiq.com/terminos-condiciones/, y con dicha publicación se entenderá que los CLIENTES quedan notificados y que las nuevas condiciones son aplicables a la PROMOCIÓN.",
              },
              {
                num: "IX",
                title: "Responsabilidad de la PROMOCIÓN",
                content:
                  "IMAGIQ y las Tiendas Autorizadas Participantes son los únicos responsables de la PROMOCIÓN y de los PRODUCTOS y/o BENEFICIOS. Cualquier reclamación sobre los mismos será atendida a través del número de contacto (601)7441176, o mediante los canales de atención al cliente de cada Tienda Autorizada Participante.",
              },
              {
                num: "X",
                title: "Protección de datos personales",
                content:
                  "La Tienda Autorizada Participante se compromete a proteger la seguridad de la información personal de los CLIENTES mediante tecnologías y procedimientos que evitan el acceso o uso no autorizado. La información personal se almacena en sistemas de acceso limitado ubicados en instalaciones controladas.",
              },
              {
                num: "XI",
                title: "Legislación aplicable",
                content:
                  "Estos Términos y Condiciones se rigen por las leyes de la República de Colombia.",
              },
            ].map((item) => (
              <div key={item.num} className="bg-gray-50 p-6">
                <h3 className="font-semibold text-black mb-3 text-lg">
                  {item.num}. {item.title}
                </h3>
                <p className="text-gray-700">{item.content}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="anexo">
          <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
            Anexo 1 - Equipos Usados Aplicables
          </h2>

          <div className="bg-gray-50 border-l-4 border-black p-6 mb-6">
            <div className="flex gap-3">
              <span className="text-black font-bold text-lg">⚠</span>
              <div>
                <p className="font-semibold text-black mb-1">Importante</p>
                <p className="text-gray-700">
                  El cuadro a continuación son los Equipos Usados aplicables a
                  la PROMOCIÓN, resulta aplicable desde el 1 de noviembre de
                  2025 hasta el 30 de noviembre de 2025.
                </p>
              </div>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            Los valores de retoma varían según el modelo y el estado (grado) del
            equipo usado. A continuación se detalla la lista completa de equipos
            aplicables con sus respectivos valores:
          </p>

          <div className="border border-gray-200 overflow-x-auto mb-8">
            <table className="w-full text-sm">
              <caption className="sr-only">
                Equipos usados aplicables a la promoción con valores según grado
              </caption>
              <thead>
                <tr className="bg-black text-white">
                  <th scope="col" className="px-4 py-3 text-left font-semibold">
                    Modelo
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-semibold">
                    Categoría
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">
                    Grado Perfecto
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">
                    Grado Deteriorado
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">
                    Grado Malo
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dispositivosUsados.map((dispositivo, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2 text-gray-700">
                      {dispositivo.modelo}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {dispositivo.categoria}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-700">
                      $ {dispositivo.gradoPerfecto}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-700">
                      $ {dispositivo.gradoDeteriorado}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-700">
                      $ {dispositivo.gradoMalo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          <div className="mt-6 p-6 bg-gray-50 border-l-4 border-gray-400">
            <h4 className="font-semibold text-black mb-3">
              Definición de grados de estado:
            </h4>
            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>Grado Perfecto:</strong> Equipo en excelente estado,
                con mínimas marcas de uso, completamente funcional.
              </li>
              <li>
                <strong>Grado Deteriorado:</strong> Equipo con signos evidentes
                de uso, pero completamente funcional.
              </li>
              <li>
                <strong>Grado Malo:</strong> Equipo con daños visibles o
                problemas funcionales menores, pero aún operativo.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </LegalDocumentLayout>
  );
}
