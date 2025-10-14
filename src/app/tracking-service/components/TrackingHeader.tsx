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
  );
}
