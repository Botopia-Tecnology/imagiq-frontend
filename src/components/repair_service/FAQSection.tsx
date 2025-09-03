"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "¿Es posible registrar todos los productos sin restricciones?",
      answer: "Sí, puedes registrar todos tus productos Samsung sin restricciones. Los componentes, dispositivos de almacenamiento (SSD) y productos no tienen fecha de fin en venta. Samsung garantiza que pueden registrarse todos los productos sin excepción."
    },
    {
      question: "¿Por qué mi número de serie, IMEI o código de modelo parecen no ser válidos?",
      answer: "Si tu número de serie, IMEI o código de modelo no son reconocidos, verifica que hayas ingresado la información correctamente. Asegúrate de que no haya espacios adicionales o caracteres especiales. Si el problema persiste, contacta nuestro soporte técnico."
    },
    {
      question: "¿Cómo puedo encontrar el IMEI o número de serie de mi producto?",
      answer: "Para dispositivos móviles, puedes encontrar el IMEI en Configuración > Acerca del teléfono. Para otros productos, busca la etiqueta en la parte posterior o inferior del dispositivo. También puedes marcar *#06# en tu teléfono para ver el IMEI."
    },
    {
      question: "¿Cuáles son los beneficios de registrar Mis productos?",
      answer: "Al registrar tus productos obtienes: acceso prioritario a soporte técnico, garantía extendida, notificaciones de actualizaciones, ofertas exclusivas, servicios de reparación con descuentos y acceso a Samsung Members con beneficios adicionales."
    },
    {
      question: "¿Cómo puedo usar un código QR para registrarme?",
      answer: "Muchos productos Samsung incluyen un código QR en el empaque o en el propio dispositivo. Simplemente escanéalo con la cámara de tu teléfono o la app Samsung Members para registrar automáticamente tu producto con toda la información necesaria."
    },
    {
      question: "¿Cómo puedo obtener soporte de servicio de Samsung?",
      answer: "Puedes obtener soporte a través de múltiples canales: centro de atención telefónica 24/7, chat en vivo en nuestra página web, centros de servicio autorizados, servicio técnico a domicilio, y a través de la app Samsung Members."
    },
    {
      question: "¿Dónde puedo ver mis productos registrados?",
      answer: "Puedes ver todos tus productos registrados en tu cuenta Samsung Members, en la sección 'Mis productos'. También puedes acceder desde la página web de Samsung en la sección de tu perfil de usuario."
    },
    {
      question: "¿Cómo registro mi producto con Samsung Members?",
      answer: "Descarga la app Samsung Members, crea una cuenta o inicia sesión, ve a la sección 'Mis productos', selecciona 'Agregar producto' y sigue las instrucciones para registrar tu dispositivo usando el número de serie o código QR."
    },
    {
      question: "¿Cómo puedo registrarme usando la aplicación SmartThings?",
      answer: "En la app SmartThings, ve a la configuración del dispositivo que quieres registrar, busca la opción 'Registrar producto' o 'Vincular con Samsung Account', y sigue las instrucciones para completar el registro automáticamente."
    },
    {
      question: "¿Cómo puedo registrar mi Smart TV en el mismo televisor?",
      answer: "En tu Smart TV Samsung, ve a Configuración > Soporte > Información del dispositivo > Registro de producto, o busca 'Samsung Members' en las aplicaciones. Sigue las instrucciones en pantalla para completar el registro directamente desde tu TV."
    },
    {
      question: "¿Todavía tienes dificultades con el registro del producto?",
      answer: "Si continúas teniendo problemas con el registro, nuestro equipo de soporte está disponible 24/7. Puedes contactarnos por teléfono, chat en vivo, o visitando cualquiera de nuestros centros de servicio autorizados donde te ayudaremos personalmente."
    },
    {
      question: "¿Cuál es la diferencia entre la garantía de fabricante y la garantía confirmada?",
      answer: "La garantía de fabricante es la cobertura estándar incluida con tu producto. La garantía confirmada es una verificación adicional que se activa al registrar tu producto, la cual puede incluir beneficios extras como extensión de cobertura o servicios prioritarios."
    },
    {
      question: "¿Cuál es la finalidad de la información del cliente usada en Mi página?",
      answer: "La información del cliente se utiliza para personalizar tu experiencia, proporcionar soporte técnico efectivo, enviar notificaciones importantes sobre tu producto, ofertas exclusivas, y mejorar nuestros servicios. Toda la información se maneja según nuestras políticas de privacidad."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Preguntas frecuentes
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Encuentra respuestas a las preguntas más comunes sobre el registro de productos 
            y servicios de reparación Samsung.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openFAQ === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </button>
              
              {openFAQ === index && (
                <div className="px-6 pb-4">
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿No encontraste lo que buscabas?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Nuestro equipo de soporte está disponible 24/7 para ayudarte con cualquier 
              pregunta o problema relacionado con tus productos Samsung.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Chat en Vivo
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-gray-400 transition-colors">
                Llamar Soporte
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
