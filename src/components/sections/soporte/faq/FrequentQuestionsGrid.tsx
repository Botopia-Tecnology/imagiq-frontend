"use client";

import Link from "next/link";
import Image from "next/image";

const questions = [
  {
    title: "Cuenta de Samsung",
    description:
      "Samsung Account es una membresía integral que te permite disfrutar todos los servicios de Samsung en celulares, tabletas, sitios web, televisiones, etc.",
    link: "#",
    iconImage: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1759861365/shop-faq_landing_categories-img01_owtq51.webp",
  },
  {
    title: "Productos y Órdenes",
    description: "¿Cómo te podemos ayudar con tu orden?",
    link: "#",
    iconImage: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1759861402/shop-faq_landing_categories-img02_1_j45two.webp",
  },
  {
    title: "Pagos y Finanzas",
    description: "Diversas opciones de pago",
    link: "#",
    iconImage: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1759861359/shop-faq_landing_categories-img03_u5s0tj.webp",
  },
  {
    title: "Entregas e instalación",
    description: "¿Cómo conocer el estatus de envío de tu orden?",
    link: "#",
    iconImage: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1759861357/shop-faq_landing_categories-img05_chji1g.webp",
  },
  {
    title: "Retornos y cancelaciones",
    description: "¿Cómo proceder para una devolución o cancelación?",
    link: "#",
    iconImage: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1759861352/shop-faq_landing_categories-img06_jfebmv.webp",
  },
  {
    title: "Servicio y garantía",
    description: "Encuentra información de nuestro servicio y garantías",
    link: "#",
    iconImage: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1759861351/shop-faq_landing_categories-img07_cynywn.webp",
  },
];

export function FrequentQuestionsGrid() {
  return (
    <div className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-12">
          Preguntas frecuentes Samsung
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questions.map((question, index) => (
            <div
              key={index}
              className="border border-gray-800 rounded-2xl p-6 hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold flex-1">{question.title}</h3>
                <div className="w-8 h-8 relative">
                  <Image
                    src={question.iconImage}
                    alt={question.title}
                    fill
                    className="object-contain"
                  />
                </div>
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
