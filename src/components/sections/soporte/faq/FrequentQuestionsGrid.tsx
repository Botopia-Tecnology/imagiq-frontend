"use client";

import Link from "next/link";

const questions = [
  {
    title: "Cuenta de Samsung",
    description:
      "Samsung Account es una membresía integral que te permite disfrutar todos los servicios de Samsung en celulares, tabletas, sitios web, televisiones, etc.",
    link: "#",
    icon: "👤",
  },
  {
    title: "Productos y Órdenes",
    description: "¿Cómo te podemos ayudar con tu orden?",
    link: "#",
    icon: "🛒",
  },
  {
    title: "Pagos y Finanzas",
    description: "Diversas opciones de pago",
    link: "#",
    icon: "💳",
  },
  {
    title: "Entregas e instalación",
    description: "¿Cómo conocer el estatus de envío de tu orden?",
    link: "#",
    icon: "🚚",
  },
  {
    title: "Retornos y cancelaciones",
    description: "¿Cómo proceder para una devolución o cancelación?",
    link: "#",
    icon: "📦",
  },
  {
    title: "Servicio y garantía",
    description: "Encuentra información de nuestro servicio y garantías",
    link: "#",
    icon: "🛡️",
  },
];

export function FrequentQuestionsGrid() {
  return (
    <div className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Preguntas frecuentes Samsung
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questions.map((question, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-2xl p-6 hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold flex-1">{question.title}</h3>
                <span className="text-3xl">{question.icon}</span>
              </div>

              <p className="text-sm text-gray-700 mb-6 flex-grow">
                {question.description}
              </p>

              <Link
                href={question.link}
                className="text-sm font-medium underline hover:no-underline inline-flex items-center gap-1"
              >
                Conocer más
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
