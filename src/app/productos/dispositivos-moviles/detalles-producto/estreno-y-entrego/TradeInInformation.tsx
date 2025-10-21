import React from "react";

interface Step {
  number: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Selección del producto",
    description:
      "Elige el producto que quieres adquirir y haz clic en la opción Estreno y Entrego antes de agregarlo al carrito.",
  },
  {
    number: "02",
    title: "Suministro de la información",
    description:
      "Responde algunas preguntas sencillas para que estimemos el valor de tu equipo usado.",
  },
  {
    number: "03",
    title: "Envío y entrega del equipo",
    description:
      "Al finalizar tu compra, dentro de los cuatro (4) días hábiles siguientes, recibirás un correo electrónico con la guía logística y las instrucciones para realizar el envío del equipo usado.",
  },
  {
    number: "04",
    title: "Verificación del equipo para acceder a Estreno y Entrego",
    description:
      "Una vez que hayamos recibido tu equipo usado, se verificará su condición y se determinará el valor final de la compra del mismo. Si estás de acuerdo con este, se consignará el dinero a tu cuenta bancaria.",
  },
  {
    number: "05",
    title: "Envío de documentos y recepción del dinero",
    description:
      "Para habilitar la transferencia, deberás enviar por correo electrónico el contrato de venta del equipo usado y otros datos relacionados a tu cuenta.",
  },
];

export default function TradeInInformation() {
  return (
    <div className="px-6 md:px-10 py-6">
      <div className="mb-8">
        <h3 className="text-lg font-bold text-[#222] mb-5">
          ¿Cómo acceder a Estreno y Entrego?
        </h3>

        <div className="space-y-6">
          {steps.map((step) => (
            <div key={step.number} className="flex gap-4">
              <div className="flex-shrink-0">
                <span className="text-2xl font-bold text-[#222]">
                  {step.number}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#222] mb-1.5">
                  {step.title}
                </h4>
                <p className="text-xs text-[#222] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 text-xs text-gray-600 leading-relaxed">
          <p>
            Si tu producto no se encuentra en las opciones proporcionadas,
            selecciona &apos;otros&apos; y recibirás un descuento del 10%. Sin
            embargo, en este caso, deberás entregar tu dispositivo actual, pero
            no recibirás ningún cashback
          </p>
          <p className="text-[#222] mt-2">Aplican términos y condiciones.</p>
        </div>
      </div>
    </div>
  );
}
