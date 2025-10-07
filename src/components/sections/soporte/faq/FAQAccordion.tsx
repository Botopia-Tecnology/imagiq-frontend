"use client";

import { useState } from "react";

const faqItems = [
  {
    title: "1. Definiciones",
    content: "Contenido sobre definiciones...",
  },
  {
    title: "2. Funcionamiento del portal",
    content: "Contenido sobre funcionamiento del portal...",
  },
  {
    title: "3. Compra de productos a través del portal",
    content: "Contenido sobre compra de productos...",
  },
  {
    title: "4. Precios de los productos incluidos en el portal",
    content: "Contenido sobre precios...",
  },
  {
    title: "5. Métodos de pago",
    content: "Contenido sobre métodos de pago...",
  },
  {
    title: "6. Entrega de los productos",
    content: "Contenido sobre entrega...",
  },
  {
    title: "7. Retracto",
    content: "Contenido sobre retracto...",
  },
  {
    title: "8. Reversión",
    content: "Contenido sobre reversión...",
  },
  {
    title: "9. Garantías",
    content: "Contenido sobre garantías...",
  },
  {
    title: "10. Cambios",
    content: "Contenido sobre cambios...",
  },
  {
    title: "11. Derechos y deberes de los Usuarios del Portal",
    content: "Contenido sobre derechos y deberes...",
  },
  {
    title: "12. Usos permitidos del Portal",
    content: "Contenido sobre usos permitidos...",
  },
];

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="space-y-0 border-t border-gray-300">
          {faqItems.map((item, index) => (
            <div key={index} className="border-b border-gray-300">
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between py-5 px-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-base font-semibold">{item.title}</span>
                <svg
                  className={`w-5 h-5 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-6 pt-2 text-sm text-gray-700 bg-gray-50">
                  {item.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
