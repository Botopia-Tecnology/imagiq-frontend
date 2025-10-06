"use client";

import Image from "next/image";

const infoCards = [
  {
    title: "Garantía",
    description: "Registra aquí tus productos y consulta información sobre tu garantía",
    buttons: [
      { text: "Registra tu producto aquí", href: "#" },
      { text: "Consulta aquí", href: "#" },
    ],
    icon: "/soporte/icon-garantia.png",
  },
  {
    title: "Servicio en Línea",
    description: "Registra aquí tus productos para agilizar consultas y solicitar asistencia",
    buttons: [
      { text: "Regístrate aquí", href: "#" },
    ],
    icon: "/soporte/icon-servicio.png",
  },
  {
    title: "Contenido en Lengua de señas",
    description: "Encuentra el contenido en lenguaje de señas y sácale provecho a tus productos",
    buttons: [
      { text: "Conoce más", href: "#" },
    ],
    icon: "/soporte/icon-lengua-senas.png",
  },
  {
    title: 'Proyecto "Conscious Service"',
    description: "Conoce nuestros proyectos ambientalmente conscientes que se implementan en servicio al cliente de Samsung.",
    buttons: [
      { text: "Conoce más", href: "#" },
    ],
    icon: "/soporte/icon-conscious.png",
  },
  {
    title: "Todo sobre Dispositivos móviles",
    description: "Obtén más información acerca de configuraciones y funciones de tus dispositivos móviles Galaxy",
    buttons: [
      { text: "Conoce más", href: "#" },
    ],
    icon: "/soporte/icon-moviles.png",
  },
  {
    title: "Todo sobre los Smart TV",
    description: "Obtén más información acerca de configuraciones y funciones de tu Smart TV",
    buttons: [
      { text: "Conoce más", href: "#" },
    ],
    icon: "/soporte/icon-smart-tv.png",
  },
];

export function AdditionalInfoSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 pb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Encuentre información adicional
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {infoCards.map((card, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-3xl p-8 hover:shadow-lg transition-shadow flex flex-col h-full"
          >
            {/* Header with title and icon */}
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold flex-1 pr-4">{card.title}</h3>
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                <Image
                  src={card.icon}
                  alt={card.title}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-700 mb-6 leading-relaxed flex-grow">
              {card.description}
            </p>

            {/* Buttons - aligned to the left and smaller */}
            <div className="flex flex-col gap-2.5 items-start">
              {card.buttons.map((button, btnIndex) => (
                <a
                  key={btnIndex}
                  href={button.href}
                  className="bg-black text-white hover:bg-gray-800 text-left px-4 py-2 rounded-full font-medium text-xs transition-colors inline-flex items-center gap-2"
                >
                  {button.text}
                  <span>→</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Ver más button */}
      <div className="flex justify-center mt-8">
        <button className="border-2 border-black bg-white text-black hover:bg-black hover:text-white px-6 py-2.5 rounded-full font-medium text-sm transition-colors inline-flex items-center gap-2">
          Ver más
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
