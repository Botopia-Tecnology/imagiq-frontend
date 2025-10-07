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
    icon: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1759840839/Home_addInfo_Warranty_onoynl.jpg",
  },
  {
    title: "Servicio en Línea",
    description: "Registra aquí tus productos para agilizar consultas y solicitar asistencia",
    buttons: [
      { text: "Regístrate aquí", href: "#" },
    ],
    icon: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1759840864/your-service-icon_vhjmne.svg",
  },
  {
    title: "Contenido en Lengua de señas",
    description: "Encuentra el contenido en lenguaje de señas y sácale provecho a tus productos",
    buttons: [
      { text: "Conoce más", href: "#" },
    ],
    icon: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1759840869/LS36_pjui7q.jpg",
  },
  {
    title: 'Proyecto "Conscious Service"',
    description: "Conoce nuestros proyectos ambientalmente conscientes que se implementan en servicio al cliente de Samsung.",
    buttons: [
      { text: "Conoce más", href: "#" },
    ],
    icon: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1759840895/eco-conscious-service-icon-additional-information_36x36_jtyu9a.png",
  },
  {
    title: "Todo sobre Dispositivos móviles",
    description: "Obtén más información acerca de configuraciones y funciones de tus dispositivos móviles Galaxy",
    buttons: [
      { text: "Conoce más", href: "#" },
    ],
    icon: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1759841061/jp-addinfo-simulator_nrdtol.webp",
  },
  {
    title: "Todo sobre los Smart TV",
    description: "Obtén más información acerca de configuraciones y funciones de tu Smart TV",
    buttons: [
      { text: "Conoce más", href: "#" },
    ],
    icon: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1759841061/jp-addinfo-simulator_nrdtol.webp",
  },
];

export function AdditionalInfoSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 pb-16">
      <h2 className="text-3xl md:text-4xl font-black text-center mb-12">
        Encuentre información adicional
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {infoCards.map((card, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-3xl p-6 hover:shadow-lg transition-shadow flex flex-col h-56"
          >
            {/* Header with title and icon */}
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-base font-black flex-1 pr-3">{card.title}</h3>
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                <Image
                  src={card.icon}
                  alt={card.title}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-700 mb-1 leading-relaxed flex-grow">
              {card.description}
            </p>

            {/* Buttons - left aligned */}
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
