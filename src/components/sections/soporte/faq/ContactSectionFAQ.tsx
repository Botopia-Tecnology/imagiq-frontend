"use client";

const contactOptions = [
  {
    title: "WhatsApp - 24/7",
    description: "Ayudarte ahora es más fácil a través de nuestro canal de WhatsApp",
    availability: "Disponible las 24 horas al día",
    buttonText: "Chatea aquí",
    icon: "💬",
  },
  {
    title: "Chatea con un agente - 24/7",
    description:
      "24 horas, 7 días a la semana, soporte con un agente en línea de compras",
    availability: "Disponible las 24 horas al día",
    buttonText: "Chatea aquí",
    icon: "💬",
  },
  {
    title: "Consulta más canales de servicio",
    description: "",
    availability: "",
    buttonText: "Ver más",
    icon: "📞",
  },
];

export function ContactSectionFAQ() {
  return (
    <div className="bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Contacto
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactOptions.map((option, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-2xl p-6 hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold flex-1">{option.title}</h3>
                <span className="text-2xl">{option.icon}</span>
              </div>

              {option.description && (
                <p className="text-sm text-gray-700 mb-4">{option.description}</p>
              )}

              {option.availability && (
                <p className="text-xs text-blue-600 mb-4">{option.availability}</p>
              )}

              <button className="mt-auto bg-black text-white hover:bg-gray-800 px-5 py-2.5 rounded-full font-medium text-sm transition-colors inline-flex items-center justify-center gap-2">
                {option.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
