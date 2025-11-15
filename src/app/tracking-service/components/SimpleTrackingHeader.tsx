interface SimpleTrackingHeaderProps {
  orderNumber: string;
  estimatedInitDate: string;
  estimatedFinalDate: string;
}

export function SimpleTrackingHeader({
  orderNumber,
  estimatedInitDate,
  estimatedFinalDate,
}: Readonly<SimpleTrackingHeaderProps>) {
  return (
    <div className="pt-2 px-4 sm:pt-3 sm:px-5 pb-1">
      <div className="flex flex-col gap-4">
        {/* Order info */}
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
      </div>
    </div>
  );
}