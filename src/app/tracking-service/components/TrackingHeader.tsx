interface TrackingHeaderProps {
  orderNumber: string;
  estimatedInitDate: string;
  estimatedFinalDate: string;
}

export function TrackingHeader({
  orderNumber,
  estimatedInitDate,
  estimatedFinalDate,
}: Readonly<TrackingHeaderProps>) {
  return (
    <div className="pt-2 px-4 sm:pt-3 sm:px-5 pb-1">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left side - Order info */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-black mb-1">
            Estado de tu pedido:
          </h1>
          <div className="text-xs sm:text-sm text-gray-700 space-y-1">
            <p>
              <span className="font-bold">Orden #</span> {orderNumber}
            </p>
            <div className="mt-1">
              <p className="font-bold text-black">Fecha Entrega estimada</p>
              <p className="text-sm sm:text-base text-gray-700">
                Entre el {estimatedInitDate} y el {estimatedFinalDate}
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Status steps */}
        <div className="flex items-center">
          {/* Step 1: Recibido */}
          <div className="flex flex-col items-center gap-1 relative z-20">
            <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs font-bold text-gray-800 text-center">Recibido por IMAGIQ</p>
          </div>

          {/* Connector Line 1 */}
          <div className="w-32 h-1 bg-black relative z-10 -mx-8"></div>

          {/* Step 2: Enviando - In Progress */}
          <div className="flex flex-col items-center gap-1 relative z-20">
            <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-300">
              <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-xs font-bold text-gray-500 text-center">Enviando por IMAGIQ</p>
          </div>

          {/* Connector Line 2 */}
          <div className="w-32 h-1 bg-gray-500 relative z-10 -mx-8"></div>

          {/* Step 3: Entregado - Not Started */}
          <div className="flex flex-col items-center gap-1 relative z-20">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-300">
              <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-xs font-bold text-gray-500 text-center">Entregado por IMAGIQ</p>
          </div>
        </div>
      </div>
    </div>
  );
}
