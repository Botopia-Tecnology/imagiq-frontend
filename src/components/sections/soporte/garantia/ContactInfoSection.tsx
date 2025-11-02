"use client";

export function ContactInfoSection() {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-12">
          Información de Contacto
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {/* WhatsApp Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.346"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2 text-left">WhatsApp</h3>
                <p className="text-sm text-gray-600 mb-4 text-left">
                  Ayudarte ahora es más fácil a través de nuestro canal de WhatsApp
                </p>
              </div>
            </div>
            
            {/* QR Code */}
            <div className="text-center mt-6">
              <div className="bg-white p-4 rounded-lg mb-4 mx-auto w-32 h-32 flex items-center justify-center border">
                <img 
                  src="https://res.cloudinary.com/dcljjtnxr/image/upload/v1759841463/Whatsapp_Contact_Info_nvowjp.png"
                  alt="WhatsApp QR Code"
                  className="w-24 h-24"
                />
              </div>
              <p className="text-xs text-gray-500 mb-4">Escanea para ingresar</p>
              
              <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors">
                Chatea aquí
              </button>
            </div>
          </div>

          {/* Chat Agent Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2 text-left">Chatea con un agente</h3>
                <p className="text-sm text-gray-600 text-left">
                  Soporte con un agente especializado
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors">
                Chatea aquí
              </button>
            </div>
          </div>

          {/* Service Center Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2 text-left">Encuentra un Centro de Servicio Autorizado</h3>
                <p className="text-sm text-gray-600 text-left">
                  Busca el centro de servicio más cercano y visítanos para recibir una atención personalizada
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
                Encuentra un centro de servicio
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Additional Contact Options */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Service Centers */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold mb-4">Compra en Centros de Servicio Autorizados</h3>
              <p className="text-sm text-gray-600 mb-4">
                Conoce nuestra red de tiendas a nivel nacional donde compras con descuentos exclusivos
              </p>
              <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors">
                Conócelos aquí
              </button>
            </div>

            {/* Additional Channels */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold mb-4">Consulta más canales de servicio</h3>
              <p className="text-sm text-gray-600 mb-4">
                Descubre todas las formas de contactarnos y recibir soporte técnico
              </p>
              <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors">
                Ver más
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}