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
    <section className="mb-1 md:mb-2">
      <div className={`rounded-lg p-3 md:p-4 relative ${
        validationError
          ? "bg-red-50"
          : "bg-white"
      }`}>
        {/* Botón X para cerrar/quitar el beneficio - Solo mostrar si NO es guía (está completado) */}
        {!isGuide && (
          <button
            onClick={onEdit}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Quitar beneficio Entrego y Estreno"
            type="button"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <div className="flex items-start justify-between gap-2 md:gap-3 pr-4 md:pr-5">
          <div className="flex items-center gap-2 flex-1">
            <div className="flex-shrink-0">
              <svg className={`w-4 h-4 md:w-5 md:h-5 ${validationError ? "text-red-500" : "text-[#0099FF]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className={`text-xs md:text-sm font-semibold mb-0.5 ${
                validationError ? "text-red-700" : "text-black"
              }`}>
                Entrego y Estreno
              </h3>
              <p className={`text-[10px] md:text-xs ${validationError ? "text-red-600" : "text-black"}`}>
                {deviceName}
              </p>

              {!isGuide && (
                <button
                  onClick={onEdit}
                  className={`text-[10px] md:text-xs hover:underline transition-colors mt-1 inline-block ${
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
                className="bg-[#0099FF] text-white px-4 py-1.5 md:px-6 md:py-2 rounded-md text-center min-w-[100px] md:min-w-[130px] hover:bg-[#0088E6] transition-colors cursor-pointer"
                type="button"
              >
                <p className="text-[10px] md:text-xs font-bold mb-0">
                  Bono disponible
                </p>
                <p className="text-[9px] md:text-[10px] opacity-90">
                  Haz clic para aplicar
                </p>
              </button>
            ) : (
              <p className={`text-sm md:text-base font-bold ${
                validationError ? "text-red-600" : "text-[#0099FF]"
              }`}>
                - $ {tradeInValue.toLocaleString('es-CO')}
              </p>
            )}
          </div>
        </div>

        {/* Mensaje de error de validación - Mostrar skeleton inicialmente, luego el mensaje */}
        {validationError && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            {showErrorSkeleton ? (
              <div className="animate-pulse space-y-1.5">
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : (
              <p className="text-[10px] md:text-xs text-red-700 font-medium leading-relaxed">
                {validationError}
              </p>
            )}
          </div>
        )}

        {/* Mensaje normal si no hay error */}
        {!validationError && (
          <div className={`${isGuide ? "mt-1.5 pt-1.5" : "mt-2 pt-2"} border-t border-gray-200`}>
            {isGuide ? (
              <div>
                <p className="text-[9px] md:text-[10px] text-black leading-tight">
                  Completa el proceso de Entrego y Estreno para aplicar el descuento. Haz clic en el botón para comenzar. El valor será desembolsado en la tienda. Solo aplica para recoger en tienda.
                </p>
              </div>
            ) : (
              <>
                <p className="text-[10px] md:text-xs text-black leading-relaxed">
                  Este es un valor aproximado del beneficio Entrego y Estreno al que aplicaste. Este valor se desembolsa en la tienda. Aplican TyC*
                </p>
                {showStorePickupMessage && (
                  <p className="text-[10px] md:text-xs text-black leading-relaxed font-medium">
                    Para el beneficio de entrego y estreno solo aplica recogida en tienda de producto.
                  </p>
                )}
                {showCanPickUpMessage && (
                  <p className="text-[10px] md:text-xs text-orange-700 leading-relaxed font-medium mt-1.5">
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
