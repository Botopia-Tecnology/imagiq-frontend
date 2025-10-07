"use client";

const contactOptions = [
  {
    title: "WhatsApp",
    description: "Ayudarte ahora es más fácil a través de nuestro canal de WhatsApp",
    buttonText: "Chatea aquí",
    hasQR: true,
    icon: "whatsapp",
  },
  {
    title: "Chatea con un agente",
    description: "Soporte con un agente especializado",
    buttonText: "Chatea aquí",
    icon: "chat",
  },
  {
    title: "Encuentra un Centro de Servicio Autorizado",
    description: "Busca el centro de servicio más cercano y visítanos para recibir una atención personalizada",
    buttonText: "Encuentra un centro de servicio",
    icon: "location",
  },
  {
    title: "Compra en Centros de Servicio Autorizados",
    description: "Conoce nuestra red de tiendas a nivel nacional donde compras con descuentos exclusivos",
    buttonText: "Contáctalos aquí",
    icon: "store",
  },
  {
    title: "Consulta más canales de servicio",
    description: "",
    buttonText: "Ver más",
    icon: "channels",
  },
];

export function ContactInfoManuales() {
  return (
    <div className="bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Información de Contacto
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contactOptions.map((option, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-2xl p-6 hover:shadow-lg transition-shadow flex flex-col"
            >
              <h3 className="text-lg font-bold mb-3">{option.title}</h3>
              {option.description && (
                <p className="text-sm text-gray-700 mb-6 flex-grow">
                  {option.description}
                </p>
              )}

              {option.hasQR && (
                <>
                  <div className="flex justify-center mb-3">
                    <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-gray-500">QR Code</span>
                    </div>
                  </div>
                  <p className="text-xs text-center text-gray-600 mb-4">
                    Escanea para ingresar
                  </p>
                </>
              )}

              <button className="bg-black text-white hover:bg-gray-800 px-5 py-2.5 rounded-full font-medium text-sm transition-colors inline-flex items-center justify-center gap-2">
                {option.buttonText}
                <span>→</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
