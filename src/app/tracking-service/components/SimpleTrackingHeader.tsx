interface SimpleTrackingHeaderProps {
  orderNumber: string;
  estimatedInitDate: string;
  estimatedFinalDate: string;
  guideNumber?: string;
  shippingType?: "pickup" | "imagiq" | "coordinadora";
}

export function SimpleTrackingHeader({
  orderNumber,
  estimatedInitDate,
  estimatedFinalDate,
  guideNumber,
  shippingType = "coordinadora",
}: Readonly<SimpleTrackingHeaderProps>) {
  const isCoordinadora = shippingType === "coordinadora";

  return (
    <div className="pt-1 pl-1 pr-4 sm:pt-2 sm:pl-1 sm:pr-5 pb-1">
      <div className="flex flex-col gap-1">
        {/* Order info */}
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-black mb-0.5">
            Estado de tu pedido:
          </h1>
          <div className="text-xs sm:text-sm text-gray-700 space-y-0.5">
            <p className="flex items-center gap-2 flex-wrap">
              <span className="font-bold">Orden #</span>
              {isCoordinadora && guideNumber ? (
                <a
                  href={`https://www.coordinadora.com/portafolio-de-servicios/servicios-en-linea/rastrear-guias/?guia=${guideNumber}&tipo=guia`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 underline hover:text-blue-800"
                >
                  {orderNumber}
                  <img
                    src="https://res.cloudinary.com/djeh72b9j/image/upload/v1769846616/logo-coordinadora_jswoes.svg"
                    alt="Coordinadora"
                    className="h-10"
                  />
                </a>
              ) : (
                orderNumber
              )}
            </p>

            <div>
              <p className="font-bold text-black text-xs">Fecha Entrega estimada</p>
              <p className="text-xs sm:text-sm text-gray-700">
                Entre el {estimatedInitDate} y el {estimatedFinalDate}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}