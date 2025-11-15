import { OrderInfoCard, InstructionsBox } from "@/app/tracking-service/components";
import Image from "next/image";

interface Product {
  id: string;
  nombre: string;
  imagen?: string;
  cantidad: number;
  precio?: number;
}

interface StoreInfo {
  nombre: string;
  direccion: string;
  ciudad: string;
  telefono: string;
  horario: string;
}

interface EnhancedPickupOrderViewProps {
  orderNumber: string;
  token: string;
  horaRecogida: string;
  fechaCreacion?: string;
  products?: Product[];
  storeInfo?: StoreInfo;
  formatDate: (
    dateString: string,
    options?: Intl.DateTimeFormatOptions
  ) => string;
}

export function EnhancedPickupOrderView({
  orderNumber,
  token,
  horaRecogida,
  fechaCreacion,
  products = [],
  storeInfo,
  formatDate,
}: Readonly<EnhancedPickupOrderViewProps>) {
  const orderInfoItems = [
    { label: "Orden #", value: orderNumber },
    { label: "Token", value: token, highlight: true },
    {
      label: "Fecha de creación",
      value: fechaCreacion ? formatDate(fechaCreacion) : formatDate(new Date().toISOString()),
    },
    {
      label: "Hora de recogida",
      value: horaRecogida || "Pendiente por asignar",
    },
    {
      label: "Estado",
      value: horaRecogida ? "Listo para recoger" : "Preparando pedido",
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-8">
      {/* Header Section */}
      <div className="text-center">
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
          {horaRecogida ? "Pedido listo para recoger" : "Preparando tu pedido"}
        </h1>
        <p className="text-gray-600">
          {horaRecogida
            ? "Tu pedido está preparado y esperando por ti en la tienda"
            : "Estamos preparando tu pedido. Te notificaremos cuando esté listo."}
        </p>
      </div>

      {/* Main Content - Two Column Layout on Desktop */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Order Info */}
        <div className="lg:w-1/2 w-full space-y-6">
          <OrderInfoCard title="Información del pedido" items={orderInfoItems} />

          {/* Store Information */}
          {storeInfo && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-black">
                  Información de la tienda
                </h2>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-900">{storeInfo.nombre}</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg
                    className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                  <span className="text-gray-600">{storeInfo.direccion}, {storeInfo.ciudad}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="text-gray-600">{storeInfo.telefono}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-gray-600">{storeInfo.horario}</span>
                </div>
              </div>
            </div>
          )}

          <InstructionsBox
            title="Instrucciones para recoger"
            instructions="Presenta tu identificación, el número de orden y el token al personal de la tienda para recoger tu pedido."
          />
        </div>

        {/* Right Column - Products List */}
        <div className="lg:w-1/2 w-full">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-[535px] flex flex-col">
            <div className="p-6 flex-shrink-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-black">
                    Productos en tu pedido
                  </h2>
                  <p className="text-sm text-gray-500">
                    {products.length} {products.length === 1 ? 'producto' : 'productos'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-hidden px-6 pb-6">
              {products.length > 0 ? (
                <div className="space-y-4 h-full overflow-y-auto pr-2">
                  {products.map((product, index) => (
                    <div
                      key={product.id}
                      className="flex gap-6 p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md hover:border-purple-300 transition-all duration-200"
                    >
                      {/* Product Image */}
                      <div className="w-56 h-56 bg-white rounded-xl overflow-hidden flex-shrink-0 border-2 border-gray-100 relative shadow-sm">
                        {product.imagen ? (
                          <Image
                            src={product.imagen}
                            alt={product.nombre}
                            fill
                            className="object-contain p-3"
                            sizes="224px"
                            priority={index < 3}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                            <svg
                              className="w-20 h-20 text-gray-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 mb-3">
                            {product.nombre}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full font-medium">
                              Cantidad: {product.cantidad}
                            </span>
                          </div>
                        </div>
                        {product.precio && (
                          <div className="flex justify-end">
                            <span className="text-xl font-bold text-[#17407A]">
                              ${product.precio.toLocaleString('es-CO')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-dashed border-gray-300 h-full flex items-center justify-center">
                  <div className="flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                      <svg
                        className="w-16 h-16 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div>
                    <h3 className="text-base font-semibold text-gray-700 mb-2">
                      Detalles del pedido
                    </h3>
                    <p className="text-sm text-gray-500 max-w-xs">
                      Los detalles de los productos se mostrarán aquí una vez que estén disponibles
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* QR Code Token Display */}
          <div className="mt-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200 p-6">
            <h3 className="font-semibold text-gray-900 text-center mb-3">
              Token de recogida
            </h3>
            <div className="bg-white rounded-lg p-6 shadow-inner">
              <div className="text-center">
                <div className="inline-block bg-gray-100 px-6 py-3 rounded-lg mb-3">
                  <span className="text-3xl font-bold text-[#17407A] tracking-wider">
                    {token}
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Presenta este código al recoger tu pedido
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
