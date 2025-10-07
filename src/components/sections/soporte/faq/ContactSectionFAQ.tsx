"use client";

import Image from "next/image";

const contactOptions = [
  {
    title: "WhatsApp - 24/7",
    description: "Ayudarte ahora es más fácil a través de nuestro canal de WhatsApp",
    availability: "Disponible las 24 horas al día",
    buttonText: "Chatea aquí",
    hasImage: true,
  },
  {
    title: "Chatea con un agente - 24/7",
    description:
      "24 horas, 7 días a la semana, soporte con un agente en línea de compras",
    availability: "Disponible las 24 horas al día",
    buttonText: "Chatea aquí",
    hasImage: false,
  },
  {
    title: "Consulta más canales de servicio",
    description: "",
    availability: "",
    buttonText: "Ver más",
    hasImage: false,
  },
];

export function ContactSectionFAQ() {
  return (
    <div className="bg-white pt-12 pb-4 px-4">
      <div className="max-w-7xl mx-auto w-full">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Contacto
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full px-0">
          {contactOptions.map((option, index) => (
            <div
              key={index}
              className="border border-black rounded-2xl p-6 hover:shadow-lg transition-shadow flex flex-col relative w-full min-h-[200px]"
            >
              {option.hasImage && (
                <div className="absolute top-4 right-4 w-12 h-12">
                  <Image
                    src="https://res.cloudinary.com/dcljjtnxr/image/upload/v1759859506/images_jnxm9j.jpg"
                    alt="WhatsApp"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-lg font-bold">{option.title}</h3>
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
