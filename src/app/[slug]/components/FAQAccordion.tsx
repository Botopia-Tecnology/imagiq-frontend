/**
 * Componente de FAQs con acordeón para landing pages
 * Muestra preguntas frecuentes con expand/collapse
 */

'use client';

import { useState } from 'react';
import type { MultimediaPageFAQ } from '@/services/multimedia-pages.service';
import { Plus, Minus } from 'lucide-react';

interface FAQAccordionProps {
  faqs: MultimediaPageFAQ[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  if (faqs.length === 0) {
    return null;
  }

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1440px' }}>
        {/* Título */}
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
          Preguntas frecuentes
        </h2>

        {/* Lista de FAQs */}
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="bg-gray-100 rounded-lg overflow-hidden"
            >
              {/* Pregunta - Header clickeable */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-start justify-between p-6 text-left hover:bg-gray-200 transition-colors duration-200"
              >
                <div className="flex items-start gap-4 flex-1">
                  <span className="font-bold text-xl md:text-2xl text-gray-900 flex-shrink-0">
                    Q{index + 1}.
                  </span>
                  <h3 className="font-bold text-xl md:text-2xl text-gray-900 flex-1">
                    {faq.pregunta}
                  </h3>
                </div>
                <div className="flex-shrink-0 ml-4">
                  {openIndex === index ? (
                    <Minus className="w-6 h-6 text-gray-900" />
                  ) : (
                    <Plus className="w-6 h-6 text-gray-900" />
                  )}
                </div>
              </button>

              {/* Respuesta - Contenido expandible */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 pt-2">
                  <div className="pl-10 text-lg md:text-xl text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {faq.respuesta}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
