import { OrderInfoCard } from "./OrderInfoCard";
import { InstructionsBox } from "./InstructionsBox";

interface PickupOrderViewProps {
  orderNumber: string;
  token: string;
  horaRecogida: string;
  formatDate: (
    dateString: string,
    options?: Intl.DateTimeFormatOptions
  ) => string;
}

export function PickupOrderView({
  orderNumber,
  token,
  horaRecogida,
  formatDate,
}: Readonly<PickupOrderViewProps>) {
  const orderInfoItems = [
    { label: "Orden #", value: orderNumber },
    { label: "Token", value: token, highlight: true },
    {
      label: "Fecha de creación",
      value: formatDate(new Date().toISOString()),
    },
    {
      label: "Hora de recogida",
      value: horaRecogida || "Pendiente por asignar",
    },
    {
      label: "Estado",
      value: horaRecogida ? "Listo para recoger" : "Pendiente",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-black mb-2">
          Pedido listo para recoger
        </h1>
        <p className="text-gray-600">
          Tu pedido está preparado y esperando por ti en la tienda
        </p>
      </div>

      <OrderInfoCard title="Información del pedido" items={orderInfoItems} />

      <InstructionsBox
        title="Instrucciones para recoger"
        instructions="Presenta tu identificación, el número de orden y el token al personal de la tienda para recoger tu pedido."
      />
    </div>
  );
}
