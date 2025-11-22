import React from "react";

interface TradeInCompletedSummaryProps {
  readonly deviceName: string;
  readonly tradeInValue: number;
  readonly onEdit: () => void;
  readonly validationError?: string;
  readonly showStorePickupMessage?: boolean;
  readonly isGuide?: boolean;
  readonly showErrorSkeleton?: boolean;
  readonly shippingCity?: string;
  readonly showCanPickUpMessage?: boolean; // Mostrar mensaje cuando canPickUp es false
}

export default function TradeInCompletedSummary({
  deviceName,
  tradeInValue,
  onEdit,
  validationError,
  showStorePickupMessage = false,
  isGuide = false,
  showErrorSkeleton = false,
  shippingCity,
  showCanPickUpMessage = false,
}: TradeInCompletedSummaryProps) {
  return (
    <section className="mb-3 md:mb-4">
      <div className={`rounded-lg p-3 md:p-4 border relative ${
        validationError 
          ? "bg-red-50 border-red-200" 
          : "bg-gray-50 border-gray-200"
      }`}>
        {/* Botón X para cerrar/quitar el beneficio - Solo mostrar si NO es guía (está completado) */}
        {!isGuide && (
          <button
            onClick={onEdit}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Quitar beneficio Entrego y Estreno"
            type="button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <div className="flex items-start justify-between gap-2 md:gap-4 pr-4 md:pr-6">
          <div className="flex items-center gap-2 md:gap-3 flex-1">
            <div className="flex-shrink-0">
              <svg className={`w-5 h-5 md:w-6 md:h-6 ${validationError ? "text-red-500" : "text-[#0099FF]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className={`text-sm md:text-base font-semibold mb-0.5 md:mb-1 ${
                validationError ? "text-red-700" : "text-[#222]"
              }`}>
                Entrego y Estreno
              </h3>
              <p className={`text-xs md:text-sm ${validationError ? "text-red-600" : "text-gray-600"}`}>
                {deviceName}
              </p>

              {isGuide ? (
                <p className="text-xs md:text-sm text-gray-600 mt-1 md:mt-2">
                  Solo aplica para recoger en tienda
                </p>
              ) : (
                <button
                  onClick={onEdit}
                  className={`text-xs md:text-sm hover:underline transition-colors mt-1 md:mt-2 inline-block ${
                    validationError ? "text-red-600" : "text-[#0099FF]"
                  }`}
                  type="button"
                >
                  Cambiar producto
                </button>
              )}
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            {isGuide ? (
              <button
                onClick={onEdit}
                className="bg-[#0099FF] text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-center min-w-[100px] md:min-w-[120px] hover:bg-[#0088E6] transition-colors cursor-pointer"
                type="button"
              >
                <p className="text-xs md:text-sm font-bold mb-0 md:mb-0.5">
                  Bono disponible
                </p>
                <p className="text-[10px] md:text-xs opacity-90">
                  Haz clic para aplicar
                </p>
              </button>
            ) : (
              <p className={`text-lg md:text-xl font-bold ${
                validationError ? "text-red-600" : "text-[#0099FF]"
              }`}>
                - $ {tradeInValue.toLocaleString('es-CO')}
              </p>
            )}
          </div>
        </div>

        {/* Mensaje de error de validación - Mostrar skeleton inicialmente, luego el mensaje */}
        {validationError && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            {showErrorSkeleton ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : (
              <p className="text-sm text-red-700 font-medium leading-relaxed">
                {validationError}
              </p>
            )}
          </div>
        )}

        {/* Mensaje normal si no hay error */}
        {!validationError && (
          <div className={`${isGuide ? "mt-1.5 pt-1.5 md:mt-2 md:pt-2" : "mt-2 pt-2 md:mt-3 md:pt-3"} border-t border-gray-200`}>
            {isGuide ? (
              <div className="space-y-0.5 md:space-y-1">
                <p className="text-xs md:text-sm text-gray-700 leading-tight md:leading-relaxed font-medium">
                  Este producto aplica para el beneficio Entrego y Estreno
                </p>
                <p className="text-[11px] md:text-xs text-gray-600 leading-tight md:leading-relaxed">
                  Completa el proceso de Entrego y Estreno para aplicar el descuento. Haz clic en el botón para comenzar.
                </p>
                <p className="text-[11px] md:text-xs text-gray-700 leading-tight md:leading-relaxed font-medium">
                  El valor será desembolsado en la tienda
                </p>
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Este es un valor aproximado del beneficio Entrego y Estreno al que aplicaste. Este valor se desembolsa en la tienda. Aplican TyC*
                </p>
                {showStorePickupMessage && (
                  <p className="text-xs text-gray-700 leading-relaxed font-medium">
                    Para el beneficio de entrego y estreno solo aplica recogida en tienda de producto.
                  </p>
                )}
                {showCanPickUpMessage && (
                  <p className="text-xs text-orange-700 leading-relaxed font-medium mt-2">
                    Este producto no se encuentra disponible en una tienda según tu ubicación predeterminada. El beneficio Entrego y Estreno solo aplica para recoger en tienda.
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
