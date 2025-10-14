"use client";

export function WarrantyPolicySection() {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-12">
          Política de garantía
        </h2>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Legal Warranty Conditions */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-4 uppercase">
              CONDICIONES DE GARANTÍA LEGAL PARA SAMSUNG ELECTRONICS COLOMBIA S.A. NIT 830.028.931-5
            </h3>
            <p className="text-sm font-semibold mb-6">Garantía sujeta a la Ley 1480 de 2011.</p>
            
            <ol className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                <div>
                  Si tienes dudas sobre el funcionamiento de tu producto, 
                  <a href="#" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1">
                    Descarga el Manual de usuario
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </li>
              
              <li className="flex items-start gap-3">
                <span className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                <div>
                  Si aún requieres solicitar tu garantía, te sugerimos presentar evidencia de compra.
                </div>
              </li>
              
              <li className="flex items-start gap-3">
                <span className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                <div>
                  Al solicitar tu garantía, ten presente:
                  <ul className="mt-2 ml-4 space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>La garantía únicamente ampara productos importados por Samsung Electronics Colombia S.A.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Revisa las situaciones que no cubre tu garantía Samsung.</span>
                    </li>
                  </ul>
                </div>
              </li>
            </ol>
          </div>

          {/* Situations Not Covered */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h3 className="text-lg font-bold mb-4 uppercase">
              SITUACIONES NO CUBIERTAS POR LA GARANTÍA: Las dispuestas en Ley 1480 de 2011 artículo 16, por ejemplo daños causados por:
            </h3>
            
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                <span>Uso de accesorios no originales o dañados.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                <span>Fluctuaciones de voltaje.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                <span>Exposición a arena, agua o cualquier sustancia sin tener en cuenta el manual de usuario.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                <span>Maltrato, modificaciones de software, hardware o alteración de Imei o serie.</span>
              </li>
            </ul>
          </div>

          {/* Support for Products Purchased in Other Countries */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h3 className="text-lg font-bold mb-4 uppercase">
              SOPORTE A PRODUCTOS COMPRADOS EN OTROS PAÍSES
            </h3>
            
            <div className="space-y-4 text-sm">
              <p>
                El servicio técnico en ejecución de la garantía se presta en el país donde se vendió por primera vez el Teléfono, Tablet o Accesorio.
              </p>
              
              <p>
                Sin embargo, el usuario puede ponerse en contacto con un Centro de Servicio Autorizado en Colombia, con el fin de confirmar si es viable o no su mantenimiento o reparación, y cuáles son los términos específicos de precio, tiempo, y otras variables aplicables en caso de ser viable, teniendo en cuenta estas condiciones:
              </p>
              
              <ol className="space-y-3 ml-4">
                <li className="flex items-start gap-3">
                  <span className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">I</span>
                  <span>El usuario deberá demostrar su compra en el exterior a través de una factura de compra sujeta a verificación.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">II</span>
                  <span>En caso de ser viable el mantenimiento o la reparación, este se ofrecerá únicamente durante los doce meses siguientes a la compra.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">III</span>
                  <span>La reparación podría tardar hasta 180 días hábiles y tener cargos adicionales que varían de acuerdo a cada situación.</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
