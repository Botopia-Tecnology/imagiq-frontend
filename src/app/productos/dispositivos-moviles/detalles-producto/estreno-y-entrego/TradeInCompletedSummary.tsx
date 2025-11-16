import React from "react";

interface TradeInCompletedSummaryProps {
  readonly deviceName: string;
  readonly tradeInValue: number;
  readonly onEdit: () => void;
  readonly validationError?: string;
  readonly showStorePickupMessage?: boolean;
}

export default function TradeInCompletedSummary({
  deviceName,
  tradeInValue,
  onEdit,
  validationError,
  showStorePickupMessage = false,
}: TradeInCompletedSummaryProps) {
  return (
    <section className="mb-8">
      <div className={`rounded-lg p-4 border relative ${
        validationError 
          ? "bg-red-50 border-red-200" 
          : "bg-gray-50 border-gray-200"
      }`}>
        {/* Botón X para cerrar/quitar el beneficio */}
        <button
          onClick={onEdit}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          aria-label="Quitar beneficio Estreno y Entrego"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-start justify-between gap-4 pr-6">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-shrink-0">
              <svg className={`w-6 h-6 ${validationError ? "text-red-500" : "text-[#0099FF]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className={`text-base font-semibold mb-1 ${
                validationError ? "text-red-700" : "text-[#222]"
              }`}>
                Estreno y Entrego
              </h3>
              <p className={`text-sm ${validationError ? "text-red-600" : "text-gray-600"}`}>
                {deviceName}
              </p>

              <button
                onClick={onEdit}
                className={`text-sm hover:underline transition-colors mt-2 inline-block ${
                  validationError ? "text-red-600" : "text-[#0099FF]"
                }`}
                type="button"
              >
                Más información
              </button>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <p className={`text-xl font-bold ${
              validationError ? "text-red-600" : "text-[#0099FF]"
            }`}>
              - $ {tradeInValue.toLocaleString('es-CO')}
            </p>
          </div>
        </div>

        {/* Mensaje de error de validación */}
        {validationError && (
          <div className="mt-3 pt-3 border-t border-red-200">
            <p className="text-sm text-red-700 font-medium leading-relaxed">
              {validationError}
            </p>
          </div>
        )}

        {/* Mensaje normal si no hay error */}
        {!validationError && (
          <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
            <p className="text-xs text-gray-700 leading-relaxed">
              Este es un valor aproximado del beneficio Estreno y Entrego al que aplicaste. Aplican TyC*
            </p>
            {showStorePickupMessage && (
              <p className="text-xs text-gray-700 leading-relaxed font-medium">
                Para el beneficio de entrego y estreno solo aplica recogida en tienda de producto.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
